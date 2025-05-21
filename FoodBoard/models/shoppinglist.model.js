const mongoose = require("mongoose");

const shoppinglistSchema = new mongoose.Schema({
    name: {
        type: String
    },
    level: {
        type: String,
        enum: ["Bof", "Emergency"],
    },
    status: {
        type: String,
        enum: ["Waiting", "Done", "Canceled"]
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    doneAt: {
        type: Date,
    },
    price: {
        type: Number,
        default: 0
    },
    currency: {
        type: Number,
        default: 0
    },
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu"
    },
    variants: [{
        variantId: {
            type: String,
            require: true
        },
        quantiy: {
            type: Number,
            default: 0
        },
        damaged: {
            type: Number,
            default: 0
        }
    }]
});

module.exports = mongoose.model('Shoppinglist', shoppinglistSchema);
