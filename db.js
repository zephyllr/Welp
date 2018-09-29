const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const Tips = new Schema({
    text: String,
    date: String,
    likes: Number,
    business_id: String,
    user_id: String
});

const Businesses = new Schema({
    business_id: String,
    name: String,
    neighborhood: String,
    address: String,
    city: String,
    state: String,
    postcal_code: String,
    latitude: Number,
    longitude: Number,
    stars: Number,
    review_count: Number,
    is_open: Number,
    attributes: Object,
    categories: String,
    hours: Object
});

const CheckIns = new Schema({
    time: Object,
    business_id: String
});

mongoose.model("Tip", Tips);
mongoose.model("Business", Businesses);
mongoose.model("Checkin", CheckIns);

mongoose.connect("mongodb://localhost:27017/yelpdataset", { useNewUrlParser: true });