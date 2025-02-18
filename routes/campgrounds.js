const express = require("express");
const mongoose = require("mongoose");
const campgrounds = require("../controllers/campgrounds");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const { isLoggedIn, isAuthor, validateCampground } = require("../middleware");
router
	.route("/")
	.get(catchAsync(campgrounds.index))
	.post(
		isLoggedIn,
		upload.array("image"),
		validateCampground,
		catchAsync(campgrounds.createCampground)
	);
// .post(upload.array("image"), (req, res) => {
// 	try {
// 		console.log(req.body, req.files); // Debugging log
// 		res.send("IT Worked!");
// 	} catch (error) {
// 		console.error("Cloudinary Upload Error:", error);
// 		next(error);
// 	}
// });

router.get("/new", isLoggedIn, campgrounds.renderNewForm);

router
	.route("/:id")
	.get(catchAsync(campgrounds.showCampground))
	.put(
		isLoggedIn,
		isAuthor,
		upload.array("image"),
		validateCampground,
		catchAsync(campgrounds.updateCampground)
	)
	.delete(isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground));

router.get(
	"/:id/edit",
	isLoggedIn,
	isAuthor,
	catchAsync(campgrounds.renderEditForm)
);

module.exports = router;
