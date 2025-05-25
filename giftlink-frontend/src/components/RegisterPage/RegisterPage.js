import React, { useState } from 'react';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showerr, setShowerr] = useState('');

  const navigate = useNavigate();
  const { setIsLoggedIn } = useAppContext();

  const handleRegister = async () => {
    try {
      const response = await fetch(`${urlConfig.backendUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: firstName,
          lastName: lastName,
          email: email,
          password: password,
        }),
      });

      const json = await response.json();

      if (json.authtoken) {
        sessionStorage.setItem('auth-token', json.authtoken);
        sessionStorage.setItem('name', firstName);
        sessionStorage.setItem('email', json.email);

        setIsLoggedIn(true);
        navigate('/app');
      } else if (json.error) {
        setShowerr(json.error);
      }
    } catch (e) {
      setShowerr('Something went wrong. Please try again.');
      console.error('Error registering user:', e.message);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>

      {showerr && <div className="text-danger mb-3">{showerr}</div>}

      <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>
        <div className="mb-3">
          <label>First Name</label>
          <input type="text" className="form-control" value={firstName}
            onChange={(e) => setFirstName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Last Name</label>
          <input type="text" className="form-control" value={lastName}
            onChange={(e) => setLastName(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Email</label>
          <input type="email" className="form-control" value={email}
            onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password}
            onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="btn btn-primary">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
