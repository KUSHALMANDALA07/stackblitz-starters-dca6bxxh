// models/menuItem.js
const mongoose = require('mongoose');

// Define the MenuItem schema
const menuItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    description: {
        type: String,
        required: false,
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
    },
    category: {
        type: String,
        required: false,
    },
});

const MenuItem = mongoose.model('MenuItem', menuItemSchema);

module.exports = MenuItem;
