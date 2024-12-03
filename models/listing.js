// const mongoose = require("mongoose");
// const review = require("./review"); 
// const Schema = mongoose.Schema;

// const listingSchema = new Schema({
//   title: {
//     type: String,
//     required: true,
//   },
//   description: String,
//   image: {
//     filename: String,
//     url: String,
// },
//   price: Number,
//   location: String,
//   country: String,
//   reviews: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Review",
//     },
//   ],
//   owner: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//   },
// });

// listingSchema.post("findOneAndDelete", async(listing) => {
//   if(listing) {
//     await review.deleteMany({_id: { $in: listing.reviews }});
//   }
// });

// const Listing = mongoose.model("Listing", listingSchema);
// module.exports = Listing;

const mongoose = require("mongoose");
const Review = require("./review"); 
const { required } = require("joi");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    filename: {
      type: String,
      default: null, // Allows no filename initially
    },
    url: {
      type: String,
      default: "/path/to/default/image.png", // Fallback URL for missing images
    },
  },
  price: {
    type: Number,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  // category:{
  //   type: String,
  //   enum: ["mountains","Farms","etc"],
  // },
});

// Middleware: Cascade delete reviews if a listing is deleted
listingSchema.post("findOneAndDelete", async function (listing) {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// Virtual for displaying placeholder images
listingSchema.virtual("defaultImage").get(function () {
  return this.image?.url || "/path/to/default/image.png";
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
