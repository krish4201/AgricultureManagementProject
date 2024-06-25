const mongo = require("./db")
const data=new mongo.Schema({
    Soil:String,
    Waterlevel:String,
    isMotion:Boolean,
    isFencing:Boolean,
    FieldMotor:Boolean,
    WaterTankMotor:Boolean
})
const datas=mongo.model("datas",data)

module.exports=datas