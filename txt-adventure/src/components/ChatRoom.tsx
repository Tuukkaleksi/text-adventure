import React, { useState, useEffect, useRef } from 'react';
import '../assets/ChatRoom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faMusic, faLightbulb, faEllipsisV, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { generateAIResponse } from './OpenAIHandler'; // Import the OpenAI handler function
import { getDatabase, ref, get } from 'firebase/database';
import { User } from 'firebase/auth';

interface ChatRoomProps {
  user: User;
  handleLogout: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ user, handleLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [error, setError] = useState('');
  const [inputMessage, setInputMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [adventureSetting, setAdventureSetting] = useState('');
  const [apiKey, setApiKey] = useState('');
  const previousAiResponseRef = useRef('');

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  // Fetch adventureSetting and apiKey
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
        // Send error if adventureSetting and apiKey not found
        console.error('Error fetching adventure setting and API key:', error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    // Only proceed if both adventureSetting and apiKey are available
    // AI Doesn't work if apiKey is false or incorrect
    if (adventureSetting && apiKey) {
      const welcomeMessage: Message = {
        id: Math.random().toString(),
        content: `Your Adventure Begins in ${adventureSetting}! Shall the Story Begin.`,
        sender: 'AI',
      };
      setMessages((prevMessages) => [...prevMessages, welcomeMessage]);

      const examplestory = `As I stood at the foot of Aslan's throne, I was filled with awe and wonder at the sight before me. The Lion himself sat on`;
      const initialPrompt = `You are in ${adventureSetting}. Your task is to craft an engaging story while staying within the confines of this setting. 
      Ensure that you do not deviate from the topic and maintain the focus on ${adventureSetting}. 
      Let your imagination run wild as you weave a captivating tale. Example how to start the story: ${examplestory}`;
      generateAIResponse(initialPrompt, apiKey)
        .then((response) => {
          // Check if the AI response is the same as the previous one
          if (response === previousAiResponseRef.current) {
            // Generate a new response if it's the same
            generateAIResponse(initialPrompt, apiKey)
              .then((newResponse) => {
                handleAiResponse(newResponse);
              })
              .catch((error) => {
                console.error('Error generating AI response:', error);
              });
          } else {
            handleAiResponse(response);
          }
        })
        .catch((error) => {
          console.error('Error generating AI response:', error);
        });
    }
  }, [adventureSetting, apiKey]);

  const handleAiResponse = (response: string) => {
    const aiMessage: Message = {
      id: Math.random().toString(),
      content: response,
      sender: 'AI',
    };

    setMessages((prevMessages) => [...prevMessages, aiMessage]);
    previousAiResponseRef.current = response;
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: Math.random().toString(),
        content: inputMessage,
        sender: user.email ?? '',
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage('');

      const prompt = `You are in ${adventureSetting}. Your task is to craft an engaging story while staying within the confines of this setting. 
      Ensure that you do not deviate from the topic and maintain the focus on ${adventureSetting}. 
      Let your imagination run wild as you weave a captivating tale and continue the story with users input: ${inputMessage}`;
      generateAIResponse(prompt, apiKey)
        .then((response) => {
          handleAiResponse(response);

          // Generate a fitting question based on the AI response
          let question = '';

          const questionMessage: Message = {
            id: Math.random().toString(),
            content: question,
            sender: 'AI',
          };

          setMessages((prevMessages) => [...prevMessages, questionMessage]);
        })
        .catch((error) => {
          console.error('Error generating AI response:', error);
          setError('There was an Error! Are you sure API Key works?');
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
        <h2 className="welcome-message">Welcome To Your Adventure!</h2>
        <p className="user-email">Current User: {user.email}</p>
        <p className="user-email">Adventure Setting: {adventureSetting}</p>
        {error && <div className="error-message">{error}</div>} {/* Render the error message */}
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