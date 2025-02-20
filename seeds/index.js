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
	for (let i = 0; i < 300; i++) {
		const random1000 = Math.floor(Math.random() * 1000);
		const price = Math.floor(Math.random() * 20) + 10;
		const camp = new Campground({
			//YOUR USER ID
			author: "67b29e13c4856670030c751f",
			location: `${cities[random1000].city}, ${cities[random1000].state}`,
			title: `${sample(descriptors)} ${sample(places)}`,
			description:
				"Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!",
			price,
			geometry: {
				type: "Point",
				coordinates: [
					cities[random1000].longitude,
					cities[random1000].latitude,
				],
			},
			images: [
				{
					url: "https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ahfnenvca4tha00h2ubt.png",
					filename: "YelpCamp/ahfnenvca4tha00h2ubt",
				},
				{
					url: "https://res.cloudinary.com/douqbebwk/image/upload/v1600060601/YelpCamp/ruyoaxgf72nzpi4y6cdi.png",
					filename: "YelpCamp/ruyoaxgf72nzpi4y6cdi",
				},
			],
		});
		await camp.save();
	}
};

seedDB().then(() => {
	mongoose.connection.close();
});
