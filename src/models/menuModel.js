const { string } = require('joi');
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const User = require('./userModel')

var MenuSchema = new mongoose.Schema({
    "userId" : {
        type : ObjectId,
        ref : 'User'
    },
    "menu" : {
        type:[{
            category : {type: String},
            itemCount: {type:Number},
            "isDeleted" : {
                type : Boolean,
                default : false
            }
        }],
        default:null
    },
    "onlineMenuLink" : {
        type : String,
        default : ""
    },
    "isDeleted" : {
        type : Boolean,
        default : false
    }
})

module.exports = mongoose.model('Menu',MenuSchema)
