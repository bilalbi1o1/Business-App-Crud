require('dotenv').config();  // Load .env variables
const jwt = require('jsonwebtoken');
const secret = process.env.SECRET;

async function setUser(user) {
    token = jwt.sign(user,secret,
        {expiresIn: '1h'}
    );
    console.log("SECRET:", process.env.SECRET);
    console.log("GeneratedToken:", token);
    return token;
}

async function getUser(token) {
    try {
        if (!token) return null;
        console.log("SECRET:", process.env.SECRET);
        console.log("Verifying token:", token);
        
        return jwt.verify(token, secret);
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return null;
    }
}


module.exports = {
    setUser,getUser
}