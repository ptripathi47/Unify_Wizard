import jwt from "jsonwebtoken";
import User from "../Model/userSchema.js"; // Import User model

export const authenticateToken = async (req, res, next) => {
    try {
        const token = req.headers["authorization"]?.split(" ")[1];

        if (!token) {
            return res.status(401).json({ success: false, message: "Access denied. No token provided." });
        }

        // 🛑 Ensure JWT_SECRET is set
        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ success: false, message: "JWT secret is missing in the server." });
        }

        // ✅ Verify JWT Token
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ success: false, message: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token" });
            }

            // 🔍 Optional: Fetch user from database
            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found. Token might be invalid." });
            }

            // ✅ Attach user info to `req.user`
            req.user = {
                id: user._id,
                email: user.email,
                role: user.role,
                userPermissions: user.userPermissions || []
            };

            next();
        });

    } catch (error) {
        console.error("Auth Error:", error.message);
        return res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};
