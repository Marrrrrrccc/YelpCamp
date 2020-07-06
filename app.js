const express = require("express");
const app = express();
const bodyParse = require('body-parser');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const seedDB = require('./seeds');

mongoose.connect("mongodb://localhost:27017/yelp_campv2", { useNewUrlParser: true, useUnifiedTopology: true });




app.set("view engine", "ejs");
seedDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get("/", function (req, res) {
  res.render("landing");
});
//index
app.get("/campgrounds", function (req, res) {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("index", { campgrounds: allCampgrounds });
    }
  });

});
//create
app.post("/campgrounds", function (req, res) {
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
app.get("/campgrounds/new", function (req, res) {
  res.render("new.ejs");
});
//show
app.get("/campgrounds/:id", function (req, res) {

  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    console.log(foundCampground)
    if (err) {
      console.log(err);
    } else {
      res.render("show", { campground: foundCampground });
    }

  });

})
app.listen(3000, function () {
  console.log("listening");
});
