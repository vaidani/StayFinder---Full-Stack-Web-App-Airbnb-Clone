import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import axios from "axios";

function Dashboard() {
  const [user, setUser] = useState(null);
  const [viewedListings, setViewedListings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchBookings = (userId) => {
    if (!userId) return;
    axios
      .get(`http://localhost:5000/api/bookings/user/${userId}`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error("❌ Error fetching bookings:", err));
  };

  useEffect(() => {
    const userData = localStorage.getItem("user");
    const viewed = localStorage.getItem("viewedListings");

    if (userData) {
      const userObj = JSON.parse(userData);
      setUser(userObj);
      fetchBookings(userObj._id || userObj.id); // handle both
    } else {
      navigate("/login");
    }

    if (viewed) {
      setViewedListings(JSON.parse(viewed));
    }
  }, [navigate]);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (location.state?.bookingMade && userData) {
      const userObj = JSON.parse(userData);
      fetchBookings(userObj._id || userObj.id);
    }
  }, [location.state]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleDeleteViewed = (id) => {
    const updated = viewedListings.filter((item) => item._id !== id);
    setViewedListings(updated);
    localStorage.setItem("viewedListings", JSON.stringify(updated));
  };

  const handleDeleteBooking = async (bookingId) => {
    try {
      await axios.delete(`http://localhost:5000/api/bookings/${bookingId}`);
      const updated = bookings.filter((b) => b._id !== bookingId);
      setBookings(updated);
    } catch (error) {
      console.error("❌ Error deleting booking:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">🏡 Welcome to StayFinder Dashboard!</h1>
        {user && (
          <p className="text-lg">
            Hello, <strong>{user.name}</strong> ({user.email})
          </p>
        )}
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      {viewedListings.length > 0 && (
        <>
          <h2 className="text-xl font-semibold mb-4 text-center">
            👁️ Your Recently Viewed Listings
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6 mb-8">
            {viewedListings.map((listing) => (
              <div
                key={listing._id}
                className="bg-white p-4 rounded shadow hover:shadow-lg relative"
              >
                {listing.image && (
                  <img
                    src={listing.image}
                    alt={listing.title}
                    className="w-full h-40 object-cover rounded mb-2"
                  />
                )}
                <h3 className="text-lg font-bold">{listing.title}</h3>
                <p className="text-gray-700">{listing.description}</p>
                <p className="text-blue-600 font-semibold">₹{listing.price}</p>
                <p className="text-sm text-gray-500">📍 {listing.location}</p>
                <Link
                  to={`/listings/${listing._id}`}
                  className="mt-2 inline-block bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition"
                >
                  View Again
                </Link>
                <button
                  onClick={() => handleDeleteViewed(listing._id)}
                  className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="text-xl font-semibold mb-4 text-center">📖 Your Booking History</h2>
      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-4 rounded shadow hover:shadow-md relative"
            >
              {booking.listingId?.image && (
                <img
                  src={booking.listingId.image}
                  alt={booking.listingId.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
              )}
              <h3 className="text-lg font-bold">{booking.listingId?.title}</h3>
              <p className="text-sm text-gray-700">{booking.listingId?.location}</p>
              <p className="text-sm text-gray-500">
                🗓️ {new Date(booking.checkInDate).toLocaleDateString()} to{" "}
                {new Date(booking.checkOutDate).toLocaleDateString()}
              </p>
              <button
                onClick={() => handleDeleteBooking(booking._id)}
                className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">
          You haven't made any bookings yet.
        </p>
      )}
    </div>
  );
}

export default Dashboard;

