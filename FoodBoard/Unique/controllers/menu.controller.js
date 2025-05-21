const Menu = require('../models/menu.model');

function getMinMax(variants) 
{
    var list = [], min = 0, max = 0;
    for (const variant of variants) {
        list.push(variant.price.value);
    }
    list.sort((a, b) => a - b);
    min = list[0];
    list.sort((a, b), b - a);
    max = list[1];
    return {min, max};
}

const menuController = ({
    createCategory: async(req, res) => {
        try {
            const {name, description} = req.body;

            const exists = await Category.findOneAndUpdate({name},
                {description},
                {new: true, upsert: true}
            );
            return res.status(200).json(exists);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    },
    updateCategory: async(req, res) => {
        try {
            const {name, description} = req.body;
            const category = await Category.findByIdAndUpdate(req.query._id,
                {name, description},
                {new: true, upsert: true}
            );

            return res.status(200).json(category);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    },
    deleteCategory: async(req, res) => {
        try {
            const id = req.params.id;

            const menu = await Menu.findOne({category: id});
            if (menu) {
                return res.status(403).json({
                    message: "There is menu using this category"
                });
            };
            await Menu.findByIdAndDelete(id);
            return res.status(200).json({
                message: "Deletion Done"
            });
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    changeMenuCategory: async(req, res) => {
        try {
            const {categoryId, menuId} = req.body;

            const category = await Category.findById(categoryId);
            if (!category) {
                return res.status(404).json({
                    message: "Category not defined"
                });
            }
            const menu = await Menu.findById(menuId);
            if (!menu) {
                return res.status(404).json({
                    message: "Message not found"
                });
            }
            menu.category = category._id;
            await menu.save();
            return res.status(200).json(menu);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            });
        }
    },
    getMenuByCat: async(req, res) => {
        try {
            const {page = 1, limit = 15, category} = req.query;
            if (!category) {
                return res.status(404).json({
                    message: "Set some catgeory"
                });
            }
            const menus = await Menu.find({
                category
            }).sort({_id: -1}).limit(limit).skip((page - 1) * limit).populate("variants");
            return res.status(200).json({
                menus
            });
        } catch (error) {
            return res.status(500).json({
                message: "Deletion Done"
            });
        }
    },
    createMenu: async(req, res) => {
        try {
            /*
            price: {
                value: Number,
                currency: "XOF"
            }
            */
            const {name, description, images, mainpic, category, price} = req.body;

            const exist = await Menu.findOne({
                name: {$regex: new RegExp(`^${name.trim()}$`, 'i')}
            });
            if (!exist)
                return res.status(404).json({
                    message: "Menu already exist"
                });
            const menu = await Menu.findOneAndUpdate({
                name
            }, {
                description,
                images,
                mainpic,
                category,
                price,
                minPrice: price,
                maxPrice: price
            }, {
                new: true,
                insert: true
            });

            return res.status(200).json({
                menu
            });
        } catch (error) {
            return res.status(500).json({
                error: error.message
            })
        }
    },
    createVariant: async(req, res) => {
        try {
            const {menuId, name, price, mainpic, images, defaultStock} = req.body;

            const menu = await Menu.findById(menuId).populate("variants");
            if (!menu) {
                return res.status(404).json({
                    message: "Menu not found"
                });
            }

            const exist = menu.variants.find(it => it.name.trim().toLowerCase() === name.trim().toLowerCase());
            if (!exist)
                return res.status(403).json({
                    message: "This menu already have this variant in stock"
                });
            if (parseInt(price.value) <= 0)
                return res.status(403).json({
                    message: "Price can't be negative"
                });
            const variant = await Variant.create({
                name,
                price: {
                    value: parseInt(price.value),
                    currency: "XOF"
                },
                mainpic,
                images,
                quant: menu.quant,
                menu: menu._id,
                defaultStock,
                stock: (defaultStock ? defaultStock : 0)
            });
            const _menu = await Menu.findById(menuId);
            if (_menu.quant && defaultStock) {
                _menu.defaultStock += defaultStock;
                _menu.stock += defaultStock;
            }
            _menu.variants.push(variant._id);
            const {min, max} = getMinMax(menu.variants);
            _menu.minPrice = {
                value: min,
                currency: "XOF"
            };
            _menu.maxPrice = {
                value: max,
                currency: "XOF"
            };
            await _menu.save();

            return res.status(200).json(variant);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            });
        }
    },
    updateVariant: async(req, res) => {
        try {
            const variantId = req.params.id;
            const {name, price, defaultStock, quant, images, mainpic} = req.body;
            const variant = await Variant.findById(variantId);
            if (!variant)
                return res.status(404).json({
                    message: "Undefined Variant"
                });
            const menu = await Menu.findById(variant.menu).populate("variants");
            if (!menu) {
                return res.status(403).json({
                    message: "Menu not found"
                });
            }
            if (name) {
                const exist = menu.variants.find(it => it.name.trim().toLowerCase() === name.trim().toLowerCase());
                if (!exist)
                    return res.status(403).json({
                        message: "Some variant of this menu already have this name"
                    });
                variant.name = name;
            }
            if (price) {
                if (parseInt(price.value) <= 0)
                    return res.status(403).json({
                        message: "Price can't be negative"
                    });
                variant.price = price;
            }
            if (defaultStock)
                variant.stock = variant.stock - variant.defaultStock + defaultStock;
            if (images)
                variant.images = images;
            if (mainpic)
                variant.mainpic = mainpic;

            await variant.save();
    
            if (price) {
                const {min, max} = getMinMax(menu.variants);
                menu.minPrice = {
                    value: min,
                    currency: "XOF"
                };
                menu.maxPrice = {
                    value: max,
                    currency: "XOF"
                };
                await menu.save();
            }
            return res.status(200).json(variant);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    },
    updateMenu: async(req, res) => {
        try {
            const {name, description, price, mainpic, images, quant, defaultStock} = req.body;

            const menu = await Menu.findById(req.params.id);

            if (!menu) {
                return res.status(404).json({
                    message: "Menu not found"
                });
            }
            if (name) {
                const _menus = await Menu.findOne({
                    name: {$regex: new RegExp(`^${name.trim()}$`, 'i')}
                });
            }
            if (description)
                menu.description = description;
            if (price) {
                if (parseInt(price.value) <= 0)
                    return res.status(403).json({
                        message: "Price can't be negative"
                    });
                menu.price = price;
            }
            if (mainpic)
                menu.mainpic = mainpic;
            if (images)
                menu.images = images;
            if (defaultStock) {
                if (menu.variants !== null) {
                    menu.defaultStock = defaultStock;
                    menu.stock = menu.stock - menu.defaultStock + defaultStock;
                } else if (!menu.quant)
                    return res.status(403).json({
                        message: "Not quantifiable"
                    });
                else
                    return res.status(404).json({
                        message: "Not quantifiable or update variant default stock"
                    });
            }
            if (quant) {
                menu.quant = quant;
                menu.variants.map(it => it.quant = quant);
            }

            await menu.save();
            return res.status(200).json(menu);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            });
        }
    },
    deleteVariant: async(req, res) => {
        try {
            return res.status(200).json("Deletion done");
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            })
        }
    },
    menuActivity: async(req, res) => {
        try {
            const menu = await Menu.findById(menu.id);
            const {active} = req.body;
            if (!menu) {
                return res.status(404).json({
                    message: "Menu not found"
                });
            }
            if (!active)
                return res.status(200).json({
                    message: "Set the state"
                });
            menu.active = active;
            await menu.save();
            return res.status(200).json(menu);
        } catch (error) {
            return res.status(500).json({
                message: "Error.message"
            })
        }
    },
    deleteMenu: async(req, res) => {
        try {
            const id = req.params.id;

            await Menu.findByIdAndDelete(id);
            return res.status(200).json({
                message: "Successfully deleted"
            });
        } catch(error) {
            return res.status(500).json({
                message: error.message,
                error
            })
        }
    },
    createDailyMenu: async(req, res) => {
        try {
            const {date, plates} = req.body;

            const exist =  await DailyMenu.findOne({date});
            if (!exist)
                return res.status(404).json({
                    message: "Daily menu already exists"
                });
            for (const plate of plates) {
                const menu = await Menu.findById(plate.menu);
            }
            

            return res.status(200).json(dailymenu);
        } catch (error) {
            return res.status(200).json({
                message: error.message
            })
        }
    },
    getDailyMenu: async(req, res) => {
        try {

        } catch(error) {
            return res.status(500).json({
                messafe: error.message
            })
        }
    }
});

//Créer ses menus --by category
//  --> Add/Delete/Read/Update Variants
//  --> Delete/Read/Update Variants
//Créer daily Menu for specific date based on existant menu
//Add specific variants of real product for daily menu
//[Duplicate] daily Menu for other dates
//