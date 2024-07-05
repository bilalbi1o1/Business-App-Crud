const jwt = require('jsonwebtoken');
const secret = "new";

async function setUser(user) {
    token = jwt.sign(user,secret);
    console.log(token);
    return token;
}

async function getUser(token) {
    try {
        if (!token) return null;
        console.log("Verifying token:", token);
        const decoded = jwt.verify(token, secret);
        
        // Check if token is expired
        const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
        if (decoded.exp && decoded.exp < currentTimestamp) {
            console.error("Token has expired");
            return null;
        }

        console.log("Token verified successfully:", decoded);
        return decoded;
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return null;
    }
}


module.exports = {
    setUser,getUser
}