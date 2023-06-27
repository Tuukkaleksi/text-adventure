import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import AdventureSetting from './components/AdventureSetting';
import firebase from 'firebase/app';
import { auth, db } from './config/firebaseConfig';
import { signOut } from 'firebase/auth';
import { update, ref } from 'firebase/database';

const App: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setTimeout(() => {
        setUser(currentUser);
        setLoading(false);
      }, 10000); // 5 seconds just to test it
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      // Remove the apiKey from the user's data in the database
      const dbRef = ref(db, `users/${user?.uid}`);
      await update(dbRef, { apiKey: null });
      
      await signOut(auth);
      setUser(null);
      console.log('handleLogout');
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (loading) {
    // Show a loading indicator while user data is being loaded
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <h2 className="loading-description">Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      {user ? (
        <>
          <button className="logout-button" onClick={handleLogout}>Logout</button>
          <AdventureSetting user={user} />
        </>
      ) : (
        <>
          {!showSignup && <Login setShowSignup={setShowSignup} />} {/* Render Login by default */}
          {showSignup && <Signup setShowSignup={setShowSignup} />} {/* Render Signup when showSignup is true */}
        </>
      )}
    </div>
  );
};

export default App;