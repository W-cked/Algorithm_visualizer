const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

const generateToken = (res, userID) => {
    const token = jwt.sign({ userID }, process.env.JWT_SECRET || "fallback_secret", {
        expiresIn: "30d",
    });

    res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "development",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
};

const authUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            generateToken(res, user._id);
            res.status(200).json({
                userID: user._id,
                user: user.username,
                email: user.email,
                xp: user.xp,
                level: user.level
            });
        } else {
            res.status(401);
            throw new Error("Invalid email or password");
        }
    } catch (error) {
        next(error);
    }
};

const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error("User already exists");
        }

        const user = await User.create({
            username,
            email,
            password,
            xp: 0,
            level: 1
        });

        if (user) {
            generateToken(res, user._id);
            res.status(201).json({
                userID: user._id,
                user: user.username,
                email: user.email,
                xp: user.xp,
                level: user.level
            });
        } else {
            res.status(400);
            throw new Error("Invalid user data");
        }
    } catch (error) {
        next(error);
    }
};

const logoutUser = (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: "Logged out successfully" });
};

const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user) {
            res.json({
                userID: user._id,
                user: user.username,
                email: user.email,
                xp: user.xp,
                level: user.level
            });
        } else {
            res.status(404);
            throw new Error("User not found");
        }
    } catch (error) {
        next(error);
    }
};

module.exports = { authUser, registerUser, logoutUser, getUserProfile };
