const express = require('express');
const router = express.Router();

// Express Validator Middleware
const { body, validationResult } = require('express-validator');
const { check } = require('express-validator');

// Bring in models
let Blog = require('../models/blog');


// Add New Blog
router.get('/add', (request, response) => {
    response.render('add_blog', {
        title: "Add Blog"
    });
})

// Add Submit POST Route
router.post('/add',
    check('title').not().isEmpty().withMessage('Title is required'),
    check('author').not().isEmpty().withMessage('Author is required'),
    check('body').not().isEmpty().withMessage('Body is required'),

    // Get Error
    (request, response) => {
        let errors = validationResult(request);
        if (!errors.isEmpty()) {
            response.render('add_blog', {
                title: 'Add Blog',
                errors: errors.array()
            });
        }
        else {
            let blog = new Blog();
            blog.title = request.body.title;
            blog.author = request.body.author;
            blog.body = request.body.body;

            blog.save((err) => {
                if (err) {
                    console.log(err); return;
                }
                else {
                    request.flash('success', 'Blog Added');
                    response.redirect('/');
                }
            });
        }
    });

// Load Edit Form
router.get("/edit/:id", (request, response) => {
    Blog.findById(request.params.id, (err, blog) => {
        response.render('edit_blog', {
            title: 'Edit Title',
            blog: blog
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id', (request, response) => {
    let blog = {};
    blog.title = request.body.title;
    blog.author = request.body.author;
    blog.body = request.body.body;

    let query = { _id: request.params.id }

    Blog.updateOne(query, blog, (err) => {
        if (err) {
            console.log(err); return;
        }
        else {
            request.flash('success', 'Blog Updated');
            response.redirect('/');
        }
    });
});

// Delete Blog Route
router.delete('/:id', (request, response) => {
    let query = { _id: request.params.id }

    Blog.deleteOne(query, (err) => {
        if (err) {
            console.log(err);
        }
        request.flash('success', 'Blog Deleted');
        response.send('Success');
    });
});

// Get Single Blog
router.get("/:id", (request, response) => {
    Blog.findById(request.params.id, (err, blog) => {
        response.render('blog', {
            blog: blog
        });
    });
});

module.exports = router;