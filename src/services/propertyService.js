import axios from "axios";

const API_URL = "http://localhost:5000/api/properties";

const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const propertyService = {
  getAll: async () => {
    try {
      const { data } = await axios.get(API_URL);
      return data;
    } catch (error) {
      console.error("Error fetching properties:", error);
      throw error;
    }
  },

  create: async (propertyData) => {
    try {
      const { data } = await axios.post(API_URL, propertyData, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "application/json",
        },
      });
      return data.newProperty; // ✅ Ensure correct data is returned
    } catch (error) {
      console.error("Error adding property:", error);
      throw error;
    }
  },

  update: async (id, propertyData) => {
    try {
      const { data } = await axios.put(`${API_URL}/${id}`, propertyData, {
        headers: getAuthHeader(),
      });
      return data;
    } catch (error) {
      console.error("Error updating property:", error);
      throw error;
    }
  },

  delete: async (id) => {
    try {
      const { data } = await axios.delete(`${API_URL}/${id}`, {
        headers: getAuthHeader(),
      });
      return data;
    } catch (error) {
      console.error("Error deleting property:", error);
      throw error;
    }
  },
};

export default propertyService;
