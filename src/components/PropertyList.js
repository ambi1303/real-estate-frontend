import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import propertyService from "../services/propertyService";
import { AuthContext } from "../context/AuthContext";
import "../components/property.css";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({ name: "", location: "", price: "" });
  const [editingProperty, setEditingProperty] = useState(null);
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await propertyService.getAll();
      setProperties(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching properties:", error);
      setProperties([]);
    }
  };

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
      const createdProperty = await propertyService.create(newProperty);
      setProperties((prev) => [...prev, createdProperty]);
      setNewProperty({ name: "", location: "", price: "" });
    } catch (error) {
      console.error("Error adding property:", error);
      alert("Failed to add property.");
    }
  };

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

  const handleEdit = (property) => {
    setEditingProperty(property);
  };

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
