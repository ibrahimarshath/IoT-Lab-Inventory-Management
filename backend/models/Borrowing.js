const mongoose = require('mongoose');

const borrowingSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
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
    borrowDate: {
        type: Date,
        default: Date.now
    },
    dueDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'returned', 'overdue'],
        default: 'active'
    },
    purpose: {
        type: String
    }
});

module.exports = mongoose.model('Borrowing', borrowingSchema);
