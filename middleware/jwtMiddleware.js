const jwt = require("jsonwebtoken");

const jwtMiddleware = (req, res, next) => {
    console.log("Inside JWT middleware");

    // 1️⃣ Check if Authorization header is present
    if (!req.headers.authorization) {
        console.error("Authorization header missing");
        return res.status(401).json({ error: "Authorization header missing" });
    }

    // 2️⃣ Extract the token
    const token = req.headers.authorization.split(" ")[1];
    console.log("Extracted Token:", token);

    if (!token) {
        console.error("Token missing in the header");
        return res.status(401).json({ error: "Token missing" });
    }

        // 3️⃣ Verify the token
        const decoded = jwt.verify(token, "secretkey"); // Make sure this key matches your .env file
        console.log("Decoded JWT Payload:", decoded);

        if (!decoded.userId) {
            console.error("Invalid token payload: Missing userId");
            return res.status(401).json({ error: "Invalid token payload" });
        }

        req.user = decoded; // Attach user data to request
        console.log(req.user);

        next();
   
};

module.exports = jwtMiddleware;
