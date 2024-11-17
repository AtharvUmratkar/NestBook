const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const mongo_url = "mongodb://127.0.0.1:27017/project1db";
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongo_url);
    
} 

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method")); 
app.use("ejs",ejsMate);
// app.get("/testListing", async (req,res) =>{
//     let sampleListing = new listeing({
//         title : "New Villa",
//         description : "By the beach",
//         price : 2000,
//         location : "Calangute, Goa",
//         country : "India",
//     });

//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("successful");
// });

app.get("/", (req, res) => {
    res.send("Hi, your are on root path");
});

app.get("/listings", async (req, res) =>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", {allListings});
});
//new route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
})

//show route
app.get("/listings/:id", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", {listing});
})

//create route
app.post("/listings", async (req, res) => {
    const listing = new Listing(req.body.listing);
    await listing.save();
    res.redirect("listings");
})

//edit route
app.get("/listings/:id/edit", async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
})

app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delete route
app.delete("/listings/:id", async (req,res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.listen(8080, () => {
    console.log("server is running on port 8080");
});