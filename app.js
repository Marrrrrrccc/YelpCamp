const express = require("express");
const app = express();
const bodyParse = require('body-parser');
const bodyParser = require("body-parser");
const campgrounds = [
  {
    name: "Salmon Creek",
    image: "https://www.photosforclass.com/download/px_1687845",
  },
  {
    name: "Granite hill",
    image: "https://www.photosforclass.com/download/px_699558",
  },
  {
    name: "Mountain Goat's rest",
    image: "https://www.photosforclass.com/download/px_1061640",
  },

];

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.get("/", function (req, res) {
  res.render("landing");
});
app.get("/campgrounds", function (req, res) {

  res.render("campgrounds", { campgrounds, campgrounds });
});
app.post("/campgrounds", function (req, res) {
  const name = req.body.name;
  const image = req.body.image;
  const newCampground = {
    name: name,
    image: image
  };
  campgrounds.push(newCampground);
  res.redirect("/campgrounds");
});
app.get("/campgrounds/new", function (req, res) {
  res.render("new.ejs");
});

app.listen(3000, function () {
  console.log("listening");
});
