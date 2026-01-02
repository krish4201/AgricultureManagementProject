

const mongo =require("mongoose");

const mongoURL="mongodb+srv://rkkramesh2001_db_user:1234@cluster0.i9yexev.mongodb.net/Agriculture?retryWrites=true&w=majority&appName=Cluster0"

mongo.connect(mongoURL).then(()=>{
    console.log("connected")}
)
.catch((e)=>{
    console.log("Error :" ,e)
})

module.exports=mongo