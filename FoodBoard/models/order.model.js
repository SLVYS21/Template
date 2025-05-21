const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    name: {
        type: String
    },
    items: [{
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true
        },
        variantId: {
            type: String,
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: 0
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    man: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["Waiting", "Confirmed", "Cooking..", "Ready", "Payed", "Cancelled"],
        default: "Waiting"
    },
    type: {
        type: String,
        enum: ["On Place", "Delivery"]
    },
    totalPrice: {
        value: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "XOF"
        }
    },
    resto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resto"
    },
    location: {
        type: String,
        required: False
    },
    note: {
        type: String
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Customer"
    }
});

module.exports = ;
