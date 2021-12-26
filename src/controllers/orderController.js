const ordersModel = require('../models/ordersModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose');
const lodash = require('lodash')

module.exports = {
        createOrder: async (req,res)=> {

    try{
          console.log("12")
          const body = req.body
          let itemsPlaced = body.itemsPlaced
          let userId = body.userId
          let totalCost = body.totalCost
          let query = {_id : userId}
          const userDocument = await userModel.findOne(query)
          const dateTime = new Date();
          const date = dateTime.toISOString().slice(0,10)
          const todayOrders = await ordersModel.find({date : date, userId : userId})
          const orderNumber = todayOrders.length + 1
          const totalOrderNumber = userDocument.totalOrdersPlaced + 1
          userDocument.totalOrdersPlaced = totalOrderNumber
          await userDocument.save()
          var newOrder = new ordersModel({
              itemsPlaced : itemsPlaced,
              userId : userId,
              totalCost : totalCost,
              orderNumber : orderNumber,
              date : date,
              totalOrderNumber : totalOrderNumber
          })
          let result = await newOrder.save()
          res.status(200).send({data : result})
    }
    catch(error)
    {
        res.status(500).send({status:false,msg:error.message})
    }

  },
  getTodayOrders : async(req,res) => {
      try{
            let userId = req.params.userId
            const dateTime = new Date();
            const date = dateTime.toISOString().slice(0,10)
            console.log(typeof userId)
            userId = mongoose.Types.ObjectId(userId.trim());
            console.log(date)
            const todayOrders = await ordersModel.find({date : date, userId : userId})
            res.status(200).send({status : true, data : todayOrders})
      }
      catch(error)
      {
          res.status(500).send({status:false,msg:error.message})
      }
  },
  getAllOrders : async(req,res)=>{
      try{
        let userId = req.params.userId
        userId = mongoose.Types.ObjectId(userId.trim());
        const AllOrders = await ordersModel.find({userId : userId})
        let ordersOnDate = lodash.reduce(AllOrders, (result, user) => {

            (result[user.date] || (result[user.date] = [])).push(user);
            return result;
        }, {});
        const totalOrders=[]
        Object.keys(ordersOnDate)
            .forEach(function eachKey(key) { 
                let obj={}
                obj.date=key
                obj.orders=ordersOnDate[key]
                totalOrders.push(obj)
            })
        res.status(200).send({status : true, data : totalOrders})
      }
      catch(error)
      {
          res.status(500).send({status:false,msg:error.message})
      }
  },
  updateOrderStatus : async(req,res)=>{
    try{
        const orderId = req.body.orderId
      //  console.log(orderId)
        const orderStatus = req.body.orderStatus
      //  console.log(orderStatus)
        let orderDocument = await ordersModel.findOne({_id : orderId})
      //  console.log(orderDocument)
        orderDocument.orderStatus = orderStatus
      
        await orderDocument.save()
        res.status(200).send({status : true, msg : "order status updated"})
      }
      catch(error)
      {
          res.status(500).send({status:false,msg:error.message})
      }
  }

}








