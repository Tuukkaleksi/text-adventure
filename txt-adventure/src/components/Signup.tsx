import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { getDatabase, ref, set } from 'firebase/database';

const Signup: React.FC = () => {
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
    <div>
      <h2>Signup</h2>
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
      <button onClick={handleSignup}>Signup</button>
    </div>
  );
};

export default Signup;