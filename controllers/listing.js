const Listing = require("../models/listing.js")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

//index route
module.exports.index = async (req,res) =>{
    const allListings = await Listing.find({});
   return res.render("listings/index.ejs",{allListings});
}

//new route 
module.exports.renderNewForm = (req,res) => {
    return res.render("listings/new.ejs");
};

//show route
module.exports.showListing =async (req,res) =>{
    let{id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate:{
             path:"author"},
        })
    .populate("owner");
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
     return res.render("listings/show.ejs",{listing});
};

//create route
module.exports.createListing = async (req, res, next) => {
   
let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
.send()

const newListing = new Listing(req.body.listing);
newListing.owner = req.user._id
if (req.file) {
    newListing.image = {
      url: req.file.path || req.file.secure_url,
      filename: req.file.filename || req.file.public_id,
    };
  } else {
    newListing.image = {
      url: 'https://res.cloudinary.com/dvwwq9f4f/image/upload/v1696224863/Wanderlust/default-listing_qr4x6h.jpg',
      filename: 'Wanderlust/default-listing_qr4x6h',
    };
  }
        

      newListing.geometry = response.body.features[0].geometry;

        let savedListing = await newListing.save();
        console.log(savedListing);

        req.flash("success", "New Listing Created");

        return res.redirect("/listings"); 
    
};

//edit route
module.exports.renderEdiitForm = async (req, res ) => {
let{id} = req.params;
const listing = await Listing.findById(id);
if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }

let originalImageUrl = listing.image.url;
originalImageUrl= originalImageUrl.replace("/upload", "/upload/w_250");
return res.render("listings/edit.ejs", { listing , originalImageUrl });

};

//update route
module.exports.updateListing = async ( req, res )=> {
   
  let{id} = req.params;
  const listingData = { ...req.body.listing };
  delete listingData.image;
  
  if (listingData.location) {
    const geoResponse = await geocodingClient.forwardGeocode({
      query: listingData.location,
      limit: 1
    }).send();
    const geometry = geoResponse.body.features?.[0]?.geometry;
    if (geometry) {
      listingData.geometry = geometry;
    }
  }

  let listing = await Listing.findByIdAndUpdate(id, listingData, { new: true });
  
  console.log(req.file)
  if(req.file){
  let url = req.file.path || req.file.secure_url;
  let filename = req.file.filename || req.file.public_id;
  listing.image = {url, filename};
  await listing.save();
  }
  req.flash("success" , " Listing Updated");
   return res.redirect(`/listings/${id}`);

};

//delete route
module.exports.destroyListing = async (req,res )=>{
    let{id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success" , " Listing Deleted");
    return res.redirect("/listings");
};
