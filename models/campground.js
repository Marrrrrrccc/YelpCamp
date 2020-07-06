const mongoose = require('mongoose');
const campgroundShecma = mongoose.Schema({
    name: String,
    image: String,
    description: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        }
    ]
});

const Campground = mongoose.model("Campground", campgroundShecma);
module.exports = Campground;