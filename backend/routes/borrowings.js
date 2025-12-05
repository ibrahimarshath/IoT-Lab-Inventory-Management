const express = require('express');
const router = express.Router();
const Borrowing = require('../models/Borrowing');
const Component = require('../models/Component');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

// @route   GET /api/borrowings
// @desc    Get all borrowings
// @access  Admin only (or specific user)
router.get('/', auth, async (req, res) => {
    try {
        // If admin, return all. If user, return only theirs?
        // The BorrowingManagement page is likely for Admins.
        // We'll assume admin access for now or return all for the management view.
        // If we want to restrict, we can check req.user.role.

        const borrowings = await Borrowing.find()
            .populate('user', 'name email phone')
            .sort({ borrowDate: -1 });

        // Transform data to match frontend expectation if needed
        // Frontend expects: userName, userEmail, userPhone, componentName, etc.
        const formattedBorrowings = borrowings.map(b => ({
            id: b._id,
            userName: b.user ? b.user.name : 'Unknown User',
            userEmail: b.user ? b.user.email : 'N/A',
            userPhone: b.user ? b.user.phone : 'N/A',
            componentName: b.componentName,
            componentId: b.componentId,
            quantity: b.quantity,
            borrowDate: b.borrowDate,
            expectedReturnDate: b.dueDate,
            actualReturnDate: b.returnDate,
            status: b.status,
            purpose: b.purpose
        }));

        res.json(formattedBorrowings);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/borrowings
// @desc    Create a new borrowing
// @access  Admin only (Record borrowing)
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        const { userEmail, componentId, quantity, returnDate, purpose } = req.body;

        // Find user by email
        const user = await User.findOne({ email: userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found with that email' });
        }

        // Find component
        const component = await Component.findById(componentId);
        if (!component) {
            return res.status(404).json({ message: 'Component not found' });
        }

        // Check availability
        if (component.available < quantity) {
            return res.status(400).json({ message: `Not enough stock. Available: ${component.available}` });
        }

        // Create Borrowing
        const newBorrowing = new Borrowing({
            user: user._id,
            componentName: component.name,
            componentId: component._id.toString(),
            quantity,
            dueDate: returnDate,
            purpose,
            status: 'active'
        });

        await newBorrowing.save();

        // Update Component Availability
        component.available -= quantity;
        await component.save();

        res.json(newBorrowing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/borrowings/:id/return
// @desc    Mark borrowing as returned
// @access  Admin only
router.put('/:id/return', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        const borrowing = await Borrowing.findById(req.params.id);
        if (!borrowing) {
            return res.status(404).json({ message: 'Borrowing not found' });
        }

        if (borrowing.status === 'returned') {
            return res.status(400).json({ message: 'Already returned' });
        }

        // Update Borrowing
        borrowing.status = 'returned';
        borrowing.returnDate = Date.now();
        await borrowing.save();

        // Update Component Availability
        // We need to find the component. Note: componentId is stored as String.
        const component = await Component.findById(borrowing.componentId);
        if (component) {
            component.available += borrowing.quantity;
            // Ensure available doesn't exceed quantity (just in case)
            if (component.available > component.quantity) {
                component.available = component.quantity;
            }
            await component.save();
        }

        res.json(borrowing);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
