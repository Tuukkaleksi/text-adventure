import React, { useState, useEffect } from 'react';

import './App.css';
import './assets/images/white_flower.gif';
import Login from './components/Login';
import Signup from './components/Signup';
import AdventureSetting from './components/AdventureSetting';
import ChatRoom from './components/ChatRoom';

import { db, auth } from './config/firebaseConfig';
import { get, getDatabase, ref, update } from 'firebase/database';
import { signOut } from 'firebase/auth';
import { User } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSignup, setShowSignup] = useState(false);
  const [adventureSetting, setAdventureSetting] = useState('');
  const [apiKey, setApiKey] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setTimeout(() => {
        setUser(currentUser);
        setLoading(false);
      }, 1000); // 5 seconds just to test it
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        try {
          const dbRef = ref(db, `users/${user.uid}`);
          const snapshot = await get(dbRef);
          const userData = snapshot.val();
  
          if (userData) {
            setAdventureSetting(userData.adventureSetting);
            setApiKey(userData.apiKey);
          }
        } catch (error: any) {
          console.error(error.message);
        }
      };

      fetchUserData();
    }
  }, [user]);

  const handleLogout = async () => {
    try {
      if (user) {
        // Remove the apiKey from the user's data in the database
        const dbRef = ref(getDatabase(), `users/${user.uid}/settings`);
        await update(dbRef, { apiKey: null });
      }
  
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
    <div className="background">
      {user ? (
        <>
        {adventureSetting && apiKey ? (
          <ChatRoom user={user} handleLogout={handleLogout}  />
        ) : (
          <AdventureSetting user={user} setAdventureSetting={setAdventureSetting} setApiKey={setApiKey} handleLogout={handleLogout} />
        )}
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