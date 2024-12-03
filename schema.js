// const Joi = require('joi');

// module.exports.listingSchema = Joi.object({
//     listing : Joi.object({
//         title : joi.string().required(),
//         description: joi.string().required(),
//         location: joi.string().required(),
//         country: joi.string().required(),
//         price: joi.number().required().min(0),
//         image: joi.string().allow("", null),
//     }).required(),
// });
// const Joi = require('joi');

// module.exports.listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().required(),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//         price: Joi.number().required().min(0),
//         image: Joi.string().allow("", null),
//     }).required(),
// });
// schema.js

// const Joi = require("joi");
// const review = require("./models/review");

// const listingSchema = Joi.object({
//     listing: Joi.object({
//         title: Joi.string().required(),
//         description: Joi.string().allow(''),
//         image: Joi.object({
//             filename: Joi.string().required(),
//             url: Joi.string().uri().required()
//         }).required(),
//         price: Joi.number().required(),
//         location: Joi.string().required(),
//         country: Joi.string().required(),
//     }).required()
// });

// module.exports = { listingSchema };

// const reviewSchema = Joi.object({
//     review: Joi.object({
//         rating: Joi.number().required(),
//         comment: Joi.string().required(),
//     }).required()
// });
// module.exports = { reviewSchema };

const Joi = require("joi");

const listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().allow(''),
        image: Joi.object({
            filename: Joi.string().required(),
            url: Joi.string().uri().required()
        }).required(),
        price: Joi.number().required(),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required()
});

const reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required(),
        comment: Joi.string().required(),
    }).required()
});

// Export both schemas as a single object
module.exports = { listingSchema, reviewSchema };


