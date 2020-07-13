const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Comments = require('../models/comments');
//=================
//comments
//=================
router.get("/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            res.render('comments/new', { campground: foundCampground })

        }
    })

})

router.post("/", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            Comments.create(req.body.comment, function (err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect(`/campgrounds/${foundCampground._id}`);
                }
            });

        }
    });
});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } res.redirect('/login')
}
module.exports = router;