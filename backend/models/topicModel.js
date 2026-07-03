const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema(
    {
        userID: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "User ID is required"],
        },
        topic: {
            type: String,
            required: [true, "Topic is required"],
            trim: true,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

const Topic = mongoose.model("Topic", topicSchema);
module.exports = Topic;
