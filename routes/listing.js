const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

//index Route & Create Route
router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,  upload.single("listing[image][url]"), wrapAsync(listingController.createListing));

//new route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//show route, Update route & DELETE ROUTE 
router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,
    isOwner,
    upload.single("image"), // Expect "image" as the form field name
    validateListing,
    wrapAsync(listingController.updateListing)
)
// .put(isLoggedIn, isOwner, upload.single("listing[image][url]"), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));
 
//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.renderEdirForm));

module.exports = router;