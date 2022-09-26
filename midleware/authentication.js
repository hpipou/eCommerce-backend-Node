const jwt = require("jsonwebtoken")
require("dotenv").config()

const authentication=(req,res,next)=>{

    if(req.headers.authorization==null || req.headers.authorization==undefined){
        return res.status(403).json("TOKEN INTROUVABLE")
    }else{
        const token = req.headers.authorization.split(' ')[1]

        try{
                if(jwt.verify(token,process.env.SECTOKEN)){
                    next()
                }else{
                    return res.status(403).json("TOKEN INVALIDE")
                }
        }catch{
            return res.status(403).json("TOKEN INVALIDE")
        }
    }
}

module.exports=authentication