const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");

// ✅ GET all listings
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error("Error fetching listings:", err);
    res.status(500).json({ message: "Server error while fetching listings" });
  }
});

// ✅ GET single listing by ID
router.get("/:id", async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    res.json(listing);
  } catch (err) {
    console.error("Error fetching listing:", err);
    res.status(500).json({ message: "Server error while fetching listing" });
  }
});

// ✅ POST create new listing
router.post("/", async (req, res) => {
  const { title, description, price, image } = req.body;

  if (!title || !price) {
    return res.status(400).json({ message: "Title and price are required" });
  }

  try {
    const newListing = new Listing({
      title,
      description,
      price,
      image,
    });

    await newListing.save();
    res.status(201).json({ message: "Listing created", listing: newListing });
  } catch (err) {
    console.error("Error creating listing:", err);
    res.status(500).json({ message: "Server error while creating listing" });
  }
});

// ✅ TEMPORARY: Seed listings for testing
router.post("/seed", async (req, res) => {
  try {
    await Listing.deleteMany(); // Clear old listings

    await Listing.insertMany([
      {
        title: "Cozy Cottage",
        description: "A lovely small cottage in the hills.",
        price: 1500,
        location: "Manali, India",
        image: "https://i.pinimg.com/originals/89/46/dd/8946ddf57725be806a43e331134f60b5.jpg"
      },
      {
        title: "Beach House",
        description: "Oceanfront property with amazing view.",
        price: 2500,
        location: "Goa, India",
        image: "https://s-i.huffpost.com/gen/1168191/images/o-BEACH-HOUSES-facebook.jpg"
      },
      {
        title: "Mountain Retreat",
        description: "Quiet retreat surrounded by pine forests.",
        price: 1800,
        location: "Ooty, India",
        image: "https://images.dwell.com/photos/6063391372700811264/6338502963217571840/large.jpg"
      },
      {
        title: "Modern Apartment",
        description: "Stylish city apartment with all amenities.",
        price: 2000,
        location: "Mumbai, India",
        image: "https://fataniestate.com/wp-content/uploads/2024/01/Reasons-Behind-the-Decline-in-Apartment-Prices.jpg"
      },
      {
        title: "Luxury Villa",
        description: "Spacious villa with private pool and garden.",
        price: 4000,
        location: "Jaipur, India",
        image: "https://villascroatia.com/wp-content/uploads/2020/08/modern-luxury-villa-pool-medulin-croatia-13-1.jpg"
      },
      {
        title: "Treehouse Stay",
        description: "Live among the trees in this peaceful escape.",
        price: 2200,
        location: "Kerala, India",
        image: "https://i.pinimg.com/736x/c3/47/15/c347154dd51a5ca55025c45ca587d4b8--cabin-design-house-and-home.jpg"
      },
      {
        title: "Desert Camp",
        description: "Experience the desert like never before.",
        price: 1300,
        location: "Jaisalmer, India",
        image: "https://www.nomadsheavendesertcamp.com/images/gallery/5.jpg"
      },
      {
        title: "Lakeview Cabin",
        description: "Cabin with beautiful lake view and calm vibes.",
        price: 1900,
        location: "Nainital, India",
        image: "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?fm=jpg"
      },
      {
        title: "Boathouse",
        description: "Floating accommodation on the backwaters.",
        price: 2100,
        location: "Alleppey, India",
        image: "https://i.pinimg.com/originals/6d/f7/14/6df714b1dc6007885fc92c311ac61607.jpg"
      },
      {
        title: "Farm Stay",
        description: "Stay close to nature on a working farm.",
        price: 1700,
        location: "Coorg, India",
        image: "https://imgix.theurbanlist.com/content/article/farm-stays-wa-historic-cottage.png"
      },
      {
        title: "Snow Cabin",
        description: "Warm cabin with snowy surroundings.",
        price: 2600,
        location: "Shimla, India",
        image: "https://wallpaperaccess.com/full/403692.jpg"
      },
      {
        title: "City Loft",
        description: "Trendy loft in the heart of the city.",
        price: 2300,
        location: "Delhi, India",
        image: "https://i.pinimg.com/originals/4d/2f/e1/4d2fe1f6f22c7b348524b1601c1fa49c.jpg"
      }
    ]);

    res.status(201).json({ message: "Listings seeded!" });
  } catch (err) {
    console.error("Seeding error:", err);
    res.status(500).json({ error: "Failed to seed listings" });
  }
});

module.exports = router;

