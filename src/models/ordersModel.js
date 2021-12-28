const mongoose = require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId
const User = require('./userModel')
const Item = require('./itemModel')

let OrdersSchema = new mongoose.Schema({
      
    "itemsPlaced" : [
        {
            "itemId" : {
                type : ObjectId,
                ref : "Item"
            },
            "itemName" : {
                type : String
            },
            "quantity" : {
                type : Number,
            }
        }
    ],
    "userId" : {
        type : ObjectId,
        ref : "User"
    },
    "totalCost" : {
        type : Number
    },
    "orderNumber" : {
        type : Number
    },
    "isPaid" : {
        type : Boolean,
        default : false
    },
    "date" : {
        type : Date
    },
    "orderStatus" : {
        type : String,
        enum : ["orderPlaced", "orderAccepted" , "orderRejected" , "orderCompleted"],
        default : "orderPlaced"
    },
    "totalOrderNumber" : {
        type : Number,
        default : 0
    },
    "orderInstructions" : {
        type : String
    },
    "dineIn" : {
        type : Boolean,
        default : true
    }
},{timestamps : true})

module.exports = mongoose.model('orders',OrdersSchema)