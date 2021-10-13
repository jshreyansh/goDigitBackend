const express = require('express');
const router = express.Router();
const restaurantapi = require('../controller/restaurantapi')

router.post('/api/restaurants',restaurantapi.createRestaurant)
router.get('/api/getrestaurants',restaurantapi.getRestaurants)
router.get('/api/restaurant/:restaurantId',restaurantapi.getOneRestaurant)
router.put('/api/:restaurantID',restaurantapi.updateDetails)
router.put('/api/:restaurantID/:categoryID',restaurantapi.updateCategory)
router.put('/api/:restaurantID/:categoryID/:nameOfItem',restaurantapi.updateItem)
router.delete('/api/:restaurantID/:categoryName',restaurantapi.deleteCategory)
router.delete('/api/:restaurantID/:categoryName/:itemName',restaurantapi.deleteItem)
// router.delete('api/:restaurantID',function(req, res){
//     res.send('teehee')
// })

module.exports = router