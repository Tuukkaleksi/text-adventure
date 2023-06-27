import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import firebase from 'firebase/compat/app';

const AdventureSetting: React.FC<{ user: firebase.User }> = ({ user }) => {
  const [adventureSetting, setAdventureSetting] = useState('');

  const handleAdventureSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdventureSetting(e.target.value);
  };

  const handleSaveAdventureSetting = async () => {
    try {
      // Retrieve the user's data from the database
      const dbRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(dbRef);
      const userData = snapshot.val();
  
      // Update the adventure setting in the user's data
      const updatedUserData = {
        ...userData,
        adventureSetting: adventureSetting
      };
  
      // Save the updated data back to the database
      await set(dbRef, updatedUserData);
  
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
      <h3>Current Setting: {adventureSetting}</h3>
    </div>
  );
};

export default AdventureSetting;