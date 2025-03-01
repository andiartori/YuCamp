if (process.env.NODE_ENV !== "production") {
	require("dotenv").config();
}

const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError");
const catchAsync = require("./utils/catchAsync");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");
const helmet = require("helmet");

const userRoutes = require("./routes/users");
const campgroundsRoutes = require("./routes/campgrounds");
const reviewsRoutes = require("./routes/reviews");
const dbUrl = process.env.DB_URL;
const mySecret = process.env.SECRET
const MongoStore = require("connect-mongo");


//This is local "mongodb://127.0.0.1:27017/yelp-camp"

mongoose
	.connect(dbUrl)
	.then(() => {
		console.log("MONGO CONNECTION SUCCESS");
	})
	.catch((err) => {
		console.log("Oh No Mongo connection is error");
		console.log(err);
	});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const store = MongoStore.create({
	mongoUrl: dbUrl,
	touchAfter: 24 * 60 * 60,
	crypto: {
		secret: mySecret,
	},
});

store.on("error", function (e) {
	console.error("Session store error: ", e);
});
const sessionConfig = {
	store,
	name: "session",
	secret: mySecret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		httpOnly: true,
		// secure : true,
		expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
		maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
	},
};
app.use(session(sessionConfig));

app.use(flash());

app.use(helmet());

const scriptSrcUrls = [
	"'self'",
	"'unsafe-inline'",
	"https://cdn.maptiler.com/",
	"https://cdn.jsdelivr.net/",
	"https://stackpath.bootstrapcdn.com/",
	"https://api.tiles.mapbox.com/",
	"https://api.maptiler.com/",
	"https://api.mapbox.com/",
	"https://kit.fontawesome.com/",
	"https://cdnjs.cloudflare.com/",
];

const styleSrcUrls = [
	"'self'",
	"'unsafe-inline'",
	"https://cdn.maptiler.com/",
	"https://cdn.jsdelivr.net/",
	"https://stackpath.bootstrapcdn.com/",
	"https://fonts.googleapis.com/",
	"https://cdnjs.cloudflare.com/",
];

const connectSrcUrls = [
	"'self'",
	"https://api.maptiler.com/",
	"https://a.tiles.mapbox.com/",
	"https://b.tiles.mapbox.com/",
	"https://events.mapbox.com/",
];

const imgSrcUrls = [
	"'self'",
	"data:",
	"blob:",
	"https://res.cloudinary.com/",
	"https://images.unsplash.com/",
	"https://api.maptiler.com/",
	"https://*.tile.openstreetmap.org/",
];

app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: [...scriptSrcUrls],
			scriptSrcElem: [...scriptSrcUrls],
			styleSrc: [...styleSrcUrls],
			styleSrcElem: [...styleSrcUrls],
			imgSrc: [...imgSrcUrls],
			connectSrc: [...connectSrcUrls],
			fontSrc: ["'self'", "https://fonts.gstatic.com/"],
			workerSrc: ["'self'", "blob:"], // ✅ Allow Web Workers
			childSrc: ["'self'", "blob:"], // ✅ Allow iframes & workers
		},
	})
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
	res.locals.currentUser = req.user;
	res.locals.success = req.flash("success");
	res.locals.error = req.flash("error");
	next();
});

app.use("/", userRoutes);
app.use("/campgrounds", campgroundsRoutes);
app.use("/campgrounds/:id/reviews", reviewsRoutes);
app.use(express.static("public"));

app.get("/", (req, res) => {
	res.render("home");
});

app.all("*", (req, res, next) => {
	next(new ExpressError("Page Not Found", 404));
});

app.use((err, req, res, next) => {
	const { statusCode = 500 } = err;
	if (!err.message) err.message = "Oh No Something Went Wrong!";
	res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
	console.log("Serving Server 3000");
});
