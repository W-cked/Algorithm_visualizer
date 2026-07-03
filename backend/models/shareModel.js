const mongoose = require("mongoose");

const shareSchema = new mongoose.Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false, // Optional if anonymous users can share
        },
        configType: {
            type: String, // e.g., 'array', 'graph', 'tree'
            required: true,
        },
        data: {
            type: Object, // The serialized state (array data, edges, etc.)
            required: true,
        },
        shortId: {
            type: String,
            required: true,
            unique: true,
        },
    },
    { timestamps: true }
);

const Share = mongoose.model("Share", shareSchema);
module.exports = Share;
