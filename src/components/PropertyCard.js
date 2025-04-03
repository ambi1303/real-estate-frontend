// src/components/PropertyCard.js
import React from "react";

const PropertyCard = ({ property }) => (
  <div className="property-card">
    <img src={property.image} alt={property.name} />
    <h3>{property.name}</h3>
    <p>Location: {property.location}</p>
    <p>Price: ${property.price}</p>
  </div>
);

export default PropertyCard;
