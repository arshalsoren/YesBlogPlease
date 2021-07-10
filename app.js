const express = require('express');
const { networkInterfaces } = require('os');
const path = require('path');

// Init App
const app = express();

// Load View Engine
app.set('views',path.join(__dirname,'views'));
app.set('view engine', 'pug');

// Home Route
app.get('/', (request, response) => {
    let newPage=[
        {
            id:1,
            title:"Blog #1",
            author:"John Doe",
            body:"Welcome to my blog one"
        },
        {
            id:2,
            title:"Blog #2",
            author:"Edgar Allan Poe",
            body:"Welcome to my blog two"
        },
        {
            id:3,
            title:"Blog #3",
            author:"Elton JOhn",
            body:"Welcome to my blog three"
        }
    ]
    response.render('index', {
        title:"Blogs",
        pages:newPage
    });
});

// Add New Page
app.get('/pages/new',(request, response)=>{
    response.render('new_page1', {
        title:"New Page #1"
    });
})


// Start Server
app.listen(3000, ()=>{
console.log("Server started on 3000")
});