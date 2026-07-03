const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./db/connect");
const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

// Route files
const userRoutes = require("./routes/userRoutes");
const progressRoutes = require("./routes/progressRoutes");
const shareRoutes = require("./routes/shareRoutes");

require("colors");

dotenv.config();
const app = express();

// CORS configuration
app.use(
    cors({
        origin: [
            "http://localhost:5173", 
            "https://algorithm-visualizer-api.onrender.com",
            "https://algorithm-visualizer-umber.vercel.app",
        ],
        credentials: true, // Allow cookies
    })
);

app.options("*", cors());

// Middleware
app.use(express.json());
app.use(cookieParser()); // Parse cookies for JWT

// Connect to database
connectDB();

// Mount Routes
app.use("/api/users", userRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/share", shareRoutes);

// Error Handling Middlewares
app.use(notFound);
app.use(errorHandler);

// Start the server
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server listening on port ${port}`.blue.bold));
