const mongoose = require('mongoose');

const stockModel = new mongoose.Schema({
    menuId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu"
    },
    variantId: {
        type: String
    },
    resto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resto"
    }
});

module.exports = mongoose.model('stockModel', stockModel);
