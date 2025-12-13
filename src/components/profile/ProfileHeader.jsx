import React from "react";
import PropTypes from "prop-types";
import {
  PencilIcon,
  UserPlusIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  MapPinIcon,
  EyeIcon,
  CheckCircleIcon,
  PlusIcon,
  SparklesIcon,
  TrophyIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

const ProfileHeader = ({
  profile = {},
  isOwnProfile = false,
  isConnected = false,
  isFollowing = false,
  isPremium = false,
  viewCount = 0,
  isLiked = false,
  isBookmarked = false,
  onEdit,
  onConnect,
  onFollow,
  onMessage,
  onLike,
  onBookmark,
  onShare,
}) => {
  // Early return if profile is not loaded or invalid
  if (!profile || typeof profile !== 'object' || Object.keys(profile).length === 0) {
    return (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-700"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8">
            <div className="flex items-center space-x-4">
              <div className="h-32 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
              <div className="flex-1">
                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const stats = profile.stats || {
    connections: 0,
    profileViews: 0,
    posts: 0,
    likes: 0,
  };

  const initials = profile.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
    : "?";

  return (
    <div className="relative">
      {/* Background Cover */}
      <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
            <SparklesIcon className="h-4 w-4" />
            <span>Premium</span>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 lg:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Avatar */}
              <div className="relative">
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
                  {profile.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name || "Profile"}
                      className="h-32 w-32 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          profile.name || "User"
                        )}&background=random`;
                      }}
                    />
                  ) : (
                    initials
                  )}
                </div>
                {isPremium && (
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full">
                    <TrophyIcon className="h-5 w-5 text-white" />
                  </div>
                )}
              </div>

              {/* Profile Details */}
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    {profile.name || "Anonymous User"}
                  </h1>
                  {isPremium && (
                    <SparklesIcon className="h-6 w-6 text-yellow-500" />
                  )}
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-2">
                  {profile.title || "No title provided"}
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                  {profile.location && (
                  <div className="flex items-center space-x-1">
                    <MapPinIcon className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <EyeIcon className="h-4 w-4" />
                    <span>{viewCount} profile views</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center space-x-3 mt-6 lg:mt-0">
              {!isOwnProfile && (
                <>
                  <button
                    onClick={onConnect}
                    disabled={isConnected}
                    className={`btn ${
                      isConnected ? "bg-green-600 hover:bg-green-700" : ""
                    }`}
                  >
                    {isConnected ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Connected
                      </>
                    ) : (
                      <>
                        <UserPlusIcon className="h-4 w-4 mr-2" />
                        Connect
                      </>
                    )}
                  </button>
                  <button
                    onClick={onFollow}
                    className={`btn-secondary ${
                      isFollowing
                        ? "bg-blue-50 text-blue-600 border-blue-200"
                        : ""
                    }`}
                  >
                    {isFollowing ? (
                      <>
                        <CheckCircleIcon className="h-4 w-4 mr-2" />
                        Following
                      </>
                    ) : (
                      <>
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Follow
                      </>
                    )}
                  </button>
                  <button onClick={onMessage} className="btn-secondary">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Message
                  </button>
                </>
              )}

              {isOwnProfile && (
                <button onClick={onEdit} className="btn">
                  <PencilIcon className="h-4 w-4 mr-2" />
                  Edit Profile
                </button>
              )}

              <button onClick={onLike} className="btn-secondary">
                {isLiked ? (
                  <HeartSolidIcon className="h-4 w-4 text-red-500" />
                ) : (
                  <HeartIcon className="h-4 w-4" />
                )}
              </button>

              <button onClick={onBookmark} className="btn-secondary">
                <BookmarkIcon className="h-4 w-4" />
              </button>

              <button onClick={onShare} className="btn-secondary">
                <ShareIcon className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
          <div className="mt-6">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {profile.bio}
            </p>
          </div>
          )}

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {stats.connections}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Connections
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {stats.profileViews}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Profile Views
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {stats.posts}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Posts
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {stats.likes}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Likes
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfileHeader.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    title: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    avatar: PropTypes.string,
    stats: PropTypes.shape({
      connections: PropTypes.number,
      profileViews: PropTypes.number,
      posts: PropTypes.number,
      likes: PropTypes.number,
    }),
  }),
  isOwnProfile: PropTypes.bool,
  isConnected: PropTypes.bool,
  isFollowing: PropTypes.bool,
  isPremium: PropTypes.bool,
  viewCount: PropTypes.number,
  isLiked: PropTypes.bool,
  isBookmarked: PropTypes.bool,
  onEdit: PropTypes.func,
  onConnect: PropTypes.func,
  onFollow: PropTypes.func,
  onMessage: PropTypes.func,
  onLike: PropTypes.func,
  onBookmark: PropTypes.func,
  onShare: PropTypes.func,
};

export default ProfileHeader;
