const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    description: {
        trype: String
    },
    pic: {
        type: String
    },
    places: {
        type: Number,
        default: 0
    },
    resto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rest"
    }
});

const reservationSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    surname: {
        type: String,
        required: true
    },
    tables: [{
        table: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Table"
        }
        
    }],
    places: {
        type: Number,
        default: 0,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
        required: true
    },
    phone: {
        type: Date,
        default: String,
        required: 0
    },
    note: {
        type: String
    },
    resto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Rest"
    }
});

