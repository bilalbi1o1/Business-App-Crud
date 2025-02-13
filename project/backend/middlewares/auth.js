const { getUser } = require("../service/auth");

async function checkForAuthentication(req, res, next) {
    const authorizationHeaderValue = req.headers["authorization"];
    req.user = null;

    if (!authorizationHeaderValue || !authorizationHeaderValue.startsWith("Bearer ")) {
        return res.sendStatus(403);
    }

    // ✅ Correct token extraction
    const token = authorizationHeaderValue.replace("Bearer ", "").trim();
    console.log("Extracted Token:", token);

    try {
        const user = await getUser(token); // ✅ Use `await`
        if (!user) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    } catch (error) {
        console.error("Token verification failed:", error.message);
        return res.sendStatus(403);
    }
}

module.exports = {
    checkForAuthentication,
};
