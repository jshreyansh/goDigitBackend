const mongoose = require('mongoose')

const restaurantSchema = new mongoose.Schema({
    name:{
          type:String,
          required:true,
    },
    menu : {
        type:[{
            category : {type: String},
            items : [{
                name:String,
                price: Number
            }]
        }],
        default:null
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
    phone:{
        type:Number,
        default:null
    },
    location:{
        type:String,
        default:null
    }
})


module.exports = mongoose.model('Restaurant', restaurantSchema)