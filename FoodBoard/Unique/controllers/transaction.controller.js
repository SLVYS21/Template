const Transaction = require('../../Models/Finances/transaction.model');
const Account = require('../../Models/Finances/account.model');
const Convert = require('../conversion.controller');

const controller = ({
    create: async(req, res) => {
        try {
            const {type, amount, currency, from, to} = req.body;

            if (!type || !amount || !currency || !from)
                return res.status(403).json("Uncomplete Fields");
            const country = req.body.country || req.user.country;
            if (!country) {
                return res.status(404).json({
                    message: "Ramba ! Needthe country"
                });
            }
            const types = ["Expense", "Income", "Transfert"];
            if (!types.includes(type)) {
                return res.status(404).json("Unknown Transaction Type");
            } if (type === "Transfert" && !to)
                return res.status(404).json('To Account undefined');

            const fromAccount = await Account.findById(from);
            const toAccount = await Account.findById(to);

            if (!fromAccount || (to && !toAccount))
                return res.status(404).json("Unknown Account");

            const transaction = await Transaction.create({
                amount: {
                    value: amount,
                    currency
                },
                type,
                country,
                to: to ? to : null,
                from
            });

            await transaction.apply();
            return res.status(200).json(transaction);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    changeCurrency: async(req, res) => {
        try {
            const id = req.params.id;
            const currency = req.query.currency;

            const transaction = await Transaction.findById(id);

            if (!transaction)
                return res.status(404).json({
                    message: "Transaction"
                });

            transaction.amount.currency = currency;
            await transaction.save();
            return res.status(200).json(transaction);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            })
        }
    },
    delete: async(req, res) => {
        try {
            const id = req.params.id;

            const transaction = await Transaction.findById(id);
            if(!transaction) {
                return res.status(404).json({
                    message: "Transaction not found"
                })
            }

            await findByIdAndDelete(transaction);
            return res.status(200).json({
                message: "Deletion done"
            });
        } catch (error) {
            return res.status(500).json({message: error.message, error});
        }
    },
    updateAmount: async(req, res) => {
        try {
            const {amount, currency} = req.body;
            const id = req.params.id;

            const transaction = await Transaction.findById(id);
            if (!transaction)
                return res.status(404).json("Undefined Transaction");

            await transaction.apply(-1);
            let converted = await Convert(amount, currency, transaction.amount.currency);
            while (converted === null)
                converted = await Convert(amount, currency, transaction.amount.currency);
            transaction.amount.value = converted;
            transaction.amount.currency = currency;
            await transaction.save();
            await transaction.apply(1);
            return res.status(200).json(transaction);
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                message: error.message
            });
        }
    },
    updateAccount: async(req, res) => {
        try {
            const {from, to} = req.body;
            const transaction = await Transaction.findById(req.params.id);
            if (!transaction) return res.status(404).json({ message: 'Transaction not found' });
            
            const oldFromAccount = await Account.findById(transaction.from);
            const oldToAccount = transaction.to ? await Account.findById(transaction.to) : null;
            const newFromAccount = await Account.findById(from);
            const newToAccount = to ? await Account.findById(to) : null;
            
            if (transaction.type === 'Expense') {
                await oldFromAccount.updateBalance(transaction.amount.value, transaction.amount.currency);
                await newFromAccount.updateBalance(-transaction.amount.value, transaction.amount.currency);
            } else if (transaction.type === 'Income') {
                await oldFromAccount.updateBalance(-transaction.amount.value, transaction.amount.currency);
                await newFromAccount.updateBalance(transaction.amount.value, transaction.amount.currency);
            } else if (transaction.type === 'Transfert' && oldToAccount && newToAccount) {
                await oldFromAccount.updateBalance(transaction.amount.value, transaction.amount.currency);
                await oldToAccount.updateBalance(-transaction.amount.value, transaction.amount.currency);
                await newFromAccount.updateBalance(-transaction.amount.value, transaction.amount.currency);
                await newToAccount.updateBalance(transaction.amount.value, transaction.amount.currency);
            }

            transaction.from = from;
            transaction.to = to || null;
            await transaction.save();
            res.json(transaction);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },
    get: async(req, res) => {
        try {
            const type = req.query.type || "Expense";
            const page = req.query.page || 1;
            const limit = req.query.limit || 10;
            const country = req.query.country || req.user.country;

            const transactions = await Transaction.find({country, type}).sort({_id: -1}).skip((page - 1) * limit).limit(limit);

            return res.status(200).json(transactions);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    },
    convertAmount: async(req, res) => {
        try {
            const {id, to} = req.query;

            const transaction = await Transaction.findById(id);
            if (!transaction)
                return res.status(404).json({
                    message: "transaction not found"
                });
            const convertedAmount = await Convert(transaction.amount.value, transaction.amount.currency, to);
            if (convertedAmount === null)
                return res.status(404).json("Unknow Currency \ API Error");
            transaction.amount.currency = to;
            transaction.amount.value = convertedAmount;
            await transaction.save();
            return res.status(200).json(transaction);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            });
        }
    }
});

module.exports = controller;