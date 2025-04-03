import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import propertyService from "../services/propertyService";
import { AuthContext } from "../context/AuthContext";
import "../components/property.css";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({ name: "", location: "", price: "", image: "", description: "" });
  const [editingProperty, setEditingProperty] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  // Fetch properties from backend
  const fetchProperties = async () => {
    try {
      const data = await propertyService.getAll();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    }
  };

  // Create a new property
  const handleCreate = async () => {
    if (!user?.token || user?.role !== "admin") {
      alert("Unauthorized: Only admins can add properties.");
      return;
    }

    if (!newProperty.name || !newProperty.location || !newProperty.price) {
      alert("Please enter name, location, and price.");
      return;
    }

    try {
      const payload = {
        name: newProperty.name,
        location: newProperty.location,
        price: Number(newProperty.price), // Ensure price is a number
        image: newProperty.image || "default-image.jpg", // Default image if missing
        description: newProperty.description || "No description available" // Default description
      };

      const createdProperty = await propertyService.create(payload);
      setProperties((prev) => [...prev, createdProperty]);
      setNewProperty({ name: "", location: "", price: "", image: "", description: "" });
    } catch (error) {
      console.error("Error adding property:", error.response?.data || error.message);
      alert(`Failed to add property: ${error.response?.data?.message || error.message}`);
    }
  };

  // Delete a property
  const handleDelete = async (id) => {
    if (!user?.token || user?.role !== "admin") {
      alert("Unauthorized: Only admins can delete properties.");
      return;
    }

    try {
      await propertyService.delete(id);
      setProperties((prev) => prev.filter((property) => property._id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
      alert("Failed to delete property.");
    }
  };

  // Edit a property
  const handleEdit = (property) => {
    setEditingProperty(property);
  };

  // Update property
  const handleUpdate = async () => {
    if (!editingProperty || !user?.token || user?.role !== "admin") {
      alert("Unauthorized: Only admins can update properties.");
      return;
    }

    try {
      const updatedProperty = await propertyService.update(editingProperty._id, editingProperty);
      setProperties((prev) =>
        prev.map((property) => (property._id === updatedProperty._id ? updatedProperty : property))
      );
      setEditingProperty(null);
    } catch (error) {
      console.error("Error updating property:", error);
      alert("Failed to update property.");
    }
  };

  return (
    <div className="property-list-container">
      <h2>Your Properties</h2>

      {user?.role === "admin" && (
        <div className="add-property-form">
          <input
            type="text"
            placeholder="Property Name"
            value={newProperty.name}
            onChange={(e) => setNewProperty({ ...newProperty, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Location"
            value={newProperty.location}
            onChange={(e) => setNewProperty({ ...newProperty, location: e.target.value })}
          />
          <input
            type="number"
            placeholder="Price"
            value={newProperty.price}
            onChange={(e) => setNewProperty({ ...newProperty, price: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL (optional)"
            value={newProperty.image}
            onChange={(e) => setNewProperty({ ...newProperty, image: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            value={newProperty.description}
            onChange={(e) => setNewProperty({ ...newProperty, description: e.target.value })}
          />
          <button onClick={handleCreate} className="add-button">Add a new property</button>
        </div>
      )}

      {properties.length === 0 ? (
        <p>No properties available.</p>
      ) : (
        <div className="property-list">
          {properties.map((property) => (
            <div key={property._id} className="property-card">
              <img src={property.image || "default-image.jpg"} alt={property.name} className="property-image"/>
              <div className="property-details">
                {editingProperty && editingProperty._id === property._id ? (
                  <div className="edit-form">
                    <input
                      type="text"
                      value={editingProperty.name}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, name: e.target.value })
                      }
                    />
                    <input
                      type="text"
                      value={editingProperty.location}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, location: e.target.value })
                      }
                    />
                    <input
                      type="number"
                      value={editingProperty.price}
                      onChange={(e) =>
                        setEditingProperty({ ...editingProperty, price: e.target.value })
                      }
                    />
                    <button onClick={handleUpdate} className="save-button">Save</button>
                    <button onClick={() => setEditingProperty(null)} className="cancel-button">Cancel</button>
                  </div>
                ) : (
                  <div>
                    <h3>{property.name}</h3>
                    <p>{property.location}</p>
                    <p>Price: ${property.price}</p>
                    {user?.role === "admin" && (
                      <div className="action-buttons">
                        <button onClick={() => handleEdit(property)} className="edit-button">Edit</button>
                        <button onClick={() => handleDelete(property._id)} className="delete-button">Delete</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PropertyList;
