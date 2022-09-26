const express = require("express")
const userRoutes= express.Router()
const validator = require("validator")
const models = require("../models")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
require("dotenv").config()

// add new user
userRoutes.post("/register", (req,res)=>{
    
    // vérifier que l'adresse email et le password ne sont pas null/undefined
    if(req.body.email==null || req.body.email==undefined){return res.status(403).json("EMAIL UNDEFINED")}
    if(req.body.password==null || req.body.password==undefined){return res.status(403).json("PASSWORD UNDEFINED")}
    
    const email = req.body.email;
    const password = req.body.password;
    // verifier l'email / password
    if(!validator.isEmail(email)){return res.status(403).json("INCORRECT EMAIL")}
    if(validator.isEmpty(password)){return res.status(403).json("PASSWORD IS EMPTY")}
    if(!validator.isLength(password,{min:5, max:30})){return res.status(403).json("PASSWORD min:5 max:10")}
    if(!validator.isLength(email,{min:5, max:30})){return res.status(403).json("EMAIL min:5 max:30")}
    if(validator.isEmpty(email)){return res.status(403).json("EMAIL IS EMPTY")}

    // verifier si l'adresse email est déjà utilisée
    models.User.findOne({attributes:['id'], where:{email:email}})
    .then((data)=>{
        if(data!=null){
            return res.status(403).json("THIS EMAIL USED BEFORE")
        }else{
            addNewUser(email, password)
        }
    })
    .catch((error)=>{console.log(error)})

    // fonction ajouter un nouveau utilisateur
    function addNewUser(myEmail,MyPassword){
        models.User.create({
            email:myEmail,
            password:bcrypt.hashSync(MyPassword, 10),
            roleName:"USER"
        })
        .then(()=>{return res.status(201).json("USER CREATED")})
        .catch((error)=>{console.log(error)})
    }

})

// login
userRoutes.post("/login",(req,res)=>{

    if(req.body.email==null || req.body.email==undefined){return res.status(403).json("EMAIL UNDEFINED")}
    if(req.body.password==null || req.body.password==undefined){return res.status(403).json("PASSWORD UNDEFINED")}
    
    const email = req.body.email;
    const password = req.body.password;

    if(!validator.isEmail(email)){return res.status(403).json("INCORRECT EMAIL")}
    if(validator.isEmpty(password)){return res.status(403).json("PASSWORD IS EMPTY")}
    if(!validator.isLength(password,{min:5, max:30})){return res.status(403).json("PASSWORD min:5 max:10")}
    if(!validator.isLength(email,{min:5, max:30})){return res.status(403).json("EMAIL min:5 max:30")}
    if(validator.isEmpty(email)){return res.status(403).json("EMAIL IS EMPTY")}

    models.User.findOne({attributes:['id','email','password','roleName'], where:{email:email}})
    .then((data)=>{
        if(data!=null){
            if(bcrypt.compareSync(password,data.password)){

                const AccessToken = jwt.sign(
                    {
                        id:data.id,
                        email:data.email,
                        roleName:data.roleName
                    },
                    process.env.SECTOKEN,
                    {expiresIn:process.env.ACCESSTOKEN}
                )
                const RefreshToken = jwt.sign(
                    {
                        id:data.id,
                        email:data.email,
                        roleName:data.roleName
                    },
                    process.env.SECTOKEN,
                    {expiresIn:process.env.REFRESHTOKEN}
                )
                return res.status(200).json({"AccessToken" : AccessToken, "RefreshToken":RefreshToken})
 
            }else{
                return res.status(403).json("WRONG PASSWORD") 
            }
        }else{
            return res.status(403).json("USER NOT FOUND")
        }
    })
    .catch((error)=>{console.log(error)})
})


// get All users
userRoutes.get("/",(req,res)=>{
    models.User.findAll({attributes:['id', 'email', 'password','roleName']})
    .then((data)=>{return res.status(200).json(data)})
    .catch((error)=>{console.log(error)})
})

