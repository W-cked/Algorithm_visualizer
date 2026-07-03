const Topic = require("../models/topicModel");
const User = require("../models/userModel");

const XP_PER_TOPIC = 100;

const submitTopicProgress = async (req, res, next) => {
    try {
        const { topic, completed } = req.body;
        const userID = req.user._id;

        if (!topic) {
            res.status(400);
            throw new Error("Topic is required");
        }

        let existingTopic = await Topic.findOne({ userID, topic });

        if (existingTopic) {
            // Only award XP if transitioning from incomplete to complete
            if (!existingTopic.completed && completed) {
                const user = await User.findById(userID);
                user.xp += XP_PER_TOPIC;
                user.level = Math.floor(user.xp / 500) + 1; // Level up every 500 XP
                await user.save();
            }
            existingTopic.completed = completed;
            await existingTopic.save();
            
            return res.status(200).json({
                message: "Topic updated successfully",
                topic: existingTopic,
            });
        }

        const newTopic = new Topic({ userID, topic, completed });
        await newTopic.save();

        if (completed) {
            const user = await User.findById(userID);
            user.xp += XP_PER_TOPIC;
            user.level = Math.floor(user.xp / 500) + 1;
            await user.save();
        }

        res.status(201).json({
            message: "Topic created successfully",
            topic: newTopic,
        });
    } catch (error) {
        next(error);
    }
};

const getUserProgress = async (req, res, next) => {
    try {
        const userID = req.user._id;
        const topics = await Topic.find({ userID });

        res.status(200).json({ topics });
    } catch (error) {
        next(error);
    }
};

const getLeaderboard = async (req, res, next) => {
    try {
        const leaderboard = await User.find({})
            .sort({ xp: -1 })
            .limit(10)
            .select("username xp level");
        
        res.status(200).json({ leaderboard });
    } catch (error) {
        next(error);
    }
};

module.exports = { submitTopicProgress, getUserProgress, getLeaderboard };
