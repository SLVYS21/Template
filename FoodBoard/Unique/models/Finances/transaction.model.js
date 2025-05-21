const mongoose = require('mongoose');
const Account = require('../../Models/Finances/account.model');

const TransactionSchema = new mongoose.Schema({
    motif: String,
    type: {
        type: String,
        enum: ["Expense", "Income", "Transfert"],
        default: "Expense"
    },
    from: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "Account"
    },
    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt:{
        type: Date,
        default: Date.now
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    amount: {
        value: {
            type: Number,
            default: 0
        },
        currency: {
            type: String,
            default: "XOF"
        }
    }
});

TransactionSchema.pre('save', async function () {
    this.updatedAt = Date.now();
});

//factor could be 1 or -1
TransactionSchema.methods.apply = async function(factor = 1) {
    const fromAccount = await Account.findById(this.from);
    const toAccount = this.to ? await Account.findById(this.to) : null;

    if (this.type === "Expense") {
        await fromAccount.updateBalance(-this.amount.value * factor, this.amount.currency);
    } else if (this.type === "Income") {
        await fromAccount.updateBalance(this.amount.value * factor, this.amount.currency);
    } else if (this.type === "Transfert" && toAccount) {
        await fromAccount.updateBalance(-this.amount.value * factor, this.amount.currency);
        await toAccount.updateBalance(this.amount.value * factor, this.amount.currency);
    }
    await this.save();
}

module.exports = mongoose.model('Transaction', TransactionSchema);