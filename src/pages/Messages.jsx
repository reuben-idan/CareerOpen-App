import { useState } from "react";
import Sidebar from "../components/layout/Sidebar";
import ChatWindow from "../components/messaging/ChatWindow";
import { EmployerLogos, PeopleGrid, GlassCard } from "../components";
import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline";

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(null);

  const conversations = [
    {
      id: 1,
      name: "John Doe",
      preview: "Hi, how are you?",
      timestamp: "2m ago",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&w=400&h=400&facepad=2",
    },
    {
      id: 2,
      name: "Jane Smith",
      preview: "Looking forward to connecting.",
      timestamp: "5h ago",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?auto=format&fit=facearea&w=400&h=400&facepad=2",
    },
    {
      id: 3,
      name: "Mike Johnson",
      preview: "Thanks for the opportunity!",
      timestamp: "1d ago",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&w=400&h=400&facepad=2",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-600 rounded-2xl">
                    <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      Messages
                    </h1>
                    <p className="text-xl text-gray-600">
                      Connect and communicate with your network
                    </p>
                  </div>
                </div>
              </div>
              
              {/* People Grid */}
              <div className="hidden lg:block">
                <PeopleGrid maxImages={4} />
              </div>
            </div>
          </div>

          {/* Employer Logos */}
          <div className="mb-8">
            <p className="text-center text-gray-600 mb-4">Connect with professionals from top companies</p>
            <EmployerLogos />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Conversations Sidebar */}
            <div className="lg:col-span-1">
              <GlassCard>
                <div className="mb-4">
                  <h2 className="text-lg font-semibold text-gray-900 mb-3">Conversations</h2>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search messages..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <PaperAirplaneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setActiveConversation(conversation)}
                      className={`p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                        activeConversation?.id === conversation.id
                          ? "bg-blue-50 border border-blue-200"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={conversation.avatar}
                          alt={conversation.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-medium text-gray-900 truncate">
                              {conversation.name}
                            </h3>
                            <span className="text-xs text-gray-500">
                              {conversation.timestamp}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {conversation.preview}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>

            {/* Chat Window */}
            <div className="lg:col-span-3">
              <GlassCard className="h-96">
                {activeConversation ? (
                  <ChatWindow conversation={activeConversation} />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Choose a conversation from the sidebar to start messaging
                    </p>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <ChatBubbleLeftRightIcon className="h-4 w-4" />
                      <span>Your messages will appear here</span>
                    </div>
                  </div>
                )}
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
