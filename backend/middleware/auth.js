import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    try {
        let token = req.headers["authorization"];

        if (!token) {
            return res.status(401).json({ error: "You need to Login" });
        }

        if (token.startsWith("Bearer")) {
            token = token.slice(7, token.length).trim();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: "Invalid token" });
        }

        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
            return res.status(401).json({ error: "Expired" });
        }

        req.user = decoded;

        next();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const authorizeRole = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;

        if (!userRole || !roles.includes(userRole)) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        next();
    };
};
