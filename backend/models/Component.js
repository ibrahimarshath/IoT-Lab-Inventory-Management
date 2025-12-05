const mongoose = require('mongoose');

const ComponentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    available: {
        type: Number,
        required: true,
        min: 0
    },
    threshold: {
        type: Number,
        default: 0,
        min: 0
    },
    description: {
        type: String,
        trim: true
    },
    datasheet: {
        type: String,
        trim: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    condition: {
        type: String,
        enum: ['New', 'Good', 'Fair', 'Poor', 'Damaged', 'Excellent', 'needs-repair'],
        default: 'Good'
    },
    tags: [{
        type: String,
        trim: true
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Component', ComponentSchema);
