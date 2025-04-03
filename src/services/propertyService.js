import axios from "axios";

const API_URL = "http://localhost:5000/api/properties";

// 🔹 Get token from localStorage
const getAuthHeader = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return user && user.token ? { Authorization: `Bearer ${user.token}` } : {};
};

const propertyService = {
  getAll: () => axios.get(API_URL),

  getById: (id) => axios.get(`${API_URL}/${id}`),

  create: (propertyData) =>
    axios.post(`${API_URL}/add`, propertyData, { headers: getAuthHeader() }),

  update: (id, propertyData) =>
    axios.put(`${API_URL}/edit/${id}`, propertyData, { headers: getAuthHeader() }),

  delete: (id) =>
    axios.delete(`${API_URL}/delete/${id}`, { headers: getAuthHeader() }),
};

export default propertyService;
