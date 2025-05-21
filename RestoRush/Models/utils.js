class Utils {
    function getDateFilter(period, startDate, endDate, filter, field) {
        let date = field || "date";
        if (startDate && endDate) {
            filter[date] = {$gte: new Date(startDate), $lte: new Date(endDate)};
        } else {
            const now = new Date();
            let fromDate = new Date();

            switch (period) {
            case "day":
                fromDate.setHours(0, 0, 0, 0);
                filter[date] = {
                    $gte: fromDate,
                    $lte: now
                };
                break;
            case "week":
                fromDate.setDate(now.getDate() - 7);
                filter[date] = {
                    $gte: fromDate,
                    $lte: now
                };
                break;
            case "month":
                fromDate.setMonth(now.getMonth() - 1);
                filter[date] = {
                    $gte: fromDate,
                    $lte: now
                };
                break;
            case "year":
                fromDate.setFullYear(now.getFullYear() - 1);
                filter[date] = {
                    $gte: fromDate,
                    $lte: now
                };
                break;
            default:
                break;
            }
        }

        return filter;
    };
}

module.exports = Utils
