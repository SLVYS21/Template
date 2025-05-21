const mongoose = require("mongoose");

const restoSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    logo: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    horaires: [{
        day: {
            type: String,
            required: true
        },
        hours: {
            type: String,
            required: true
        }
    }]
});

module.exports = mongoose.model("Restaurant", restoSchema);
