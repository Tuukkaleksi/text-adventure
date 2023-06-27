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

  const handleSignup = async () => {
    try {
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
    <div className="signup-container">
      <h2>Sign Up</h2>
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
      <button onClick={handleSignup}>Sign Up</button>
      <div className="login-link">
        Already have an account?{' '}
        <span onClick={() => setShowSignup(false)}>Sign In</span>
      </div>
    </div>
  );
};

export default Signup;