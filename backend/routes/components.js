const express = require('express');
const router = express.Router();
const Component = require('../models/Component');
const { auth } = require('../middleware/auth');

// @route   GET /api/components
// @desc    Get all components
// @access  Public (or Private)
router.get('/', async (req, res) => {
    try {
        const components = await Component.find().sort({ createdAt: -1 });
        res.json(components);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/components
// @desc    Add a new component
// @access  Admin only
router.post('/', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        const { name, category, quantity, threshold, description, datasheet, purchaseDate, condition, tags } = req.body;

        const newComponent = new Component({
            name,
            category,
            quantity,
            available: quantity, // Initially available = total quantity
            threshold,
            description,
            datasheet,
            purchaseDate,
            condition,
            tags
        });

        const component = await newComponent.save();
        res.json(component);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/components/:id
// @desc    Update a component
// @access  Admin only
router.put('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        const component = await Component.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );

        res.json(component);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/components/:id
// @desc    Delete a component
// @access  Admin only
router.delete('/:id', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        await Component.findByIdAndDelete(req.params.id);
        res.json({ message: 'Component deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
