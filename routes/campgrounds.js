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
router.post("/", function (req, res) {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description
    const newCampground = {
        name: name,
        image: image,
        description: description,
    };
    Campground.create(newCampground, (err, allCampgrounds) => {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });

});//new
router.get("/new", function (req, res) {
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
module.exports = router;
