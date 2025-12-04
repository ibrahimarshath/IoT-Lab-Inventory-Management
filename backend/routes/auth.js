const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// Helper to generate token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role, name: user.name },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );
};

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const lowerEmail = email.toLowerCase();

        // Domain Check
        if (!lowerEmail.endsWith('@atriauniversity.edu.in')) {
            return res.status(400).json({ message: 'Registration restricted to @atriauniversity.edu.in emails' });
        }

        // Check existing user
        const existingUser = await User.findOne({ email: lowerEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create User
        const newUser = new User({
            name,
            email: lowerEmail,
            password,
            role: 'user'
        });

        await newUser.save();

        const token = generateToken(newUser);

        res.json({
            token,
            user: {
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const lowerEmail = email.toLowerCase();

        // --- HARDCODED ADMIN CHECK ---
        if (lowerEmail === 'admin@atriauniversity.edu.in' && password === 'iotlab') {
            let adminUser = await User.findOne({ email: lowerEmail });

            if (!adminUser) {
                // Create admin if not exists
                adminUser = new User({
                    name: 'Administrator',
                    email: lowerEmail,
                    password: password, // Will be hashed by pre-save hook
                    role: 'admin'
                });
                await adminUser.save();
            } else {
                // Ensure role is admin
                if (adminUser.role !== 'admin') {
                    adminUser.role = 'admin';
                    await adminUser.save();
                }
            }

            const token = generateToken(adminUser);
            return res.json({
                token,
                user: {
                    id: adminUser._id,
                    name: adminUser.name,
                    email: adminUser.email,
                    role: adminUser.role
                }
            });
        }
        // -----------------------------

        // Domain Check
        if (!lowerEmail.endsWith('@atriauniversity.edu.in')) {
            return res.status(400).json({ message: 'Login restricted to @atriauniversity.edu.in emails' });
        }

        // Check User
        const user = await User.findOne({ email: lowerEmail });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check Password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/auth/change-password
// @desc    Change password
// @access  Private
router.post('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ message: 'Please provide current and new password' });
        }

        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Incorrect current password' });
        }

        // Update password (pre-save hook will hash it)
        user.password = newPassword;
        await user.save();

        res.json({ message: 'Password updated successfully' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
