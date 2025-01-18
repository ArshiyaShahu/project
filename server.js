const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const port = 3019;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://127.0.0.1:27017/students');

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to the database!');
});

// Define schema and model for contact
const contactSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Phone: String, // Changed from Number to String
});

const Contact = mongoose.model('contacts', contactSchema); // Changed model name from Users to Contact

// Serve the contact page as the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

// Handle contact form submissions
app.post('/post', async (req, res) => {
  console.log('Received data:', req.body);
  const { Name, Email, Phone } = req.body;

  try {
    const user = new Contact({ // Updated to use Contact model
      Name,
      Email,
      Phone,
    });

    await user.save();
    console.log('Contact saved:', user);
    res.send('Contact data has been added successfully!');
  } catch (error) {
    console.error('Error saving contact:', error); // Improved error logging
    res.status(500).send('Error saving contact data. Please try again later.');
  }
});

// Define schema and model for orders
const orderSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Phone: String,
  DeliveryAddress: String,
  PizzaSize: String,
  Toppings: [String],
  SpecialInstructions: String,
});

const Orders = mongoose.model('orders', orderSchema);

// Serve the order page
app.get('/order', (req, res) => {
  res.sendFile(path.join(__dirname, 'order.html'));
});

// Handle order form submissions
app.post('/submit-order', async (req, res) => {
  console.log('Received order data:', req.body);

  const { Name, Email, Phone, DeliveryAddress, PizzaSize, Toppings, SpecialInstructions } = req.body;
  const order = new Orders({
    Name,
    Email,
    Phone,
    DeliveryAddress,
    PizzaSize,
    Toppings: Array.isArray(Toppings) ? Toppings : [Toppings],
    SpecialInstructions,
  });

  try {
    await order.save();
    console.log('Order saved:', order);
    res.send('Your order has been submitted successfully!');
  } catch (error) {
    console.error('Error saving order:', error);
    res.status(500).send('Error submitting your order. Please try again later.');
  }
});

// API to get all contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).send('Error fetching contacts.');
  }
});

// API to get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Orders.find();
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).send('Error fetching orders.');
  }
});

app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
