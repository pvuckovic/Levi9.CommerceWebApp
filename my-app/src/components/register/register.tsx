import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import axios from 'axios';
import './register.css';
import { useNavigate } from 'react-router-dom';

interface Client {
  Name: string;
  Address: string;
  Email: string;
  Password: string;
  Phone: string;
  PriceListId: number;
}

interface PriceList {
  id: number;
  name: string;
}

const RegisterClient: React.FC = () => {
  const [client, setClient] = useState<Client>({
    Name: '',
    Address: '',
    Email: '',
    Password: '',
    Phone: '',
    PriceListId: 0,
  });

  const [priceLists, setPriceLists] = useState<PriceList[]>([]);
  const [message, setMessage] = useState<string>('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchPriceLists();
  }, []);

  const fetchPriceLists = async () => {
    try {
      const response = await axios.get('https://localhost:7281/v1/pricelist/');
      const data = response.data;

      if (Array.isArray(data) && data.length > 0) {
        const priceLists = data.map((item: PriceList) => ({
          id: item.id,
          name: item.name,
        }));
        setPriceLists(priceLists);
      }
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

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (e.target.name === 'PriceListId') {
      setClient({ ...client, [e.target.name]: parseInt(e.target.value, 10) });
    } else {
      setClient({ ...client, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7281/v1/Client/', client);
      console.log(response);
      setMessage('Client created successfully');

      navigate('/');
      
    } catch (error: any) {
      setMessage(error.response.data);

    }
  };

  return (
    <div className="register-container">
        <div className="register-card">
            <h2 className='register-header'>Create client</h2>
  <form className="register-form" onSubmit={handleSubmit}>
    <input
      className="register-input"
      type="text"
      name="Name"
      placeholder="Name"
      value={client.Name}
      onChange={handleChange}
      required
    />
    <input
      className="register-input"
      type="text"
      name="Address"
      placeholder="Address"
      value={client.Address}
      onChange={handleChange}
      required
    />
    <input
      className="register-input"
      type="email"
      name="Email"
      placeholder="Email"
      value={client.Email}
      onChange={handleChange}
      required
    />
    <input
      className="register-input"
      type="password"
      name="Password"
      placeholder="Password"
      value={client.Password}
      onChange={handleChange}
      required
    />
    <input
      className="register-input"
      type="text"
      name="Phone"
      placeholder="Phone"
      value={client.Phone}
      onChange={handleChange}
      required
      pattern="\d{10}"
    />
    <select
      className="register-select"
      name="PriceListId"
      value={client.PriceListId}
      onChange={handleChange}
      required
    >
      <option value="">Select Price List</option>
      {priceLists.map((priceList: PriceList) => (
        <option key={priceList.id} value={priceList.id}>
          {priceList.name}
        </option>
      ))}
    </select>
    <button className="register-button" type="submit">Create Client</button>
  </form>
  {message && <p className="message">{message}</p>}
  </div>
</div>
  );
};

export default RegisterClient;
