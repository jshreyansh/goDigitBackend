
const jwt= require ('jsonwebtoken')

module.exports = function(req, res, next){
    const token=req.header('x-auth-token')
    console.log("inside Auth")
    if (!token) return res.status(401).send("Access Denied. Token not provided")
    try{
        const decodedTokenData=jwt.verify(token, "myStallSecretUserAuthKey")
        req.user=decodedTokenData  //decodedTokenData= { mobile: '8287946944', firstName:"pritesh", iat: 1589315049 }

        next();
    }
    catch(exception) {
        res.status(400).send("Token not valid")
    }
}