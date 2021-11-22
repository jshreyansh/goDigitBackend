const menuModel = require('../models/menuModel')
const userModel = require('../models/userModel')
const mongoose = require('mongoose')

let createMenu = async function(req,res) {

    try{
        const body = req.body
        if(body){
            let userId = body.userId
            let menu = body.menu
            let query = {userId : userId}
            let menuexist = await menuModel.findOne(query)
            if(menuexist)
            {
                menuexist.menu = menu
                res.send(menuexist)
            }
            else
            {
                var newMenu = new menuModel({
                    userId : userId,
                    menu : menu
                })
                let result = await newMenu.save()
                let user = await userModel.findOne({'_id' : userId})
                user.menuCreated = true
                await user.save()
                res.send(result)
            }
        }
    }catch(error)
    {
        res.status(500).send({status:false,msg:error.message})
    }
}

let getMenu = async function(req,res){
    try{
         const body = req.body
         const userId = body.userId
         let menuExist = await menuModel({userId:userId})
         if(!menuExist)
         {
             res.send("Stall not uploaded their menu yet")
         }
         else
         {
             res.send(menuExist)
         }
    }
    catch(error){
        res.status(500).send({status:false,msg:error.message})
    }
}

module.exports.createMenu = createMenu
module.exports.getMenu = getMenu

