const express = require("express");
const router = express.Router();
const expressError = require("../utilities/expressError");
const catchAsync = require("../utilities/catchAsync");
const joi = require("joi");
const Campground = require("../models/campground");
const { campDataSchema } = require("../utilities/schemas");
const { isLoggedIn } = require("../middleware");
const campgrounds = require("../controllers/campgrounds");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const validateCampground = (req, res, next) => {
	const { error } = campDataSchema.validate(req.body);
	if (error) {
		const msg = error.details.map((el) => el.message).join(",");
		throw new expressError(msg, 400);
	} else next();
};

//For the page that displays all the campgrounds in the database
//From the new page, to save new data to database
router
	.route("/")
	.get(catchAsync(campgrounds.index))
	.post(validateCampground, catchAsync(campgrounds.makeNew));

//For the page that lets us enter information about a new campground
router.get("/new", isLoggedIn, campgrounds.renderNew);

//For the page that shows details on one single campground
router
	.route("/:id")
	.get(catchAsync(campgrounds.show))
	.put(validateCampground, catchAsync(campgrounds.makeEdit))
	.delete(catchAsync(campgrounds.delete));

router.get("/:id/edit", catchAsync(campgrounds.renderEdit));

module.exports = router;
