const express = require('express');
const router = express.Router();

// Express Validator Middleware
const { body, validationResult } = require('express-validator');
const { check } = require('express-validator');

// Bring in models
let Page = require('../models/page');


// Add New Page
router.get('/add', (request, response) => {
    response.render('add_page', {
        title: "Add Page"
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
            response.render('add_page', {
                title: 'Add Page',
                errors: errors.array()
            });
        }
        else {
            let page = new Page();
            page.title = request.body.title;
            page.author = request.body.author;
            page.body = request.body.body;

            page.save((err) => {
                if (err) {
                    console.log(err); return;
                }
                else {
                    request.flash('success', 'Page Added');
                    response.redirect('/');
                }
            });
        }
    });

// Load Edit Form
router.get("/edit/:id", (request, response) => {
    Page.findById(request.params.id, (err, page) => {
        response.render('edit_page', {
            title: 'Edit Title',
            page: page
        });
    });
});

// Update Submit POST Route
router.post('/edit/:id', (request, response) => {
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
            request.flash('success', 'Page Updated');
            response.redirect('/');
        }
    });
});

// Delete Page Route
router.delete('/:id', (request, response) => {
    let query = { _id: request.params.id }

    Page.deleteOne(query, (err) => {
        if (err) {
            console.log(err);
        }
        request.flash('success', 'Page Deleted');
        response.send('Success');
    });
});

// Get Single Page
router.get("/:id", (request, response) => {
    Page.findById(request.params.id, (err, page) => {
        response.render('page', {
            page: page
        });
    });
});

module.exports = router;