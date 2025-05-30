import React, { useState, useEffect } from 'react';
import './LoginPage.css';
import { urlConfig } from '../../config';
import { useAppContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [incorrect, setIncorrect] = useState('');

    const navigate = useNavigate();
    const bearerToken = sessionStorage.getItem('bearer-token');
    const { setIsLoggedIn } = useAppContext();

    useEffect(() => {
        if (sessionStorage.getItem('auth-token')) {
            navigate('/app');
        }
    }, [navigate]);

const handleLogin = async () => {
  try {
    const response = await fetch(`${urlConfig}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': bearerToken ? `Bearer ${bearerToken}` : ''
      },
      body: JSON.stringify({
        email: email,
        password: password,
      })
    });

    // Task 1: Access data coming from fetch API
    const json = await response.json();

    if (json.authtoken) {
      // Task 2: Set user details
      sessionStorage.setItem('auth-token', json.authtoken);
      sessionStorage.setItem('name', json.userName);
      sessionStorage.setItem('email', json.userEmail);

      // Task 3: Set user state to logged in
      setIsLoggedIn(true);

      // Task 4: Navigate to MainPage
      navigate('/app');

      // Clear inputs and error (optional cleanup)
      setEmail('');
      setPassword('');
      setIncorrect('');
    } else {
      // Task 5: Clear input and set error message
      setEmail('');
      setPassword('');
      setIncorrect("Wrong password. Try again.");

      // Clear error message after 2 seconds (optional but recommended)
      setTimeout(() => {
        setIncorrect('');
      }, 2000);
    }
  } catch (e) {
    console.error("Error fetching details: " + e.message);
    setIncorrect('Something went wrong. Please try again later.');
  }
};


    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="login-card p-4 border rounded">
                        <h2 className="text-center mb-4 font-weight-bold">Login</h2>

                        {incorrect && (
                            <div className="alert alert-danger text-center" role="alert">
                                {incorrect}
                            </div>
                        )}

                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                id="email"
                                type="text"
                                className="form-control"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                id="password"
                                type="password"
                                className="form-control"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button className="btn btn-primary w-100 mb-3" onClick={handleLogin}>
                            Login
                        </button>

                        <p className="mt-4 text-center">
                            New here? <a href="/app/register" className="text-primary">Register Here</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
