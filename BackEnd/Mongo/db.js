

const mongo =require("mongoose");

const mongoURL="mongodb+srv://praveen:1234@cluster0.5s3l1r6.mongodb.net/Agriculture?retryWrites=true&w=majority&appName=Cluster0"

mongo.connect(mongoURL).then(()=>{
    console.log("connected")}
)
.catch((e)=>{
    console.log("Error :" ,e)
})

module.exports=mongo