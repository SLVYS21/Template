const axios = require('axios');

async function convertAmount(amount, from, to) {
    try {
        if (from === to)
            return amount;
        let response = await axios.get(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${from.toLowerCase()}.json`);

        if (!response)
            response = await axios.get(`https://latest.currency-api.pages.dev/npm//@fawazahmed0/currency-api@latest/v1/currencies/${from.toLowerCase()}.json`);
        if (!response) {
            console.log("API error");
            return null;
        }
        const rate = response.data[from.toLowerCase()][to.toLowerCase()];
        if (!rate)
            return null;

        const converted = amount * rate;
        return Number(converted.toFixed(6));
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

module.exports = convertAmount;