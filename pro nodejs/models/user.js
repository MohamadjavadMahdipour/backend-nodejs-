const mongoose=require("mongoose")


const {Schema}=mongoose

const userSchema=new Schema({
    email:{type:String,required:true

    },
    password:{type:String,required:true

    },
    token:{type:String,require:false},
    tokenexpire:{type:Date,required:false},
    cart:{
        items:[
            {
                productId:{type:Schema.Types.ObjectId,ref:"Product",required:true},
                quantity:{type:Number,required:true}
            }
        ]
    }

     

})
userSchema.methods.addToCart=function(product){
    const cartProductIndex=this.cart.items.findIndex(cp=>{
        return cp.productId.toString()===product._id.toString()
      })
      let newQuantity=1
      let updatedCartItems=[...this.cart.items]
      if(cartProductIndex>=0){
         newQuantity =updatedCartItems[cartProductIndex].quantity+1
         updatedCartItems[cartProductIndex].quantity=newQuantity
      }
      else{
        updatedCartItems.push({productId:product._id,quantity:newQuantity})
      }
      const updatedCart={items:updatedCartItems}
      this.cart=updatedCart
      return this.save()
}

userSchema.methods.deleteFromCart=function(id){
    const updatedCart=this.cart.items.filter(i=>{
               return i.productId.toString()!==id.toString()
            })
            this.cart.items=updatedCart

            return this.save()
}

userSchema.methods.clearCart=function(){
    this.cart={items:[]}

    return this.save()
}

module.exports=mongoose.model("User",userSchema)



// const mongodb=require("mongodb")
// const {getDb}=require("../util/database")


// class User {
//   constructor(username ,email,cart,id){
//     this.username=username
//     this.emai=email
//     this.cart=cart //{item:[{productId,quantity}]}
//     this._id=id
//   }
//   save(){
//      const db=getDb()
//     return db
//     .collection("users")
//     .insertOne(this)
//   }
//   addToCart(product){ 
//     const cartProductIndex=this.cart.item.findIndex(cp=>{
//       return cp.productId.toString()===product._id.toString()
//     })
//     let newQuantity=1
//     let updatedCartItems=[...this.cart.item]
//     if(cartProductIndex>=0){
//        newQuantity =updatedCartItems[cartProductIndex].quantity+1
//        updatedCartItems[cartProductIndex].quantity=newQuantity
//     }
//     else{
//       updatedCartItems.push({productId:new mongodb.ObjectId(product._id),quantity:newQuantity})
//     }
//     const updatedCart={item:updatedCartItems}
//     const db=getDb()
//     return db
//     .collection("users")
//     .updateOne({_id: new mongodb.ObjectId(this._id)},{$set:{cart:updatedCart}})

//   }
//   getCart(){
//     const db=getDb()
//     const productIds=this.cart.item.map(i=>{
//       return i.productId
//     })
//     return db.
//     collection("products")
//     .find({_id:{$in:productIds}})
//     .toArray()
//     .then(products=>{
//       return products.map(p=>{
//         return {...p,quantity:this.cart.item.find(cp=>{
//           return cp.productId.toString()===p._id.toString()
//         }).quantity
//       }
//       })

//     })
//     .catch(err=>console.log(err))
    
//   }
//   deleteCartById(proId){
//     const updatedCart=this.cart.item.filter(i=>{
//       return i.productId.toString()!==proId.toString()
//     })
//     const db=getDb()
//     return db.collection("users").updateOne({_id:new mongodb.ObjectId(this._id)},{$set:{cart:{item:updatedCart}}})
//   }
//   addOrder(){
//    const db=getDb()
//    return this.getCart().then(products=>{
//      const orders={
//       items:products,
//       user:{
//         _id:new mongodb.ObjectId(this._id),
//         name:this.name
         
//          }
      
//     } 
//     return db
//    .collection("orders")
//    .insertOne(orders)

//    })
   
   
//    .then(result=>{
//     this.cart={item:[]}
//     return db.collection("users")
//     .updateOne({_id :new mongodb.ObjectId(this._id)},{$set:{cart:this.cart}})
//    })
   
//    .catch(err=>console.log(err))
//   }
//   getOrders(){
//     const db=getDb()
//     return db.collection("orders").find({"user._id":new mongodb.ObjectId(this._id)}).toArray()
   
//   }

//   static findByUserId(userId){
//     const db=getDb()
//     return db
//     .collection("users")
//     .findOne({_id:new mongodb.ObjectId(userId)})
//   }


// }

// module.exports=User