const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');
router.get("/", function (req, res) {
    res.render("landing");
});
//auth
//register
router.get('/register', function (req, res) {
    res.render('register')
})
//add user
router.post('/register', function (req, res) {
    User.register({ username: req.body.username }, req.body.password, function (err, user) {
        if (err) {
            console.log(err);
            return res.render('register');
        } passport.authenticate('local')(req, res, function () {
            res.redirect('/campgrounds');
        })
    })
})
//login
router.get('/login', function (req, res) {
    res.render("login");
});
router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/campgrounds',
        failureRedirect: '/login',
    }), function (req, res) {

    })
//logout
router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/campgrounds');

})
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } res.redirect('/login')
}
module.exports = router;