import { useState } from "react";
import Sidebar from "../components/Sidebari";
import ChatWindow from "../components/ChatWindow";

const Messages = () => {
  const [activeConversation, setActiveConversation] = useState(null);

  const conversations = [
    {
      id: 1,
      name: "John Doe",
      preview: "Hi, how are you?",
      timestamp: "2m ago",
    },
    {
      id: 2,
      name: "Jane Smith",
      preview: "Looking forward to connecting.",
      timestamp: "5h ago",
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-7xl mx-auto py-6 px-4">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <Sidebar
            conversations={conversations}
            activeConversation={activeConversation}
            onConversationSelect={setActiveConversation}
          />
        </aside>

        {/* Chat Window */}
        <main className="lg:col-span-3">
          <section className="bg-white rounded-lg shadow-md p-6 mb-6">
            {activeConversation ? (
              <ChatWindow conversation={activeConversation} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default Messages;
