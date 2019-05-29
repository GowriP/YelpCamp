var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

router.get("/", function(req, res){
	Campground.find({}, function(err, allCampgrounds){
		if(err){
			console.log(err);
		} else {
			res.render("campgrounds/index", {campgrounds: allCampgrounds});
		}
	})
	
});

//EDIT - campground route
router.get("/:id/edit", middleware.checkCampgroundOwnership,function(req, res){
	Campground.findById(req.params.id,function(err, foundCampground)
	{
		res.render("campgrounds/edit",{campground: foundCampground});
	});
			
});

//UPDATE - campground route
router.put("/:id",middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err){
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id )
		};
	})
})

//DESTROY - campground route
router.delete("/:id",middleware.checkCampgroundOwnership, function(req, res){
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

//CREATE - add new campground
router.post("/",middleware.isLoggedIn, function(req, res){
	var name = req.body.name; 
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	}
	var price = req.body.price;
	var newCampground = {name: name, price : price, image: image, description: desc, author: author};
	Campground.create(newCampground, function(err, campground){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});

});

//NEW - show form to create a new campground
router.get("/new",middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

//SHOW - shows more information about one campground
router.get("/:id",function(req, res){

	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
		if(err){
			console.log(err);
		} else {
			console.log(foundCampground);
			res.render("campgrounds/show", {campground: foundCampground} )
		}
	});
});

module.exports = router;