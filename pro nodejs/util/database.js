const {MongoClient}=require("mongodb")

let _db



const mongoConnect=(cb)=>{
  MongoClient.connect("mongodb://127.0.0.1:27017/Shop")
  .then(client=>{
    console.log("Connected !!!")
    _db=client.db()
    cb()
  })
  .catch(err=>console.log(err))
}

const getDb=()=>{
  if(_db){
    return _db
  }
  throw "not any db found"
}




exports.mongoConnect=mongoConnect
exports.getDb=getDb

