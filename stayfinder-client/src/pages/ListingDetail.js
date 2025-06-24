import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ListingDetail() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/listings/${id}`);
        setListing(res.data);

        const viewed = JSON.parse(localStorage.getItem("viewedListings")) || [];
        const exists = viewed.find(item => item._id === res.data._id);
        if (!exists) {
          viewed.push(res.data);
          localStorage.setItem("viewedListings", JSON.stringify(viewed));
        }
      } catch (err) {
        console.error("Error fetching listing:", err);
      }
    };

    fetchListing();
  }, [id]);

  const handleBooking = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id || user?._id;

    if (!userId) {
      setMessage("❌ Please login to make a booking.");
      return;
    }

    if (!checkIn || !checkOut) {
      setMessage("❌ Please select check-in and check-out dates.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/bookings", {
        userId,
        listingId: listing._id,
        checkInDate: checkIn,
        checkOutDate: checkOut,
      });

      if (res.status === 201) {
        setMessage("✅ Booking successful!");
        setTimeout(() => {
          navigate("/dashboard", { state: { bookingMade: true } }); // 👈 Pass flag
        }, 1500);
      } else {
        setMessage("❌ Booking failed. Try again.");
      }
    } catch (err) {
      console.error("Booking failed:", err.response?.data || err.message);
      setMessage("❌ Booking failed. Try again.");
    }
  };

  if (!listing) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100 p-6">
      <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-2">{listing.title}</h2>
        <p className="text-gray-600 mb-2">{listing.description}</p>
        <p className="font-semibold text-blue-600 mb-2">₹{listing.price}</p>
        <p className="text-sm text-gray-500 mb-4">📍 {listing.location}</p>
        {listing.image && (
          <img
            src={listing.image}
            alt={listing.title}
            className="w-full h-64 object-cover rounded mb-4"
          />
        )}

        {/* Booking Form */}
        <div className="bg-gray-100 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold mb-2">Book this stay 🛏️</h3>
          <div className="flex flex-col gap-3">
            <input
              type="date"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
              className="border px-3 py-2 rounded"
            />
            <input
              type="date"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
              className="border px-3 py-2 rounded"
            />
            <button
              onClick={handleBooking}
              className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Confirm Booking
            </button>
          </div>
          {message && (
            <p className="mt-3 text-sm text-center text-blue-600 font-medium">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListingDetail;
