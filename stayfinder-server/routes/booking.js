const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");

// ✅ Create a new booking
router.post("/", async (req, res) => {
  try {
    const { userId, listingId, checkInDate, checkOutDate } = req.body;

    if (!userId || !listingId || !checkInDate || !checkOutDate) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newBooking = new Booking({
      userId,
      listingId,
      checkInDate,
      checkOutDate,
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      message: "Booking successful!",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({ message: "Server error while creating booking" });
  }
});

// ✅ Get all bookings for a user
router.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === "undefined") {
      return res.status(400).json({ message: "Invalid user ID." });
    }

    const bookings = await Booking.find({ userId }).populate({
      path: "listingId",
      select: "title location image",
    });

    res.json(bookings);
  } catch (error) {
    console.error("❌ Error fetching bookings:", error.message);
    res.status(500).json({ message: "Server error while fetching bookings" });
  }
});

// ✅ Delete a booking by ID
router.delete("/:bookingId", async (req, res) => {
  try {
    const { bookingId } = req.params;
    await Booking.findByIdAndDelete(bookingId);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting booking:", error);
    res.status(500).json({ message: "Server error while deleting booking" });
  }
});

module.exports = router;
