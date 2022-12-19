const express = require('express');

const {check,body}=require("express-validator/check")

const authController = require('../controllers/auth');

const User=require("../models/user")

const router = express.Router();

router.get('/login', authController.getLogin);

router.get('/signup', authController.getSignup);

router.get("/reset",authController.getReset);

router.get('/reset/:token', authController.getNewPassword);

router.post('/login',
check("email")
.isEmail()
.withMessage("please enter valid email"),
body("password","this password must be atleast 6 charetecter and only use alfabic letter")
.isLength({min:6})
.isAlphanumeric()
 ,authController.postLogin);

router.post('/signup',[check("email")
.isEmail()
.withMessage("its not a valid email")
.custom((value)=>{
    return User.findOne({email:value})
    .then(user=>{
      if(user){
        return Promise.reject("E-mail exist already,please pick a diffrent one")
      }
      
    })
})
.normalizeEmail()
,body("password","this password must be atleast 6 charetecter and only use alfabic letter")
.isLength({min:6})
.isAlphanumeric()
.trim()
,body("confirmPassword").custom((value,{req})=>{
    if(value!==req.body.password){
        throw new Error("password have to match")
    }
    return true
})
.trim()
]
 ,authController.postSingup);

router.post('/logout', authController.postLogout);

router.post('/reset', authController.postReset);

router.post("/new-password",authController.postNewPassword)

module.exports = router;