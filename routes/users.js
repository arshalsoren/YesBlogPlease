const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');

// Express Validator Middleware
const { body, validationResult } = require('express-validator');
const { check } = require('express-validator');

// Bring in User models
let User = require('../models/user');

// Registration Form
router.get('/register', (req, res) => {
    res.render('register');
});

// Register Process
router.post('/register',
    check('name').not().isEmpty().withMessage('Name is required'),
    check('email').not().isEmpty().withMessage('Empty or Invalid Email Id'),
    check('username').not().isEmpty().withMessage('Username is required'),
    check('password').not().isEmpty().withMessage('Password is required'),
    body('password2').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('Password confirmation does not match password');
        }
        return true;
    }),

    // Get errors
    (req, res) => {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            // return res.json({ error: errors.array() });
            res.render('register', {
                errors: errors.array()
            });
        }
        else {
            const name = req.body.name;
            const email = req.body.email;
            const username = req.body.username;
            const password = req.body.password;

            let newUser = new User({
                name: name,
                email: email,
                username: username,
                password: password
            });

            // Turns Password into Hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) { console.log(err) }
                    newUser.password = hash;
                    newUser.save((err) => {
                        if (err) {
                            console.log(err);
                            return;
                        }
                        else {
                            req.flash('success', 'Account Created! Try to Log In');
                            res.redirect('/users/login');
                        }
                    });
                });
            });
        }
    }
);

// Login Form
router.get('/login', (req, res) => {
    res.render('login');
});

// Login Process
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

// Logout Process
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You are logged out!');
    res.redirect('/users/login');
});

module.exports = router;