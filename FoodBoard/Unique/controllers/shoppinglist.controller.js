const Shoppinglist  = require('../models/shoppinglist.model');
const dailyController = require('./daily.controller');

const shoppinglistController = ({
    create: async(req, res) => {
        try {
            const {name, menuId, variants} = req.body;

            if (!name && !menuId)
                return res.status(404).json({
                    message: "Set the name or the name you want to shop"
                });
            const list = [];
            if (variants) {
                for (const variant of variants) {
                    const _v = await variant.findById(variant.variantId);
                }
            }
            const shopping = await Shoppinglist.create({
                name,
                menuId,
                variants
            });
            return res.status(200).json(shopping);
        } catch (error) {
            return res.status(500).json({
                error
            })
        }
    },
    getShopping: async(req, res) => {
        try {
            const {page = 1, limit = 10} = req.query;
            const list = await Shoppinglist.find()
            .populate("menuId", "name")
            .populate("variants.variantId", "name")
            .sort({_id: -1})
            .skip((page - 1) * limit)
            .limit(limit);
            return res.status(200).json(limit);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    updateStatus: async(req, res) => {
        try {
            const {status, id} = req.body;

            const shoppinglist = await Shoppinglist.findById(id);
            if (!shoppinglist) {
                return res.status(404).json({
                    message:"Unknown Shopping list"
                });
            }
            if (status === "Done" && shoppinglist.status !== "Done" && shoppinglist.menuId) {
                const menu = await Menu.findById(shoppinglist.menuId);
                if (!menu)
                    return res.status(404).json("Menu not found");
            }
            return res.status(200).json(shoppinglist);
        } catch (error) {
            return res.status(500).json({
                error
            });
        }
    }
})