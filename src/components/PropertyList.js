import React, { useEffect, useState, useContext } from "react";
import propertyService from "../services/propertyService";
import { AuthContext } from "../context/AuthContext";

const PropertyList = () => {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({ name: "", location: "" });
  const [editingProperty, setEditingProperty] = useState(null);
  const { user } = useContext(AuthContext); // Get logged-in user

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await propertyService.getAll();
      setProperties(response.data);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!user?.token || user?.role !== "admin") {
      alert("Unauthorized: Only admins can delete properties.");
      return;
    }

    try {
      await propertyService.delete(id);
      setProperties(properties.filter((property) => property._id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  const handleCreate = async () => {
    if (!user?.token || user?.role !== "admin") {
      alert("Unauthorized: Only admins can add properties.");
      return;
    }

    try {
      const response = await propertyService.create(newProperty);
      setProperties([...properties, response.data]);
      setNewProperty({ name: "", location: "" }); // Clear input fields
    } catch (error) {
      console.error("Error adding property:", error);
    }
  };

  const handleUpdate = async () => {
    if (!editingProperty || !user?.token || user?.role !== "admin") {
      alert("Unauthorized: Only admins can update properties.");
      return;
    }

    try {
      await propertyService.update(editingProperty._id, editingProperty);
      setProperties(
        properties.map((property) =>
          property._id === editingProperty._id ? editingProperty : property
        )
      );
      setEditingProperty(null);
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  return (
    <div>
      <h2>Property Listings</h2>

      {/* ✅ Add New Property (Admin Only) */}
      {user?.role === "admin" && (
        <div>
          <h3>Add Property</h3>
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
          <button onClick={handleCreate}>Add</button>
        </div>
      )}

      {/* ✅ Property List */}
      {properties.map((property) => (
        <div key={property._id}>
          {editingProperty && editingProperty._id === property._id ? (
            // Edit Mode
            <div>
              <input
                type="text"
                value={editingProperty.name}
                onChange={(e) => setEditingProperty({ ...editingProperty, name: e.target.value })}
              />
              <input
                type="text"
                value={editingProperty.location}
                onChange={(e) => setEditingProperty({ ...editingProperty, location: e.target.value })}
              />
              <button onClick={handleUpdate}>Save</button>
              <button onClick={() => setEditingProperty(null)}>Cancel</button>
            </div>
          ) : (
            // Display Mode
            <div>
              <h3>{property.name}</h3>
              <p>{property.location}</p>
              {user?.role === "admin" && (
                <>
                  <button onClick={() => handleDelete(property._id)}>Delete</button>
                  <button onClick={() => setEditingProperty(property)}>Edit</button>
                </>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default PropertyList;
