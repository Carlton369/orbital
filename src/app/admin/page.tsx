'use client'
import React, { useState } from 'react';
import { auth, signInWithEmailAndPassword } from '../../firebase';
import { useRouter } from 'next/navigation';


const Login = () => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const email = 'orbital.onboard@gmail.com'; // Predefined email address
  
    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setError(null);
  
      try {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/admin/home')
      } catch (error) {
        setError('Invalid password. Please try again.');
        console.error('Error logging in:', error);
      }
    };
  
    return (
      <div className="login-container">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div>
            <label>Email</label>
            <input type="email" value={email} readOnly disabled />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    );
  };
  
  export default Login;