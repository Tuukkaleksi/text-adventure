import React, { useState } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import firebase from 'firebase/compat/app';

const AdventureSetting: React.FC<{ user: firebase.User }> = ({ user }) => {
  const [adventureSetting, setAdventureSetting] = useState('');

  const handleAdventureSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdventureSetting(e.target.value);
  };

  const handleSaveAdventureSetting = async () => {
    try {
      // Save the adventure setting to the user's document in the database
      await updateDoc(doc(db, 'users', user.uid), {
        adventureSetting: adventureSetting,
      });
      console.log('Adventure setting saved');
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <h2>Adventure Setting</h2>
      <input
        type="text"
        placeholder="Enter Adventure Setting"
        value={adventureSetting}
        onChange={handleAdventureSettingChange}
      />
      <button onClick={handleSaveAdventureSetting}>Save</button>
    </div>
  );
};

export default AdventureSetting;
