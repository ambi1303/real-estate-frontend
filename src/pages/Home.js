import React, { useEffect, useState } from 'react';  // ✅ Add useState
import propertyService from '../services/propertyService';

const Home = () => {
  const [properties, setProperties] = useState([]); // ✅ Define state

  useEffect(() => {
    propertyService.getAll()
      .then(response => setProperties(response.data))
      .catch(error => console.error('Error fetching properties:', error));
  }, []);

  return (
    <div>
      <h1>Property Listings</h1>
      {properties.map(property => (
        <div key={property._id}>
          <h2>{property.name}</h2>
          <p>{property.location}</p>
        </div>
      ))}
    </div>
  );
};

export default Home;
