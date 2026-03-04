const Listing = require("./models/listing");
const Review = require("./models/review");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");
const { reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req ,res, next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error","you must login to create listing");
        return res.redirect("/login");
    }
    return next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async (req, res, next) =>{
    let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You are not owner of this listing");
        return res.redirect(`/listings/${id}`);
    };
    return next();

};

module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
   if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
   }else {
    return next();
   }
};

module.exports.validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
   if(error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
   }else {
    return next();
   }
};

module.exports.isReviewAuthor = async (req, res, next) =>{
    let{id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review){
        req.flash("error", "Review does not exist");
        return res.redirect(`/listings/${id}`);
    }
    if(!review.author || !review.author.equals(req.user._id)){
        req.flash("error", "You are not author of this review");
        return res.redirect(`/listings/${id}`);
    };
    return next();

};
