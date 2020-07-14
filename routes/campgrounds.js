const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
//index
router.get("/", function (req, res) {
    Campground.find({}, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: allCampgrounds });
        }
    });

});
//create
router.post("/", isLoggedIn, function (req, res) {
    console.log(req.user);
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    const newCampground = {
        name: name,
        image: image,
        description: description,
        author: author
    };
    Campground.create(newCampground, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            console.log(allCampgrounds);
            res.redirect("/campgrounds");
        }
    });

});//new
router.get("/new", isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});
//show
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
        if (err) {
            console.log(err)
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } res.redirect('/login')
}
module.exports = router;
