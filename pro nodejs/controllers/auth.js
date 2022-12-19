
const crypto=require("crypto")
const bcryptjs=require("bcryptjs")
// const nodemailer=require("nodemailer")
// const send=require("nodemailer-sendgrid-transport")
const {validationResult}=require("express-validator/check")
const User=require("../models/user");


// const transport=nodemailer.createTransport(send({
//   auth:{
//     api_key:""
//   }
// }))


exports.getLogin = (req, res, next) => {
   let m=req.flash("error")
   if(m.lenght!=0){
    m=m[0]
   }else{
    m=null
   }
   
 
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
   
    errorMessage:m,
    oldData:{
      email:"",
      password:""
    },

    validErrors:[]
    
  
    
  });
};
exports.getReset=(req,res,next)=>{
  let message=req.flash("error")
  if(message.lenght!=0){
    message=message[0]
  }else{
    message=null
  }
  res.render('auth/reset', {
    path: '/reset',
    pageTitle: 'Reset', 
    errorMessage:message
  });
}
exports.getSignup = (req, res, next) => {
  
  let message=req.flash("error")
  if(message.lenght!=0){
    message=message[0]
  }else{
    message=null
  }

  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'Signup',
     errorMessage:message,
     oldData:{email:"",password:"",confirmPassword:""},
     validErrors:[]
    
  });
};
exports.getNewPassword=(req,res,next)=>{
  const userToken=req.params.token
  User.findOne({token:userToken,tokenexpire:{$gt:Date.now()}})
  .then(user=>{
    if(!user){
      req.flash('error',"this token not valid or this was expire")
      return res.redirect("/reset")
    }
    let message=req.flash("error")
    if(message.lenght!=0){
      message=message[0]
    }else{
      message=null
    }
  
    res.render('auth/new-password', {
      path: '/new-password',
      pageTitle: 'New Password',
       errorMessage:message,
       userId:user._id.toString(),
       token:userToken
      
    });
  })
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })
}

exports.postLogin = (req, res, next) => {
    const email=req.body.email

    const password=req.body.password
    const errors=validationResult(req)
    if(!errors.isEmpty()){
      const errorMsg= errors.array()[0].msg
      return res.status(422).render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
       
        errorMessage:errorMsg,
        oldData:{
          email:email,
          password:password
        },

        validErrors:errors.array()
      
        
      });

    }
    User.findOne({email:email})
    .then(user=>{
      if(!user){
        req.flash("error","this email is not exist")
        return res.redirect("/login")
      }
      bcryptjs
      .compare(password,user.password)
      .then(doMatch=>{
        if(!doMatch){
          return res.redirect("/login")
        }
        req.session.isloggedin=true
        req.session.user=user
       
        return  req.session.save((err)=>{
          
          res.redirect("/")
        })

      })
      .catch(err=>{
        const error=new Error(err)
        error.httpStatusCode=500
        return next(error)
      })

    })
    .catch(err=>{
      const error=new Error(err)
      error.httpStatusCode=500
      return next(error)
    })
    

 
 
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err)=>{
    console.log(err)
    res.redirect('/')
  })
};

exports.postSingup=(req,res,next)=>{
  const email=req.body.email
  const password=req.body.password
  const confirmPassword=req.body.confirmPassword
  const errors=validationResult(req)
  if(!errors.isEmpty()){
    const errorMsg= errors.array()[0].msg
    return res.status(422) 
    .render('auth/signup', {
      path: '/signup',
      pageTitle: 'Signup',
       errorMessage:errorMsg,
       oldData:{email:email,password:password,confirmPassword:confirmPassword},
       validErrors:errors.array()
      
    });
  }

 
   return bcryptjs.hash(password,13)
    .then(hashPassword=>{
      
      const newuser=new User({
        email:email,
        password:hashPassword,
        cart:{item:[]}
      })
      return newuser.save()
    })
    .then(val=>{
      res.redirect("/")
    })
    .catch(err=>{
      const error=new Error(err)
      error.httpStatusCode=500
      return next(error)
    })
  


}
exports.postReset=(req,res,next)=>{
  crypto.randomBytes(32,(err,Buffer)=>{
    if(err){
      console.log(err)
      return res.redirect("/reset")
    }
    const token=Buffer.toString("hex")
   
    User.findOne({email:req.body.email})
    .then(user=>{
      if(!user){
        req.flash("error","this email not true")
        return res.redirect("/reset")
      }
      user.token=token
      user.tokenexpire=Date.now()+360000
      return user.save()
  
  
    })
    .then(result=>{
       
       res.redirect(`/reset/${token}`)
    })
    .catch(err=>{
      const error=new Error(err)
      error.httpStatusCode=500
      return next(error)
    })
  })
}

exports.postNewPassword=(req,res,next)=>{
  const newpassword=req.body.password
  const userId=req.body.userId
  const token=req.body.token
  let resetUser
  User.findOne({
    token:token,
    _id:userId,
    tokenexpire:{$gt:Date.now()}
  })
  .then(user=>{
    if(!user){
      req.flash("error","not valid")
      return res.redirect("/singup")
    }
    resetUser=user
    return bcryptjs.hash(newpassword,13)
  })
  .then(hashPassword=>{
    resetUser.password=hashPassword
    resetUser.token=undefined
    resetUser.tokenexpire=undefined
    return resetUser.save()
  })
  .then(result=>{
    res.redirect("/login")
  })
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })
}

