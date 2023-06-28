import React, { useState } from 'react';
import { ref, set, get, getDatabase } from 'firebase/database';
import firebase from 'firebase/compat/app';
import '../assets/Adventure.css';

interface AdventureSettingProps {
  user: firebase.User;
  setAdventureSetting: React.Dispatch<React.SetStateAction<string>>;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
}

const AdventureSetting: React.FC<AdventureSettingProps> = ({ user, setAdventureSetting, setApiKey }) => {
  const [adventureSetting, setLocalAdventureSetting] = useState('');
  const [apiKey, setLocalApiKey] = useState('');

  const handleAdventureSettingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalAdventureSetting(e.target.value);
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalApiKey(e.target.value);
  };

  const handleSaveAdventureSetting = async () => {
    try {
      const dbRef = ref(getDatabase(), `users/${user.uid}`);
      const snapshot = await get(dbRef);
      const userData = snapshot.val();

      const updatedUserData = {
        ...userData,
        email: user.email,
        settings: {
          adventureSetting: adventureSetting, // Setting for the Adventure
          apiKey: apiKey, // User's own OpenAI API Key
        },
      };

      await set(dbRef, updatedUserData);

      setAdventureSetting(adventureSetting);
      setApiKey(apiKey);

      console.log('Adventure setting and API key saved');
    } catch (error) {
      console.error('Error saving adventure setting and API key:', error);
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
      <input type="text" placeholder="OpenAI API Key" value={apiKey} onChange={handleApiKeyChange} />
      <button className="adventure-button" onClick={handleSaveAdventureSetting}>
        Save
      </button>
    </div>
  );
};

export default AdventureSetting;