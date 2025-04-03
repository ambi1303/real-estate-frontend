import React, { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import "../styles.css";

const PropertyPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user } = useContext(AuthContext); // Get logged-in user details

    const [newProperty, setNewProperty] = useState({
        name: "",
        image: "",
        location: "",
        price: "",
    });

    const [editingId, setEditingId] = useState(null); // Track editing state

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        try {
            const res = await api.get("/properties");
            setProperties(res.data);
        } catch (err) {
            console.error("Error fetching properties:", err);
            setError("Failed to load properties.");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setNewProperty({ ...newProperty, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await api.put(`/properties/${editingId}`, newProperty, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                alert("Property Updated!");
                setEditingId(null); // Reset editing mode
            } else {
                await api.post("/properties", newProperty, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                alert("Property Added!");
            }
            fetchProperties();
            setNewProperty({ name: "", image: "", location: "", price: "" }); // Reset form
        } catch (err) {
            console.error("Error saving property:", err);
            alert("Failed to save property.");
        }
    };

    const handleEdit = (property) => {
        setNewProperty(property);
        setEditingId(property._id);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this property?")) return;
        try {
            await api.delete(`/properties/${id}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            alert("Property Deleted!");
            fetchProperties();
        } catch (err) {
            console.error("Error deleting property:", err);
            alert("Failed to delete property.");
        }
    };

    return (
        <div className="property-page">
            <h1>Property Listings</h1>

            {loading && <p>Loading properties...</p>}
            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Property List */}
            <div className="property-container">
                {properties.map((property) => (
                    <div key={property._id} className="property-card">
                        <img src={property.image} alt={property.name} />
                        <h3>{property.name}</h3>
                        <p>Location: {property.location}</p>
                        <p>Price: ${property.price}</p>

                        {/* Admin Controls */}
                        {user?.role === "admin" && (
                            <div>
                                <button className="edit-btn" onClick={() => handleEdit(property)}>Edit</button>
                                <button className="delete-btn" onClick={() => handleDelete(property._id)}>Delete</button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Add/Edit Property Form (Only for Admins) */}
            {user?.role === "admin" && (
                <div className="add-property">
                    <h2>{editingId ? "Edit Property" : "Add New Property"}</h2>
                    <form onSubmit={handleSubmit}>
                        <input type="text" name="name" placeholder="Property Name" value={newProperty.name} onChange={handleChange} required />
                        <input type="text" name="image" placeholder="Image URL" value={newProperty.image} onChange={handleChange} required />
                        <input type="text" name="location" placeholder="Location" value={newProperty.location} onChange={handleChange} required />
                        <input type="number" name="price" placeholder="Price" value={newProperty.price} onChange={handleChange} required />
                        <button type="submit">{editingId ? "Update Property" : "Add Property"}</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default PropertyPage;
