

const mongo =require("mongoose");

const mongoURL=""

mongo.connect(mongoURL).then(()=>{
    console.log("connected")}
)
.catch((e)=>{
    console.log("Error :" ,e)
})

module.exports=mongo