const Customer = require('../models/customer.model.js');

// Create and Save a new Customer
exports.create = (req, res) => {
    //Validate request
    if(!req.body) {
        return res.status(400).send({
            message: "Customer content can not be empty"
        });
    }
    console.log(req.body);

    const {
    	name,
    	gender,    	
    	phonenumber,
    	line1,
    	line2,
    	city,
    	state,
    	postalcode,
        main
    } = req.body;

    // Set customer data
    const customer = new Customer({
    	name,
    	gender,
    	phonenumber,
        addresses: [{line1,line2,city,state,postalcode,main}] 
    });

    // Save Customer in the database
    customer.save()
    .then(customer => {
        res.send({customer, message: 'Customer created successfully!'});
    }).catch(err => {
        var errMessage = [];
        console.log(err.errors);
        for (var errName in err.errors) {
            switch(err.errors[errName].properties.type) {
                case 'required':
                    errMessage.push(err.errors[errName].properties.message);
                break;
                case 'notvalid', 'enum':
                    errMessage.push(err.errors[errName].path + ' is not valid');
                break;
            }
        }         
        res.status(500).send({
            message: "Error creating the customer: " + errMessage
        });
    });
};

// Retrieve and return all customers from the database.
exports.findAll = (req, res) => {
    Customer.find()
    .then(customers => {
        res.send(customers);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving notes."
        });
    });
};

// Find a single customer with a customerId
exports.findOne = (req, res) => {
    Customer.findById(req.params.customerId)
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
            message: "Error retrieving customer with id " + req.params.customerId
        });
    });
};

// Update a customer identified by the customerId in the request
exports.update = (req, res) => {
	// Validate Request
    if(!req.body) {
        return res.status(400).send({
            message: "Customer content can not be empty"
        });
    }

    const {
        name,
        gender,     
        phonenumber
    } = req.body;   

    // Find customer and update it with the request body
    Customer.findByIdAndUpdate(req.params.customerId, {
        name,
        gender,
        phonenumber
    }, {new: true})
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });
        }
        res.send({customer, message: 'Customer updated successfully!'});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });                
        } else {
            var errMessage = [];
            for (var errName in err.errors) {
                switch(err.errors[errName].properties.type) {
                    case 'required':
                        errMessage.push(err.errors[errName].properties.message);
                    break;
                    case 'notvalid', 'enum':
                        errMessage.push(err.errors[errName].path + ' is not valid');
                    break;
                }
            }         
            return res.status(500).send({
                message: "Error updating the customer: " + errMessage
            });           
        }

    });
};

// Delete a customer with the specified customerId in the request
exports.delete = (req, res) => {
    Customer.findByIdAndRemove(req.params.customerId)
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });
        }
        res.send({customer, message: "Customer deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });                
        }
        return res.status(500).send({
            message: "Could not delete customer with id " + req.params.customerId
        });
    });
};