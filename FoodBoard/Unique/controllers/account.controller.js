const Account = require('../../Models/Finances/account.model');
const Transaction = require('../../Models/Finances/transaction.model');
const Convert = require('../conversion.controller')

async function convert(delivery, from, to)
{
    let delivered = await Convert(delivery, from, to);

    while (delivered === null)
        delivered = await Convert(delivery, from, to);
    return Number(delivered);
}

const accountController = ({
    get: async(req, res) => {
        try {
            const country = req.query.country || req.user.country;
            const page = req.query.page || 1;
            const limit = req.query.limit || 15;

            // console.log(`--${country}--`);
            // const query = {};
            // if (country)
            //     query.country = country;
            const query = country ? {countries: {$in: [country]}} : {};
            const accounts = await Account.find(query).skip((page - 1) * limit).limit(limit);

            return res.status(200).json(accounts);
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },
    create: async(req, res) => {
        try {
            // const {name, country, defaultAmount, currency} = req.body;
            const {name, countries, defaultAmount, currency} = req.body;

            const account = await Account.create({
                name,
                countries,
                currency,
                defaultAmount: {
                    value: defaultAmount,
                    currency
                },
                sold: {
                    value: defaultAmount,
                    currency
                },
                // countries
            });

            if (!account)
                return res.status(404).json("Creation Error");
            await account.save();
            return res.status(200).json(account);
        } catch (error) {
            return res.status(500).json({message: error.message});
        }
    },
    updateDefaultAmount: async(req, res) => {
        try {
            const {defaultAmount, currency} = req.body;
            const accountId = req.params.id;

            const account = await Account.findById(accountId);

            account.sold.value -= account.defaultAmount.value;
            account.defaultAmount.value = await Convert(defaultAmount, currency, account.defaultAmount.currency);
            account.sold.value -= account.defaultAmount.value;
            account.sold.value = 0;
            await account.save();
            return res.status(account);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    delete: async(req, res) => {
        try {
            const id = req.params.id;

            const account = await Account.findByIdAndDelete(id);

            return res.status(200).json({
                message: "Deletion Done"
            });

        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            })
        }
    },
    changeCurrency: async(req, res) => {
        try {
            const accountId = req.params.id;
            const currency = req.query.currency;

            const account = await Account.findById(accountId);
            if (!account) {
                return res.status(404).json({
                    message: "Account not found"
                });
            }
            account.defaultAmount.value = await Convert(account.defaultAmount.value, account.defaultAmount.currency, currency);
            account.sold.value = await Convert(account.sold.value, account.sold.currency, currency);
            account.sold.currency = currency;
            await account.save();
            return res.status(200).json(account);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            })
        }
    },
    updateCountries: async(req, res) => {
        try {
            const id = req.params.id;
            const account = await Account.findById(id);
            if (!account)
                return res.status(404).json({
                    message: "Account not defined"
                });
            const countries = req.body.countries;
            
            account.countries = countries;
            await account.save();
            return res.status(200).json(account);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            })
        }
    },
    refreshAccount: async(req, res) => {
        try {
            let account = await Account.findById(req.params.id);

            const tab = [];
            tab.push(account.country);
            const updatedAccount = {
                countries: tab,
                defaultAmount: {
                    value: account.defaultAmount,
                    currency: account.defaultAmount
                },
                sold: {
                    value: account.sold,
                    currency: account.currency
                }
            };

            account = await Account.findOneAndUpdate({_id: req.params.id}, updatedAccount, {upsert: true, new: true});
            await account.save();
            return res.status(200).json(account);
        } catch (error) {
            return res.status(500).json({
                message: error.message
            });
        }
    }
})

module.exports =  accountController;