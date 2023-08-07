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
  const [error, setError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setError(''); // Clear the error when the user starts typing
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setError(''); // Clear the error when the user starts typing
  };

  const handleLogin = async () => {
    try {

    // Email and password validation
    if (!email) {
      setError('Please enter your email.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

      await signInWithEmailAndPassword(auth, email, password);
      console.log('User found');
    } catch (error: any) {
      console.error(error.message);
      setError('Invalid email or password.');
    }
  };

  return (
    <>
    <div className="login-container">
      <h2>Sign In</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={handleEmailChange}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={handlePasswordChange}
      />
      {error && <div className="error-message">{error}</div>} {/* Render the error message */}
      <button onClick={handleLogin}>Sign In</button>
      <div className="signup-link">
        Don't have an account?{' '}
        <span onClick={() => setShowSignup(true)}>Sign Up</span>
      </div>
    </div>
    <footer className="footer">
      <p>© 2023. All rights reserved. | <a href="https://github.com/Tuukkaleksi/text-adventure" target='_blank'>GitHub</a></p>
    </footer>
    </>
  );
};

export default Login;