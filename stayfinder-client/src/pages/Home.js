import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [listings, setListings] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [locationFilter, setLocationFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/listings");
        // Update prices to ₹100000+
        const updatedListings = res.data.map((listing, index) => ({
          ...listing,
          price: 100000 + index * 5000, // Incrementing price for variety
        }));
        setListings(updatedListings);
        setFiltered(updatedListings);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, []);

  useEffect(() => {
    const filteredData = listings.filter((listing) => {
      const matchesLocation =
        locationFilter === "" ||
        listing.location?.toLowerCase().includes(locationFilter.toLowerCase());
      const matchesPrice =
        priceFilter === "" || listing.price <= parseInt(priceFilter);
      return matchesLocation && matchesPrice;
    });
    setFiltered(filteredData);
  }, [locationFilter, priceFilter, listings]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ✅ Navigation Icons */}
      <div className="flex justify-end gap-4 text-sm p-2 pr-6 bg-white shadow-sm">
        <Link to="/" className="text-blue-500 flex items-center gap-1">
          <span role="img" aria-label="home">🏠</span> Home
        </Link>
        <Link to="/register" className="text-blue-500 flex items-center gap-1">
          <span role="img" aria-label="register">📝</span> Register
        </Link>
        <Link to="/login" className="text-blue-500 flex items-center gap-1">
          <span role="img" aria-label="login">🔐</span> Login
        </Link>
        <Link to="/dashboard" className="text-blue-500 flex items-center gap-1">
          <span role="img" aria-label="dashboard">📊</span> Dashboard
        </Link>
      </div>

      {/* ✅ Welcome Banner */}
      <div
        className="bg-cover bg-center h-[400px] flex items-center justify-center"
        style={{
          backgroundImage: `url('https://www.toptimberhomes.com/wp-content/uploads/2017/01/03-1.jpg')`,
        }}
      >
        <h1 className="text-4xl font-bold text-white bg-black bg-opacity-50 px-6 py-3 rounded-lg shadow-lg">
          🏠 Welcome to StayFinder App
        </h1>
      </div>

      {/* ✅ Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-6 px-6">
        <input
          type="text"
          placeholder="Search by location..."
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full sm:w-1/3"
        />
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded w-full sm:w-1/3"
        >
          <option value="">All Prices</option>
          <option value="110000">Up to ₹110000</option>
          <option value="120000">Up to ₹120000</option>
          <option value="130000">Up to ₹130000</option>
          <option value="140000">Up to ₹140000</option>
          <option value="150000">Up to ₹150000</option>
        </select>
      </div>

      {/* ✅ Listings Section */}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-center mb-6">🏡 Explore Listings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
          {filtered.map((listing) => (
            <div
              key={listing._id}
              className="bg-white rounded-xl shadow-md p-4 hover:shadow-xl transition duration-300"
            >
              {listing.image && (
                <img
                  src={listing.image}
                  alt={listing.title}
                  className="w-full h-48 object-cover rounded mb-3"
                />
              )}
              <h3 className="text-xl font-semibold mb-1">{listing.title}</h3>
              <p className="text-gray-700 mb-1">{listing.description}</p>
              <p className="text-blue-600 font-bold">₹{listing.price}</p>
              {listing.location && (
                <p className="text-sm text-gray-500 mt-1">📍 {listing.location}</p>
              )}
              <div className="mt-4">
                <Link
                  to={`/listings/${listing._id}`}
                  className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Informational Paragraph with Icons */}
      <div className="p-6 max-w-5xl mx-auto text-center text-gray-800">
        <h3 className="text-2xl font-bold mb-4">✨ StayFinder App: Your Gateway to Beautiful Stays Across India 🇮🇳</h3>
        <p className="mb-4">
          Welcome to StayFinder 🏠, your go-to destination for discovering the coziest cottages 🛖, beachside homes 🏖️,
          luxurious villas 🏡, and adventurous getaways ⛺ across India. Whether you're planning a quiet weekend retreat 🌄
          or a lavish family vacation 🎉, StayFinder brings you a curated selection of stays with just a few clicks.
        </p>
        <p className="mb-4">
          With a sleek and responsive interface 💻📱, users can easily explore listings 🧭, view detailed information 📋,
          and track their recently viewed stays 🕵️ right from the dashboard after logging in 🔐. StayFinder makes the
          experience personal and seamless 🤝, allowing you to see what you’ve explored even after you leave the page.
        </p>
        <p className="mb-4">
          Each listing comes with beautiful high-quality images 🖼️, clear descriptions ✍️, and exact locations 📍, so you
          know exactly what to expect. From a snow-covered cabin in Shimla ❄️🏔️ to a treehouse in the forests of Kerala
          🌳🛖, the app is built to inspire your next adventure.
        </p>
        <p>
          The built-in user authentication system 🔒 ensures your preferences and history are secure. Only after registering
          and logging in can users access their personalized dashboard 🧑‍💼, making the experience more tailored and protected.
        </p>
      </div>

      {/* ✅ Bottom Branding Section */}
      <div className="flex justify-start items-center gap-8 p-6 mt-8 bg-white border-t border-gray-300">
        <div className="flex items-center gap-2">
          <img
            src="https://i.pinimg.com/736x/94/41/0b/94410bb5a45445bae751ab7c151e7694.jpg"
            alt="StayFinder"
            className="h-10 w-10 object-cover rounded"
          />
          <span className="text-sm font-semibold">StayFinder</span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src="https://pluspng.com/img-png/airbnb-logo-png-airbnb-logo-1600.png"
            alt="Airnub"
            className="h-10 w-10 object-contain"
          />
          <span className="text-sm font-semibold">Airnub</span>
        </div>
      </div>
    </div>
  );
}

export default Home;
