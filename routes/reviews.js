const express = require("express");
const router = express.Router({ mergeParams: true });
const expressError = require("../utilities/expressError");
const catchAsync = require("../utilities/catchAsync");
const joi = require("joi");
const Campground = require("../models/campground");
const Review = require("../models/review");
const { reviewSchema } = require("../utilities/schemas");
const { isLoggedIn } = require("../middleware");
const controller = require("../controllers/reviews");

const validateReview = (req, res, next) => {
	const { error } = reviewSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new expressError(msg, 400);
	} else next();
};

router.post("/", validateReview, catchAsync(controller.addNew));

router.delete("/:rId", catchAsync(controller.delete));
module.exports = router;
