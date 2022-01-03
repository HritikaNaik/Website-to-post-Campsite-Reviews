const express = require("express");
const router = express.Router();
const User = require("../models/user");
const catchAsync = require("../utilities/catchAsync");
const passport = require("passport");

router.get("/register", (req, res) => {
	res.render("users/register");
});

router.post(
	"/register",
	catchAsync(async (req, res, next) => {
		try {
			const { email, username, password } = req.body.user;
			const user = new User({ email, username });
			const registeredUser = await User.register(user, password);
			//console.log(registeredUser);
			req.login(registeredUser, (e) => {
				if (e) return next(e);
			});
			req.flash("success", "Welcome " + username);
			res.redirect("/campgrounds");
		} catch (err) {
			req.flash("error", err.message);
			res.redirect("register");
		}
	})
);

router.get("/login", (req, res) => {
	res.render("users/login");
});

router.post(
	"/login",
	passport.authenticate("local", {
		failureFlash: true,
		failureRedirect: "/login",
	}),
	(req, res) => {
		req.flash("success", "Welcome back, " + req.body.username);
		res.redirect("/campgrounds");
	}
);

router.get("/logout", (req, res) => {
	req.logout();
	req.flash("success", "You have logged out");
	res.redirect("/");
});

module.exports = router;
