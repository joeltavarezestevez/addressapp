const Customer = require('../models/customer.model.js');


// Find all addresses of a Customer with a customerId
exports.findAll = (req, res) => {  
    Customer.findById(req.params.customerId)
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });            
        }
        res.send(customer.addresses);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });                
        }
        console.log(err);
        return res.status(500).send({
            message: "Error retrieving Customer with id " + req.params.customerId
        });
    });
};

// Find a single address with a addressId
exports.findOne = (req, res) => {
    Customer.findById(req.params.customerId)
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });            
        }
        for (var i = customer.addresses.length - 1; i >= 0; i--) {
            if(customer.addresses[i]._id == req.params.addressId)
                address = customer.addresses[i];
        }
        res.send({customer,address});
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Address not found with id " + req.params.addressId
            });                
        }
        console.log(err);
        return res.status(500).send({
            message: "Error retrieving address with id " + req.params.addressId
        });
    });
};

//Create a single address of a Customer with a customerId
exports.create = (req, res) => {  
    
    if(!req.body) {
        return res.status(400).send({
            message: "Address content can not be empty"
        });
    }

    const {
        line1,
        line2,
        city,
        state,
        postalcode,
        mainaddress
    } = req.body;

    var main = Boolean(mainaddress);
    
    Customer.findById(req.params.customerId)
    .then(customer => {
  
        if(!customer) {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });            
        }

        if(main) {
            Customer.updateMany( {'addresses.main': true}, {'$set': {
                     'addresses.$.main' : false
                }
            }, (err, addresses) => {
                if(err) {
                    console.log(err);
                    return res.status(500).send({
                        message: "Could not update address with id " + req.body._id
                    });        
                }
            })
        }

        customer.addresses.push({line1,line2,city,state,postalcode,main})

        customer.save((err, cust) => {
            if (err) {
                console.log(err.errors);
                var errMessage = [];
                for (var errName in err.errors) {
                    switch(err.errors[errName].properties.type) {
                        case 'required':
                            errMessage.push(err.errors[errName].properties.message);
                        break;
                        case 'notvalid':
                            errMessage.push(err.errors[errName].path + ' is not valid');
                        break;
                    }
                }              
                return res.status(500).send({
                    message: "Error creating address: " + errMessage
                });  
            }
            res.send({customer, message: 'Address added successfully!'});
        });
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });                
        } 
        else {
            for (var errName in err.errors) {
                switch(err.errors[errName].properties.type) {
                    case 'required':
                        errMessage.push(err.errors[errName].properties.message);
                    break;
                    case 'notvalid':
                        errMessage.push(err.errors[errName].path + ' is not valid');
                    break;
                }
            }              
            return res.status(500).send({
                message: "Error creating address for customer with id " + req.params.customerId + ": " + errMessage
            });  
        }
    });
};

// Update a customer address identified by the _id in the request
exports.update = (req, res) => {
	
    if(!req.body) {
        return res.status(400).send({
            message: "Address content can not be empty"
        });
    }

    const {
        line1,
        line2,
        city,
        state,
        postalcode,
        mainaddress,
        _id
    } = req.body;


    var main = Boolean(mainaddress);

    if(main) {
        Customer.updateMany( {'addresses.main': true}, {'$set': {
                 'addresses.$.main' : false
            }
        }, (err, addresses) => {
            if(err) {
                console.log(err);
                return res.status(500).send({
                    message: "Could not update address with id " + req.body._id
                });        
            }
            console.log(addresses);
        })
    }

    Customer.updateOne({'addresses._id': _id}, {'$set': {
                'addresses.$.line1': line1,
                'addresses.$.line2': line2,
                'addresses.$.city': city,
                'addresses.$.state': state,
                'addresses.$.postalcode': postalcode,
                'addresses.$.main': main
            }
        }, (err, address) => {
        if (err) {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Customer not found with id " + req.params.customerId
                });                
            }

            var errMessage = [];
            for (var errName in err.errors) {
                switch(err.errors[errName].properties.type) {
                    case 'required':
                        errMessage.push(err.errors[errName].properties.message);
                    break;
                    case 'notvalid':
                        errMessage.push(err.errors[errName].path + ' is not valid');
                    break;
                }
            }              
            return res.status(500).send({
                message: "Error updating address with id " + req.body._id + ": " + errMessage
            });  
        }
        res.send({address, message: 'Address updated successfully!'});
    });
}

// Delete a customer with the specified customerId in the request
exports.delete = (req, res) => {   
    Customer.findById(req.params.customerId)
    .then(customer => {
        if(!customer) {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });
        }
 
        customer.addresses.pull({_id: req.params.addressId});
 
        customer.save().then(function(customer) {
            if(!customer) {
                return res.status(404).send({
                    message: "Address not found with id " + req.params.addressId
                });
            }

            res.send({message: "Address deleted successfully!"});
        }).catch(err => {
            if(err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: "Address not found with id " + req.params.customerId
                });                
            }

            return res.status(500).send({
                message: "Could not delete address with id " + req.params.customerId
            });
        });
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Customer not found with id " + req.params.customerId
            });                
        }
        console.log(err);
        return res.status(500).send({
            message: "Could not delete address with id " + req.params.customerId
        });
    });
};