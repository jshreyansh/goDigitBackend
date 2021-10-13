// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

const route = require('./routes/route.js');
const express = require('express');
const app = express();
const restaurantapi = require('./controller/restaurantapi');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const mongoose = require('mongoose')
mongoose.connect("mongodb+srv://dbshreyansh:17Je003188$@cluster0.egjhg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority", {useNewUrlParser: true})
    .then(() => console.log('mongodb running on 27017'))
    .catch(err => console.log(err))
app.use('/',route );

app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});

