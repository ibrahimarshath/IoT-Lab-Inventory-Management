const express = require('express');
const router = express.Router();
const BorrowRequest = require('../models/BorrowRequest');
const Component = require('../models/Component');
const Borrowing = require('../models/Borrowing');
const { auth } = require('../middleware/auth');

// @route   GET /api/borrow-requests
// @desc    Get all borrow requests (admin) or user's own requests
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        let requests;

        if (req.user.role === 'admin') {
            // Admin sees all requests
            requests = await BorrowRequest.find()
                .populate('user', 'name email phone')
                .populate('respondedBy', 'name')
                .sort({ requestDate: -1 });
        } else {
            // Users see only their own requests
            requests = await BorrowRequest.find({ user: req.user.id })
                .populate('respondedBy', 'name')
                .sort({ requestDate: -1 });
        }

        // Format for frontend
        const formattedRequests = requests.map(r => ({
            id: r._id,
            userName: r.user ? r.user.name : 'Unknown User',
            userEmail: r.user ? r.user.email : 'N/A',
            userPhone: r.user ? r.user.phone : 'N/A',
            componentName: r.componentName,
            componentId: r.componentId,
            quantity: r.quantity,
            requestDate: r.requestDate,
            expectedReturnDate: r.expectedReturnDate,
            purpose: r.purpose,
            status: r.status,
            adminResponse: r.adminResponse,
            respondedBy: r.respondedBy ? r.respondedBy.name : null,
            responseDate: r.responseDate
        }));

        res.json(formattedRequests);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   POST /api/borrow-requests
// @desc    Create a new borrow request (students)
// @access  Private (students and admins)
router.post('/', auth, async (req, res) => {
    try {
        const { componentId, quantity, expectedReturnDate, purpose, requestGroupId } = req.body;

        // Find component
        const component = await Component.findById(componentId);
        if (!component) {
            return res.status(404).json({ message: 'Component not found' });
        }

        // Check if component is visible to users
        if (!component.visibleToUsers && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'This component is not available for borrowing' });
        }

        // Check availability
        if (component.available < quantity) {
            return res.status(400).json({ message: `Not enough stock. Available: ${component.available}` });
        }

        // Create request
        const newRequest = new BorrowRequest({
            user: req.user.id,
            requestGroupId: requestGroupId || `${Date.now()}-single`,
            componentName: component.name,
            componentId: component._id.toString(),
            quantity,
            expectedReturnDate,
            purpose,
            status: 'pending'
        });

        await newRequest.save();

        res.json(newRequest);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/borrow-requests/:id/approve
// @desc    Approve a borrow request and create borrowing
// @access  Admin only
router.put('/:id/approve', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        const { adminResponse, approvedQuantity } = req.body;

        const request = await BorrowRequest.findById(req.params.id).populate('user');
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request already processed' });
        }

        // Use approved quantity or fall back to requested quantity
        const quantityToApprove = approvedQuantity !== undefined ? approvedQuantity : request.quantity;

        // Check component availability
        const component = await Component.findById(request.componentId);
        if (!component) {
            return res.status(404).json({ message: 'Component not found' });
        }

        if (component.available < quantityToApprove) {
            return res.status(400).json({ message: `Not enough stock. Available: ${component.available}` });
        }

        // Only create borrowing if quantity > 0
        if (quantityToApprove > 0) {
            // Create Borrowing
            const newBorrowing = new Borrowing({
                user: request.user._id,
                componentName: request.componentName,
                componentId: request.componentId,
                quantity: quantityToApprove,
                dueDate: request.expectedReturnDate,
                purpose: request.purpose,
                status: 'active'
            });

            await newBorrowing.save();

            // Update Component Availability
            component.available -= quantityToApprove;
            await component.save();
        }

        // Update Request
        request.status = 'approved';
        request.adminResponse = adminResponse || 'Approved';
        request.respondedBy = req.user.id;
        request.responseDate = Date.now();
        await request.save();

        res.json({ request, borrowing: newBorrowing });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   PUT /api/borrow-requests/:id/reject
// @desc    Reject a borrow request
// @access  Admin only
router.put('/:id/reject', auth, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin only' });
        }

        const { adminResponse } = req.body;

        const request = await BorrowRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Request already processed' });
        }

        // Update Request
        request.status = 'rejected';
        request.adminResponse = adminResponse || 'Rejected';
        request.respondedBy = req.user.id;
        request.responseDate = Date.now();
        await request.save();

        res.json(request);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route   DELETE /api/borrow-requests/:id
// @desc    Delete a borrow request (user can delete their own pending requests)
// @access  Private
router.delete('/:id', auth, async (req, res) => {
    try {
        const request = await BorrowRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: 'Request not found' });
        }

        // Check if user owns the request or is admin
        if (request.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }

        // Can only delete pending requests
        if (request.status !== 'pending') {
            return res.status(400).json({ message: 'Can only delete pending requests' });
        }

        await request.deleteOne();

        res.json({ message: 'Request deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
