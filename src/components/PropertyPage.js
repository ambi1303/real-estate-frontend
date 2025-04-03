import React, { useState, useEffect, useContext } from "react";
import propertyService from "../services/propertyService";
import { AuthContext } from "../context/AuthContext"; // Ensure AuthContext is implemented

const PropertyPage = () => {
  const { user } = useContext(AuthContext); // Get logged-in user
  const [properties, setProperties] = useState([]);
  const [form, setForm] = useState({ name: "", location: "", price: "" });
  const [editingId, setEditingId] = useState(null);

  // Fetch all properties
  useEffect(() => {
    propertyService
      .getAll()
      .then((response) => setProperties(response.data))
      .catch((error) => console.error("Error fetching properties:", error));
  }, []);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create Property
  const handleCreate = async () => {
    try {
      const token = user?.token;
      const response = await propertyService.create(form, token);
      setProperties([...properties, response.data]); // Update state
      setForm({ name: "", location: "", price: "" }); // Reset form
    } catch (error) {
      console.error("Error creating property:", error);
    }
  };

  // Edit Property (Load data into form)
  const handleEdit = (property) => {
    setForm({ name: property.name, location: property.location, price: property.price });
    setEditingId(property._id);
  };

  // Update Property
  const handleUpdate = async () => {
    try {
      const token = user?.token;
      const response = await propertyService.update(editingId, form, token);
      setProperties(properties.map((prop) => (prop._id === editingId ? response.data : prop)));
      setEditingId(null); // Reset editing mode
      setForm({ name: "", location: "", price: "" });
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  // Delete Property
  const handleDelete = async (id) => {
    try {
      const token = user?.token;
      await propertyService.remove(id, token);
      setProperties(properties.filter((prop) => prop._id !== id));
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  return (
    <div>
      <h1>Property Listings</h1>

      {/* Form for Adding / Updating Property */}
      {user?.isAdmin && (
        <div>
          <h2>{editingId ? "Edit Property" : "Add Property"}</h2>
          <input type="text" name="name" placeholder="Property Name" value={form.name} onChange={handleChange} />
          <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} />
          <input type="text" name="price" placeholder="Price" value={form.price} onChange={handleChange} />
          {editingId ? (
            <button onClick={handleUpdate}>Update</button>
          ) : (
            <button onClick={handleCreate}>Add</button>
          )}
        </div>
      )}

      {/* Property List */}
      <div>
        {properties.map((property) => (
          <div key={property._id} style={{ border: "1px solid #ddd", padding: "10px", margin: "10px" }}>
            <h2>{property.name}</h2>
            <p>Location: {property.location}</p>
            <p>Price: ${property.price}</p>

            {/* Edit & Delete Buttons - Visible only to Admin */}
            {user?.isAdmin && (
              <>
                <button onClick={() => handleEdit(property)}>Edit</button>
                <button onClick={() => handleDelete(property._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyPage;
