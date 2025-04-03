const PropertyCard = ({ property }) => {
    return (
      <div>
        <img src={property.image} alt={property.name} width="200" />
        <h3>{property.name}</h3>
        <p>{property.location}</p>
        <p>${property.price}</p>
      </div>
    );
  };
  
  export default PropertyCard;
  