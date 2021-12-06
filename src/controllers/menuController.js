// const menuModel = require('../models/menuModel')
// const userModel = require('../models/userModel')
// const mongoose = require('mongoose')

// let createMenu = async function(req,res) {

//     try{
//         const body = req.body
//         if(body){
//             let userId = body.userId
//             let menu = body.menu
//             let query = {userId : userId}
//             let menuexist = await menuModel.findOne(query)
//             if(menuexist)
//             {
//                 menuexist.menu = menu
//                 res.send(menuexist)
//             }
//             else
//             {
//                 var newMenu = new menuModel({
//                     userId : userId,
//                     menu : menu
//                 })
//                 let result = await newMenu.save()
//                 let user = await userModel.findOne({'_id' : userId})
//                 user.menuCreated = true
//                 await user.save()
//                 res.send(result)
//             }
//         }
//     }catch(error)
//     {
//         res.status(500).send({status:false,msg:error.message})
//     }
// }

// let getMenu = async function(req,res){
//     try{
//          const body = req.body
//          const userId = body.userId
//          let menuExist = await menuModel({userId:userId})
//          if(!menuExist)
//          {
//              res.send("Stall not uploaded their menu yet")
//          }
//          else
//          {
//              res.send(menuExist)
//          }
//     }
//     catch(error){
//         res.status(500).send({status:false,msg:error.message})
//     }
// }

// module.exports.createMenu = createMenu
// module.exports.getMenu = getMenu

const menuService = require('../services/menuService');
const menuModel=require('../models/menuModel')
const qrCode = require('qrcode')

module.exports = {
    createMenu: async(req, res) => {
        try{

            const data = await menuService.createMenu(req.body, req.files, req.params, req.query)
            if(data.status){
                res.status(200).send({ status: true,message :"categories created" })
            }
            else{
                res.status(200).send({ status: false,message :data.msg })

            }
        }catch(err){
            res.status(200).send({ status: false,msg :"bad request,fill the fields properly" })

        }
    },
    getMenu: async(req, res) => {
        try{

            // const data = await menuService.createMenu(req.body, req.files, req.params, req.query)
            let userId=req.params.userId
            let menuData = await menuModel.findOne({userId:userId})
            if(menuData){
                res.status(200).send({ status: true,data :menuData.menu })
            }
            else{
                res.status(200).send({ status: false,message :"menu not found" })

            }
        }catch(err){
            res.status(200).send({ status: false,msg :"bad request" })

        }
    },
     deleteCategory: async(req, res) => {
         try{
             console.log("adas")

             // const data = await menuService.createMenu(req.body, req.files, req.params, req.query)
             let userId=req.body.userId
             let categoryId=req.body.categoryId
             let menuData = await menuModel.findOne({userId:userId})
             console.log("hello101")
             if(!menuData){
                 res.status(200).send({ status: false,data :"menu not found" })
             }
             let menu = menuData.menu
             for(let i=0;i<menu.length;i++)
             {
                    if(menu[i]._id == categoryId)
                    {
                        menu.splice(i,1);
                       break;
                   }
            }
            menuData.menu = menu
            console.log("hello102")

            menuData.save()
            res.status(200).send({status:true,msg : "Category Deleted Successfully"})
            
        }catch(err){
            res.status(200).send({ status: false,msg :err })

        }
    },
     editCategory: async(req, res) => {
        try{
            console.log("adas")

            // const data = await menuService.createMenu(req.body, req.files, req.params, req.query)
            let userId=req.body.userId
            let categoryId=req.body.categoryId
            let menuData = await menuModel.findOne({userId:userId})
            console.log("hello101")
            if(!menuData){
                res.status(200).send({ status: false,data :"menu not found" })
            }
            const body = req.body
            if(!body.category || !body.itemCount)
            {
                res.status(200).send({status: false, msg : "Name and No. of items cannot be empty"})
            }
            let menu = menuData.menu
            let checkNameAlreadyExist = 0
            for(let i=0;i<menu.length;i++)
            {
                if(menu[i].category == body.category)
                {
                    checkNameAlreadyExist = 1
                }
            }
            if(checkNameAlreadyExist)
            {
                res.status(200).send({status:false,msg : "Category Already Exist"})
            }
            else
            {
                for(let i=0;i<menu.length;i++)
                {
                    if(menu[i]._id == categoryId)
                    {
                        menu[i].category = body.category
                        menu[i].itemCount = body.itemCount
                    }
                }
            }

            menuData.menu = menu
            console.log("hello102")

            menuData.save()
            res.status(200).send({status:true,msg : "Category updated Successfully"})
            
        }catch(err){
            res.status(200).send({ status: false,msg :err })

        }

    },
    generateQrCode: async(req,res) => {
        try{
              const menuId = req.body.menuId
              if(!menuId)
              {
                  res.status(200).send({status:false,msg:"MenuId Required"})
              }
              const url = "https://staging.d1a8d9f0os5aqd.amplifyapp.com/"
              const generatedQrCode = await qrCode.toString(url, {type: 'terminal'})
              res.status(200).send({status:true,data:generatedQrCode})
        }
        catch(error){
            res.status(200).send({ status: false,msg :error.message })
        }
    }
}

// 61ac7492997df707a93177b7
// 61ac7a6167321c0e031cfbd0

