const express = require("express")
const profilRoute= express.Router()
const models = require("../models")
const jwt = require("jsonwebtoken")
const validator = require("validator")

////////////////////////////////////////////////////////
// creer un nouveau profil
////////////////////////////////////////////////////////
profilRoute.post("/new",(req,res)=>{

    // vérifier que nos input ne sont pas null/undefined
    if(req.body.fname==null || req.body.fname==undefined){return res.status(403).json("FIRST NAME UNDEFINED")}
    if(req.body.lname==null || req.body.lname==undefined){return res.status(403).json("LAST NAME UNDEFINED")}
    if(req.body.adresse==null || req.body.adresse==undefined){return res.status(403).json("ADRESSE UNDEFINED")}
    if(req.body.phone==null || req.body.phone==undefined){return res.status(403).json("PHONE UNDEFINED")}
    if(req.body.country==null || req.body.country==undefined){return res.status(403).json("COUNTRY UNDEFINED")}

    // déclarer nos input
    const fname=req.body.fname
    const lname=req.body.lname
    const adresse=req.body.adresse
    const phone=req.body.phone
    const country=req.body.country

    // verifier le type de data entrante
    if(!validator.matches(fname,'^[A-Za-z]*$')){return res.status(403).json("FIRST NAME INCORRECT")}
    if(!validator.matches(lname,'^[A-Za-z]*$')){return res.status(403).json("LAST NAME INCORRECT")}
    if(!validator.matches(adresse,'^[A-Za-z0-9 ]*$')){return res.status(403).json("ADRESSE NAME INCORRECT")}
    if(!validator.matches(phone,'^[0-9 ]*$')){return res.status(403).json("PHONE NAME INCORRECT")}
    if(!validator.matches(country,'^[A-Za-z]*$')){return res.status(403).json("COUNTRY NAME INCORRECT")}

    // verifier la taille
    if(!validator.isLength(fname,{min:3, max:20})){return res.status(403).json("FIRST NAME MAX 20 CARACTERES")}
    if(!validator.isLength(lname,{min:3, max:20})){return res.status(403).json("LAST NAME MAX 20 CARACTERES")}
    if(!validator.isLength(adresse,{min:3, max:30})){return res.status(403).json("ADRESSE MAX 30 CARACTERES")}
    if(!validator.isLength(phone,{min:3, max:20})){return res.status(403).json("PHONE MAX 20 NUMBERS")}
    if(!validator.isLength(country,{min:3, max:20})){return res.status(403).json("COUNTRY NAME MAX 20 CARACTERES")}

    // décoder le token pour extraire l'id de l'utilisateur
    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded=jwt.decode(token)
    // verifier que l'idUser est bien défini dans le token
    if(tokenDecoded.id==null || tokenDecoded.id==undefined){return res.status(403).json("ID USER UNDEFINED IN TOKEN")}
    const idUser = tokenDecoded.id

    // vérifier si le profil a déjà été crée
    models.Profil.findOne({attributes:['id'], where:{idUser:idUser}})
    .then((data)=>{

        if(data!=null){
            return res.status(403).json("PROFIL ALREADY EXIST")
        }else{
            addNewProfil(fname,lname,adresse,phone,country,idUser)
        }
    
    })
    .catch((error)=>{return res.status(500).json(error)})

    // fonction crée un profil
    function addNewProfil(myFName,myLName,myAdresse,myPhone,myCountry,myIdUser){
        models.Profil.create({
            fname:myFName,
            lname:myLName,
            adresse:myAdresse,
            phone:myPhone,
            country:myCountry,
            idUser:myIdUser
        })
        .then(()=>{return res.status(201).json("PROFIL CREATED")})
        .catch((error)=>{return res.status(502).json(error)})
    }

})
////////////////////////////////////////////////////////
// modifier un profil
////////////////////////////////////////////////////////
profilRoute.put("/edit",(req,res)=>{

    // vérifier que nos input ne sont pas null/undefined
    if(req.body.fname==null || req.body.fname==undefined){return res.status(403).json("FIRST NAME UNDEFINED")}
    if(req.body.lname==null || req.body.lname==undefined){return res.status(403).json("LAST NAME UNDEFINED")}
    if(req.body.adresse==null || req.body.adresse==undefined){return res.status(403).json("ADRESSE UNDEFINED")}
    if(req.body.phone==null || req.body.phone==undefined){return res.status(403).json("PHONE UNDEFINED")}
    if(req.body.country==null || req.body.country==undefined){return res.status(403).json("COUNTRY UNDEFINED")}

    // déclarer nos input
    const fname=req.body.fname
    const lname=req.body.lname
    const adresse=req.body.adresse
    const phone=req.body.phone
    const country=req.body.country

    // verifier le type de data entrante
    if(!validator.matches(fname,'^[A-Za-z]*$')){return res.status(403).json("FIRST NAME INCORRECT")}
    if(!validator.matches(lname,'^[A-Za-z]*$')){return res.status(403).json("LAST NAME INCORRECT")}
    if(!validator.matches(adresse,'^[A-Za-z0-9 ]*$')){return res.status(403).json("ADRESSE NAME INCORRECT")}
    if(!validator.matches(phone,'^[0-9 ]*$')){return res.status(403).json("PHONE NAME INCORRECT")}
    if(!validator.matches(country,'^[A-Za-z]*$')){return res.status(403).json("COUNTRY NAME INCORRECT")}

    // verifier la taille
    if(!validator.isLength(fname,{min:3, max:20})){return res.status(403).json("FIRST NAME MAX 20 CARACTERES")}
    if(!validator.isLength(lname,{min:3, max:20})){return res.status(403).json("LAST NAME MAX 20 CARACTERES")}
    if(!validator.isLength(adresse,{min:3, max:30})){return res.status(403).json("ADRESSE MAX 30 CARACTERES")}
    if(!validator.isLength(phone,{min:3, max:20})){return res.status(403).json("PHONE MAX 20 NUMBERS")}
    if(!validator.isLength(country,{min:3, max:20})){return res.status(403).json("COUNTRY NAME MAX 20 CARACTERES")}

    // décoder le token pour extraire l'id de l'utilisateur
    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded=jwt.decode(token)
    // verifier que l'idUser est bien défini dans le token
    if(tokenDecoded.id==null || tokenDecoded.id==undefined){return res.status(403).json("ID USER UNDEFINED IN TOKEN")}
    const idUser = tokenDecoded.id

    // vérifier si le profil a déjà été crée
    models.Profil.findOne({attributes:['id'], where:{idUser:idUser}})
    .then((data)=>{

        if(data!=null){
            editProfil(fname,lname,adresse,phone,country,idUser)
        }else{
            return res.status(403).json("PROFIL INTROUVABLE")
        }
    
    })
    .catch((error)=>{return res.status(500).json(error)})

    // fonction modifier un profil
    function editProfil(myFName,myLName,myAdresse,myPhone,myCountry,myIdUser){
        models.Profil.update({
            fname:myFName,
            lname:myLName,
            adresse:myAdresse,
            phone:myPhone,
            country:myCountry,
        },{where:{idUser:myIdUser}})
        .then(()=>{return res.status(201).json("PROFIL MODIFIED")})
        .catch((error)=>{return res.status(500).json(error)})
    }

})
////////////////////////////////////////////////////////
// supprimer un profil
////////////////////////////////////////////////////////
profilRoute.delete("/",(req,res)=>{

    // décoder le token pour extraire l'id de l'utilisateur
    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded=jwt.decode(token)
    // verifier que l'idUser est bien défini dans le token
    if(tokenDecoded.id==null || tokenDecoded.id==undefined){return res.status(403).json("ID USER UNDEFINED IN TOKEN")}
    const idUser = tokenDecoded.id

    // verifier si le profil exist
    models.Profil.findOne({attributes:['id'], where:{idUser:idUser}})
    .then((data)=>{
        if(data!=null){
            // S'il existe, alors on le supprime
            deleteProfil(idUser);
        }else{
            return res.status(403).json("PROFIL NOT FOUND");
        }

    })
    .catch((error)=>{return res.status(500).json(error)})

    // fonction supprimer le profil
    function deleteProfil(myIdUser){
        models.Profil.destroy({where:{idUser:myIdUser}})
        .then(()=>{return res.status(200).json("PROFIL REMOVED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
    
})
////////////////////////////////////////////////////////
// afficher tout les profils
////////////////////////////////////////////////////////
profilRoute.get("/",(req,res)=>{

    models.Profil.findAll({attributes:['id','fname','lname','adresse','phone','country','idUser'], include : {model:models.User, attributes:['id','email']}})
    .then((data)=>{return res.status(200).json(data)})
    .catch((error)=>{return res.status(500).json(error)})

})
////////////////////////////////////////////////////////
// afficher un seul profil
////////////////////////////////////////////////////////
profilRoute.get("/:id",(req,res)=>{

    // vérifier que l'id n'est pas null ou undefined
    if(req.params.id==null || req.params.id==undefined){return res.status(403).json("ID UNDEFINED")}

    // verifier si l'ID contient uniquement des chiffres
    const idUser = req.params.id
    if(!validator.matches(idUser,['^[0-9]*$'])){return res.status(403).json("INVALID ID")}

    // verifier si le compte existe
    models.Profil.findOne({attributes:['id','fname','lname','adresse','phone','country','idUser'], include : {model:models.User, attributes:['id','email']}, where:{idUser:idUser}})
    .then((data)=>{

            if(data!=null){
                return res.status(403).json(data)
            }else{
                return res.status(403).json("PROFIL NOT FOUND")
            }
        }
    )
    .catch((error)=>{return res.status(500).json(error)})

})


module.exports=profilRoute