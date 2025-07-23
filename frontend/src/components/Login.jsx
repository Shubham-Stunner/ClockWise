import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/login', { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form onSubmit={submit} className="bg-white p-8 rounded shadow w-80">
        <h1 className="text-2xl mb-4 text-center">ClockWise Login</h1>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
          className="w-full mb-2 p-2 border"
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
        <input
          className="w-full mb-4 p-2 border"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white p-2" type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
