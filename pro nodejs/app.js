const path = require('path');
const fs=require("fs")

const express = require('express');
const bodyParser = require('body-parser');

const multer=require('multer')

const pageController=require("./controllers/error")
const mongoose=require("mongoose")

const session=require("express-session")

const MongoDBStore=require("connect-mongodb-session")(session)

const jwt=require("jsonwebtoken")
const flash =require("connect-flash")

const User=require("./models/user")




const app = express();

const store=new MongoDBStore({
  uri:"mongodb://127.0.0.1:27017/Shop",
  collection:"sessoins"
  
})

const fileStorage=multer.diskStorage({
  destination:(req,file,cb)=>{
    cb(null,"images")
  },
  filename:(req,file,cb)=>{
    cb(null,file.originalname)
  }
})

const fileFilter=(req,file,cb)=>{
  if(file.mimetype==="image/png"||
  file.mimeype==="image/jpg"||
  file.mimetype==="image/jpeg"){
    
    cb(null,true)
  }else{
    cb(null,false)

  }
}

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');

const shopRoutes = require('./routes/shop');

const authRoutes = require('./routes/auth');






app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use("/images",express.static(path.join(__dirname, 'images')));
app.use(multer({storage:fileStorage,fileFilter:fileFilter}).single("image"))
app.use(
  session({secret:"my secret",resave:false,saveUninitialized:false,store:store})
  )
  app.use(flash())
  app.use((req,res,next)=>{
    res.locals.isAuthenticated=req.session.isLoggedin
    res.locals.csrfToken=0
    next()
  })
  
// app.use((req,res,next)=>{

//   if(req.method!="POST"){
//     return next()
//   }
//   const validtoken=req.body._csrf
//   const filepath=path.join(path.dirname(require.main.filename),"data","token.json")
//   fs.readFile(filepath,(err,data)=>{
    
//     if(!err){
//       const items=[]
//       items.push(data)
//       const parsedata=Buffer.concat(items).toString()
//       console.log("data",parsedata)
//       console.log("token",validtoken)
//       if(validtoken==parsedata){
  //       return next()
  //       }
  //         console.log("heh")
  //         res.redirect("/")
//     }
//     else{
//       console.log(err)
//     }
//   })
     
// })  

// app.use((req,res,next)=>{
//   const r=Math.random()
//   const token=jwt.sign(JSON.stringify(r),"javad")
//   req.token=token
//   const filepath=path.join(path.dirname(require.main.filename),"data","token.json")
//   fs.writeFile(filepath,JSON.stringify(token),err=>{console.log(err)})
//   next()
// })

app.use((req,res,next)=>{
  if(!req.session.user){
    return next()
  }
 User.findById(req.session.user._id).then((user)=>{
  if(!user){
    return next()
  }
    req.user=user
    next()

 })
 .catch(err=>{
  next(new Error(err))
 })
 
})


 app.use('/admin', adminRoutes );
 app.use(shopRoutes);
 app.use(authRoutes)

app.get("/500",pageController.get500)

app.use(pageController.get404);

app.use((error,req,res,next)=>{
  // res.httpStatusCode(error.httpStatusCode).render(..)
  res.redirect("/500")
})



mongoose.connect("mongodb://127.0.0.1:27017/Shop")
.then(result=>{
    app.listen(3000)
})

.catch(err=>console.log(err))