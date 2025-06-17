// pages/MyNetwork.jsx
import React from "react";
import ConnectionCard from "../components/social/ConnectionCard";
import InvitationCard from "../components/social/InvitationCard";
import SuggestedConnectionCard from "../components/social/SuggestedConnectionCard";
import Sidebar from "../components/layout/Sidebar";
import { EmployerLogos, PeopleGrid, GlassCard } from "../components";
import {
  UserGroupIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";

const MyNetwork = () => {
  const invitations = [
    {
      id: 1,
      sender: {
        id: 101,
        name: "Reuben Idan",
        title: "Web Developer",
        company: "Tech Solutions",
        location: "San Francisco, CA",
      },
      message:
        "Hi! I'd love to connect with you. We have similar interests in web development.",
      mutualConnections: 10,
      senderSkills: ["React", "Node.js", "TypeScript"],
    },
    {
      id: 2,
      sender: {
        id: 102,
        name: "Jane Smith",
        title: "Graphic Designer",
        company: "Creative Studio",
        location: "New York, NY",
      },
      message: "Would love to connect and discuss design opportunities!",
      mutualConnections: 5,
      senderSkills: ["Figma", "Adobe Creative Suite", "UI/UX"],
    },
  ];

  const suggestedConnections = [
    {
      id: 1,
      name: "Alice Johnson",
      title: "Product Manager",
      company: "Tech Solutions",
      mutualConnections: 3,
      skills: ["Product Strategy", "User Research", "Agile"],
    },
    {
      id: 2,
      name: "Bob Brown",
      title: "Data Analyst",
      company: "Analytics Corp",
      mutualConnections: 8,
      skills: ["Python", "SQL", "Tableau"],
    },
  ];

  const connections = [
    {
      id: 1,
      name: "Charlie Adams",
      title: "Software Engineer",
      company: "Tech Corp",
      location: "San Francisco, CA",
      mutualConnections: 7,
      skills: ["React", "Node.js", "TypeScript"],
    },
    {
      id: 2,
      name: "David Lee",
      title: "UX Designer",
      company: "Design Studio",
      location: "New York, NY",
      mutualConnections: 4,
      skills: ["Figma", "Sketch", "Adobe XD"],
    },
  ];

  const handleMessage = (connectionId) => {
    console.log("Message connection:", connectionId);
    // TODO: Implement messaging functionality
  };

  const handleRemoveConnection = (connectionId) => {
    console.log("Remove connection:", connectionId);
    // TODO: Implement remove connection functionality
  };

  const handleConnect = (connectionId) => {
    console.log("Connect with:", connectionId);
    // TODO: Implement connect functionality
  };

  const handleDismissSuggestion = (connectionId) => {
    console.log("Dismiss suggestion:", connectionId);
    // TODO: Implement dismiss functionality
  };

  const handleAcceptInvitation = (invitationId) => {
    console.log("Accept invitation:", invitationId);
    // TODO: Implement accept invitation functionality
  };

  const handleDeclineInvitation = (invitationId) => {
    console.log("Decline invitation:", invitationId);
    // TODO: Implement decline invitation functionality
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64">
        <div className="container mx-auto py-8 px-4">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-3 bg-blue-600 rounded-2xl">
                    <UserGroupIcon className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                      My Network
                    </h1>
                    <p className="text-xl text-gray-600">
                      Connect with professionals and grow your career
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
            <p className="text-center text-gray-600 mb-4">
              Connect with professionals from top companies
            </p>
            <EmployerLogos />
          </div>

          {/* Network Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <GlassCard className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <UserPlusIcon className="h-8 w-8 text-blue-600" />
                <span className="text-3xl font-bold text-gray-900">
                  {invitations.length}
                </span>
              </div>
              <p className="text-gray-600">Pending Invitations</p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <UsersIcon className="h-8 w-8 text-green-600" />
                <span className="text-3xl font-bold text-gray-900">
                  {connections.length}
                </span>
              </div>
              <p className="text-gray-600">Current Connections</p>
            </GlassCard>

            <GlassCard className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-2">
                <UserGroupIcon className="h-8 w-8 text-purple-600" />
                <span className="text-3xl font-bold text-gray-900">
                  {suggestedConnections.length}
                </span>
              </div>
              <p className="text-gray-600">Suggested Connections</p>
            </GlassCard>
          </div>

          {/* Invitations Section */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <UserPlusIcon className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Invitations ({invitations.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {invitations.map((invitation) => (
                <InvitationCard
                  key={invitation.id}
                  invitation={invitation}
                  onAccept={handleAcceptInvitation}
                  onDecline={handleDeclineInvitation}
                />
              ))}
            </div>
            {invitations.length === 0 && (
              <GlassCard className="text-center py-12">
                <div className="text-6xl mb-4">📧</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No pending invitations
                </h3>
                <p className="text-gray-600">
                  Start connecting with people to receive invitations
                </p>
              </GlassCard>
            )}
          </section>

          {/* Suggested Connections Section */}
          <section className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Suggested Connections ({suggestedConnections.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {suggestedConnections.map((connection) => (
                <SuggestedConnectionCard
                  key={connection.id}
                  connection={connection}
                  onConnect={handleConnect}
                  onDismiss={handleDismissSuggestion}
                />
              ))}
            </div>
            {suggestedConnections.length === 0 && (
              <GlassCard className="text-center py-12">
                <div className="text-6xl mb-4">🤝</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No suggestions yet
                </h3>
                <p className="text-gray-600">
                  Complete your profile to get personalized connection
                  suggestions
                </p>
              </GlassCard>
            )}
          </section>

          {/* Connections Section */}
          <section>
            <div className="flex items-center space-x-3 mb-6">
              <UsersIcon className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-semibold text-gray-900">
                Your Connections ({connections.length})
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {connections.map((connection) => (
                <ConnectionCard
                  key={connection.id}
                  connection={connection}
                  onMessage={handleMessage}
                  onRemove={handleRemoveConnection}
                />
              ))}
            </div>
            {connections.length === 0 && (
              <GlassCard className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No connections yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start building your professional network by connecting with
                  colleagues and industry professionals
                </p>
                <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors">
                  Find People to Connect With
                </button>
              </GlassCard>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyNetwork;
