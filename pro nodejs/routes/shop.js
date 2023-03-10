

const express = require('express');

const shopController = require('../controllers/shop');
const isAuth=require("../middelware/is-auth")

const router = express.Router();

router.get('/', shopController.getIndex);

router.get('/products', shopController.getProducts);

router.get('/products/:productId', shopController.getProduct);

router.get('/cart',isAuth, shopController.getCart);

router.post('/cart',isAuth, shopController.postCart);

router.get('/orders',isAuth, shopController.getOrders);



  router.post("/cart-delete-item",isAuth,shopController.postCartDelete)

  router.post("/checkout",isAuth,shopController.postOrder)

   router.get("/orders/:orderId",isAuth,shopController.getInvoice)

module.exports = router;
