const mongoose = require("mongoose");

const notifSchema = new mongoose.Schema({
    createdAt: {
        type: Date,
        default: Date.now
    },
    read: {
        type: Boolean,
        default: false
    },
    message: {
        type: String,
        require: true
    },
    userId: {
        type: mongoose.Schema.Type.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model('Notification', notifSchema);
