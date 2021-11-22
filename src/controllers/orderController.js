const ordersModel = require('../models/ordersModel')
const userModel = require('../models/userModel')

let createOrder = async function(req,res){
    
    try{
          const body = req.body
          let itemsPlaced = body.items
          let stallId = body.stallId
          let totalCost = body.totalCost
          let query = {_id : stallId}
          const userDocument = await userModel.findOne(query)
          let orderNumber = userDocument.totalOrdersPlaced + 1
          var newOrder = new ordersModel({
              itemsPlaced : itemsPlaced,
              stallId : stallId,
              totalCost : totalCost,
              orderNumber : orderNumber
          })
          let result = await newOrder.save()
          res.send(result)
    }
    catch(error)
    {
        res.status(500).send({status:false,msg:error.message})
    }
}

let getOrderList = async function(req,res){
    try{
        const body = req.body
        let query = {_id : stallId}
        const allOrders = await ordersModel.find(query)
        res.send(allOrders)
    }
    catch(error)
    {
        res.status(500).send({status:false , msg : error.message })
    }
}

module.exports.createOrder = createOrder
module.exports.getOrderList = getOrderList



