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
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
app.set("view engine", "ejs");
seedDB();
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



app.get("/", function (req, res) {
  res.render("landing");
});
//index
app.get("/campgrounds", function (req, res) {
  Campground.find({}, (err, allCampgrounds) => {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/index", { campgrounds: allCampgrounds });
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
  res.render("campgrounds/new");
});
//show
app.get("/campgrounds/:id", function (req, res) {

  Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
    if (err) {
      console.log(err);
    } else {
      res.render("campgrounds/show", { campground: foundCampground });
    }

  });
  //=================
  //comments
  //=================
  app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
      if (err) {
        console.log(err)
      } else {
        console.log(foundCampground)
        res.render('comments/new', { campground: foundCampground })

      }
    })

  })

});
app.post("/campgrounds/:id/comments", isLoggedIn, function (req, res) {
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
      })

    }
  })
})

//auth
//register
app.get('/register', function (req, res) {
  res.render('register')
})
//add user
app.post('/register', function (req, res) {
  User.register({ username: req.body.username }, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      return res.render('register');
    } passport.authenticate('local')(req, res, function () {
      res.redirect('/campgrounds');
    })
  })
})
//login
app.get('/login', function (req, res) {
  res.render("login");
});
app.post('/login', passport.authenticate('local',
  {
    successRedirect: '/campgrounds',
    failureRedirect: '/login',
  }), function (req, res) {

  })
//logout
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/campgrounds');

})



function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } res.redirect('/login')
}




app.listen(3000, function () {
  console.log("listening");
});
