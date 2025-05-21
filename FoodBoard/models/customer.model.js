const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: false
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
        required: true
    },
    orders: {
        type: Number,
        default: 0
    }
});

customerSchema.methods.apply = async function () {
    try {
        
    } catch (error) {
        
    }
}

module.exports = mongoose.model('Customer', customerSchema);
