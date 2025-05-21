const Order = require("../models/order.model");
const Menu = require('../models/menu.model');

function generateTrackingCode(keyword = "") {
    const timestamp = Date.now().toString(36);
    const randomPart = Math.random().toString(36).substring(2, 8);
    const keywordPart = keyword ? keyword.toLowerCase().replace(/\s+/g, '').substring(0, 6) : "";
    return `${keywordPart}${timestamp}${randomPart}`.toUpperCase();
}

const orderController = ({
    create: async(req, res) => {
        try {
            const {items, customerName, type, note, keyword} = req.body;

            let total = 0;
            let totalPrice = 0;
            const list = [];
            for (const item of items) {
                const object = {};
                const menu = await Menu.findById(menu.menuId);
                if (!menu) {
                    return res.status(404).json({
                        message: "Menu not found"
                    });
                }
                object.menuId = menu.menuId;
                if (menu.variants && menu.variants[0]) {
                    for (const variant of menu.variants) {
                        const _v = await variant.findById(variant.variantId);
                        if (!_v)
                            return res.status(404).json({
                                message: "Variant not found"
                            });
                        if (parseInt(variant.quantity) <= 0)
                            return res.status(404).json({
                                message: "Can't order negative or null quantity"
                            });
                        total += variant.quantity;
                        object.quantity += variant.quantity;
                        object.variants.push({
                            variantId: variant.variantId,
                            quantity: variant.quantity,
                            price: {
                                value: _v.price.value * quantity,
                                currency: _v.price.currency
                            }
                        });
                        object.price.value += _price.value;
                    }
                    object.price.currency = menu.currency;
                } else {
                    if (parseInt(menu.quantity) <= 0)
                        return res.status(404).json({
                            message: "Quantity can not be null or negative"
                        });
                    object.quantity = menu.quantity;
                    object.price = {
                        value: menu.price.value * menu.quantity,
                        currency: menu.price.currency
                    }
                    total += quantity;
                }
                list.push(object);
            }
            if (!list[0])
                return res.status(403).json("Invalid order")
            list.map(it => totalPrice += it.price.value);
            const order = await Order.create({
                trackingNumber: generateTrackingCode(),
                items: list,
                customerName,
                totalPrice: {
                    value: totalPrice,
                    currency: "XOF"
                },
                type,
                note
            });
            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    },
    setMan: async(req, res) => {
        try {
            const {orderId} = req.body;

            const order = await Order.findById(orderId);
            if (!order)
                return res.status(404).json({
                    message: "Order not found"
                });
            order.man = req.user._id;
            return res.status(200).json(order);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    },
    updateItems: async(req, res) => {
        try {
            const {orderId, items} = req.body;

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({
                    message: "Order not found"
                });
            }
            let total = 0;
            let totalPrice = 0;
            const list = [];
            for (const item of items) {
                const object = {};
                const menu = await Menu.findById(menu.menuId);
                if (!menu) {
                    return res.status(404).json({
                        message: "Menu not found"
                    });
                }
                object.menuId = menu.menuId;
                if (menu.variants && menu.variants[0]) {
                    for (const variant of menu.variants) {
                        const _v = await variant.findById(variant.variantId);
                        if (!_v)
                            return res.status(404).json({
                                message: "Variant not found"
                            });
                        if (parseInt(variant.quantity) <= 0)
                            return res.status(404).json({
                                message: "Can't order negative or null quantity"
                            });
                        total += variant.quantity;
                        object.quantity += variant.quantity;
                        object.variants.push({
                            variantId: variant.variantId,
                            quantity: variant.quantity,
                            price: {
                                value: _v.price.value * quantity,
                                currency: _v.price.currency
                            }
                        });
                        object.price.value += _price.value;
                    }
                    object.price.currency = menu.currency;
                } else {
                    if (parseInt(menu.quantity) <= 0)
                        return res.status(404).json({
                            message: "Quantity can not be null or negative"
                        });
                    object.quantity = menu.quantity;
                    object.price = {
                        value: menu.price.value * menu.quantity,
                        currency: menu.price.currency
                    }
                    total += quantity;
                }
                list.push(object);
            }
            if (!list[0])
                return res.status(403).json("Invalid order")
            list.map(it => totalPrice += it.price.value);
            order.items = list;
            order.totalPrice = {
                currency: "XOF",
                value: totalPrice
            }
            return res.status(200).json({
                order
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    },
    trackOrder: async(req, res) => {
        try {
            const trackingNumber = req.query;
            const order = await Order.findOne({
                trackingNumber
            }).populate('man', 'name');
            if (!order)
                return res.status(404).json({
                    message: "Invalid Tracking Number! Please Retry with another one"
                });
            return res.status(200).json({
                order
            })
        } catch (error) {
            return res.status(500).json(error);
        }
    },
    getOrders: async(req, res) => {
        try {
            const {page, limit} = req.query;
            const orders = await Order.find().sort({_id: -1}).limit(limit).skip((page - 1) * limit);
            return res.status(200).json(orders);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    updateStatus: async(req, res) => {
        try {
            const {orderId, status} = req.body;

            const order = await Order.findById(orderId);
            if (!order) {
                return res.status(404).json({
                    message: "Order.mot found"
                });
            }
        } catch (error) {
            return res.status(500).json({
                message: "Message not found"
            })
        }
    }
});

MediaSourceHandle.exports = orderController;