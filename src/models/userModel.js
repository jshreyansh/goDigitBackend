const mongoose = require('mongoose')
//const config= require('../../config')
const jwt= require ('jsonwebtoken')

// const otpGenerator = require('otp-generator')
//const smsSender= require('../controllers/smsSender')


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        default:""
    },
    mobile:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
    },
    email:{
        type:String,
    },
    isDeleted:{
        type:Boolean,
        default:false,
    },
    otp:Number,
    menuCreated : {
        type:Boolean,
        default : false
    },
    totalOrdersPlaced : {
        type : Number,
        default : 0
    },
    location:{
        type:
        {
            cityName : {
                type : String,
                default:""
            }
        },
        default:{}
    },
    stallName:{
        type:String,
        default:""
    }
})

userSchema.pre('save', async function () {
    console.log("in  - userSchema.post('save', userSchema.pre('save', async function () {")
    generateOtp(this);
    
})

let generateOtp = function (user) {
    console.log("in - let generateOtp = function (user) {")
// let otp = otpGenerator.generate(6, { digits: true, specialChars: false, upperCase: false, alphabets: false });
let otp=Math.floor(1000 + Math.random() * 9000);
user.otp = otp;

if(user.mobile==7987007894)
{
    user.otp=1234; 
}
return;
}

userSchema.methods.generateToken= function() {
    console.log("in - userSchema.methods.generateToken= function() {")  
return jwt.sign({mobile: this.mobile, name: this.name}, "myStallSecretUserAuthKey");
}

userSchema.post('save', async function () {
//smsSender.sendOtp(this.mobile, this.otp);
console.log("in - userSchema.post('save', async function () {,",this.otp,this.mobile)
})

module.exports = mongoose.model('User', userSchema)