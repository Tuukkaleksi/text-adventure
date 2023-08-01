import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { getDatabase, ref, set } from 'firebase/database';
import '../assets/Signup.css';

interface SignupProps {
  setShowSignup: React.Dispatch<React.SetStateAction<boolean>>;
}

const Signup: React.FC<SignupProps> = ({ setShowSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError(''); // Clear the email error when the user starts typing
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError(''); // Clear the password error when the user starts typing
  };

  const handleSignup = async () => {
    try {
      // Email check
      if (email === '') {
        setEmailError('Please enter an email address.');
        return;
      }

      // Password check
      if (!/(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
        setPasswordError('Password should contain at least one number and one special character.');
        return;
      }

      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      console.log('User created');

      // Create a database entry for the user
      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);
      set(userRef, { email: email, data: 'test' }); // Change the data value as needed
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <>
    <div className="signup-container">
      <h2>Sign Up</h2>
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
      {emailError && <div className="error-message">{emailError}</div>}
      {passwordError && <div className="error-message">{passwordError}</div>}
      <button onClick={handleSignup}>Sign Up</button>
      <div className="login-link">
        Already have an account?{' '}
        <span onClick={() => setShowSignup(false)}>Sign In</span>
      </div>
    </div>
    <footer className="footer">
      <p>© 2023. All rights reserved. | <a href="#">Terms of Service</a> | <a href="#">Privacy Policy</a> | <a href="#" target='_blank'>GitHub</a></p>
    </footer>
    </>
  );
};

export default Signup;