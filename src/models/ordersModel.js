const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const User = require('./userModel')

let OrdersSchema = new mongoose.Schema({
      
    "itemsPlaced" : [
        {
            "itemId" : ObjectId,
            "quantity" : {
                type : Number,
            }
        }
    ],
    "stallId" : {
        type : ObjectId,
        ref : 'User'
    },
    "totalCost" : {
        type : Number
    },
    "orderNumber" : {
        type : number
    },
    "isPaid" : {
        type : Boolean,
        default : false
    }
},{timestamps : true})

module.exports = mongoose.model('orders',OrdersSchema)