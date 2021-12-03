const mongoose = require('mongoose');


const CustomerSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'you must enter the customer name'],
    },
    gender: {
        type: String,
        enum: ["M", "F"],
        required: [true, "you must select a gender"]
    },
    phonenumber: {
        type: String,
        required: [true, 'you must enter the customer phone number']
    },
    addresses: [
        {
            line1: {
                type: String,
                required: [true, "you must enter the address"]
            },
            line2: String,
            city: {
                type: String,
                required: [true, "you must enter the city"]
            },
            state: {
                type: String,
                required: [true, "you must enter the state"]
            },
            postalcode: { type: String },
            main: {
                type: Boolean,
                default: false
            }
        }
    ]
}, {
    timestamps: true
});

module.exports = mongoose.model('Customer', CustomerSchema);