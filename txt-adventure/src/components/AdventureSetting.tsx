import React, { useState } from 'react';
import { ref, set, get, getDatabase } from 'firebase/database';
import { User } from 'firebase/auth';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import '../assets/Adventure.css';

interface AdventureSettingProps {
  user: User;
  setAdventureSetting: React.Dispatch<React.SetStateAction<string>>;
  setApiKey: React.Dispatch<React.SetStateAction<string>>;
  handleLogout: () => void;
}

const AdventureSetting: React.FC<AdventureSettingProps> = ({ user, setAdventureSetting, setApiKey, handleLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [adventureSetting, setLocalAdventureSetting] = useState('');
  const [apiKey, setLocalApiKey] = useState('');
  const [error, setError] = useState('');

  //List of places
  const adventureOptions = [
    'Hogwarts',
    'Castle Black',
    'Rivendell',
    'Narnia',
    'Atlantis'
  ];
  

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const handleAdventureSettingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalAdventureSetting(e.target.value);
    setError('');
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalApiKey(e.target.value);
    setError('');
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
        }
      };

      if(!adventureSetting) {
        setError('Please Select Adventure Setting');
        return;
      }
      if(!apiKey) {
        setError('Please enter API Key.');
        return;
      }

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
      <div className={`side-menu ${isSidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
        <div className="sidebar-content">
          <button className="sidebar-button" onClick={handleLogout} title="Sign Out">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className="tooltip">Sign Out</span>
          </button>
        </div>
      </div>
      <h2 className="adventure-title">Adventure Setting</h2>
      <select value={adventureSetting} onChange={handleAdventureSettingChange}>
        <option value="">Select Adventure Setting</option>
        {adventureOptions.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <p className="api-key-info">
        You need to add your own OpenAI API Key
        <br />
        Don't know how? Click here <a href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-secret-api-key" target='_blank'>GUIDE</a>
      </p>
      <input type="text" min={32} placeholder="OpenAI API Key" value={apiKey} onChange={handleApiKeyChange} />
      {error && <div className="error-message">{error}</div>} {/* Render the error message */}
      <button className="adventure-button" onClick={handleSaveAdventureSetting}>
        Save
      </button>
    </div>
  );
};

export default AdventureSetting;
