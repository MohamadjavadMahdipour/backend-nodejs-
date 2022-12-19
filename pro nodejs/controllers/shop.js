const fs=require("fs")

const path=require("path")

const Product = require('../models/product');

const Order=require("../models/order")

const PDFDocument = require('pdfkit')

const ITEMS_PER_PAGE = 3 

exports.getProducts = (req, res, next) => {
  
  const page=+req.query.page||1
 
   let totalItems
  Product.find()
  .countDocuments().then(numProducts=>{
       totalItems=numProducts
       return Product.find()
       .skip((page-1)*ITEMS_PER_PAGE)
       .limit(ITEMS_PER_PAGE)    
  })
  .then((products)=>{
    res.render('shop/product-list', {
      prods: products,
      pageTitle: 'Products',
      path: '/products',
      isAuthenticated:req.session.isloggedin,
      currentPage:page,
      hasNextPage:ITEMS_PER_PAGE*page<totalItems,
      hasPreviousPage:page>1,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)

    });
  
  })
  .catch(err=>{
    
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })
   
  
};

exports.getProduct = (req, res, next) => {
 
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then((product)=>{
    if(!product){
      res.redirect("/")
     }
    
     res.render('shop/product-detail', {
      product: product,
      pageTitle: product.title,
      path: '/products',
      isAuthenticated:req.session.isloggedin
    });
  })
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })
    
 
};

exports.getIndex = (req, res, next) => {
  const page=+req.query.page||1
  
   let totalItems
  Product.find()
  .countDocuments().then(numProducts=>{
       totalItems=numProducts
       return Product.find()
       .skip((page-1)*ITEMS_PER_PAGE)
       .limit(ITEMS_PER_PAGE)    
  })
  .then((products)=>{
    res.render('shop/index', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      isAuthenticated:req.session.isloggedin,
      currentPage:page,
      hasNextPage:ITEMS_PER_PAGE*page<totalItems,
      hasPreviousPage:page>1,
      nextPage:page+1,
      previousPage:page-1,
      lastPage:Math.ceil(totalItems/ITEMS_PER_PAGE)

    });
  
  })
  .catch(err=>{
    
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })
    
  
 
};

exports.getCart = (req, res, next) => {
 
  req.user
  .populate("cart.items.productId")
  
  .then(user=>{
   
    res.render('shop/cart', {
      path:"/cart",
      pageTitle:"your Cart",
      products:user.cart.items,
      isAuthenticated:req.session.isloggedin
    })
  })
    
  
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })
 
 
  
};

exports. postCartDelete=(req,res,next)=>{
  const proId=req.body.proId
  req.user.deleteFromCart(proId).then(val=>{
    res.redirect("/cart")
  })
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })

}

exports.postCart = (req, res, next) => {
  const prodId=req.body.productId
  Product.findById(prodId).
  then(product=>{
    
   return req.user.addToCart(product)
  })
  .then(val=>{
    
    res.redirect("/cart")
  })
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })
  
};

exports.getOrders = (req, res, next) => {
    
  Order.find({"user.userId":req.user._id})
  .then((orders)=>{
    res.render("shop/orders",{
      orders:orders,
      path: '/orders',
      pageTitle: 'Your Orders',
      isAuthenticated:req.session.isloggedin

    })
  })
 
  .catch(err=>{
    const error=new Error(err)
    error.httpStatusCode=500
    return next(error)
  })
};

// exports.getCheckout = (req, res, next) => {
//   res.render('shop/checkout', {
//     path: '/checkout',
//     pageTitle: 'Checkout'
//   });
// };
exports.postOrder=(req,res,next)=>{
  
  req.user
  .populate("cart.items.productId")
 
 .then(user=>{
  const products=user.cart.items.map(i=>{
    return {quantity:i.quantity,product:{...i.productId._doc}}
  })
  const order=new Order({
    user:{
      email:req.user.email,
      userId:req.user
    },
    products:products
    
  })
  return order.save()
 })
 .then(val=>{
  return req.user.clearCart()
 })
 .then(()=>{
  res.redirect("/orders")
 })
 .catch(err=>{
  console.log(err)
//   const error=new Error(err)
//   error.httpStatusCode=500
//   return next(error)
 })
 

}

  exports.getInvoice=(req,res,next)=>{
    

   const orderId=req.params.orderId

   Order.findById(orderId).then(order=>{
    if(!order){
      return next(new Error("No order found"))
    }
    if(order.user.userId.toString()!==req.user._id.toString()){
      return next(new Error("you accsec this order"))
    }
    const invoiceName="invoice-"+orderId+".pdf"

    const invoicePath=path.join("data","invoices",invoiceName) 
   
    const doc = new PDFDocument()

    doc.pipe(fs.createWriteStream(invoicePath))
    doc.pipe(res)

   doc.fontSize(26).text("Invoice",{
    underline:true
   })
   doc.text("_________________________________________")
    let totalPrice=0
   order.products.forEach(item=>{
    totalPrice+=item.quantity*item.product.price
    doc.fontSize(14)
    .text(`Title : ${item.product.title} __ quantity : ${item.quantity}`)
   })
   doc.text("_________________________________________")
   doc.fontSize(20).text(`TotalPrice : ${totalPrice}`)

    doc.end()
     
   })
   .catch(err=>{next(err)})

   
    
  
}

    

