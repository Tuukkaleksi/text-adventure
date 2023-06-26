import React, { useState, useEffect } from 'react';
import firebase from 'firebase/app';
import { auth } from './config/firebaseConfig';
import Login from './components/Login';
import Signup from './components/Signup';
import AdventureSetting from './components/AdventureSetting';

const App: React.FC = () => {
  const [user, setUser] = useState<firebase.User | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    if (!user) {
      setUser(null);
    }

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {user ? (
        <AdventureSetting user={user} />
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