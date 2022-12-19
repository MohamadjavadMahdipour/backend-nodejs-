const mongodb=require("mongodb");
const product = require("../models/product");

const ObjectId=mongodb.ObjectId
const Product = require('../models/product');

const {validationResult}=require("express-validator/check")
exports.getAddProduct = (req, res, next) => {
   
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
    isAuthenticated:req.session.isloggedin,
    hasError:false,
    error:null,
    validErrors:[],
    product:{title:"",imageUrl:"",price:"",description:""}
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const image = req.file;
  const price = req.body.price;
  const description = req.body.description;
  const errors=validationResult(req)
  
  if(!image){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      isAuthenticated:req.session.isloggedin,
      hasError:true,
      error:"Attached file is not an image",
      validErrors:[],
      product:{title:title,price:price,description:description}
    });
    
  }
  const imageUrl="/"+image.path
  console.log(imageUrl)
   if(!errors.isEmpty()){
    return res.status(422).render('admin/edit-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      editing: false,
      isAuthenticated:req.session.isloggedin,
      hasError:true,
      error:errors.array()[0].msg,
      validErrors:errors.array(),
      product:{title:title,imageUrl:imageUrl,price:price,description:description}
    });
   }

  const product=new Product({title:title,price:price,description:description,imageUrl:imageUrl,userId:req.user})
  product.save()
  .then(result=>{
    console.log("Created Product")
     res.redirect("/admin/products")
  }
    
  ).catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })
};

exports.getEditProduct = (req, res, next) => {
  
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect('/');
  }
  
  const prodId = req.params.productId;
  Product.findById(prodId)

  .then((product)=>{
    if(!product){
      res.redirect("/")
     }
    
     res.render('admin/edit-product', {
       pageTitle: 'Edit Product',
       path: '/admin/edit-product',
       editing: editMode,
       isAuthenticated:req.session.isloggedin,
       product: product,
       hasError:false,
       error:null,
       validErrors:[]
       
       

       
     });
  })
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })
    
    
 
};
exports.postEditProduct=(req,res,next)=>{

  const proId=req.body.proId
  const updatedTitle=req.body.title
  const updatedprice=req.body.price
  const updatedImage=req.file
  const updatedDiscription=req.body.description
  const errors=validationResult(req)
  
      // if(!updatedImage){
      //   return res.status(422).render('admin/edit-product', {
      //     pageTitle: 'Edit product',
      //     path: '/admin/edit-product',
      //     editing: false,
      //     hasError: true,
      //     product: {
      //         title: updatedTitle,
      //         price: updatedprice,
      //         description: updatedDiscription
      //     },
      //     errorMessage: 'Attached file is not an image.',
      //     validationErrors: []
      // });
      // }
       
      if(!errors.isEmpty()){
        return res.status(422).render('admin/edit-product', {
          pageTitle: 'Edit Product',
          path: '/admin/edit-product',
          editing: false,
          isAuthenticated:req.session.isloggedin,
          product:{title:updatedTitle,imageUrl:updatedImage,price:updatedprice,description:updatedDiscription,_id:proId},
          hasError:true,
          error:errors.array()[0].msg,
          validErrors:errors.array(),
          
         
        });
      }
      Product.findById(proId).then(product=>{
        if(product.userId.toString()!==req.user._id.toString()){
          return res.status(401).render('admin/edit-product', {
            pageTitle: 'Edit product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                title: updatedTitle,
                price: updatedprice,
                description: updatedDiscription
            },
            errorMessage: 'you cant edit this product.',
            validationErrors: []
        });
          }
    product.title=updatedTitle
    product.price=updatedprice
    product.description=updatedDiscription
    if(updatedImage){
      product.imageUrl="/"+updatedImage.path
    }
    return  product.save().then(result=>{
      console.log("Updated")
      res.redirect("/admin/products")
    })
  })
  
  .catch(err=>{
    console.log(err)
    // const error=new Error(err)
    // error.httpStatusCode=500
    // return next(error)
  })
 
  
   
}
exports.deleteProducts=(req,res,next)=>{
 
  const proId=req.params.proId
  Product.deleteOne({_id:proId,userId:req.user._id})
  .then(result=>{
    
    res.status(200).json({message:"Succsess"})
  })
  .catch(err=>{
    res.status(500).json({message:"product dont delete!!!!!"})
  })

 

}

exports.getProducts = (req, res, next) => {
 const userId=req.user._id
  Product.find({userId:userId})
  // .populate("userId","name")
  // .select("title price-_id" )
  .then((products)=>{
    res.render('admin/products', {
      prods: products,
      pageTitle: 'Admin Products',
      path: '/admin/products',
      isAuthenticated:req.session.isloggedin
    });
  })
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })
  
 
};
