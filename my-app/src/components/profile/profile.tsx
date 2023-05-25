import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';

const api = axios.create();

// Add the interceptor
api.interceptors.request.use(
  (config) => {
    // Get stored token from localStorage
    const token = sessionStorage.getItem('token');
    
    // Add token to the header
    config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface Client {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface ClientProfileProps {
  
}

const Profile: React.FC<ClientProfileProps> = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const clientId = sessionStorage.getItem('userId');
        const response = await api.get<Client>(`http://localhost:5091/v1/client/${clientId}`);
        setClient(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error:any) {
        if(error.response){
          const status = error.response.status;
          const data = error.response.data;
          const errorMessage = `Request failed with status: ${status}\nError data: ${JSON.stringify(data)}`;
      
          console.log('Request failed with status:', status);
          console.log('Error data:', data);
         
          window.alert(errorMessage);
        }else{
          const errorMessage = `Error executing request: ${error.message}`;
  
          window.alert(errorMessage);
        }      
      }
    };

    fetchClientProfile();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='profile-container'>
    <div className="profile-card">
  <h1 className='profile-h1'>Client Profile</h1>
  <div className="client-info">
    <span>Name:</span>
    <p>{client?.name}</p>
  </div>
  <div className="client-info">
    <span>Email:</span>
    <p>{client?.email}</p>
  </div>
  <div className="client-info">
    <span>Address:</span>
    <p>{client?.address}</p>
  </div>
  <div className="client-info">
    <span>Phone:</span>
    <p>{client?.phone}</p>
  </div>
</div>
</div>
  );
};

export default Profile;
