const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
	heading: String,
	rating: Number,
	body: String,
	user: String,
});

module.exports = mongoose.model("Review", ReviewSchema);
