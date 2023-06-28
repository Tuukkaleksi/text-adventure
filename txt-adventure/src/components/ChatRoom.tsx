import React, { useState } from 'react';
import '../assets/ChatRoom.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faMusic, faLightbulb, faEllipsisV, faPaperPlane } from '@fortawesome/free-solid-svg-icons';

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

  const toggleSidebar = () => {
    setIsSidebarOpen((prevState) => !prevState);
  };

  const sendMessage = () => {
    if (inputMessage.trim() !== '') {
      const newMessage: Message = {
        id: Math.random().toString(),
        content: inputMessage,
        sender: user.email,
      };
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setInputMessage('');
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
        <p className="user-email">Adventure: {user.AdventureSetting}</p>
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