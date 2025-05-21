const mongoose = require('mongoose');

const dailymenu = new mongoose.Schema({
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    menus: [{
        menu: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu"
        },
        quantity: {
            type: Number,
            default: 0
        },
        finished: {
            type: Boolean,
            default: false
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Daily Menu", dailymenu):

const mongoose = require('mongoose');
const DailyMenu = require('../models/dailyMenu');
const Menu = require('../models/menu');

/**
 * Creates a new daily menu for a specific date
 * @route POST /api/daily-menus
 */
exports.createDailyMenu = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { date, menus } = req.body;

    // Validate date
    if (!date || !isValidDate(date)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Valid date is required for daily menu' 
      });
    }

    // Check if a daily menu already exists for this date
    const existingDailyMenu = await DailyMenu.findOne({
      date: {
        $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
        $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
      }
    });

    if (existingDailyMenu) {
      return res.status(409).json({
        success: false,
        message: 'A daily menu already exists for this date',
        existingId: existingDailyMenu._id
      });
    }

    // Validate menus array
    if (!Array.isArray(menus) || menus.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Daily menu must include at least one menu item'
      });
    }

    // Validate each menu item
    const menuItems = [];
    for (const item of menus) {
      // Validate menu ID
      if (!item.menu || !mongoose.isValidObjectId(item.menu)) {
        return res.status(400).json({
          success: false,
          message: 'Each menu item must have a valid menu ID'
        });
      }

      // Check if menu exists
      const menuExists = await Menu.findById(item.menu);
      if (!menuExists) {
        return res.status(404).json({
          success: false,
          message: `Menu with ID ${item.menu} not found`
        });
      }

      // Add validated menu item
      menuItems.push({
        menu: item.menu,
        quantity: Number(item.quantity) || 0,
        finished: Boolean(item.finished) || false
      });
    }

    // Create new daily menu
    const dailyMenu = new DailyMenu({
      date: new Date(date),
      menus: menuItems
    });

    // Save daily menu
    const savedDailyMenu = await dailyMenu.save({ session });
    await session.commitTransaction();

    // Return the newly created daily menu with populated menu details
    const populatedDailyMenu = await DailyMenu.findById(savedDailyMenu._id)
      .populate({
        path: 'menus.menu',
        populate: [
          { path: 'category' },
          { path: 'images' }
        ]
      })
      .exec();

    return res.status(201).json({
      success: true,
      data: populatedDailyMenu
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error creating daily menu:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create daily menu',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

/**
 * Updates an existing daily menu
 * @route PUT /api/daily-menus/:id
 */
exports.updateDailyMenu = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const { date, menus } = req.body;

    // Validate daily menu ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid daily menu ID'
      });
    }

    // Find the daily menu
    const dailyMenu = await DailyMenu.findById(id);
    if (!dailyMenu) {
      return res.status(404).json({
        success: false,
        message: 'Daily menu not found'
      });
    }

    // Update date if provided and valid
    if (date && isValidDate(date)) {
      // Check if another daily menu exists for this date (excluding current one)
      const existingDailyMenu = await DailyMenu.findOne({
        _id: { $ne: id },
        date: {
          $gte: new Date(new Date(date).setHours(0, 0, 0, 0)),
          $lt: new Date(new Date(date).setHours(23, 59, 59, 999))
        }
      });

      if (existingDailyMenu) {
        return res.status(409).json({
          success: false,
          message: 'Another daily menu already exists for this date',
          existingId: existingDailyMenu._id
        });
      }

      dailyMenu.date = new Date(date);
    }

    // Update menus array if provided
    if (Array.isArray(menus)) {
      if (menus.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Daily menu must include at least one menu item'
        });
      }

      // Validate each menu item
      const menuItems = [];
      for (const item of menus) {
        // Validate menu ID
        if (!item.menu || !mongoose.isValidObjectId(item.menu)) {
          return res.status(400).json({
            success: false,
            message: 'Each menu item must have a valid menu ID'
          });
        }

        // Check if menu exists
        const menuExists = await Menu.findById(item.menu);
        if (!menuExists) {
          return res.status(404).json({
            success: false,
            message: `Menu with ID ${item.menu} not found`
          });
        }

        // Add validated menu item
        menuItems.push({
          menu: item.menu,
          quantity: Number(item.quantity) || 0,
          finished: Boolean(item.finished) || false
        });
      }

      dailyMenu.menus = menuItems;
    }

    // Update timestamp
    dailyMenu.updatedAt = Date.now();

    // Save updated daily menu
    const updatedDailyMenu = await dailyMenu.save({ session });
    await session.commitTransaction();

    // Return the updated daily menu with populated menu details
    const populatedDailyMenu = await DailyMenu.findById(updatedDailyMenu._id)
      .populate({
        path: 'menus.menu',
        populate: [
          { path: 'category' },
          { path: 'images' }
        ]
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: populatedDailyMenu
    });

  } catch (error) {
    await session.abortTransaction();
    console.error('Error updating daily menu:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update daily menu',
      error: error.message
    });
  } finally {
    session.endSession();
  }
};

