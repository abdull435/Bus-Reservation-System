import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/login', formData);
      if (res.data.success) {
        setMessage('Login successful!');
        // You can store user in localStorage or navigate to dashboard
        // localStorage.setItem("user", JSON.stringify(res.data.user));
      } else {
        setMessage('Login failed: ' + res.data.message);
      }
    } catch (err) {
      setMessage('Login error: ' + err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="email" name="email" placeholder="Email" required
          onChange={handleChange}
          className="w-full p-2 border rounded" />
        <input type="password" name="password" placeholder="Password" required
          onChange={handleChange}
          className="w-full p-2 border rounded" />
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Log In</button>
      </form>
      {message && <p className="mt-4 text-center text-sm text-red-500">{message}</p>}
    </div>
  );
};

export default Login;