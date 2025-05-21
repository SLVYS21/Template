const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    description: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    deleted: {
        type: Boolean,
        default: false
    }
});

const categoryController = ({
    get: async(req, res, next) => {
        try {
            const categories = await Category.find();

            return res.status(200).json(categories);
        } catch (error) {
            next(error);
        }
    },
    update: async(req, res, next) => {
        try {
            const categoryId = req.body.categoryId;
            const {name, description} = req.body;

            if (!categoryId) {
                return res.status(403).json("Set the category Id");
            }
            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json("Category not found");
            }
            if (name && name !== category.name && name.trim().length > 0)
                category.name = name;
            if (description && description !== category.description && description.trim().length > 0)
                category.description = description;
            await category.save();
            return res.status(200).json("Updating Done");
        } catch (error) {
            next(error);
        }
    },
    deleteCat: async(req, res, next) => {
        try {
            const categoryId = req.params.id;
            if (!categoryId) {
                return res.status(403).json({
                    message: "What do you want to delete"
                });
            }
            const one = await Menu.findOne({category: categoryId});
            if (one) {
                const category = await Category.findById(categoryId);
                if (!category) {
                    return res.status(403).json({
                        message: "Category not found"
                    });
                }
                category.deleted = false;
                await category.save();
                return res.status(200).json({
                    message: "Deletion Done !"
                });
            }
            await Category.findByIdAndDelete(categoryId);
            return res.status(200).json({
                message: "Deletion Done"
            )};
        } catch (error) {
            next(error);
        }
    },
    create: async(req, res, next) => {
        try {
            const {name, description} = req.body;

            if (!name) {
                return res.status(403).json({
                    message: "The name is required"
                });
            }
            const category = await Category.create({
                name,
                description
            });
            return res.status(200).json(category);
        } catch (error) {
            next(error);
        }
    }
});

module.exports = mongoose.model('Category', categorySchema);
