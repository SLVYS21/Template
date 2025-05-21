const mongoose = require('mongoose');

const dailypointSchema = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    turnOver: {
        value: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "XOF"
        }
    },
    collected: {
        value: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "XOF"
        }
    },
    turnOverByMenu: [{
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        },
        variants: [{
            variantId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Variant",
                required: true
            },
            turnOver: {
                value: {
                    type: Number,
                    default: 0
                },
                currency: {
                    type: String,
                    default: "XOF"
                }
            },
            collected: {
                value: {
                    type: Number,
                    default: 0
                },
                currency: {
                    type: String,
                    default: "XOF"
                }
            },        
            orders: {
                type: Number,
                default: 0
            },
            canceled: {
                type: Number,
                default: 0
            },
            delivered: {
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
            waiting: {
                type: Number,
                default: 0
            },
            quantity: {
                type: Number,
                default: 0
            }
        }],
        orders: {
            type: Number,
            default: 0
        },
        turnOver: {
            value: {
                type: Number,
                default: 0
            },
            currency: {
                type: String,
                default: "XOF"
            }
        },
        collected: {
            value: {
                type: Number,
                default: 0
            },
            currency: {
                type: String,
                default: "XOF"
            }
        },
        canceled: {
            type: Number,
            default: 0
        },
        delivered: {
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
        waiting: {
            type: Number,
            default: 0
        },
        quantity: {
            type: Number,
            default: 0
        }
    }],
    orders: {
        type: Number,
        default: 0
    },
    canceled: {
        type: Number,
        default: 0
    },
    confirmed: {
        type: Number,
        default: 0
    },
    delivered: {
        type: Number,
        default: 0
    },
    cooking: {
        type: Number,
        default: 0
    },
    quantity: {
        type: Number,
        default: 0
    }
});

//Waiting --> Confirmed --> Cooking --> delivered -->

function addByStatus(object, status, factor) {
    object[status] += factor;
}

dailypointSchema.methods.applyOrder = async function (order, factor) {
    try {
        const byStatus = {
            orders: factor,
            canceled: (order.status === "canceled") ? 1 : 0,
            delivered: (order.status === "delivered") ? 1 : 0,
            confirmed: (order.status === "confirmed") ? 1 : 0,
            cooking: (order.status === "cooking") ? 1 : 0,
            waiting: (order.status === "waiting") ? 1 : 0,
            turnOver: {
                value: order.totalPrice.value * factor,
                currency: "XOF"
            },
            collected: {
                value: (order.status === "delivered") ? order.totalPrice.value * factor : 0,
                currency: "XOF"
            }
        }
        for (const item of order.items) {
            let menuTO = await this.turnOverByMenu.find(it => it.menuId.toString() === item.menuId.toString());
            if (!menuTO) {
                this.turnOverByMenu.push({
                    menuId: item.menuId,
                    variants: [],
                });
                menuTO = await this.turnOverByMenu.find(it => it.menuId.toString() === item.menuId.toString());
            }
            if (item.variants) {
                for (const variant of item.variants) {
                    let dailyVariant = menuTO.variants.find(it => it.variantId.toString() === variant.variantId.toString());
                    if (!dailyVariant) {
                        menuTO.variants.push({
                            variantId: variant.variantId,
                            orders: factor,
                            quantity: (order.status === "delivered" ? variant.quantity * factor : 0),
                        });
                        dailyVariant = menuTO.variants.find(it => it.variantId.toString() === variant.variantId.toString());
                    }
                    dailyVariant.turnOver.value += variant.price.value * factor;
                    dailyVariant.collected.value += (order.status === "delivered") ? variant.quantity * factor : 0;
                    dailyVariant.orders += 1 * factor;
                    addByStatus(dailyVariant, order.status, factor);
                    dailyVariant.quantity += (order.status === "delivered" ? variant.quantity * factor : 0);
                }
            }
            menuTO.turnOver.value += item.price.value * factor;
            menuTO.collected.value += (order.status === "delivered") ? item.price.value * factor: 0;
            menuTO.quantity += (order.status === "delivered") ? item.quantity * factor : 0;
            addByStatus(menuTO, order.status, factor);
        }
        this.turnOver.price.value += order.totalPrice.value * factor;
        this.collected.price.value += (order.status === "delivered") ? order.totalPrice.value * factor : 0;
        addByStatus(this, order.status, factor);
        this.quantity += order.quantity * factor;
        await this.save();
    } catch (error) {
        console.log(error);
        return null;
    }
}

module.exports = mongoose.model("DailyPoint", dailypointSchema);
