const express = require("express");
const app = express();
const bodyParse = require('body-parser');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });

const campgroundShecma = mongoose.Schema({
  name: String,
  image: String,
  description: String,
});

const Campground = mongoose.model("Campground", campgroundShecma);
// Campground.create({
//   name: "Marc hill",
//   image: "https://www.photosforclass.com/download/px_699558",
//   description: "This is marc hill"
// }, (err, campground) => {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(campground);
//   }
// });

app.set("view engine", "ejs");
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

  Campground.findById(req.params.id, (err, foundCampground) => {
    if (err) {
      console.log(err);
    } else {
      res.render("show", { foundCampground: foundCampground });
    }
  });

})
app.listen(3000, function () {
  console.log("listening");
});
