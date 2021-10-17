const restaurantModel = require('../models/restaurant')


let createRestaurant = async function (req, res) {

    try {
        if (req.body) {
            let restaurant = await restaurantModel.create(req.body)
            res.status(201).send({ status: true, data: restaurant })
        } else {

            res.status(400).send({ status: false, msg: 'Request must contain a body' })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })
    }
}


let getRestaurants = async function (req, res) {//404 case
    try {
        const restaurants=await restaurantModel.find({isDeleted:false})  
        res.status(200).send({status : true , msg : 'restaurants list' ,data:restaurants})

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })

    }
}
let getOneRestaurant = async function (req, res) {//404 case
    try {
        let restaurantId = req.params.restaurantId
        const restaurant = await restaurantModel.findById({ _id: restaurantId, isDeleted: false });
 
        res.status(200).send({status : true , msg : 'Requested Restaurant Details' ,data:restaurant})

    } catch (error) {
        res.status(500).send({ status: false, msg: error.message })

    }
}

let updateDetails = async function(req,res)
{
      try {
          console.log(req.body)
        let rest = await restaurantModel.findOne({_id: req.params.restaurantID});

        if(req.body.name) rest.name = req.body.name;
        if(req.body.menu) rest.menu = req.body.menu;
        if(req.body.phone) rest.phone = req.body.phone;
        if(req.body.location) rest.location = req.body.location;
        rest.save();
        console.log(rest);
        res.status(201).send({ status: true, data: rest});

      }
      catch (error) {
        res.status(500).send({ status: false, msg: error.message })

    }
}

let updateCategory = async function(req,res)
{
    try{
         let restaurant = await restaurantModel.findOne({_id : req.params.restaurantID});
         let menu = restaurant.menu;
         let menuLength = menu.length;
         for(let i =0;i<menuLength;i++)
         {
             if(menu[i]._id = req.params.categoryID)
             {
                 let categoryObject = menu[i];
                 console.log(req.body.itemArray);
                 if(req.body.categoryName)  categoryObject.category = req.body.categoryName;
                 if(req.body.itemArray) {
                     for(let j=0;j<req.body.itemArray.length;j++)
                     {
                         categoryObject.items.push(req.body.itemArray[j]);
                     }
                }
                 break;
             }
         }
         restaurant.save();
         res.status(201).send({ status: true, data: restaurant});
    }
    catch (error){
        res.status(500).send({ status: false, msg: error.message })
    }
}

let updateItem = async function(req,res)
{
    try{
        let restaurant = await restaurantModel.findOne({_id : req.params.restaurantID});
        let menu = restaurant.menu;
        let menuLength = menu.length;
        for(let i =0;i<menuLength ; i++)
        {
            if(menu[i]._id = req.params.categoryID)
            {
                let itemList = menu[i].items;
                console.log(menu[i].items);
                console.log(itemList);
                for(let j=0;j<itemList.length;j++)
                {
                    console.log(itemList[j].name);
                    if(itemList[j].name = req.params.nameOfItem)
                    {
                        console.log("check");
                        if(req.body.itemName) itemList[j].name = req.body.itemName;
                        if(req.body.itemPrice) itemList[j].price = req.body.itemPrice;
                        break;
                    }
                }
                break;
            }
        }
        restaurant.save();
        res.status(201).send({ status: true, data: restaurant});

    }
    catch (error){
        res.status(500).send({ status: false, msg: error.message })
    }
}

let deleteCategory = async function(req,res)
{
    try{
        let restaurant = await restaurantModel.findOne({_id : req.params.restaurantID})
        let menu = restaurant.menu;
        console.log(menu);
        console.log(req.params.categoryName);
        for(let i = 0;i<menu.length;i++)
        {
            if(menu[i].category = req.params.categoryName)
            {
                menu.splice(i,1);
                break;
            }
        }
        console.log(menu);
        restaurant.save();
        res.status(201).send({status : true , data : restaurant});
    }
    catch(error){
        res.status(500).send({status : false , msg:error.message})
    }
}

let deleteItem = async function(req,res)
{
    try{
        let restaurant = await restaurantModel.findOne({_id : req.params.restaurantID})
        console.log("I am deleteingan item")
        let menu = restaurant.menu
        console.log(menu)
        for(let i=0;i<menu.length;i++)
        {
            console.log(menu[i].category)
            if(menu[i].category = req.params.categoryName)
            {
                let itemList = menu[i].items
                console.log(itemList)
                for(let j=0;j<itemList.length;j++)
                {
                    console.log(itemList[j].name)
                    if(itemList[j].name = req.params.itemName)
                    {
                        itemList.splice(j,1);
                        break;
                    }
                }
                break;
            }
        }
        restaurant.save();
        res.status(201).send({status : true, data : restaurant});
    }
    catch(error)
    {
        res.status(500).send({status : false, msg : error.message});
    }
}

module.exports.createRestaurant = createRestaurant
module.exports.getRestaurants = getRestaurants
module.exports.updateDetails = updateDetails
module.exports.updateCategory = updateCategory
module.exports.updateItem = updateItem
module.exports.deleteCategory = deleteCategory
module.exports.deleteItem = deleteItem
module.exports.getOneRestaurant = getOneRestaurant