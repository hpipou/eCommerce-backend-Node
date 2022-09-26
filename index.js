const express=require("express")
const app=express()
const cors=require("cors")

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended:true}))

// declare token verification
const auth = require("./midleware/authentication") 

// declare Routes
const userRoutes = require("./routes/user")
const oderRoutes = require("./routes/order")
const profilRoutes = require("./routes/profil")
const productRoutes = require("./routes/product")
const categoryRoutes = require("./routes/category")

// deploy routes
app.use("/users", userRoutes);
app.use("/profils", profilRoutes);

app.listen(3000, ()=>console.log("SERVER START"))