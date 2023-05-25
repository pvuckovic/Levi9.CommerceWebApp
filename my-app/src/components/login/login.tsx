import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import LogoWhite from '../../assets/icons/logowhite';

export const Header = styled.div`
position: absolute;
height: auto;
left: 0px;
right: 0px;
top: 0px;
background: white;
`;

interface AuthenticationRequest {
  Email: string;
  Password: string;
}

const LoginClient: React.FC = () => {
  const [credentials, setCredentials] = useState<AuthenticationRequest>({
    Email: '',
    Password: '',
  });

  const [error, setError] = useState<string>('');
  const [token, setToken] = useState('');
  const [idClient, setClientId] = useState('');

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7281/v1/Authentication/', credentials);

      const token = response.data.token; //ove dve linije
      const idClient = response.data.idClient;

      setToken(token)
      setClientId(idClient)

      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', idClient);
      console.log(response.data.token);
      console.log(response.data.idClient);

      navigate('/products');
    } catch (error: any) {
      setError(error.response.data);
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <div className="login-container">
      <Header> <LogoWhite /> </Header>
      <div className='login-card'>
        <h2 className='login-header'>Log in</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            className="login-input"
            type="email"
            name="Email"
            placeholder="Email"
            value={credentials.Email}
            onChange={handleChange}
            required
          />
          <input
            className="login-input"
            type="password"
            name="Password"
            placeholder="Password"
            value={credentials.Password}
            onChange={handleChange}
            required
          />
          <button className="login-button" type="submit">Login</button>
        </form>
        {error && <p className="login-error">{error}</p>}
        <p className="register-link">Don't have an account? <a href='' onClick={handleRegister}>Register</a></p>
      </div>
    </div>

  );
};

export default LoginClient;
