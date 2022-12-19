const mongoose=require("mongoose")

const {Schema}=mongoose

const productSchema=new Schema({
    title:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    description:{
       type:String,
       required:true 
    },
    imageUrl:{
        type:String,
        required:true 
     },

    userId:{
        type:mongoose.Types.ObjectId,
        ref:"User",
        required:true
    }

    
})

module.exports=mongoose.model("Product",productSchema)










// const mongodb=require("mongodb")
// const {getDb}=require("../util/database")


// class Product {
//   constructor(title,price,description,imageUrl,id,userid){
//     this.title=title
//     this.price=price
//     this.description=description
//     this.imageUrl=imageUrl
//     this._id=id ? mongodb.ObjectId(id):null
//     this.userid=userid
//   }
//   save(){
//     const db=getDb()
//     let dBu
//     if(this._id){

//       dBu=db.collection("products").updateOne({_id:new mongodb.ObjectId(this._id) },{$set:this})

//     }
//     else{
//       dBu= db.collection("products")
//     .insertOne(this)
//     }
//     return dBu
//     .then(result=>{console.log(result)})
//     .catch(err=>console.log(err))  
    
//   }
//   static fetchedAll(){
//     const db=getDb()
//     return db
//     .collection("products")
//     .find()
//     .toArray()
//     .then(products=>{
//       return products

//     })
//     .catch(err=>console.log(err))
//   }
//   static findById(proId){
//    const db=getDb()
//    return db
//    .collection("products")
//    .find({_id:mongodb.ObjectId(proId)})
//    .next()
//    .then(product=>{
//     console.log(product)
//     return product
//    }).catch(err=>console.log(err))

//   }
//   static deleteById(prodId){
//     const db=getDb()
//     return db.
//     collection("products")
//     .deleteOne({_id:new mongodb.ObjectId(prodId)})
//     .then(res=>{
//       console.log("deleted")
//     })
//     .catch(err=>console.log(err))
//   }

// }

// module.exports=Product