const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: false
    },
    phone: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    restos: [{
        resto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Restaurant"
        },
        status: {
            type: String,
            enum: ["On", "Off"],
        },
        role: {
            type: String,
            required: true
        },
        permissions: [{
            type: String
        }],
        activity: [{
            startAt: {
                type: Date
            },
            endAt: {
                type: Date
            }
        }]
    }],
    country: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);
