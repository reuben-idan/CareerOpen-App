// pages/MyNetwork.jsx
import  "react";
import ConnectionCard from "../components/ConnectionCard."; // Added ConnectionCard import
import InvitationCard from "../components/InvitationCard";
import SuggestedConnectionCard from "../components/SuggestedConnectionCard";

const MyNetwork = () => {
  const invitations = [
    { id: 1, name: "Reuben Idan", title: "Web Developer", mutualConnections: 10 },
    {
      id: 2,
      name: "Jane Smith",
      title: "Graphic Designer",
      mutualConnections: 5,
    },
  ];

  const suggestedConnections = [
    {
      id: 1,
      name: "Alice Johnson",
      title: "Product Manager",
      mutualConnections: 3,
    },
    { id: 2, name: "Bob Brown", title: "Data Analyst", mutualConnections: 8 },
  ];

  const connections = [
    {
      id: 1,
      name: "Charlie Adams",
      title: "Software Engineer",
      mutualConnections: 7,
    },
    {
      id: 2,
      name: "David Lee",
      title: "UX Designer",
      mutualConnections: 4,
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-6">
          My Network
        </h1>

        {/* Invitations Section */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Invitations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {invitations.map((invitation) => (
              <InvitationCard key={invitation.id} {...invitation} />
            ))}
          </div>
        </section>

        {/* Suggested Connections Section */}
        <section className="mb-8">
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Suggested Connections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestedConnections.map((connection) => (
              <SuggestedConnectionCard key={connection.id} {...connection} />
            ))}
          </div>
        </section>

        {/* Connections Section */}
        <section>
          <h2 className="text-lg font-medium text-gray-800 mb-4">
            Connections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {connections.map((connection) => (
              <ConnectionCard key={connection.id} {...connection} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default MyNetwork;
