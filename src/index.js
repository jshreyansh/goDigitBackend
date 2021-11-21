const route = require('./routes/route.js');
const express = require('express');
const app = express();
var multer=require('multer')

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer().any())
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://dbshreyansh:17Je003188$@cluster0.egjhg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true})
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))
app.use('/', route);
app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});