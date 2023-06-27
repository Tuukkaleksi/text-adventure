import { useState } from 'react';
import { ref, set, get } from 'firebase/database';
import { db } from '../config/firebaseConfig';
import firebase from 'firebase/compat/app';
import '../assets/Adventure.css';

const AdventureSetting: React.FC<{ user: firebase.User }> = ({ user }) => {
  const [adventureSetting, setAdventureSetting] = useState('');
  const [apiKey, setApiKey] = useState('');

  const handleAdventureSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAdventureSetting(e.target.value);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
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
        adventureSetting: adventureSetting,
        apiKey: apiKey
      };
  
      // Save the updated data back to the database
      await set(dbRef, updatedUserData);
  
      console.log('Adventure setting and API key saved');
    } catch (error: any) {
      console.error(error.message);
    }
  };

  return (
    <div className="adventure-container">
      <h2 className="adventure-title">Adventure Setting</h2>
      <input
        type="text"
        placeholder="Enter Adventure Setting"
        value={adventureSetting}
        onChange={handleAdventureSettingChange}
      />
      <p className="api-key-info">
        You need to add your own OpenAI API Key
        <br />
        Don't know how? Click here <a href="#">GUIDE</a>
      </p>
      <input
        type="text"
        placeholder="OpenAI API Key"
        value={apiKey}
        onChange={handleApiKeyChange}
      />
      <button className="adventure-button" onClick={handleSaveAdventureSetting}>Save</button>
    </div>
  );
};

export default AdventureSetting;