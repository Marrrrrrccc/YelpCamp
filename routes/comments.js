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
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect(`/campgrounds/${foundCampground._id}`);
                }
            });

        }
    });
});
router.get("/:comment_id/edit", checkCommentOwnership, function (req, res) {
    Comments.findById(req.params.comment_id, function (err, foundComment) {
        if (err) {
            res.redirect("back");
        } else {
            res.render("comments/edit",
                {
                    campground_id: req.params.id,
                    comment: foundComment
                })
        }

    })

})
router.put("/:comment_id", checkCommentOwnership, function (req, res) {
    Comments.findByIdAndUpdate(req.params.comment_id, req.body.comment, function (err, updatedComment) {
        if (err) {
            res.redirect("back")
        } else {
            res.redirect(`/campgrounds/${req.params.id}`)
        }
    })
})

//delete route
router.delete("/:comment_id", checkCommentOwnership, function (req, res) {
    Comments.findByIdAndDelete(req.params.comment_id, function (err, deletedComment) {
        if (err) {
            res.redirect("back")
        } else {
            res.redirect("back")
        }

    })
})
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } res.redirect('/login')
}
function checkCommentOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        Comments.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                res.redirect("back")
            } else {
                //otherwise redirect
                if (foundComment.author.id.equals(req.user._id)) {
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