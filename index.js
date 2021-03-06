if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const joi = require("joi");
const methodOverride = require("method-override");
const expressError = require("./utilities/expressError");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localStrategy = require("passport-local");

const campgroundRoutes = require("./routes/campgrounds");
const reviewRoutes = require("./routes/reviews");
const userRoutes = require("./routes/user");
const User = require("./models/user");
const mongoSanitize = require("express-mongo-sanitize");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const sessionCofig = {
	secret: "mysteriousStuff",
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		expires: Date.now() + 3000,
		maxAge: 3000,
	},
};
app.use(session(sessionCofig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/reviews", reviewRoutes);
app.use("/", userRoutes);

//For going to the main page
app.get("/", (req, res) => {
	//res.send("Hello from YelpCamp");
	res.render("home");
});

app.all("*", (req, res, next) => {
	next(new expressError("Bleep! PAGE NOT FOUND", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Mayday!";
	console.log(err);
	res.status(statusCode).render("campgrounds/error", { err }); //(message);
});

app.listen(3000, () => {
	console.log("Hello from port 3000");
});
