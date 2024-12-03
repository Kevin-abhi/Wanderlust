const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const { query } = require("express");
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews", populate: {path: "author",}, }).populate("owner");
    if(!listing) {
     req.flash("error", "Listing you requested for does not exist!");
     res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient.forwardGeocode({query: req.body.listing.location, limit:1,}).send();

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {url, filename};

    newListing.geometry = response.body.features[0].geometry;

    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};


module.exports.renderEdirForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
};


// module.exports.updateListing = async (req, res) => {
//     let { id } = req.params;
//     const updatedListing = {
//         title: req.body.listing.title,
//         description: req.body.listing.description,
//         image: {
//             filename: req.body.listing.image.filename,
//             url: req.body.listing.image.url 
//         },
//         price: req.body.listing.price,
//         location: req.body.listing.location,
//         country: req.body.listing.country
//     };
//     let listing = await Listing.findByIdAndUpdate(id, updatedListing);
//     if(typeof req.file != "undefined"){
//         let url = req.file.path;
//         let filename = req.file.filename;
//         listing.image = { url, filename };
//         await listing.save();
//     }
    
//     req.flash("success", "Listing Updated!");
//     res.redirect(`/listings/${id}`);
// };
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    
    // Fetch current listing
    let listing = await Listing.findById(id);
    
    // Update fields except image
    listing.title = req.body.listing.title;
    listing.description = req.body.listing.description;
    listing.price = req.body.listing.price;
    listing.location = req.body.listing.location;
    listing.country = req.body.listing.country;

    // If a new file is uploaded, replace the old image
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    
    await listing.save();

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};



module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}