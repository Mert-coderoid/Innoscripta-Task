import React, { useState } from 'react';

const LoginSignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch(process.env.REACT_APP_BASE_URL+'/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('Login successful!', data);
      // Store the token to localStorage
      localStorage.setItem('token', data.data.token);

      // Start the session or redirect the user here.
      // For example, you can redirect the user to the home page.
      window.location.href = '/';
    } else {
      // Handle the error situation
      alert(data.message);
      console.log('Login failed:', data);
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
