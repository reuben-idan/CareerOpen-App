import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useNetwork } from '../../contexts/NetworkContext';
import { 
  ChatAlt2Icon, 
  SearchIcon, 
  PaperAirplaneIcon,
  UserCircleIcon,
  ClockIcon,
  CheckCircleIcon
} from '@heroicons/react/outline';
import { formatDistanceToNow } from 'date-fns';

const MessagesList = () => {
  const { 
    conversations, 
    notifications, 
    isLoading, 
    refreshConversations,
    refreshNotifications
  } = useNetwork();
  
  const { userId } = useParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeConversation, setActiveConversation] = useState(null);
  const messagesEndRef = useRef(null);

  // Set active conversation when userId changes
  useEffect(() => {
    if (userId && conversations) {
      const conversation = conversations.find(conv => 
        conv.other_user.id.toString() === userId
      );
      setActiveConversation(conversation || null);
    } else if (conversations?.length > 0) {
      // Default to first conversation if no userId is provided
      setActiveConversation(conversations[0]);
      navigate(`/network/messages/${conversations[0].other_user.id}`, { replace: true });
    }
  }, [userId, conversations, navigate]);

  // Scroll to bottom of messages when active conversation changes or new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [activeConversation]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter conversations based on search term
  const filteredConversations = conversations?.filter(conv => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      conv.other_user.first_name?.toLowerCase().includes(term) ||
      conv.other_user.last_name?.toLowerCase().includes(term) ||
      conv.last_message?.content?.toLowerCase().includes(term)
    );
  }) || [];

  // Handle sending a new message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !activeConversation) return;
    
    try {
      // TODO: Implement send message API call
      console.log('Sending message to', activeConversation.other_user.id, ':', message);
      
      // Optimistically update UI
      const newMessage = {
        id: Date.now(), // Temporary ID
        sender: { id: 'current-user' }, // Will be replaced with actual user
        recipient: activeConversation.other_user,
        content: message,
        is_read: false,
        created_at: new Date().toISOString(),
        isSending: true
      };
      
      // Update the conversation with the new message
      setActiveConversation(prev => ({
        ...prev,
        last_message: newMessage,
        messages: [...(prev?.messages || []), newMessage]
      }));
      
      // Clear the message input
      setMessage('');
      
      // Refresh conversations to get the actual message from the server
      await refreshConversations();
      
      // Scroll to bottom after message is sent
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error sending message:', error);
      // TODO: Show error message to user
    }
  };

  // Mark conversation as read
  const markAsRead = async (conversation) => {
    if (conversation.unread_count > 0) {
      try {
        // TODO: Implement mark as read API call
        console.log('Marking conversation as read:', conversation.other_user.id);
        await refreshConversations();
        await refreshNotifications();
      } catch (error) {
        console.error('Error marking conversation as read:', error);
      }
    }
  };

  // Loading state
  if (isLoading.conversations) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  // No conversations state
  if (conversations?.length === 0) {
    return (
      <div className="text-center py-12">
        <ChatAlt2Icon className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
        <p className="mt-1 text-sm text-gray-500">
          Start a conversation by connecting with other users.
        </p>
        <div className="mt-6">
          <Link
            to="/network/connect"
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            Find connections
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-200px)] bg-white rounded-lg shadow overflow-hidden">
      {/* Sidebar with conversations */}
      <div className="w-full md:w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Messages</h2>
          <div className="mt-2 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
              placeholder="Search messages"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length > 0 ? (
            <ul className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <li 
                  key={conversation.other_user.id}
                  className={`${
                    activeConversation?.other_user.id === conversation.other_user.id 
                      ? 'bg-gray-50' 
                      : 'hover:bg-gray-50'
                  } border-l-4 ${
                    activeConversation?.other_user.id === conversation.other_user.id 
                      ? 'border-primary-500' 
                      : 'border-transparent'
                  }`}
                >
                  <Link
                    to={`/network/messages/${conversation.other_user.id}`}
                    className="block px-4 py-4"
                    onClick={() => {
                      setActiveConversation(conversation);
                      markAsRead(conversation);
                    }}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        {conversation.other_user.profile_image ? (
                          <img
                            className="h-10 w-10 rounded-full"
                            src={conversation.other_user.profile_image}
                            alt={`${conversation.other_user.first_name} ${conversation.other_user.last_name}`}
                          />
                        ) : (
                          <UserCircleIcon className="h-10 w-10 text-gray-300" />
                        )}
                      </div>
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="flex justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {`${conversation.other_user.first_name} ${conversation.other_user.last_name}`}
                          </p>
                          <div className="text-xs text-gray-500">
                            {conversation.last_message && formatDistanceToNow(
                              new Date(conversation.last_message.created_at), 
                              { addSuffix: true }
                            )}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500 truncate">
                          {conversation.last_message?.content || 'No messages yet'}
                        </p>
                      </div>
                      {conversation.unread_count > 0 && (
                        <span className="ml-2 inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-500 text-white text-xs font-medium">
                          {conversation.unread_count}
                        </span>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-sm text-gray-500">
              No conversations found
            </div>
          )}
        </div>
      </div>

      {/* Message area */}
      <div className="hidden md:flex flex-col flex-1 bg-white">
        {activeConversation ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-gray-200 flex items-center">
              <div className="flex-shrink-0">
                {activeConversation.other_user.profile_image ? (
                  <img
                    className="h-10 w-10 rounded-full"
                    src={activeConversation.other_user.profile_image}
                    alt={`${activeConversation.other_user.first_name} ${activeConversation.other_user.last_name}`}
                  />
                ) : (
                  <UserCircleIcon className="h-10 w-10 text-gray-300" />
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {`${activeConversation.other_user.first_name} ${activeConversation.other_user.last_name}`}
                </p>
                <p className="text-xs text-gray-500">
                  {activeConversation.other_user.headline || 'No headline'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 p-4 overflow-y-auto"
              style={{ maxHeight: 'calc(100vh - 300px)' }}
            >
              {activeConversation.messages?.length > 0 ? (
                <div className="space-y-4">
                  {activeConversation.messages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.sender.id === 'current-user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs md:max-w-md lg:max-w-lg xl:max-w-xl rounded-lg px-4 py-2 ${
                          msg.sender.id === 'current-user' 
                            ? 'bg-primary-600 text-white' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <div className={`flex items-center mt-1 text-xs ${
                          msg.sender.id === 'current-user' 
                            ? 'text-primary-200' 
                            : 'text-gray-500'
                        }`}>
                          <span>
                            {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                          </span>
                          {msg.sender.id === 'current-user' && (
                            <span className="ml-1">
                              {msg.is_read ? (
                                <CheckCircleIcon className="h-3.5 w-3.5 inline" />
                              ) : (
                                <ClockIcon className="h-3.5 w-3.5 inline" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ChatAlt2Icon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Start the conversation with {activeConversation.other_user.first_name}
                  </p>
                </div>
              )}
            </div>

            {/* Message input */}
            <div className="border-t border-gray-200 p-4">
              <form onSubmit={handleSendMessage} className="flex">
                <input
                  type="text"
                  className="flex-1 min-w-0 block w-full px-3 py-2 rounded-l-md border border-gray-300 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  placeholder={`Message ${activeConversation.other_user.first_name}...`}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                  disabled={!message.trim()}
                >
                  <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" aria-hidden="true" />
                  <span className="sr-only">Send message</span>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-8">
            <ChatAlt2Icon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No conversation selected</h3>
            <p className="mt-1 text-sm text-gray-500">
              Select a conversation or start a new one
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesList;
