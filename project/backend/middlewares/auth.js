const {getUser} = require('../service/auth');

async function isLoggedin(req,res,next){
    const userUid = req.cookies?.uid;

    if(!userUid) return res.send('login');
    const user = getUser(userUid);
    req.user = user;
    next();
}

module.exports = {
    isLoggedin
}