const {getUser} = require('../service/auth');

function checkForAuthentication(req,res,next) {
    const authorizationHeaderValue = req.headers["authorization"];
    req.user = null;

    if(!authorizationHeaderValue ||  !authorizationHeaderValue.startsWith('Bearer'))
        {   
            res.sendStatus(403);
            return next();
        }

    const token = authorizationHeaderValue.split('Bearer')[1];
    console.log(token);
    const user = getUser(token);
    req.user = user;    

    return next();
}

function restrictTo(roles = []) {
    return function(req,res,next) {
        if(!req.user) 
            return res.redirect("/login");

        if(!roles.includes(req.user.role))
            return res.end('UnAuthorized');

        return next();
    }
}

module.exports = {
    checkForAuthentication,restrictTo
}


// async function isLoggedin(req,res,next){
//     const userUid = req.cookies?.uid;

//     if(!userUid) 
//         return res.status(401).json({ message: 'Not authenticated' });
//     const user = await getUser(userUid);
    
//     if(!user)
//         {
//             console.log("user does not exist");
//             return res.redirect();
//         } 

//     req.user = user;
//     console.log("user sent");
//     next();
// }
