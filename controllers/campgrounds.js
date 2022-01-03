const Campground = require("../models/campground");

module.exports.index = async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNew = (req, res) => {
	res.render("campgrounds/new");
};

module.exports.makeNew = async (req, res, next) => {
	//if (!req.body.campground) throw new expressError("Insufficient data", 400);
	const campground = new Campground(req.body.campground);
	campground.author = req.user._id;
	await campground.save();
	req.flash("success", "Successfully made a new Campground!");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.show = async (req, res) => {
	const campground = await Campground.findById(req.params.id).populate(
		"reviews"
	);
	if (!campground) {
		req.flash("error", "Cannot find campground");
		res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", { campground });
};

module.exports.renderEdit = async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	console.log(campground);
	res.render("campgrounds/edit", { campground });
};

module.exports.makeEdit = async (req, res) => {
	const campground = await Campground.findByIdAndUpdate(req.params.id, {
		...req.body.campground,
	});
	console.log(campground);
	req.flash("success", "Successfully updated Campground!");
	res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.delete = async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id);
	req.flash("success", "Successfully deleted Campground!");
	res.redirect(`/campgrounds`);
};
