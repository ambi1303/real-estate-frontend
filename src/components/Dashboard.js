import { useState, useContext } from 'react';
import propertyService from '../services/propertyService';
import { AuthContext } from '../context/AuthContext';
const Dashboard = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const { user } = useContext(AuthContext);

  const handleAdd = async () => {
    if (!user || user.role !== 'admin') return alert('Unauthorized!');
    try {
      await propertyService.create({ name, location }, user.token);
      alert('Property Added!');
    } catch (error) {
      console.error('Error adding property:', error);
    }
  };

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <input type="text" placeholder="Property Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="text" placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <button onClick={handleAdd}>Add Property</button>
    </div>
  );
};

export default Dashboard;
