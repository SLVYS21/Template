const mongoose = require('mongoose');
const Convert  = require('../../Controllers/conversion.controller')

const AccountSchema = new mongoose.Schema({
    name: String,
    countries: [{
       type: String
    }],
    defaultAmount: {
        value: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "XOF"
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        defautlt: Date.now
    },
    logo: {
        type: String
    },
    sold: {
        value: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "XOF"
        }
    },
});

AccountSchema.pre('save', function () {
    this.updatedAt = Date.now();
});

AccountSchema.methods.updateBalance = async function (amount, currency) {
    let converted = await Convert(amount, this.sold.currency, currency);

    while (converted === null)
        converted = await Convert(amount, this.sold.currency, currency);
    converted = Number(converted);
    this.sold.value += converted;
    await this.save();
};

module.exports = mongoose.model('Account', AccountSchema);