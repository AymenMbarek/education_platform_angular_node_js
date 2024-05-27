const jwt= require('jsonwebtoken');

function verifyToken(req,res,next) {
    const token=req.header("auth-token")
    if(!token){
        res.status(401).json({error:"acces denied"})
    }
    try {
        const decode=jwt.verify(token,process.env.TOKEN_SECRET)
        req.userId = decode.userId
        next()
    } catch (error) {
        res.status(401).json({error:"invalid token "})
    }
}
    module.exports=verifyToken
//..
//..









