const express = require("express");
const app = express();
const bodyParse = require('body-parser');
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const Comments = require('./models/comments');
const methodOverride = require('method-override')
const passport = require('passport');
const LocalStrategy = require('passport-local');
const passportLocalMongoose = require('passport-local-mongoose');
const expressSession = require('express-session');
const User = require('./models/user');
const commentsRoutes = require('./routes/comments')
const campgroundsRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/index')
const MemoryStore = require('memorystore')(expressSession)
const PORT = process.env.PORT || 3000
mongoose.connect("mongodb://localhost:27017/yelp_camp", { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
// mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://admin:Pr0grammerm@rc@yelpcamp.hdvmr.mongodb.net/YelpCamp?retryWrites=true&w=majority',
//   {
//     useUnifiedTopology: true,
//     useNewUrlParser: true,
//     useCreateIndex: true
//   }).then(() => {
//     console.log('Connected');
//   }).catch(err => {
//     console.log(err.message)
//   })
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.use(methodOverride('_method'));
// app.use(expressSession({
//   cookie: { maxAge: 86400000 },
//   store: new MemoryStore({
//     checkPeriod: 86400000 // prune expired entries every 24h
//   }),
//   secret: 'keyboard cat'
// }))


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
















app.listen(PORT, function () {
  console.log("listening");
});
