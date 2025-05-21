const mongoose = require('mongoose');

const variants = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        value: {
            type: Number,
            default: 0
        },
        currency: {
            type: Number,
            default: 'XOF'
        }
    },
    stock: {
        type: Number,
        default: 0
    },
    quant: {
        type: Boolean,
        default: false
    },
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Menu'
    }
})


const menuModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    variants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Variant'
    }],
    quant: {
        type: Boolean,
        default: false
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
    stock: {
        type: Number,
        default: 0
    },
    images: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Image"
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    variant: {
        type: Boolean,
        default: false
    }
});

const menuController = ({
    createMenu: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const { name, description, category, price, stock, quant, variant } = req.body;
            const variantsData = req.body.variants || [];
            const files = req.files || [];
            
            if (!name) {
                return res.status(400).json({ message: 'Menu name is required' });
            }
            
            if (!category || !mongoose.isValidObjectId(category)) {
                return res.status(400).json({ message: 'Valid category ID is required' });
            }
            
            if (price && typeof price === 'object') {
                if (!price.value || isNaN(Number(price.value))) {
                    return res.status(400).json({ message: 'Price value must be a number' });
                }
                
                if (!price.currency || typeof price.currency !== 'string') {
                    return res.status(400).json({ message: 'Price currency must be a string' });
                }
            }
            
            if (files.length > 4) {
                return res.status(400).json({ message: 'Maximum of 4 images allowed per menu' });
            }
            
            const menuData = {
                name,
                description,
                category,
                quant: Boolean(quant),
                variant: Boolean(variant),
                price: {
                    value: price?.value || 0,
                    currency: price?.currency || 'XOF'
                },
                stock: stock || 0,
                variants: [],
                images: []
            };
            
            const menu = new Menu(menuData);
            
            if (variant && Array.isArray(variantsData)) {
                for (const variantData of variantsData) {
                    if (!variantData.name) {
                        return res.status(400).json({ message: 'Each variant must have a name' });
                    }
                }
                
                for (const variantData of variantsData) {
                    const newVariant = new Variant({
                        name: variantData.name,
                        price: {
                            value: variantData.price?.value ?? menu.price.value,
                            currency: variantData.price?.currency ?? menu.price.currency
                        },
                        stock: variantData.stock ?? menu.stock,
                        quant: menu.quant,
                        menuId: menu._id
                    });
                    
                    const savedVariant = await newVariant.save({ session });
                    menu.variants.push(savedVariant._id);
                }
            }
            
            if (files.length > 0) {
                for (const file of files) {
                    const uploadResult = await imageService.uploadImg(file);
                    if (uploadResult) {
                        const imageDoc = new mongoose.model('Image')({
                            name: uploadResult.name,
                            url: uploadResult.url,
                            menuId: menu._id
                        });
                        
                        const savedImage = await imageDoc.save({ session });
                        menu.images.push(savedImage._id);
                    }
                }
            }
            
            const savedMenu = await menu.save({ session });
            await session.commitTransaction();
            
            const populatedMenu = await Menu.findById(savedMenu._id)
                  .populate('variants')
                  .populate('images')
                  .populate('category')
                  .exec();
            
            return res.status(201).json({
                success: true,
                data: populatedMenu
            });
            
        } catch (error) {
            await session.abortTransaction();
            console.error('Error creating menu:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to create menu',
                error: error.message
            });
        } finally {
            session.endSession();
        }
    },
    updateMenu: async (req, res) => {
        const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const { id } = req.params;
            const { 
                name, 
                description, 
                category, 
                price, 
                stock, 
                quant, 
                variant,
                variants: variantsData = [],
                imagesToDelete = []
            } = req.body;
            const files = req.files || [];
            
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: 'Invalid menu ID' });
            }
            
            const menu = await Menu.findById(id);
            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }
            
            const existingImageCount = menu.images.length;
            const newTotalImages = existingImageCount + files.length - imagesToDelete.length;
            if (newTotalImages > 4) {
                return res.status(400).json({ message: 'Maximum of 4 images allowed per menu' });
            }
            
            if (name) menu.name = name;
            if (description !== undefined) menu.description = description;
            if (category && mongoose.isValidObjectId(category)) menu.category = category;
            
            if (quant !== undefined) {
                menu.quant = Boolean(quant);
                if (menu.variants.length > 0) {
                    await Variant.updateMany(
                        { _id: { $in: menu.variants } },
                        { quant: menu.quant },
                        { session }
                    );
                }
            }
            
            if (variant !== undefined) menu.variant = Boolean(variant);
            
            if (price && typeof price === 'object') {
                if (price.value && !isNaN(Number(price.value))) {
                    menu.price.value = Number(price.value);
                }
                if (price.currency && typeof price.currency === 'string') {
                    menu.price.currency = price.currency;
                }
            }
            
            if (stock !== undefined && !isNaN(Number(stock))) {
                menu.stock = Number(stock);
            }
            
            if (menu.variant && Array.isArray(variantsData)) {
                const currentVariants = await Variant.find({ menuId: menu._id });
                const currentVariantIds = currentVariants.map(v => v._id.toString());
                
                for (const variantData of variantsData) {
                    if (variantData._id && mongoose.isValidObjectId(variantData._id)) {
                        await Variant.findByIdAndUpdate(
                            variantData._id,
                            {
                                name: variantData.name,
                                price: {
                                    value: variantData.price?.value ?? menu.price.value,
                                    currency: variantData.price?.currency ?? menu.price.currency
                                },
                                stock: variantData.stock ?? menu.stock,
                                quant: menu.quant
                            },
                            { session }
                        );
                    } else if (variantData.name) {
                        const newVariant = new Variant({
                            name: variantData.name,
                            price: {
                                value: variantData.price?.value ?? menu.price.value,
                                currency: variantData.price?.currency ?? menu.price.currency
                            },
                            stock: variantData.stock ?? menu.stock,
                            quant: menu.quant,
                            menuId: menu._id
                        });
                        
                        const savedVariant = await newVariant.save({ session });
                        menu.variants.push(savedVariant._id);
                    }
                }
                
                const variantIdsToKeep = variantsData
                      .filter(v => v._id && mongoose.isValidObjectId(v._id))
                      .map(v => v._id.toString());
                
                const variantIdsToDelete = currentVariantIds.filter(id => !variantIdsToKeep.includes(id));
                
                if (variantIdsToDelete.length > 0) {
                    await Variant.deleteMany({ _id: { $in: variantIdsToDelete } }, { session });
                    menu.variants = menu.variants.filter(id => !variantIdsToDelete.includes(id.toString()));
                }
            }
            
            if (files.length > 0) {
                for (const file of files) {
                    const uploadResult = await imageService.uploadImg(file);
                    if (uploadResult) {
                        const imageDoc = new mongoose.model('Image')({
                            name: uploadResult.name,
                            url: uploadResult.url,
                            menuId: menu._id
                        });
                        
                        const savedImage = await imageDoc.save({ session });
                        menu.images.push(savedImage._id);
                    }
                }
            }
            
            if (Array.isArray(imagesToDelete) && imagesToDelete.length > 0) {
                const validImageIds = imagesToDelete.filter(id => mongoose.isValidObjectId(id));
                
                const imagesToRemove = await mongoose.model('Image').find({
                    _id: { $in: validImageIds },
                    menuId: menu._id
                });
                
                for (const image of imagesToRemove) {
                    await imageService.deleteImg(image.name);
                }
                
                await mongoose.model('Image').deleteMany(
                    { _id: { $in: validImageIds }, menuId: menu._id },
                    { session }
                );
                
                menu.images = menu.images.filter(id => !validImageIds.includes(id.toString()));
            }
            
            menu.updatedAt = Date.now();
            
            const updatedMenu = await menu.save({ session });
            await session.commitTransaction();
            
            const populatedMenu = await Menu.findById(updatedMenu._id)
                  .populate('variants')
                  .populate('images')
                  .populate('category')
                  .exec();
            
            return res.status(200).json({
                success: true,
                data: populatedMenu
            });
            
        } catch (error) {
            await session.abortTransaction();
            console.error('Error updating menu:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to update menu',
                error: error.message
            });
        } finally {
            session.endSession();
        }
    },
    deleteMenu = async (req, res) => {
  const session = await mongoose.startSession();
        session.startTransaction();
        
        try {
            const { id } = req.params;
            
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: 'Invalid menu ID' });
            }

            const menu = await Menu.findById(id);
            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }
            
            if (menu.images.length > 0) {
                const images = await mongoose.model('Image').find({ _id: { $in: menu.images } });

                for (const image of images) {
                    await imageService.deleteImg(image.name);
                }

                await mongoose.model('Image').deleteMany({ _id: { $in: menu.images } }, { session });
            }

            if (menu.variants.length > 0) {
                await Variant.deleteMany({ _id: { $in: menu.variants } }, { session });
            }
 
            await Menu.findByIdAndDelete(id, { session });

            await session.commitTransaction();
            
            return res.status(200).json({
                success: true,
                message: 'Menu deleted successfully'
            });
            
        } catch (error) {
            await session.abortTransaction();
            console.error('Error deleting menu:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to delete menu',
                error: error.message
            });
        } finally {
            session.endSession();
        }
    },
    getMenus = async (req, res) => {
        try {
            const {
                page = 1,
                limit = 10,
                category,
                search,
                sortBy = 'createdAt',
                sortOrder = 'desc',
                withVariants = false
            } = req.query;
            
            const filter = {};
            if (category && mongoose.isValidObjectId(category)) {
                filter.category = category;
            }
            
            if (search) {
                filter.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { description: { $regex: search, $options: 'i' } }
                ];
            }
            
            const sort = {};
            sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
            
            const skip = (parseInt(page) - 1) * parseInt(limit);
            
            const menuQuery = Menu.find(filter)
                  .sort(sort)
                  .skip(skip)
                  .limit(parseInt(limit))
                  .populate('category', 'name')
                  .populate('images');
            
            if (withVariants === 'true' || withVariants === true) {
                menuQuery.populate('variants');
            }
            
            const menus = await menuQuery.exec();
            
            const total = await Menu.countDocuments(filter);
            
            return res.status(200).json({
                success: true,
                data: menus,
                pagination: {
                    total,
                    page: parseInt(page),
                    limit: parseInt(limit),
                    pages: Math.ceil(total / parseInt(limit))
                }
            });
            
        } catch (error) {
            console.error('Error fetching menus:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch menus',
                error: error.message
            });
        }
    },
    getMenuById: async (req, res) => {
        try {
            const { id } = req.params;
            
            // Validate menu ID
            if (!mongoose.isValidObjectId(id)) {
                return res.status(400).json({ message: 'Invalid menu ID' });
            }
            
            const menu = await Menu.findById(id)
                  .populate('variants')
                  .populate('images')
                  .populate('category')
                  .exec();
            
            if (!menu) {
                return res.status(404).json({ message: 'Menu not found' });
            }
            
            return res.status(200).json({
                success: true,
                data: menu
            });
            
        } catch (error) {
            console.error('Error fetching menu:', error);
            return res.status(500).json({
                success: false,
                message: 'Failed to fetch menu',
                error: error.message
            });
        }
    }
});
                        
module.exports = mongoose.model("Menu", menuModel);

