import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import '../assets/Login.css'; // Import the CSS file for styling

interface LoginProps {
  setShowSignup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Login: React.FC<LoginProps> = ({ setShowSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      console.log('User found');
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Sign In</button>
      <div className="signup-link">
        Don't have an account?{' '}
        <span onClick={() => setShowSignup(true)}>Sign Up</span>
      </div>
    </div>
  );
};

export default Login;