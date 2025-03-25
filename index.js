// index.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const MenuItem = require('./menuItem'); // Import the MenuItem model

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // To parse JSON requests

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Stop the app if DB connection fails
  }
};

// Connect to the database
connectDB();

// **Routes for CRUD operations**

// POST /menu: Create a new menu item
app.post('/menu', async (req, res) => {
  const { name, description, price } = req.body;

  // Basic validation
  if (!name || !price) {
    return res.status(400).json({ error: 'Name and price are required' });
  }

  try {
    const newMenuItem = new MenuItem({ name, description, price });
    await newMenuItem.save(); // Save the new menu item in the database
    res.status(201).json({
      message: 'Menu item created successfully',
      data: newMenuItem,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// GET /menu: Fetch all menu items
app.get('/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.status(200).json(menuItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch menu items' });
  }
});

// PUT /menu/:id: Update an existing menu item
app.put('/menu/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  // Ensure at least one field is provided to update
  if (!name && !description && !price) {
    return res.status(400).json({ error: 'At least one field (name, description, or price) is required to update' });
  }

  try {
    const menuItem = await MenuItem.findById(id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    // Update the fields that are provided
    if (name) menuItem.name = name;
    if (description) menuItem.description = description;
    if (price) menuItem.price = price;

    await menuItem.save(); // Save the updated menu item
    res.status(200).json({
      message: 'Menu item updated successfully',
      data: menuItem,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// DELETE /menu/:id: Delete an existing menu item
app.delete('/menu/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const menuItem = await MenuItem.findByIdAndDelete(id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    res.status(200).json({
      message: 'Menu item deleted successfully',
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete menu item' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
