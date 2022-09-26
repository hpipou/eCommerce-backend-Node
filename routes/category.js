const express = require("express")
const categoryRoute= express.Router()
const models = require("../models")
const validator=require("validator")

// add new category
categoryRoute.post("/",(req,res)=>{
    
    // vérifier que nos input ne sont pas null/undefined
    if(req.body.name==null || req.body.name==undefined){return res.status(403).json("CATEGORY NAME UNDEFINED")}
    if(req.body.color==null || req.body.color==undefined){return res.status(403).json("COLOR UNDEFINED")}

    // déclarer nos input
    const name=req.body.name.toUpperCase();
    const color=req.body.color

    // verifier le type de data entrante
    if(!validator.matches(name,'^[A-Za-z ]*$')){return res.status(403).json("CATEGORY NAME INCORRECT")}
    if(!validator.matches(color,'^[A-Za-z]*$')){return res.status(403).json("COLOR NAME INCORRECT")}

    // verifier la taille
    if(!validator.isLength(name,{min:3, max:20})){return res.status(403).json("CATEGORY NAME MAX 20 CARACTERES")}
    if(!validator.isLength(name,{min:3, max:20})){return res.status(403).json("COLOR NAME MAX 20 CARACTERES")}

    // vérifier si la catégorie existe déja
    models.Category.findOne({attributes:['id'], where:{name:name}})
    .then((data)=>{
        if(data!=null){
            return res.status(403).json("CATEGORY ALREADY EXIST")
        }else{
            addNewCategory(name,color)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // fonction ajouter une catégorie
    function addNewCategory(myName,myColor){
        models.Category.create({
            name:myName,
            color:myColor,
            icon:"icon.png",
            image:"image.png"
        })
        .then(()=>{return res.status(200).json("CATEGORY CREATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
    
})

// edit category
categoryRoute.put("/:id",(req,res)=>{

    // vérifier que l'id n'est pas null ou undefined
    if(req.params.id==null || req.params.id==undefined){return res.status(403).json("ID UNDEFINED")}

    // verifier si l'ID contient uniquement des chiffres
    const idCategory = req.params.id
    if(!validator.matches(idCategory,['^[0-9]*$'])){return res.status(403).json("INVALID ID")}
    
    // vérifier que nos input ne sont pas null/undefined
    if(req.body.name==null || req.body.name==undefined){return res.status(403).json("CATEGORY NAME UNDEFINED")}
    if(req.body.color==null || req.body.color==undefined){return res.status(403).json("COLOR UNDEFINED")}

    // déclarer nos input
    const name=req.body.name.toUpperCase();
    const color=req.body.color

    // verifier le type de data entrante
    if(!validator.matches(name,'^[A-Za-z ]*$')){return res.status(403).json("CATEGORY NAME INCORRECT")}
    if(!validator.matches(color,'^[A-Za-z]*$')){return res.status(403).json("COLOR NAME INCORRECT")}

    // verifier la taille
    if(!validator.isLength(name,{min:3, max:20})){return res.status(403).json("CATEGORY NAME MAX 20 CARACTERES")}
    if(!validator.isLength(name,{min:3, max:20})){return res.status(403).json("COLOR NAME MAX 20 CARACTERES")}

    // vérifier si la catégorie existe déja
    models.Category.findOne({attributes:['id'], where:{id:idCategory}})
    .then((data)=>{
        if(data!=null){
            editCategory(name,color,idCategory)
        }else{
            return res.status(403).json("CATEGORY NOT FOUND")
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // fonction ajouter une catégorie
    function editCategory(myName,myColor,myID){
        models.Category.update({
            name:myName,
            color:myColor,
            icon:"icon.png",
            image:"image.png"
        },{where:{id:myID}})
        .then(()=>{return res.status(200).json("CATEGORY UPDATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

// show all categories
categoryRoute.get("/",(req,res)=>{
    models.Category.findAll({attributes:['id','name','color','icon','image']})
    .then((data)=>{return res.status(200).json(data)})
    .catch((error)=>{return res.status(500).json(error)})
})
// show one category
categoryRoute.get("/:id",(req,res)=>{

    // vérifier que l'id n'est pas null ou undefined
    if(req.params.id==null || req.params.id==undefined){return res.status(403).json("ID UNDEFINED")}

    // verifier si l'ID contient uniquement des chiffres
    const idCategory = req.params.id
    if(!validator.matches(idCategory,['^[0-9]*$'])){return res.status(403).json("INVALID ID")}

    models.Category.findOne({attributes:['id','name','color','icon','image'], where:{id:idCategory}})
    .then((data)=>{
        if(data!=null){
            return res.status(200).json(data)
        }else{
            return res.status(403).json("CATEGORY NOT FOUND")
        }
    })
    .catch((error)=>{return res.status(500).json(error)})
})

// delete category
categoryRoute.delete("/:id",(req,res)=>{

    // vérifier que l'id n'est pas null ou undefined
    if(req.params.id==null || req.params.id==undefined){return res.status(403).json("ID UNDEFINED")}

    // verifier si l'ID contient uniquement des chiffres
    const idCategory = req.params.id
    if(!validator.matches(idCategory,['^[0-9]*$'])){return res.status(403).json("INVALID ID")}

    models.Category.findOne({attributes:['id','name','color','icon','image'], where:{id:idCategory}})
    .then((data)=>{
        if(data!=null){
            deleteCategory(idCategory);
        }else{
            return res.status(403).json("CATEGORY NOT FOUND")
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // fonction qui supprime une catégory
    function deleteCategory(myIDCategory){
        models.Category.destroy({where:{id:myIDCategory}})
        .then(()=>{return res.status(200).json("CATEGORY DELETED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

module.exports=categoryRoute