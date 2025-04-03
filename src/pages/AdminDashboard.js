import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import "../styles.css"; 

const AdminDashboard = () => {
  const [properties, setProperties] = useState([]);
  const [newProperty, setNewProperty] = useState({ name: "", image: "", price: "", location: "" });
  const [editingProperty, setEditingProperty] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      alert("Access Denied: Admins Only");
      navigate("/");
    } else {
      fetchProperties();
    }
  }, []);

  const fetchProperties = async () => {
    try {
      const res = await API.get("/properties");
      setProperties(res.data);
    } catch (error) {
      console.error("Error fetching properties", error);
    }
  };

  const handleAddProperty = async () => {
    try {
      await API.post("/properties", newProperty);
      setNewProperty({ name: "", image: "", price: "", location: "" });
      fetchProperties();
    } catch (error) {
      console.error("Error adding property", error);
    }
  };

  const handleEditProperty = async () => {
    try {
      await API.put(`/properties/${editingProperty._id}`, editingProperty);
      setEditingProperty(null);
      fetchProperties();
    } catch (error) {
      console.error("Error updating property", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/properties/${id}`);
      fetchProperties();
    } catch (error) {
      console.error("Error deleting property", error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      <h3>{editingProperty ? "Edit Property" : "Add Property"}</h3>
      <input
        placeholder="Name"
        value={editingProperty ? editingProperty.name : newProperty.name}
        onChange={(e) =>
          editingProperty
            ? setEditingProperty({ ...editingProperty, name: e.target.value })
            : setNewProperty({ ...newProperty, name: e.target.value })
        }
      />
      <input
        placeholder="Image URL"
        value={editingProperty ? editingProperty.image : newProperty.image}
        onChange={(e) =>
          editingProperty
            ? setEditingProperty({ ...editingProperty, image: e.target.value })
            : setNewProperty({ ...newProperty, image: e.target.value })
        }
      />
      <input
        placeholder="Price"
        value={editingProperty ? editingProperty.price : newProperty.price}
        onChange={(e) =>
          editingProperty
            ? setEditingProperty({ ...editingProperty, price: e.target.value })
            : setNewProperty({ ...newProperty, price: e.target.value })
        }
      />
      <input
        placeholder="Location"
        value={editingProperty ? editingProperty.location : newProperty.location}
        onChange={(e) =>
          editingProperty
            ? setEditingProperty({ ...editingProperty, location: e.target.value })
            : setNewProperty({ ...newProperty, location: e.target.value })
        }
      />
      {editingProperty ? (
        <button onClick={handleEditProperty}>Update</button>
      ) : (
        <button onClick={handleAddProperty}>Add</button>
      )}

      <h3>Manage Properties</h3>
      {properties.map((property) => (
        <div key={property._id} className="property-item">
          <p>{property.name}</p>
          <button onClick={() => setEditingProperty(property)}>Edit</button>
          <button onClick={() => handleDelete(property._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
