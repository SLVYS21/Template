const mongoose = require('mongoose');

const category = new mongoose.Schema({
    name: {
        type: String,
        enum: ["Delivery", "Ads", "Sourcing", "Salary", "Daily Income", "Others"],
        required: true,
    },
    type: {
        type: String,
        enum: ["Expense", "Income", "Transfert"],
        default: "Expense"
    },
});

module.exports = mongoose.model("Category", category);