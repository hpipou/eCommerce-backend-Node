const express = require("express")
const productRoutes= express.Router()
const models=require("../models")
const validator=require("validator")
const jwt = require("jsonwebtoken")

/////////////////////////////////////////////
// add new product
/////////////////////////////////////////////
productRoutes.post("/",(req,res)=>{
    
    // vérifier que nos input ne sont pas null/undefined
    if(req.body.name==null || req.body.name==undefined){return res.status(403).json("PRODUCT NAME UNDEFINED")}
    if(req.body.description==null || req.body.description==undefined){return res.status(403).json("DESCRIPTION UNDEFINED")}
    if(req.body.price==null || req.body.price==undefined){return res.status(403).json("PRICE UNDEFINED")}
    if(req.body.brand==null || req.body.brand==undefined){return res.status(403).json("BRAND UNDEFINED")}
    if(req.body.countStock==null || req.body.countStock==undefined){return res.status(403).json("COUNTER STOCK UNDEFINED")}
    if(req.body.category==null || req.body.category==undefined){return res.status(403).json("CATEGORY UNDEFINED")}

    // déclarer nos input
    const name=req.body.name
    const description=req.body.description
    const price=req.body.price
    const brand=req.body.brand
    const countStock=req.body.countStock
    const category=req.body.category.toUpperCase();

    // verifier le type de data entrante
    if(!validator.matches(price,'^[0-9]*$')){return res.status(403).json("PRICE INCORRECT")}
    if(!validator.matches(countStock,'^[0-9]*$')){return res.status(403).json("COUNT STOCK INCORRECT")}
    if(!validator.matches(category,'^[A-Za-z]*$')){return res.status(403).json("CATEGORY INCORRECT")}

    // verifier la taille
    if(!validator.isLength(name,{min:3, max:50})){return res.status(403).json("FIRST NAME MAX 20 CARACTERES")}
    if(!validator.isLength(description,{min:3, max:250})){return res.status(403).json("LAST NAME MAX 20 CARACTERES")}
    if(!validator.isLength(brand,{min:3, max:30})){return res.status(403).json("ADRESSE MAX 30 CARACTERES")}

    // décoder le token pour extraire l'id de l'utilisateur
    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded=jwt.decode(token)
    // verifier que l'idUser est bien défini dans le token
    if(tokenDecoded.id==null || tokenDecoded.id==undefined){return res.status(403).json("ID USER UNDEFINED IN TOKEN")}
    const idUser = tokenDecoded.id

    // Verifier si la categorie existe déjà
    models.Category.findOne({attributes:['id'], where:{name:category}})
    .then((data)=>{
        if(data!=null){
            addNewProduct(name,description,price,brand,countStock,data.id,idUser)
        }else{
            return res.status(403).json("CATEGORY NOT FOUND")
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // fonction créer un nouveau produit
    function addNewProduct(myName,myDescription,myPrice,myBrind,myCountStock,myIdCategory,myIdUser){
        models.Product.create({
            name: myName ,
            description : myDescription,
            price : myPrice,
            brand : myBrind,
            countStock : myCountStock,
            rating : 0,
            images : "image.jpg",
            idCategory : myIdCategory,
            idUser : myIdUser
        })
        .then((data)=>{return res.status(201).json("PRODUCT ADDED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

/////////////////////////////////////////////
// edit product
/////////////////////////////////////////////

productRoutes.put("/:id",(req,res)=>{

    // vérifier que l'id n'est pas null ou undefined
    if(req.params.id==null || req.params.id==undefined){return res.status(403).json("ID UNDEFINED")}

    // verifier si l'ID contient uniquement des chiffres
    const idProduct = req.params.id
    if(!validator.matches(idProduct,['^[0-9]*$'])){return res.status(403).json("INVALID ID")}
    
    // vérifier que nos input ne sont pas null/undefined
    if(req.body.name==null || req.body.name==undefined){return res.status(403).json("PRODUCT NAME UNDEFINED")}
    if(req.body.description==null || req.body.description==undefined){return res.status(403).json("DESCRIPTION UNDEFINED")}
    if(req.body.price==null || req.body.price==undefined){return res.status(403).json("PRICE UNDEFINED")}
    if(req.body.brand==null || req.body.brand==undefined){return res.status(403).json("BRAND UNDEFINED")}
    if(req.body.countStock==null || req.body.countStock==undefined){return res.status(403).json("COUNTER STOCK UNDEFINED")}
    if(req.body.category==null || req.body.category==undefined){return res.status(403).json("CATEGORY UNDEFINED")}

    // déclarer nos input
    const name=req.body.name
    const description=req.body.description
    const price=req.body.price
    const brand=req.body.brand
    const countStock=req.body.countStock
    const category=req.body.category.toUpperCase();

    // verifier le type de data entrante
    if(!validator.matches(price,'^[0-9]*$')){return res.status(403).json("PRICE INCORRECT")}
    if(!validator.matches(countStock,'^[0-9]*$')){return res.status(403).json("COUNT STOCK INCORRECT")}
    if(!validator.matches(category,'^[A-Za-z]*$')){return res.status(403).json("CATEGORY INCORRECT")}

    // verifier la taille
    if(!validator.isLength(name,{min:3, max:50})){return res.status(403).json("FIRST NAME MAX 20 CARACTERES")}
    if(!validator.isLength(description,{min:3, max:250})){return res.status(403).json("LAST NAME MAX 20 CARACTERES")}
    if(!validator.isLength(brand,{min:3, max:30})){return res.status(403).json("ADRESSE MAX 30 CARACTERES")}

    // décoder le token pour extraire l'id de l'utilisateur
    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded=jwt.decode(token)
    // verifier que l'idUser est bien défini dans le token
    if(tokenDecoded.id==null || tokenDecoded.id==undefined){return res.status(403).json("ID USER UNDEFINED IN TOKEN")}
    const idUser = tokenDecoded.id

    // Verifier si le produit existe déjà
    models.Product.findOne({attributes:['id','idUser'], where:{id:idProduct}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PRODUCT NOT FOUND")
        }else{
            // Vérifier si l'utilisateur est le propriétaire de l'annonce
            if(idUser!=data.idUser){
                return res.status(403).json("YOU ARE NOT PUBLISHER OF THIS PRODUCT")
            }
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // Verifier si la categorie existe déjà
    models.Category.findOne({attributes:['id'], where:{name:category}})
    .then((data)=>{
        if(data!=null){
            editProduct(name,description,price,brand,countStock,data.id,idProduct)
        }else{
            return res.status(403).json("CATEGORY NOT FOUND")
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // fonction créer un nouveau produit
    function editProduct(myName,myDescription,myPrice,myBrind,myCountStock,myIdCategory,MyidProduct){
        models.Product.update({
            name: myName ,
            description : myDescription,
            price : myPrice,
            brand : myBrind,
            countStock : myCountStock,
            rating : 0,
            idCategory : myIdCategory,
        }, {where:{id:MyidProduct}})
        .then(()=>{return res.status(201).json("PRODUCT UPDATED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

/////////////////////////////////////////////
// show all producs
/////////////////////////////////////////////

productRoutes.get("/", (req,res)=>{
    models.Product.findAll({attributes:['id','name','description','price','brand','countStock','rating','images'], include:[{model:models.User,attributes:['id','email']},{model:models.Category,attributes:['id','name','color','icon','image']}]})
    .then((data)=>{return res.status(200).json(data)})
    .catch((error)=>{return res.status(500).json(error)})
})

/////////////////////////////////////////////
// show one product
/////////////////////////////////////////////
productRoutes.get("/:id",(req,res)=>{

    // vérifier que l'id n'est pas null ou undefined
    if(req.params.id==null || req.params.id==undefined){return res.status(403).json("ID UNDEFINED")}

    // verifier si l'ID contient uniquement des chiffres
    const idProduct = req.params.id
    if(!validator.matches(idProduct,['^[0-9]*$'])){return res.status(403).json("INVALID ID")}

    // Verifier si le produit existe déjà
    models.Product.findOne({attributes:['id','name','description','price','brand','countStock','rating','images'], include:[{model:models.User,attributes:['id','email']},{model:models.Category,attributes:['id','name','color','icon','image']}], where:{id:idProduct}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PRODUCT NOT FOUND")
        }else{
            return res.status(403).json(data)
        }
    })
    .catch((error)=>{return res.status(500).json(error)})
})


/////////////////////////////////////////////
// delete product
/////////////////////////////////////////////
productRoutes.delete("/:id",(req,res)=>{

    // vérifier que l'id n'est pas null ou undefined
    if(req.params.id==null || req.params.id==undefined){return res.status(403).json("ID UNDEFINED")}

    // verifier si l'ID contient uniquement des chiffres
    const idProduct = req.params.id
    if(!validator.matches(idProduct,['^[0-9]*$'])){return res.status(403).json("INVALID ID")}

    // décoder le token pour extraire l'id de l'utilisateur
    const token = req.headers.authorization.split(' ')[1]
    const tokenDecoded=jwt.decode(token)
    // verifier que l'idUser est bien défini dans le token
    if(tokenDecoded.id==null || tokenDecoded.id==undefined){return res.status(403).json("ID USER UNDEFINED IN TOKEN")}
    const idUser = tokenDecoded.id

    // Verifier si le produit existe déjà
    models.Product.findOne({attributes:['id','idUser'], where:{id:idProduct}})
    .then((data)=>{
        if(data==null){
            return res.status(403).json("PRODUCT NOT FOUND")
        }else{
            // Vérifier si l'utilisateur est le propriétaire de l'annonce
            if(idUser!=data.idUser){
                // Si ce n'est pas l'auteur, alors on le bloque
                return res.status(403).json("YOU ARE NOT PUBLISHER OF THIS PRODUCT")
            }else{
                // si c'est l'auteur alors on supprime l'annonce du produit
                deleteProduct(idProduct)
            }
        }
    })
    .catch((error)=>{return res.status(500).json(error)})

    // fonction supprimer un produit
    function deleteProduct(MyidProduct){
        models.Product.destroy({where:{id:MyidProduct}})
        .then(()=>{return res.status(201).json("PRODUCT DELETED")})
        .catch((error)=>{return res.status(500).json(error)})
    }
})

module.exports=productRoutes