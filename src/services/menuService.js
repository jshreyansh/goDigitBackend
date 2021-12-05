
const userModel =require('../models/userModel')
const menuModel= require('../models/menuModel')

module.exports = {
    createMenu: (body, files, params, query) => {
        return new Promise(async (resolve, reject) => {
            
            let userId=body.userId
            let userData = await userModel.findOne({_id:userId})
            if(!userData){
                reject({"status": false, "code": 404, "msg": "user does not exist"})
            }
            const menu = body.menu 
            let newMenu=[]
            menu.forEach((item,index,arr)=>{
                let block={}
                if(item.category) block.category=item.category
                if(item.itemCount) block.itemCount=item.itemCount
                newMenu.push(block)
            })
            var menuData = new menuModel({
                userId:userId,
                menu:newMenu
            })
         

            menuData.save((err, saved)=>{
                if(err){
                    reject({"status": false, "code": 200, "msg": err})
                }else{
                    resolve({"status": true, "code": 200, "msg": saved})
                }
            })

        });
    },
}