const userModel =require('../models/userModel')
const menuModel =require('../models/menuModel')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const axios = require('axios')

let registerUser = async function (req,res) {

    try{
            
        if(req.body){
           
            let mobile = req.body.mobile

            let query = {mobile: mobile}
            let user = await userModel.findOne(query)
            if (user) {
                const newOtp = Math.floor(1000 + Math.random() * 9000);
                user.otp = newOtp
                if(user.mobile==7987007894)
                {
                    user.otp=1234; 
                }
              //  console.log(newOtp)
                user.save()
               const otp = user.otp
               const mobileNumber = user.mobile
            //    let sendStatus = await axios.get(`http://2factor.in/API/V1/bb1223a8-5d02-11ec-b710-0200cd936042/SMS/${mobileNumber}/${otp}`)

                // smsSender.sendOtp(mobile, user.otp)
               return res.status(200).send({ status: true,message :"existing user" })
            } else
            {   
                const newOtp = Math.floor(1000 + Math.random() * 9000);
                var newUser = new userModel({
                    mobile: mobile
                })
                newUser.otp=newOtp
                let result = await newUser.save()
                const otp = result.otp
                const mobileNumber = result.mobile
                // let sendStatus = await axios.get(`http://2factor.in/API/V1/bb1223a8-5d02-11ec-b710-0200cd936042/SMS/${mobileNumber}/${otp}`)
                return res.status(200).send({ status: true,message :"New user" })
            }
        }
        else {
            res.status(400).send({ status: false,msg :"bad request,fill the fields properly" })

        }

    }catch (error) {

        res.status(500).send({ status: false, msg: error.message })

    }

    
}

let getMenu = async function(req,res){
    try{
          const userId = req.params.userId
          const menuDocument = await menuModel.findOne({userId:userId})
          res.send(menuDocument.menu)
    }
    catch(error)
    {
       res.status(500).send({status:false,msg:error.message}) 
    }
}
let verifyOtp = async (req,res)=>{
    try{
        let otp=req.body.otpEntered
    let mobile=req.body.mobile

    var userDocument=await userModel.findOne({mobile:mobile})
    if (userDocument)
    {
        console.log(otp)
        if (userDocument.otp==otp)
        {
            const token=userDocument.generateToken()
                // jwt.sign({mobile: user.mobile}, config.get('jwtPrivateKey'))
            res.status(200).header('x-auth-token', token).send({
                otpVerified:true,
                mobile:mobile,
                userId:userDocument._id,
                token:token
            })
        }
        else{
            res.status(200).send({
                otpVerified:false,
                mobile:mobile,
                userId:userDocument._id

            })
        }
    }
    else{
        res.send({
            otpVerified:false,
            mobile:"Invalid Mobile"
        })
    }
    }catch(error){
        res.status(500).send({ status: false, msg: error.message })
    }
    
}

let userDetails= async (req,res)=> {
    try{
        // const userId = req.body.userId
        console.log(req.params)
        const userId = req.params.userId
        const query = {"_id":userId}
        let userDocument = await userModel.findOne(query)
        const url = "https://staging.d2qhyt7hxak6e8.amplifyapp.com/"
            const menuUrl=url+`stall/${userId}`
        const userDetails = {
            userName : userDocument.name,
            stallName : userDocument.stallName,
            livesIn : userDocument.location.cityName,
            url: menuUrl ,
        }

        if (userDocument) {
            res.status(200).send({status:true,"userDetails": userDetails})
        }
        else res.status(200).send({ status: false, msg: error.message })
    }catch(error){
        res.status(200).send({ status: false, msg: error.message })
    }

}
let editUserDetails = async(req,res)=>{
    try{
          const userId = req.body.userId
          const query = {"_id":userId}
          let userDocument = await userModel.findOne(query)
          console.log('req.body',req.body)
          userDocument.stallName = req.body.stallName
          userDocument.location.cityName = req.body.livesIn
          userDocument.name = req.body.userName
          let result = await userDocument.save()
          console.log("userDocument",userDocument)
          console.log("result",result)
          const userDetails = {
            userName : userDocument.name,
            stallName : userDocument.stallName,
            livesIn : userDocument.location.cityName
        }
        res.status(200).send({status : true,"userDetails": userDetails})
           
    }
    catch(error)
    {
        res.status(200).send({status:false,msg:error.message})
    }
}
let getUsers = async function (req,res) {
    try{
        let users=await userModel.find({isDeleted:false})
        if (users && users.length > 0) {
           res.status(200).send({ status: true, data: users })
       } else {
           res.status(400).send({status: false,msg: "no users found"})
       }

    } catch(error) {
       res.status(500).send({ status: false, msg: error.message })

    }
}

let userLogin = async function (req,res) {
    try {
          if(req.body&&req.body.name&&req.body.password){
              let user= await userModel.findOne({name:req.body.name,password:req.body.password,isDeleted:false});
              if(user){
                    let payload = { _id: user._id };
	                let token = jwt.sign(payload, 'mysecretkey');
                    res.header('x-auth-token', token);
	                res.status(200).send({ status: true,data:user });
              }
              else
              {
                  res.status(401).send({status:false,msg:"invalid name and password "})
              }
          }
          else{
              res.status(400).send({status:false,msg:"please enter the crendentials properly"})
          }

    }catch(error) {

        res.status(500).send({status:false,msg:error.message})


    }
}


let putUserInfo = async function (req,res) {
   try{
    //    let token=req.header('x-auth-token')
    //    let validatedToken=jwt.verify(token,'mysecretkey')
    //    if(validatedToken)
    //    {
           if(req.params.userId==req.validatedToken._id){
                let updatedUser = await userModel.findOneAndUpdate({ _id: req.params.userId, isDeleted: false }, { $set: { name: req.body.name, mobile:req.body.mobile }},{new:true})
                if (updatedUser) {
                  res.status(200).send({ status: true, data: updatedUser })
                } else {
                  res.status(404).send({ status: false, msg: "User not found" })
                }
           }
           else{
              res.status(403).send({ status: false, msg: "unauthorized user cant put" })
           }
    //    }
    //    else{
    //     res.status(401).send({ status: false, msg: "not aregitered token" })
    //    }

   }catch(error){
    res.status(500).send({status:false,msg:error.message})

   }

}

let getUserInfo = async function (req,res) {
    try{
        // let token=req.header('x-auth-token')
        // let validatedToken=jwt.verify(token,'mysecretkey')
        // if(validatedToken)
        // {
            if(req.params.userId==req.validatedToken._id){
                 let user = await userModel.findOne({ _id: req.params.userId, isDeleted: false })
                 if (user) {
                   res.status(200).send({ status: true, data: user })
                 } else {
                   res.status(404).send({ status: false, msg: "User not found" })
                 }
            }
            else{
               res.status(403).send({ status: false, msg: "unauthorized user" })
            }
        // }
        // else{
        //  res.status(401).send({ status: false, msg: "not aregitered token" })
        // }
 
    }catch(error){
     res.status(500).send({status:false,msg:error.message})
       
    }
 
 }




module.exports.registerUser=registerUser
module.exports.getUsers=getUsers
module.exports.userLogin=userLogin
module.exports.getUserInfo=getUserInfo
module.exports.putUserInfo=putUserInfo
module.exports.verifyOtp=verifyOtp
module.exports.userDetails=userDetails
module.exports.getMenu=getMenu
module.exports.editUserDetails=editUserDetails


