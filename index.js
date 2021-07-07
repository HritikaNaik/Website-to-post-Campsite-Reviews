const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
const Campground = require("./models/campground");

mongoose.connect("mongodb://localhost:27017/yelp-camp", {
	useNewUrlParser: true,
	useCreateIndex: true,
	useUnifiedTopology: true,
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

//For going to the main page
app.get("/", (req, res) => {
	//res.send("Hello from YelpCamp");
	res.render("home");
});

//For the page that displays all the campgrounds in the database
app.get("/campgrounds", async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
});

//For the page that lets us enter information about a new campground
app.get("/campgrounds/new", (req, res) => {
	res.render("campgrounds/new");
});

//From the new page, to save new data to database
app.post("/campgrounds", async (req, res) => {
	const campground = new Campground(req.body.campground);
	await campground.save();
	res.redirect(`/campgrounds/${campground._id}`);
});

//For the page that shows details on one single campground
app.get("/campgrounds/:id", async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	//console.log(campground);
	res.render("campgrounds/show", { campground });
});

app.get("/campgrounds/:id/edit", async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	console.log(campground);
	res.render("campgrounds/edit", { campground });
});

app.put("/campgrounds/:id", async (req, res) => {
	const campground = await Campground.findByIdAndUpdate(req.params.id, {
		...req.body.campground,
	});
	console.log(campground);
	res.redirect(`/campgrounds/${campground._id}`);
});

app.delete("/campgrounds/:id", async (req, res) => {
	await Campground.findByIdAndDelete(req.params.id);
	res.redirect(`/campgrounds`);
});

app.listen(3000, () => {
	console.log("Hello from port 3000");
});