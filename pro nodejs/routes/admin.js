

const express = require('express');

const adminController = require('../controllers/admin');

const {body}=require("express-validator/check")

const isAuth=require("../middelware/is-auth")

const router = express.Router();

// /admin/add-product => GET
 router.get('/add-product',isAuth,adminController.getAddProduct);

// // /admin/products => GET
 router.get('/products',isAuth, adminController.getProducts);

// // /admin/add-product => POST
router.post('/add-product',[
body("title","please enter the title with min 6 char and max 20 char whith out space").
isLength({min:6,max:20})
.isString()
.trim()

,body("price","please enter valid number")
.isFloat()
,body("description","please enter min 5 char and max 400 char")
.isLength({min:6,max:400})
.trim()

],isAuth, adminController.postAddProduct);

 router.get('/edit-product/:productId',isAuth, adminController.getEditProduct);

 router.post("/%20edit-product",[body("title").
 isLength({min:6,max:20})
 .isAlphanumeric()
 .trim()
 
 ,body("price")
 .isFloat()
 ,body("description")
 .isLength({min:6,max:400})
 .trim()],isAuth,adminController.postEditProduct)

 router.delete("/product/:proId",isAuth,adminController.deleteProducts)
module.exports = router;
