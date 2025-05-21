const mongoose = require("mongoose");

const order = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    items: [{
        menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        },
        variants: {
            variantId: {
                type: String,
            },
            quantity: {
                type: Number,
                default: 0
            }
        },
        quantity: {
            type: Number,
            default: 1
        }
    }],
x    server: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    option: {
        type: String,
        enum: ["On Site", "Delivery"],
        default: "On Place"
    },
    status: {
        type: String,
        enum: ["Waiting", "Validated", "Cooking", "Served", "Payed", "Aborted"],
        default: "Waiting"
    },
    payment: {
        type: String,
        enum: ["Cash", "Momo", "Moov Money", "Celtis Cash"],
        default: "Cash"
    },
    details: {
        value: {
            type: String,
            enum: ["10000", "5000", "2000", "1000", "500", "200", "100", "50", "25", "10", "5"],
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1
        }
    },
    total: {
        value: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "XOF"
        }
    },
    trackingCode: {
        type: String,
        required: true
    }
});

const orderController = ({
    create: async(req, res, next) => {
        try {
            const {items, option} = req.body;

        } catch (error) {
            next(error);
        }
    },
    updateStatus: async(req, res, next) => {
        try {
            const order = await Order.findById(req.params.id);
            if (!order || !req.params.id) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            const {status} = req.body;
            
        } catch (error) {
            next(error);
        }
    },
    trackOrder: async(req, res, next) => {
        try {
            const {code} = req.body;

            const order = await Order.findOne({trackingCode: code});
            return res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    },
    payOrder: async(req, res, next) => {
        try {
            const {payment, details} = req.body;

            if (!payment || !["Cash", "Momo", "Moov Money", "Celtis Cash"].includes(payment))
                return res.status(404).json({
                    message: "Set the right payment Method"
                });
            const order = await Order.findById(req.params.id);
            if (!order) {
                return res.status(404).json({
                    message: "order not found"
                });
            }
            order.payment = payment;
            order.details = details || [];
            await order.save();
            return res.status(200).json(order);
        } catch (error) {
            next(error);
        }
    },
    setServer: async(req, res, next) => {
        try {
            const orderId = req.params.id;
            if (!orderId) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
        } catch (error) {
            next(error);
        }
    },
    get: async(req, res, next) => {
        try {
            const {page = 1, limit = 10, startDate, endDate, period, user, status} = req.query;

            let filter = {};
            if (user) {
                const us = await User.findById(user);
                if (!user) {
                    return res.status(404).json(message: "User not found");
                }
                filter.server = us._id.toString();
            }
            if (status && ["Waiting", "Validated", "Cooking", "Served", "Payed"].includes(status)) {
                filter.status = status;
            }
            getDateFilter(startDate, endDate, period, filter);
            const orders = await Order.find(filter)
                  .populate('items.menu', 'name')
                  .limit(limit)
                  .skip((page - 1) * limit);
            return res.status(200).json(orders);
        } catch (error) {
            next(error);
        }
    },
    update: async(req, res, next) => {
        try {
            const order = await Order.findById(req.params.id);
        } catch (error) {
            next(error);
        }
    },
    deleteMenu: async(req, res, next) => {
        try {
            const menu = await Menu.findById(req.params.id);
            if (!req.params.id || !menu) {
                return res.status(404).json({
                    message: "Menu not found"
                });
            }
            const order = await Order.findOne({items: {$in: menu._id}});
            if (order) {
                menu.deleted = true;
                await menu.save();
            } else {
                await Menu.findByIdAndDelete(menu._id);
            }
            return res.status(200).json({
                message: "Deleting Done"
            });
        } catch (error) {
            next(error);
        }
    }
});

module.exports = mongoose.model("Order", order);
