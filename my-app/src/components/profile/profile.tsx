import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';

interface Client {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
}

interface ClientProfileProps {
  clientId: number;
}

const Profile: React.FC<ClientProfileProps> = ({ clientId }) => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClientProfile = async () => {
      try {
        const response = await axios.get<Client>(`http://localhost:5091/v1/client/${clientId}`);
        setClient(response.data);
        console.log(response.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchClientProfile();
  }, [clientId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='container'>
    <div className="card">
  <h1>Client Profile</h1>
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