// get on user
userRoutes.get("/:id",(req,res)=>{
    if(req.params.id==null || req.params.id==undefined){return res.status(403).json("ID UNDEFINED")}

    const idUser = req.params.id
    if(!validator.matches(idUser,['^[0-9]*$'])){return res.status(403).json("INVALID ID")}

    models.User.findOne({attributes:['id','email','password','roleName'], where:{id:idUser}})
    .then((data)=>{

            if(data!=null){
                return res.status(200).json(data)
            }else{
                return res.status(403).json("USER NOT FOUND")
            }
        }
    )
    .catch((error)=>{console.log(error)})
})

// edit password
userRoutes.put("/password",(req,res)=>{

    // vérifier que l'adresse email et le password ne sont pas null/undefined
    if(req.body.email==null || req.body.email==undefined){return res.status(403).json("EMAIL UNDEFINED")}
    if(req.body.password==null || req.body.password==undefined){return res.status(403).json("PASSWORD UNDEFINED")}
    
    const email = req.body.email;
    const password = req.body.password;

    // verifier l'email / password
    if(!validator.isEmail(email)){return res.status(403).json("INCORRECT EMAIL")}
    if(validator.isEmpty(password)){return res.status(403).json("PASSWORD IS EMPTY")}
    if(!validator.isLength(password,{min:5, max:30})){return res.status(403).json("PASSWORD min:5 max:10")}
    if(!validator.isLength(email,{min:5, max:30})){return res.status(403).json("EMAIL min:5 max:30")}
    if(validator.isEmpty(email)){return res.status(403).json("EMAIL IS EMPTY")}

    // extraire les informations du token dans le header
    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)

    models.User.findOne({attributes:['id','email','password'], where:{email:email}})
    .then((data)=>{
        if(data!=null){

            // Verifier s'il est bien le propriétaire du compte
            if(tokenDecoded.id!=data.id){
                return res.status(401).json("VOUS N'ETES PAS LE PROPRIÉTAIRE DU COMPTE")
            }else{

                // S'il est propriétaire du compte alors on vérifie son password
                if(bcrypt.compareSync(password,data.password)){
                    changePassord(email,password);
                }else{
                    return res.status(403).json("WRONG PASSWORD") 
                }

            }

            
        }else{
            return res.status(403).json("USER NOT FOUND")
        }
    })
    .catch((error)=>{console.log(error)})

    // fonction pour modifier le mot de passe
    function changePassord(myEmail,MyPassword){
        models.User.update(
            {password:bcrypt.hashSync(MyPassword, 10)},
            {where:{email:myEmail}}
        )
        .then(()=>{return res.status(200).json("PASSWORD CHANGED")})
        .catch((error)=>{console.log(error)})
    }

})

// delete user
userRoutes.delete("/:id",(req,res)=>{
    // vérifier que l'id n'est pas null ou undefined
    if(req.params.id==null || req.params.id==undefined){return res.status(403).json("ID UNDEFINED")}

    // verifier si l'ID contient uniquement des chiffres
    const idUser = req.params.id
    if(!validator.matches(idUser,['^[0-9]*$'])){return res.status(403).json("INVALID ID")}

    // extraire les informations du token dans le header
    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded = jwt.decode(token)

    // Verifier s'il est bien le propriétaire du compte
    if(tokenDecoded.id!=idUser){
        return res.status(401).json("VOUS N'ETES PAS LE PROPRIÉTAIRE DU COMPTE")
    }

    // verifier si le compte existe
    models.User.findOne({attributes:['id'], where:{id:idUser}})
    .then((data)=>{

            if(data!=null){
                deleteUser(idUser)
            }else{
                return res.status(403).json("USER NOT FOUND")
            }
        }
    )
    .catch((error)=>{console.log(error)})

    // fonction supprimer le compte
    function deleteUser(myIdUser){
        models.User.destroy({where:{id:myIdUser}})
        .then(()=>{return res.status(200).json("USER DELETED")})
        .catch((error)=>{console.log(error)})
    }

})

module.exports=userRoutes