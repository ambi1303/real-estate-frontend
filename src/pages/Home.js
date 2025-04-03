import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api"; // Ensure correct path
import PropertyCard from "../components/PropertyCard"; // Ensure correct path

const Home = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    api.get("/api/properties")
      .then((res) => setProperties(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div>
      <h1>Property Listings</h1>
      <div>
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </div>

      {/* Correct link to properties */}
      <Link to="/properties">
        <button>View All Properties</button>
      </Link>
    </div>
  );
};

export default Home;
