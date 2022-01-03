const Campground = require("../models/campground");
const Review = require("../models/review");

module.exports.addNew = async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	const review = new Review(req.body.review);
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash("success", "Successfully added a new Review!");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.delete = async (req, res) => {
	await Campground.findByIdAndUpdate(req.params.id, {
		$pull: { reviews: req.params.rId },
	});
	await Review.findByIdAndDelete(req.params.rId);
	req.flash("success", "Successfully deleted Review");
	res.redirect(`/campgrounds/${req.params.id}`);
};
