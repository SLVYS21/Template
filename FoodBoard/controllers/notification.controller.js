const Notification = require('../models/notification.model');

const notifController = ({
    create: async (req, res) => {
        try {
            const {userId, message, resto} = req.body;

            const notification = await Notification.create({
                userId,
                message,
                resto
            });
            await notification.save();
            res.status(201).json(notification);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            });
        }
    },
    getUserNotifications: async(req, res) => {
        try {
            const {unread, userId, resto} = req.query;
            const page = req.query.page || 1;
            const limit = req.query.limit || 15;

            if (!userId || !resto)
                return res.status(404).send("PLease set user Id and resto");
            const query = {};
            query.userId = userId;
            query.resto = resto;
            if (unread)
                query.read = false;
            
            const notifications = await Notification.find(query).sort({_id: -1}).skip((page - 1) * limit).limit(limit);
        } catch (error) {
            return res.status(500).json({
                message: error.message,
                error
            });
        }
    },
    delete: async(req, res) => {
        try {
            const id = req.params.id;

            const notif = await Notification.findById(req.params.id);
            if (!notif)
                return res.status(404).send("Notification Undefined");
            if (notif.userId.toString() !== req.user._id.toString()) {
                return res.status(403).send("You're not allowed to delete this notifs");
            }
        } catch (error) {
            return res.status(500).send("Deletion error");
        }
    },
    markAsRead: async(req, res) => {
        try {
            const {all, notifId} = req.query;

            if (all) {
                const notifs = await Notification.find({userId: req.user._id, read: false});

                for (const notif of notifs) {
                    notif.read = true;
                    await notif.save();
                }
                return res.status(200).json(notifs);
            }
            const notif = await Notification.findById(notifId);
            if (!notif)
                return res.status(404).json("Notif not found");
            if (notif.userId.toString() !== req.user._id.toString())
                return res.status(403).send("You're not allowed to delete this notifs");
            notif.read = true;
            await notif.save();
            return res.status(200).json(notif);
        } catch (error) {
            return res.status(500).send("Server Error: Mark Failed");
        }
    }
});

module.exports = notifController;
