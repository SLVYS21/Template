const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true
    }, //suffixe #10
    trackingNumber: {
        type: String,
        required: true
    },
    items: [{
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
            required: true
        },
        variants: [{
            variantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Variant"
            },
            quantity: {
                type: Number,
                default: 0
            },
            price: {
                value: {
                    type: Number,
                    default: 0
                },
                currency: {
                    type: String,
                    default: "XOF"
                }
            },                
        }],
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            value: {
                type: Number,
                default: 0
            },
            currency: {
                type: String,
                default: "XOF"
            }
        },
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
        enum: ["waiting", "confirmed", "cooking", "shipping", "delivered", "canceled"],
        default: "waiting"
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
    },
});

orderSchema.pre('save', () => {
    this.updatedAt = new Date.now();
});

module.exports = mongoose.model('Order', orderSchema);
