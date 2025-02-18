const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");

mongoose
	.connect("mongodb://127.0.0.1:27017/yelp-camp")
	.then(() => {
		console.log("MONGO CONNECTION SUCCESS");
	})
	.catch((err) => {
		console.log("Oh No Mongo connection is error");
		console.log(err);
	});

//this is to pick our array value randomnly from seed.helpers

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
	await Campground.deleteMany({});
	for (let i = 0; i < 50; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			author: "67b29e13c4856670030c751f",
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
			price,
			images: [
				{
					url: "https://res.cloudinary.com/dejm00p07/image/upload/v1739864987/YelpCamp/rrcb72wz0jrchnnpwm0e.jpg",
					filename: "YelpCamp/rrcb72wz0jrchnnpwm0e",
				},
				{
					url: "https://res.cloudinary.com/dejm00p07/image/upload/v1739864982/YelpCamp/k5xsroxt9qz3og1y5uqk.png",
					filename: "YelpCamp/k5xsroxt9qz3og1y5uqk",
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
