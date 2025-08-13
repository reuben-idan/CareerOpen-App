import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import analytics from "../../services/analytics";
import { toast } from "react-toastify";
import {
  HomeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  Cog6ToothIcon,
  BookmarkIcon,
  DocumentTextIcon,
  SparklesIcon,
  ArrowLeftOnRectangleIcon,
  XMarkIcon,
  PlusIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolidIcon,
  BriefcaseIcon as BriefcaseSolidIcon,
  UserGroupIcon as UserGroupSolidIcon,
  BellIcon as BellSolidIcon,
  ChatBubbleLeftRightIcon as ChatSolidIcon,
  UserIcon as UserSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
  DocumentTextIcon as DocumentTextSolidIcon,
  SparklesIcon as SparklesSolidIcon,
} from "@heroicons/react/24/solid";

const MobileDrawer = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userStats, setUserStats] = useState({});
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Mock data
    setNotifications([
      { id: 1, type: "job", message: "New job matching your profile", unread: true },
      { id: 2, type: "connection", message: "John Doe wants to connect", unread: true },
    ]);
    setUnreadCount(2);
    setUserStats({
      applications: 12,
      interviews: 3,
      savedJobs: 25,
      connections: 156,
      profileViews: 89,
    });
    setIsPremium(false);
  }, []);

  const handleLogout = async () => {
    try {
      const result = await signOut();
      if (result?.success) {
        analytics.track("user_logout");
        navigate("/signin");
        onClose();
      } else {
        throw new Error("Logout was not successful");
      }
    } catch (error) {
      console.error("Logout error:", error);
      // Show error toast or notification to the user
      toast.error("Failed to log out. Please try again.");
    }
  };

  const navItems = [
    {
      path: "/feed",
      icon: HomeIcon,
      solidIcon: HomeSolidIcon,
      label: "Feed",
      description: "Discover opportunities",
      badge: null,
    },
    {
      path: "/jobs",
      icon: BriefcaseIcon,
      solidIcon: BriefcaseSolidIcon,
      label: "Jobs",
      description: "Find your next role",
      badge: userStats.applications > 0 ? `${userStats.applications} active` : null,
    },
    {
      path: "/network",
      icon: UserGroupIcon,
      solidIcon: UserGroupSolidIcon,
      label: "Network",
      description: "Connect with professionals",
      badge: userStats.connections > 0 ? `${userStats.connections}` : null,
    },
    {
      path: "/messages",
      icon: ChatBubbleLeftRightIcon,
      solidIcon: ChatSolidIcon,
      label: "Messages",
      description: "Chat with connections",
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      path: "/notifications",
      icon: BellIcon,
      solidIcon: BellSolidIcon,
      label: "Notifications",
      description: "Stay updated",
      badge: unreadCount > 0 ? unreadCount : null,
    },
  ];

  const userNavItems = [
    {
      path: `/profile/${user?.uid}`,
      icon: UserIcon,
      solidIcon: UserSolidIcon,
      label: "Profile",
      description: "Manage your profile",
      badge: userStats.profileViews > 0 ? `${userStats.profileViews} views` : null,
    },
    {
      path: "/saved-jobs",
      icon: BookmarkIcon,
      solidIcon: BookmarkSolidIcon,
      label: "Saved Jobs",
      description: "Your bookmarked jobs",
      badge: userStats.savedJobs > 0 ? `${userStats.savedJobs}` : null,
    },
    {
      path: "/applications",
      icon: DocumentTextIcon,
      solidIcon: DocumentTextSolidIcon,
      label: "Applications",
      description: "Track your applications",
      badge: userStats.applications > 0 ? `${userStats.applications}` : null,
    },
    {
      path: "/subscription",
      icon: SparklesIcon,
      solidIcon: SparklesSolidIcon,
      label: "Premium",
      description: "Upgrade your account",
      premium: true,
      badge: isPremium ? "Active" : "Upgrade",
    },
  ];

  const quickActions = [
    { id: 1, label: "Post Job", icon: PlusIcon, path: "/post-job", premium: true },
    { id: 2, label: "Create Post", icon: DocumentTextIcon, path: "/create-post" },
    { id: 3, label: "Upload Resume", icon: DocumentTextIcon, path: "/upload-resume" },
    { id: 4, label: "View Analytics", icon: ChartBarIcon, path: "/analytics", premium: true },
  ];

  const isActive = (path) => {
    if (path === "/feed") {
      return location.pathname === "/feed" || location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const handleNavClick = (path) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" 
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed left-0 top-0 h-full w-80 bg-white dark:bg-gray-900 z-50 md:hidden transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {user?.displayName || "User"}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {user?.email}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User Stats */}
          <div className="p-4 bg-gray-50 dark:bg-gray-800">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Your Activity
            </h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-primary-600 dark:text-primary-400">
                  {userStats.applications}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Applications</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600 dark:text-green-400">
                  {userStats.interviews}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Interviews</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {userStats.connections}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Connections</div>
              </div>
              <div>
                <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {userStats.profileViews}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Views</div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              {/* Main Navigation */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Main Navigation
                </h3>
                <div className="space-y-2">
                  {navItems.map((item) => {
                    const Icon = isActive(item.path) ? item.solidIcon : item.icon;
                    const isActiveItem = isActive(item.path);
                    
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                          isActiveItem
                            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="relative">
                          <Icon className="h-5 w-5" />
                          {item.badge && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.label}</span>
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* User Navigation */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Account
                </h3>
                <div className="space-y-2">
                  {userNavItems.map((item) => {
                    const Icon = isActive(item.path) ? item.solidIcon : item.icon;
                    const isActiveItem = isActive(item.path);
                    
                    return (
                      <button
                        key={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={`w-full flex items-center px-3 py-3 rounded-lg text-left transition-all duration-200 ${
                          isActiveItem
                            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                      >
                        <div className="relative">
                          <Icon className="h-5 w-5" />
                          {item.badge && (
                            <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.label}</span>
                            {item.premium && (
                              <SparklesIcon className="h-4 w-4 text-yellow-500" />
                            )}
                          </div>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {item.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="mb-6">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleNavClick(action.path)}
                      className="w-full flex items-center px-3 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                    >
                      <action.icon className="h-5 w-5" />
                      <div className="ml-3 flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{action.label}</span>
                          {action.premium && (
                            <SparklesIcon className="h-4 w-4 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <button
                onClick={() => handleNavClick("/settings")}
                className="w-full flex items-center px-3 py-3 rounded-lg text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <Cog6ToothIcon className="h-5 w-5" />
                <span className="ml-3 font-medium">Settings</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center px-3 py-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200"
              >
                <ArrowLeftOnRectangleIcon className="h-5 w-5" />
                <span className="ml-3 font-medium">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MobileDrawer;
