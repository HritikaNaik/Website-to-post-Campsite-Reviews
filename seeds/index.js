const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

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
const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedBD = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 250; i++) {
		const randomCity = Math.ceil(Math.random() * 1000);
		const price = 300 + Math.floor(Math.random() * 900);
		const camp = new Campground({
			title: `${sample(descriptors)} ${sample(places)}`,
			location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
			image: "https://source.unsplash.com/collection/483251",
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Nulla obcaecati ut facere, recusandae accusamus officia sit ab necessitatibus, enim, quasi nihil? Unde, consequatur voluptates placeat doloribus minima id quam repellat? Cum voluptate quos mollitia illo adipisci, molestias sunt accusamus? Quo voluptate soluta explicabo, quisquam praesentium provident ut quia voluptatibus facilis. Ab veniam neque quis enim pariatur vero qui laudantium illo? Eveniet autem repudiandae facilis dolorem ratione non obcaecati voluptatum dolore ea odit, minima nemo eos aliquid sit laboriosam praesentium. Quisquam voluptate magnam iusto quasi, debitis animi! Doloribus inventore odio unde!",
			price: price,
		});
		await camp.save();
	}
};
seedBD().then(() => mongoose.connection.close());
