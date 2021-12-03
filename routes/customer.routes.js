const express = require('express');
const app = express.Router();

const customers = require('../controllers/customer.controller.js');

// Create a new Customer
app.post('/', customers.create);

// Retrieve all Customers
app.get('/', customers.findAll);

// Retrieve a single Customer with customerId
app.get('/:customerId', customers.findOne);

// Update a Customer with customerId
app.put('/:customerId', customers.update);

// Delete a Customer with customerId
app.delete('/:customerId', customers.delete);


module.exports = app;