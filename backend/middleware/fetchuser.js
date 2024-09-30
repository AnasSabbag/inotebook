const jwt = require('jsonwebtoken');
const JWT_SECRET= 'helloworld';

const getUserFromMiddleware = (req,res,next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error:"authentication failed : you are not authorized "})
    }
    try {
        const data= jwt.verify(token,JWT_SECRET);
        req.user= data.user;
        next();
    } catch (error) {
        res.status(401).send({error:"authentication failed : you are not authorized "})
    }

}

module.exports = getUserFromMiddleware;