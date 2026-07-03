const Share = require("../models/shareModel");
const crypto = require("crypto");

const saveState = async (req, res, next) => {
    try {
        const { configType, data } = req.body;
        const author = req.user ? req.user._id : null;

        if (!configType || !data) {
            res.status(400);
            throw new Error("Configuration type and data are required");
        }

        // Generate a random 8-character string for the short ID
        const shortId = crypto.randomBytes(4).toString("hex");

        const share = new Share({
            author,
            configType,
            data,
            shortId
        });

        await share.save();

        res.status(201).json({
            message: "State saved successfully",
            shortId,
            url: `/share/${shortId}`
        });
    } catch (error) {
        next(error);
    }
};

const getState = async (req, res, next) => {
    try {
        const { shortId } = req.params;
        const share = await Share.findOne({ shortId });

        if (!share) {
            res.status(404);
            throw new Error("Shared state not found");
        }

        res.status(200).json(share);
    } catch (error) {
        next(error);
    }
};

module.exports = { saveState, getState };
