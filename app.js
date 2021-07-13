const express = require('express');
const { networkInterfaces } = require('os');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/backend-node');
let db = mongoose.connection;

// Check connection
db.once('open', () => {
    console.log('connected to mongoDB');
})

// Check for db errors
db.on('error', (err) => {
    console.log(err);
});

// Init App
const app = express();

// Bring in models
let Page = require('./models/page');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// body parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// Home Route
app.get('/', (request, response) => {
    Page.find({}, (err, pages) => {
        if (err) {
            console.log(err);
        }
        else {
            response.render('index', {
                title: 'Pages',
                pages: pages
            });
        }
    });

});

// Add New Page
app.get('/pages/add', (request, response) => {
    response.render('add_page', {
        title: "Add Page"
    });
})

// Add Submit POST Route
app.post('/pages/add', (request, response) => {
    let page = new Page();
    page.title = request.body.title;
    page.author = request.body.author;
    page.body = request.body.body;

    page.save((err) => {
        if (err) {
            console.log(err); return;
        }
        else {
            response.redirect('/');
        }
    });
});


// Start Server
app.listen(3000, () => {
    console.log("Server started on 3000")
});