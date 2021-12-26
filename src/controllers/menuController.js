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
const itemModel=require('../models/itemModel')
const qrCode = require('qrcode')
const userModel = require('../models/userModel')
const lodash = require('lodash')

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
    getMenuWeb: async(req, res) => {
        try{git

            // const data = await menuService.createMenu(req.body, req.files, req.params, req.query)
            let userId=req.params.userId
          //  let menuData = await menuModel.findOne({userId:userId})
            let userData = await userModel.findOne({_id:userId})
            let itemsList = await itemModel.find({userId : userId})
            // console.log(itemsList)
            // const itemInCategory = lodash.groupBy(itemsList,categoryName)
            // console.log(itemInCategory)

            let itemInCategory = lodash.reduce(itemsList, (result, user) => {

                (result[user.categoryName] || (result[user.categoryName] = [])).push(user);
                return result;
            }, {});
            // console.log(itemInCategory)
            const menu=[]
            Object.keys(itemInCategory)
                .forEach(function eachKey(key) { 
                    let obj={}
                    obj.category=key
                    obj.items=itemInCategory[key]
                    menu.push(obj)
                })
            // console.log("menu",menu)
            if(menu){
                res.status(200).send({ status: true, data :menu, userdata :userData })
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
            const userId = req.params.userId
            const menuDocument = await menuModel.findOne({"userId":userId})
            if(!menuDocument)
            {
                return res.status(200).send({status:false,msg:"Menu not created yet"})
            }
            const url = "https://staging.d2qhyt7hxak6e8.amplifyapp.com/"
            const menuUrl=url+`stall/${userId}`
            
            const generatedQrCode = await qrCode.toString(url, {type: 'terminal'})
            //example image
            let example="https://picsum.photos/200"
            let example2=
            res.status(200).send({status:true,data:example,url:menuUrl})
      }
      catch(error){
          res.status(200).send({ status: false,msg :error.message })
      }
    },
    addItems : async(req,res) => {
        try{
            const body = req.body
            const userId = body.userId
            const menuId = body.menuId
            const categoryId = body.categoryId
            const items = body.itemArray
            let categoryName = ""

            const menuDocument = await menuModel.findOne({"userId" : userId})
            if(!menuDocument)
            {
                res.status(200).send({status:false,msg:"menu not created"})
            }
            else
            {
                let categoryExist = 0
                for(let i=0;i<menuDocument.menu.length;i++)
                {
                    if(categoryId == menuDocument.menu[i]._id)
                    {
                        categoryExist = 1
                        categoryName = menuDocument.menu[i].category
                        break
                    }
                }
                if(!categoryExist)
                {
                    res.status(200).send({status:false,msg:"category does not exist"})
                }
                else
                {
                    for(let i=0;i<items.length;i++)
                    {
                        const query = {"name":items[i].itemName,"userId":userId}
                        const itemDocument = await itemModel.findOne(query)
                        if(itemDocument)
                        {
                            res.status(200).send({status:false,msg:"Item with same name already exist"})
                            break
                        }
                        else
                        {
                            let itemData = new itemModel({
                                name : items[i].itemName,
                                price : items[i].itemPrice,
                                categoryName : categoryName,
                                userId : userId,
                                categoryId : categoryId
                            })
                            await itemData.save()
                        }
                    }
                    res.status(200).send({status:true,msg:"Items Added Successfully"})
                
                }
            }
            }
        catch(error){
            res.status(200).send({status:false,msg:error.message})
        }
    },
    editItem : async(req,res) => {
        try{
             const itemId = req.body.itemId
             const menuId = req.body.menuId
             const userId = req.body.userId
             const itemDocument = await itemModel.findOne({"_id" : itemId})
             const query = {"name":req.body.itemName,"userId":userId}
             const itemDocumentDuplicate = await itemModel.findOne(query)
              console.log(itemDocumentDuplicate._id)
              console.log(itemId)
              console.log(String(itemDocumentDuplicate._id) !== itemId,typeof itemId)
             if(itemDocumentDuplicate && String(itemDocumentDuplicate._id) !== itemId)
             {
                 return res.status(200).send({status:false,msg:"Item with same name already exist"})
             }
             if(!itemDocument)
             {
                 return res.status(200).send({status:false,msg:"Item Does not exist"})
             }
             else
             {
               
                 if(req.body.itemName)
                 {
                     itemDocument.name = req.body.itemName
                 }
                 if(req.body.itemPrice)
                 {
                     itemDocument.price = req.body.itemPrice
                 }
                 await itemDocument.save()
                 return res.status(200).send({status:true,msg:"Item Updated"})
            }
        }
        catch(error){
            return res.status(200).send({status:false,msg:error.message})
        }
    },
    deleteItem : async(req,res) => {
        try{
             const itemId = req.body.itemId
             await itemModel.deleteOne({"_id":itemId})
             return res.status(200).send({status:true,msg:"Item Deleted Successfully"})
        }
        catch(error)
        {
            return res.status(200).send({status:false,msg:error.message})
        }
    },
    getCategoryItem : async(req,res) => {
        try{
               const userId = req.params.userId
               const categoryId = req.params.categoryId
               const menuDocument = await menuModel.findOne({"userId" : userId})
               
               if(!menuDocument)
               {
                   return res.status(200).send({status:false,msg:"Menu is not created yet"})
               }
               else
               {
                   for(let i=0;i<menuDocument.menu.length;i++)
                   {
                       if(categoryId==menuDocument.menu[i]._id)
                       {
                             const items = await itemModel.find({"userId":userId,"categoryId":categoryId})
                             return res.status(200).send({status:true,data:items})
                             break
                       }
                   }   
               }
               return res.status(200).send({status:false,msg:"category not found"})
        }
        catch(error)
        {
            return res.status(200).send({status:false,msg:error.message})   
        }
    }
}

