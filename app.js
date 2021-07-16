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

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

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

// Get Single Page
app.get("/page/:id", (request, response) => {
    Page.findById(request.params.id, (err, page) => {
        response.render('page', {
            page: page
        });
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

// Load Edit Form
app.get("/page/edit/:id", (request, response) => {
    Page.findById(request.params.id, (err, page) => {
        response.render('edit_page', {
            title: 'Edit Title',
            page: page
        });
    });
});

// Update Submit POST Route
app.post('/pages/edit/:id', (request, response) => {
    let page = {};
    page.title = request.body.title;
    page.author = request.body.author;
    page.body = request.body.body;

    let query = { _id: request.params.id }

    Page.updateOne(query, page, (err) => {
        if (err) {
            console.log(err); return;
        }
        else {
            response.redirect('/');
        }
    });
});

// Delete Page Route
app.delete('/page/:id', (request, response) => {
    let query = { _id: request.params.id }

    Page.deleteOne(query, (err) => {
        if (err) {
            console.log(err);
        }
        response.send('Success');
    });
});

// Start Server
app.listen(3000, () => {
    console.log("Server started on 3000")
});