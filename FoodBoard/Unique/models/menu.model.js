const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
});

const variantSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
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
    quant: {
        type: Boolean,
        default: false
    },
    defaultStock: {
        type: Number,
        default: 0
    },
    stock: {
        type: Number,
        default: 0
    },
    mainpic: {
        type: String,
    },
    images: [{
        type: String,
    }],
    menu: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu"
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

mongoose.model('Variant', variantSchema);

const menuSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    variants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Variant"
    }],
    description: {
        type: String,
        required: false
    },
    descriptionHtml: {
        type: String,
        required: false
    },
    images: [{
        type: String
    }],
    mainpic: {
        type: String
    },
    minPrice: {
        value: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "XOF"
        }
    },
    maxPrice: {
        value: {
            type: Number,
            default: 0,
        },
        currency: {
            type: String,
            default: "XOF"
        }
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
    quant: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        default: 0
    }
});

const dailyMenuSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        unique: true
    },
    plates: [{
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
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
            first: {
                //In case of promotion for the the {first n} orders
                type: Number,
                default: 0
            }, 
            illimited: {
                type: Boolean,
                default: true
            }    
        }],
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
        illimited: {
            type: Boolean,
            default: true
        },
        minPrice: {
            value: {
                type: Number,
                default: 0
            },
            currency: {
                type: String,
                default: "XOF"
            }
        },
        maxPrice: {
            value: {
                type: Number,
                default: 0
            },
            currency: {
                type: String,
                default: "XOF"
            }
        },
        reduc: {
            type: Number,
            default: 0
        }
    }]
});

module.exports = mongoose.model("Menu", menuSchema);
