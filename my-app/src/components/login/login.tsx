import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import './login.css';
 
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post('https://localhost:7281/v1/Authentication/', credentials);
      
      setToken(response.data.token)
      setClientId(response.data.idClient)


      
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('userId', idClient);
      console.log(response.data.token);
      console.log(response.data.idClient);
      // Save the token or perform any necessary actions
    } catch (error : any) {
      setError(error.response.data);
    }
  };

  return (
    <div className="login-container">
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
  <p className="register-link">Don't have an account? </p><a href='https://www.google.com/'>Register</a>
  </div>
</div>

  );
};

export default LoginClient;
