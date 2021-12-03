const express = require('express');
const app = express.Router();

const addresses = require('../controllers/address.controller.js');

// Add a new address to Customer
app.post('/:customerId', addresses.create);

// Retrieve all addreses of a single Customer with customerId
app.get('/all/:customerId', addresses.findAll);

// Retrieve a single address of a Customer with addressId
app.get('/:customerId/:addressId', addresses.findOne);

// Update a single address with customerId
app.put('/:customerId', addresses.update);

// Delete a single address of a Customer with customerId and addressId
app.delete('/:customerId/:addressId', addresses.delete);

module.exports = app;


/*

    // Find customer and update it with the request body
    Customer.findByIdAndUpdate(req.params.customerId, {
        add
    }, {new: true})
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });
        }
        res.send(customer);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });                
        }
        return res.status(500).send({
            message: "Error updating customer with id " + req.params.customerId
        });
    });
};
*/