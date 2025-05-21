const DailyPoint = require('../models/dailypoint.model');

const controller = ({
    getDailyPoint: async () => {
        try {
            const today = new Date();
            let dailyPoint = await DailyPoint.findOne().sort({_id: -1});
            if (!dailyPoint) {
                const dp = new DailyPoint();
                await dp.save();
                return dp;
            }
            const lastDate = dailyPoint.date;
            if (lastDate.getMonth() === today.getMonth() && 
                lastDate.getYear() === today.getYear() &&
                lastDate.getDate() === today.getDate()) {
                    return dailyPoint;
            }
            dailyPoint = new DailyPoint();
            await dailyPoint.save();
            return dailyPoint;
        } catch (error) {
            console.log(error);
            return null;
        }
    },
});

module.exports = controller;