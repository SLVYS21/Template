const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    logo: {
        type: String
    },
    resto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resto"
    }
});

const variantSchema = {
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        default: 0,
        required: true
    },
    currency: {
        type: String,
        default: "XOF"
    },
    quant: {
        type: Boolean,
        default: false
    },
    stock: {
        type: Number,
        default: 0
    },
    mainpic: {
        type: String,
        default: 0
    },
    images: [{
        type: String,
    }]
};

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    variants: [
        variantSchema
    ],
    description: {
        type: String,
        required: false
    },
    descriptionHtml: {
        type: String,
        required: false
    },
    resto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resto"
    }
});

//factor could be 1 or -1
menuSchema.methods.applyOrder = async function (order, factor = 1) {
    try {
        
    } catch (error) {
        console.log(error);
    }
}

const dailyMenuSchema = new mongoose.Schema({
    resto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resto"
    },
    plates: [{
        menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
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
        }
    }]
});

module.exports = mongoose.model("Menu", menuSchema);
