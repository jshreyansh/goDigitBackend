const mongoose = require('mongoose')
const User = require('./userModel')
const itemSchema = new mongoose.Schema({
    name:{
        type:String,
        required : true
    },
    price : {
        type:Number,
        required : true
    },
    userId:{
        type:  mongoose.Types.ObjectId,
        ref : "User"
    },
    categoryName : {
        type : String,
        default : ""
    },
    categoryId : {
        type : String
    }
})
module.exports = mongoose.model('Item',itemSchema)