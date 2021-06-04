
const {config} = require("../config/secData")
const jwt = require("jsonwebtoken");

exports.auth = (req,res,next) => {
    let token = req.header("x-auth-token");
    if (!token){
        res.status(401).json({err: "You must sent a token!"})
    }
    try{
        let decodeToken = jwt.verify(token, config.secretJwt);
        req.tokenData = decodeToken;
        next()
    }
    catch (err) {
        console.log(err)
        res.status(400).json({err: "Token is either invalid or expired!"})
    }
 
}