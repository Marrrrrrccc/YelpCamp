const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", function (req, res) {
  res.render("landing");
});
app.get("/campgrounds", function (req, res) {
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
  res.render("campgrounds", { campgrounds, campgrounds });
});

app.listen(3000, function () {
  console.log("listening");
});