/**
 * Updates menu quantity or finished status within a daily menu
 * @route PATCH /api/daily-menus/:id/menu/:menuId
 */
exports.updateDailyMenuItem = async (req, res) => {
  try {
    const { id, menuId } = req.params;
    const { quantity, finished } = req.body;

    // Validate IDs
    if (!mongoose.isValidObjectId(id) || !mongoose.isValidObjectId(menuId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid daily menu ID or menu ID'
      });
    }

    // Find the daily menu
    const dailyMenu = await DailyMenu.findById(id);
    if (!dailyMenu) {
      return res.status(404).json({
        success: false,
        message: 'Daily menu not found'
      });
    }

    // Find the menu item in the daily menu
    const menuIndex = dailyMenu.menus.findIndex(
      item => item.menu.toString() === menuId
    );

    if (menuIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Menu not found in this daily menu'
      });
    }

    // Update menu item properties if provided
    if (quantity !== undefined) {
      dailyMenu.menus[menuIndex].quantity = Number(quantity);
    }

    if (finished !== undefined) {
      dailyMenu.menus[menuIndex].finished = Boolean(finished);
    }

    // Update timestamp
    dailyMenu.updatedAt = Date.now();

    // Save updated daily menu
    await dailyMenu.save();

    // Return the updated daily menu with populated menu details
    const populatedDailyMenu = await DailyMenu.findById(id)
      .populate({
        path: 'menus.menu',
        populate: [
          { path: 'category' },
          { path: 'images' }
        ]
      })
      .exec();

    return res.status(200).json({
      success: true,
      data: populatedDailyMenu
    });

  } catch (error) {
    console.error('Error updating daily menu item:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update daily menu item',
      error: error.message
    });
  }
};

/**
 * Deletes a daily menu
 * @route DELETE /api/daily-menus/:id
 */
exports.deleteDailyMenu = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate daily menu ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid daily menu ID'
      });
    }

    // Find and delete the daily menu
    const deletedDailyMenu = await DailyMenu.findByIdAndDelete(id);

    if (!deletedDailyMenu) {
      return res.status(404).json({
        success: false,
        message: 'Daily menu not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Daily menu deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting daily menu:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete daily menu',
      error: error.message
    });
  }
};

/**
 * Gets all daily menus with filtering, sorting and pagination
 * @route GET /api/daily-menus
 */
exports.getDailyMenus = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      startDate,
      endDate,
      sortBy = 'date',
      sortOrder = 'desc'
    } = req.query;

    // Build filter conditions
    const filter = {};
    
    // Date range filter
    if (startDate || endDate) {
      filter.date = {};
      
      if (startDate && isValidDate(startDate)) {
        filter.date.$gte = new Date(new Date(startDate).setHours(0, 0, 0, 0));
      }
      
      if (endDate && isValidDate(endDate)) {
        filter.date.$lte = new Date(new Date(endDate).setHours(23, 59, 59, 999));
      }
    }

    // Build sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Execute query with pagination
    const dailyMenus = await DailyMenu.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .populate({
        path: 'menus.menu',
        populate: { path: 'category' }
      })
      .exec();

    // Get total count for pagination metadata
    const total = await DailyMenu.countDocuments(filter);

    return res.status(200).json({
      success: true,
      data: dailyMenus,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching daily menus:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch daily menus',
      error: error.message
    });
  }
};

/**
 * Gets a daily menu by ID
 * @route GET /api/daily-menus/:id
 */
exports.getDailyMenuById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate daily menu ID
    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid daily menu ID'
      });
    }

    // Find the daily menu with populated menu details
    const dailyMenu = await DailyMenu.findById(id)
      .populate({
        path: 'menus.menu',
        populate: [
          { path: 'category' },
          { path: 'images' },
          { path: 'variants' }
        ]
      })
      .exec();

    if (!dailyMenu) {
      return res.status(404).json({
        success: false,
        message: 'Daily menu not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: dailyMenu
    });

  } catch (error) {
    console.error('Error fetching daily menu:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch daily menu',
      error: error.message
    });
  }
};

/**
 * Gets the daily menu for today
 * @route GET /api/daily-menus/today
 */
exports.getTodayDailyMenu = async (req, res) => {
  try {
    // Get today's date range (start and end of day)
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Find today's daily menu
    const dailyMenu = await DailyMenu.findOne({
      date: {
        $gte: startOfDay,
        $lte: endOfDay
      }
    })
    .populate({
      path: 'menus.menu',
      populate: [
        { path: 'category' },
        { path: 'images' },
        { path: 'variants' }
      ]
    })
    .exec();

    if (!dailyMenu) {
      return res.status(404).json({
        success: false,
        message: 'No daily menu found for today'
      });
    }

    return res.status(200).json({
      success: true,
      data: dailyMenu
    });

  } catch (error) {
    console.error('Error fetching today\'s daily menu:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s daily menu',
      error: error.message
    });
  }
};

/**
 * Helper function to validate date string
 */
function isValidDate(dateString) {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
