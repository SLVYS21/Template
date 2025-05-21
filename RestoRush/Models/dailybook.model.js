const mongoose = require('mongoose');

const  bookModel = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    statsByMenu: [{
        menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Menu'
        },
        orders: {
            type: Number,
            default: 0
        },
        quantity: {
            type: Number,
            default: 0
        },
        payed: {
            type: Number,
            default: 0
        },
        aborted: {
            type: Number,
            default: 0
        },
        cooking: {
            type: Number,
            default: 0
        },
        served: {
            type: Number,
            default: 0
        },
        validated: {
            type: Number,
            default: 0
        },
        pending: {
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
        }
    }],
    stats: {
        orders: {
            type: Number,
            default: 0
        },
        quantity: {
            type: Number,
            default: 0
        },
        payed: {
            type: Number,
            default: 0
        },
        aborted: {
            type: Number,
            default: 0
        },
        cooking: {
            type: Number,
            default: 0
        },
        served: {
            type: Number,
            default: 0
        },
        validated: {
            type: Number,
            default: 0
        },
        pending: {
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
        }
    }
})


bookModel.methods.applyOrder(order, factor) {
    try {
        for (const menu of order.menus) {
            const bookMenu = this.statsByMenu.find(it => it.menu.toString() === menu.menu.toString());
            if (!bookMenu && factor  !== -1) {
                this.statsByMenu.push({
                    menu: menu.menu,
                    quantity: menu.quantity,
                    orders: 1,
                    pending: order.status === "pending" ? 1 : 0,
                    validated: order.status === "validated" ? 1 : 0,
                    cooking: order.status === "cooking" ? 1 : 0,
                    served: order.status === "served" ? 1 : 0,
                    payed: order.status === "payed" ? 1 : 0,
                    aborted: order.status === "payed" ? 
                });
            } else {
                bookMenu.quantity += menu.quantity * factor;
                bookMenu.orders += factor;
                bookMenu.pending += factor * (order.status === "pending" ? 1 : 0);
                bookMenu.validated += factor * (order.status === "validated" ? 1 : 0);
                bookMenu.cooking += factor * (order.status === "cooking" ? 1 : 0);
                bookMenu.served += factor * (order.status === "served" ? 1 : 0);
                bookMenu.payed += factor * (order.status === "payed" ? 1 : 0);
            }
            this.stats.orders += factor;
            this.stats.quantity += menu.quantity * factor;
            this.stats.pending += factor * (order.status === "pending" ? 1 : 0);
            this.stats.validated += factor * (order.status === "validated" ? 1 : 0);
            this.stats.cooking += factor * (order.status === "cooking" ? 1 : 0);
            this.stats.served += factor * (order.status === "served" ? 1 : 0);
            this.stats.payed += factor * (order.status === "payed" ? 1 : 0);
        }
        await this.save();
    } catch (error) {
        throw error;
    }
}

const bookController = ({
    getTodayPoint: async(req, res, next) => {
        try {
        } catch(error) {
            next(error);
        }
    },
    getDailyPoints: async(req, res, next) => {
        try {
        } catch (error) {
        }
    },
    
});

module.exports = mongoose.model('Book', bookModel);
