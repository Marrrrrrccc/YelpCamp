const express = require("express");
const app = express();
const bodyParse = require('body-parser');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comments = require('./models/comments');
const seedDB = require('./seeds');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const expressSession = require('express-session');
const User = require('./models/user');
const commentsRoutes = require('./routes/comments')
const campgroundsRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/index')
// mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connect('mongodb+srv://admin:Pr0grammerm@rc@yelpcamp.hdvmr.mongodb.net/YelpCamp?retryWrites=true&w=majority',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  }).then(() => {
    console.log('Connected');
  }).catch(err => {
    console.log(err.message)
  })
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));


//passport configuration
app.use(expressSession(
  {
    secret: "Marc",
    resave: false,
    saveUninitialized: false,
  }
))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
})
app.use(indexRoutes);
app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/comments', commentsRoutes);
















app.listen(3000, function () {
  console.log("listening");
});
