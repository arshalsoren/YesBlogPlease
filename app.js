const express = require('express');
const { networkInterfaces } = require('os');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect(config.database);
let db = mongoose.connection;

// Check connection
db.once('open', () => {
    console.log('Connected to MongoDB');
})

// Check for db errors
db.on('error', (err) => {
    console.log(err);
});

// Init App
const app = express();

// Bring in models
let Blog = require('./models/blog');

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

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true,
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', (req, res, next) => {
    res.locals.user = req.user || null;
    next();
});

// Home Route
app.get('/', (request, response) => {
    Blog.find({}, (err, blogs) => {
        if (err) {
            console.log(err);
        }
        else {
            response.render('index', {
                title: 'Blogs',
                blogs: blogs
            });
        }
    });

});

// Route Files
let blogs = require('./routes/blogs');
app.use('/blogs', blogs);
let users = require('./routes/users');
app.use('/users', users);

// Start Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log("Server started...")
});