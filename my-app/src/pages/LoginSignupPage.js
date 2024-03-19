import React, { useState } from 'react';
import { toast } from 'react-toastify';

const LoginSignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Invalid email');
      return;
    }
    const response = await fetch(process.env.REACT_APP_BASE_URL+'/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // Handle the error situation
      const data = await response.json();
      toast.error(data.message);
      return;
    }
    const data = await response.json();

    if (response.ok) {
      localStorage.setItem('token', data.data.token);
      window.location.href = '/';
    } else {
      toast.error(data.message);
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
          <h1 className="text-2xl font-bold mb-8 text-center text-gray-700">Login</h1>
          <form className="space-y-4" onSubmit={handleLogin}>
            <input
                className="w-full p-2 border rounded bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500"
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="w-full p-2 border rounded bg-gray-50 focus:outline-none focus:bg-white focus:border-blue-500"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:bg-blue-600">Login</button>
          </form>
          {/*<button className="w-full p-2 bg-green-500 text-white rounded mt-4 hover:bg-green-600 focus:outline-none focus:bg-green-600">Sign Up</button>*/}
        </div>
      </div>
  );
};

export default LoginSignupPage;
