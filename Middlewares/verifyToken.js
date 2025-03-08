import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) return res.status(401).json({ message: "Invalid or expired token" , Mistake : err.message });

        req.user = decoded; // Extract phone number from token
        next();
    });

    } catch (error) {
        console.error("Auth Error:", error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};
