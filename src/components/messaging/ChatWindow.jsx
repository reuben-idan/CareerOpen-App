// components/ChatWindow.jsx
import React, { useRef, useEffect } from "react";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const ChatWindow = ({
  conversation,
  onSendMessage,
  messageInput,
  setMessageInput,
  attachments,
  setAttachments,
}) => {
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation.messages]);

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          {conversation.avatar ? (
            <img
              src={conversation.avatar}
              alt={conversation.name}
              className="h-10 w-10 rounded-full object-cover"
            />
          ) : (
            <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700" />
          )}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              {conversation.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {conversation.isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <PhoneIcon className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <VideoCameraIcon className="h-5 w-5" />
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {conversation.messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.senderId === "current-user"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.senderId === "current-user"
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
              }`}
            >
              {message.text}
              {message.attachments?.map((attachment, i) => (
                <div key={i} className="mt-2">
                  {attachment.type.startsWith("image/") ? (
                    <img
                      src={attachment.url}
                      alt="Attachment"
                      className="rounded-lg max-w-full h-auto"
                    />
                  ) : (
                    <a
                      href={attachment.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm underline"
                    >
                      {attachment.name}
                    </a>
                  )}
                </div>
              ))}
              <p className="text-xs mt-1 opacity-75">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Attachments Preview */}
      {attachments.length > 0 && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="relative group">
                {file.type.startsWith("image/") ? (
                  <img
                    src={URL.createObjectURL(file)}
                    alt="Preview"
                    className="h-20 w-20 object-cover rounded-lg"
                  />
                ) : (
                  <div className="h-20 w-20 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <PaperClipIcon className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <button
                  onClick={() => removeAttachment(index)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <form onSubmit={onSendMessage} className="flex items-end space-x-2">
          <div className="flex-1">
            <textarea
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Type a message..."
              rows={1}
              className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  onSendMessage(e);
                }
              }}
            />
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <PaperClipIcon className="h-5 w-5" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <FaceSmileIcon className="h-5 w-5" />
            </button>
            <button
              type="submit"
              disabled={!messageInput.trim() && attachments.length === 0}
              className="p-2 text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ChatWindow.propTypes = {
  conversation: PropTypes.object.isRequired,
  onSendMessage: PropTypes.func.isRequired,
  messageInput: PropTypes.string.isRequired,
  setMessageInput: PropTypes.func.isRequired,
  attachments: PropTypes.array.isRequired,
  setAttachments: PropTypes.func.isRequired,
};

export default ChatWindow;
