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
//edit
router.get("/:id/edit", checkCampgroundOwnership, function (req, res) {
    //is user loggged in

    Campground.findById(req.params.id, function (err, foundCampground) {

        res.render("campgrounds/edit", { foundCampground: foundCampground })
    })

})
//update
router.put("/:id", function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    })
})
//delete route
router.delete('/:id', function (req, res) {
    Campground.findByIdAndDelete(req.params.id, req.body.campground, function (err, deleted) {
        if (err) {
            console.log(err);
        } else {
            res.redirect(`/campgrounds`)
        }
    })
})
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } res.redirect('/login')
}
function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                res.redirect("back")
            } else {
                //otherwise redirect
                if (foundCampground.author.id.equals(req.user._id)) {
                    next()
                } else {
                    res.redirect("back")
                }

            }

        })

    } else {
        res.redirect("back")
    }
}
module.exports = router;
