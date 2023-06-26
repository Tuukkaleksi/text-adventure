import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth } from './config/firebaseConfig';
import Login from './components/Login';
import Signup from './components/Signup';
import AdventureSetting from './components/AdventureSetting';
import { signOut } from 'firebase/auth';

const App: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setTimeout(() => {
        setUser(currentUser);
        setLoading(false);
      }, 5000); //5 seconds just to test it
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      console.log("handleLogout")
    } catch (error: any) {
      console.error(error.message);
    }
  };

  if (loading) {
    // Show a loading indicator while user data is being loaded
    return <div>Loading...</div>;
  }

  return (
    <div>
      {user ? (
        <>
          <button onClick={handleLogout}>Logout</button>
          <AdventureSetting user={user} />
        </>
      ) : (
        <>
          <Login />
          <Signup />
        </>
      )}
    </div>
  );
};

export default App;