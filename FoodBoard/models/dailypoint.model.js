const mongoose = require('mongoose');

const dailypointSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    resto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Restaurant"
    },
    turnOver: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: "XOF"
    },
    turnOverByMenu: [{
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        },
        variants: [{
            variantId: {
                type: String,
                required: true
            },
            turnOver: {
                type: Number,
                default: 0
            },
            currency: {
                type: String,
                default: "XOF"
            },
            orders: {
                type: Number,
                default: 0
            },
            canceled: {
                type: Number,
                default: 0
            },
            payed: {
                type: Number,
                default: 0
            },
            confirmed: {
                type: Number,
                default: 0
            },
            cooking: {
                type: Number,
                default: 0
            },
        }],
        orders: {
            type: Number,
            default: 0
        },
        canceled: {
            type: Number,
            default: 0
        },
        payed: {
            type: Number,
            default: 0
        },
        confirmed: {
            type: Number,
            default: 0
        },
        cooking: {
            type: Number,
            default: 0
        },
    }],
    orders: {
        type: Number,
        default: 0
    },
    canceled: {
        type: Number,
        default: 0
    },
    payed: {
        type: Number,
        default: 0
    },
    confirmed: {
        type: Number,
        default: 0
    },
    cooking: {
        type: Number,
        default: 0
    }
});

module.exports = mongoose.model("DailyPoint", dailypointSchema);
