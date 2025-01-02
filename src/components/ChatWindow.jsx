// components/ChatWindow.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import MessageInput from "./MessageInput";

const ChatWindow = ({ conversation }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi, how are you?",
      sender: "John Doe",
      timestamp: "2m ago",
    },
    {
      id: 2,
      text: "I'm good, thanks! How about you?",
      sender: "Me",
      timestamp: "1m ago",
    },
  ]);

  const handleSend = (text) => {
    setMessages([
      ...messages,
      { id: messages.length + 1, text, sender: "Me", timestamp: "Just now" },
    ]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gray-100">
        <h3 className="text-gray-800 font-semibold">{conversation.name}</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-4 ${
              message.sender === "Me" ? "text-right" : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-2 rounded-lg ${
                message.sender === "Me"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {message.text}
            </div>
            <div className="text-xs text-gray-400">{message.timestamp}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <MessageInput onSend={handleSend} />
    </div>
  );
};

ChatWindow.propTypes = {
  conversation: PropTypes.object.isRequired,
};

export default ChatWindow;
