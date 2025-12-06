const mongoose = require('mongoose');

const borrowRequestSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestGroupId: {
        type: String,
        required: true,
        index: true
    },
    componentName: {
        type: String,
        required: true
    },
    componentId: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    requestDate: {
        type: Date,
        default: Date.now
    },
    expectedReturnDate: {
        type: Date,
        required: true
    },
    purpose: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    adminResponse: {
        type: String
    },
    respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    responseDate: {
        type: Date
    }
});

module.exports = mongoose.model('BorrowRequest', borrowRequestSchema);
