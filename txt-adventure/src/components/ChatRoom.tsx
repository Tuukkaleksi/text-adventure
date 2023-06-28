import React, { useState, useEffect } from 'react';
import '../assets/ChatRoom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faMusic, faLightbulb, faEllipsisV, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { generateAIResponse } from './OpenAIHandler'; // Import the OpenAI handler function
import { getDatabase, ref, get } from 'firebase/database';

interface ChatRoomProps {
  user: firebase.User;
  handleLogout: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ user, handleLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [adventureSetting, setAdventureSetting] = useState('');
  const [apiKey, setApiKey] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dbRef = ref(getDatabase(), `users/${user.uid}`);
        const snapshot = await get(dbRef);
        const userData = snapshot.val();

        if (userData && userData.settings) {
          setAdventureSetting(userData.settings.adventureSetting);
          setApiKey(userData.settings.apiKey);
        }
      } catch (error) {
        console.error('Error fetching adventure setting and API key:', error);
      }
    };

    fetchData();
  }, [user]);

  useEffect(() => {
    // Only proceed if both adventureSetting and apiKey are available
    if (adventureSetting && apiKey) {
      const welcomeMessage: Message = {
        id: Math.random().toString(),
        content: `Welcome to the Chat Room in ${adventureSetting}!`,
        sender: 'AI',
      };
      setMessages((prevMessages) => [...prevMessages, welcomeMessage]);

      const initialPrompt = `You are in ${adventureSetting}. What would you like to do?`;
      generateAIResponse(initialPrompt, apiKey)
        .then((response) => {
          const aiMessage: Message = {
            id: Math.random().toString(),
            content: response,
            sender: 'AI',
          };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        })
        .catch((error) => {
          console.error('Error generating AI response:', error);
        });
        console.log(apiKey);
    }
  }, [adventureSetting, apiKey]);

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: Math.random().toString(),
        content: inputMessage,
        sender: user.email,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage('');

      const prompt = `You are in ${adventureSetting}. ${inputMessage}`;
      generateAIResponse(prompt, apiKey)
        .then((response) => {
          const aiMessage: Message = {
            id: Math.random().toString(),
            content: response,
            sender: 'AI',
          };
          setMessages((prevMessages) => [...prevMessages, aiMessage]);
        })
        .catch((error) => {
          console.error('Error generating AI response:', error);
        });
    }
  };

  return (
    <div className="chatroom-container">
      <div className={`side-menu ${isSidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
        <div className="sidebar-content">
          <button className="sidebar-button" title="Toggle Light Mode">
            <FontAwesomeIcon icon={faLightbulb} />
            <span className="tooltip">Light Mode</span>
          </button>
          <button className="sidebar-button" title="Music">
            <FontAwesomeIcon icon={faMusic} />
            <span className="tooltip">Music</span>
          </button>
          <button className="sidebar-button" onClick={handleLogout} title="Sign Out">
            <FontAwesomeIcon icon={faSignOutAlt} />
            <span className="tooltip">Sign Out</span>
          </button>
        </div>
      </div>
      <div className="chatroom-content">
        <h2 className="welcome-message">Welcome to the Chat Room</h2>
        <p className="user-email">User: {user.email}</p>
        <p className="user-email">Adventure: {adventureSetting}</p>
        <div className="chat-area">
          {messages.map((message) => (
            <div
              className={`message ${message.sender === user.email ? 'user-message' : 'ai-message'}`}
              key={message.id}
            >
              <span className="message-content">{message.content}</span>
            </div>
          ))}
        </div>
        <div className="input-area">
          <input
            type="text"
            placeholder="Type your message..."
            className="message-input"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
          />
          <button className="send-button" onClick={sendMessage}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;