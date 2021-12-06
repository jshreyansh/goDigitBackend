const express = require('express');
const userController = require('../controllers/userController')
const auth=require('../middleware/auth')
const menuController = require('../controllers/menuController')
const orderController = require('../controllers/orderController')
const mongoose=require('mongoose')
const jwt=require('jsonwebtoken')
const router = express.Router();



let tokenVerification = (req,res,next) =>{
    try{

    let token=req.header('x-auth-token')
    if(token) {
        let validatedToken=jwt.verify(token,'mysecretkey')

        if(validatedToken){
               req.validatedToken=validatedToken;
               next()
        } else {
            res.status(401).send({ status: false, msg: "invalid token" })
}
    } else {
        res.status(400).send({ status: false, msg: "request header must contain token" })
    }
        
    } catch(error){
        res.status(500).send({status: false, msg: error.message})
    }

}

// User routes

router.post('/api/user',userController.registerUser)

router.post('/api/verifyOtp',userController.verifyOtp)
router.get('/api/userDetails/:userId', auth, userController.userDetails)
router.post('/api/editUserDetails', auth, userController.editUserDetails)
router.post('/api/createMenu',auth,menuController.createMenu)
router.get('/api/getMenu/:userId',auth,menuController.getMenu)
router.get('/api/deleteCategory/:userId/:categoryId',auth,menuController.deleteCategory)
router.post('/api/editCategory/',auth,menuController.editCategory)

router.post('/api/createOrder',auth,orderController.createOrder)
router.get('/api/orderList',auth,orderController.getOrderList)
router.get('/api/getMenu/:userId',userController.getMenu)
// router.get('/api/getUsers',userController.getUsers)
// router.post('/api/userLogin',userController.userLogin)
// //router.get('/api/getUserInfo/:_id"',userController.getUserInfo)
// router.get('/api/users/:userId',tokenVerification, userController.getUserInfo)
// router.put('/api/putUserInfo/:userId',tokenVerification,userController.putUserInfo)








module.exports = router;