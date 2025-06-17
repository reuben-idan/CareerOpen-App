import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useUser } from "../../context/auth";
import { useTheme } from "../../context/ThemeContext";
import analytics from "../../services/analytics";
import {
  HomeIcon,
  BriefcaseIcon,
  UserGroupIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  UserIcon,
  Cog6ToothIcon,
  BookmarkIcon,
  HeartIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ArrowLeftOnRectangleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  PlusIcon,
  SparklesIcon,
  CalendarIcon,
  BriefcaseIcon as BriefcaseOutlineIcon,
  UserGroupIcon as UserGroupOutlineIcon,
  BellIcon as BellOutlineIcon,
  ChatBubbleLeftRightIcon as ChatOutlineIcon,
  UserIcon as UserOutlineIcon,
  BookmarkIcon as BookmarkOutlineIcon,
  HeartIcon as HeartOutlineIcon,
  DocumentTextIcon as DocumentTextOutlineIcon,
  AcademicCapIcon as AcademicCapOutlineIcon,
  CurrencyDollarIcon as CurrencyDollarOutlineIcon,
  ChartBarIcon as ChartBarOutlineIcon,
  Cog6ToothIcon as Cog6ToothOutlineIcon,
  ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleOutlineIcon,
  PlusIcon as PlusOutlineIcon,
  SparklesIcon as SparklesOutlineIcon,
  ChevronLeftIcon as ChevronLeftOutlineIcon,
  ChevronRightIcon as ChevronRightOutlineIcon,
  XMarkIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolidIcon,
  BriefcaseIcon as BriefcaseSolidIcon,
  UserGroupIcon as UserGroupSolidIcon,
  BellIcon as BellSolidIcon,
  ChatBubbleLeftRightIcon as ChatSolidIcon,
  UserIcon as UserSolidIcon,
  BookmarkIcon as BookmarkSolidIcon,
  HeartIcon as HeartSolidIcon,
  DocumentTextIcon as DocumentTextSolidIcon,
  AcademicCapIcon as AcademicCapSolidIcon,
  CurrencyDollarIcon as CurrencyDollarSolidIcon,
  ChartBarIcon as ChartBarSolidIcon,
  Cog6ToothIcon as Cog6ToothSolidIcon,
  ArrowLeftOnRectangleIcon as ArrowLeftOnRectangleSolidIcon,
  PlusIcon as PlusSolidIcon,
  SparklesIcon as SparklesSolidIcon,
  ChevronLeftIcon as ChevronLeftSolidIcon,
  ChevronRightIcon as ChevronRightSolidIcon,
  XMarkIcon as XMarkSolidIcon,
  Bars3Icon as Bars3SolidIcon,
  CalendarIcon as CalendarSolidIcon,
} from "@heroicons/react/24/solid";

const Sidebar = ({
  isCollapsed = false,
  onToggle,
  isMobileOpen = false,
  onMobileClose,
}) => {
  const { user, signOutUser } = useUser();
  const { theme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [quickActions, setQuickActions] = useState([]);
  const [userStats, setUserStats] = useState({});
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    // Mock notifications
    setNotifications([
      {
        id: 1,
        type: "job",
        message: "New job matching your profile",
        unread: true,
      },
      {
        id: 2,
        type: "connection",
        message: "John Doe wants to connect",
        unread: true,
      },
      {
        id: 3,
        type: "message",
        message: "New message from recruiter",
        unread: false,
      },
    ]);
    setUnreadCount(2);

    // Mock user stats
    setUserStats({
      applications: 12,
      interviews: 3,
      savedJobs: 25,
      connections: 156,
      profileViews: 89,
    });

    // Mock premium status
    setIsPremium(false);

    // Enhanced quick actions
    setQuickActions([
      {
        id: 1,
        label: "Post Job",
        icon: PlusIcon,
        path: "/post-job",
        premium: true,
        description: "Hire talent",
        badge: "New",
      },
      {
        id: 2,
        label: "Create Post",
        icon: DocumentTextIcon,
        path: "/create-post",
        description: "Share updates",
        badge: null,
      },
      {
        id: 3,
        label: "Upload Resume",
        icon: DocumentTextIcon,
        path: "/upload-resume",
        description: "Update CV",
        badge: null,
      },
      {
        id: 4,
        label: "Schedule Interview",
        icon: CalendarIcon,
        path: "/schedule-interview",
        description: "Book meetings",
        badge: "Hot",
      },
      {
        id: 5,
        label: "View Analytics",
        icon: ChartBarIcon,
        path: "/analytics",
        description: "Track progress",
        premium: true,
        badge: null,
      },
    ]);
  }, []);

  const handleLogout = async () => {
    try {
      await signOutUser();
      analytics.track("user_logout");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const mainNavItems = [
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
      badge:
        userStats.applications > 0 ? `${userStats.applications} active` : null,
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
      badge:
        userStats.profileViews > 0 ? `${userStats.profileViews} views` : null,
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
      path: "/interviews",
      icon: CalendarIcon,
      solidIcon: CalendarSolidIcon,
      label: "Interviews",
      description: "Upcoming meetings",
      badge: userStats.interviews > 0 ? `${userStats.interviews}` : null,
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

  const isActive = (path) => {
    if (path === "/feed") {
      return location.pathname === "/feed" || location.pathname === "/";
    }
    return location.pathname.startsWith(path);
  };

  const NavItem = ({ item, onClick }) => {
    const Icon = isActive(item.path) ? item.solidIcon || item.icon : item.icon;
    const isActiveItem = isActive(item.path);

    return (
      <Link
        to={item.path}
        onClick={onClick}
        className={`group flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActiveItem
            ? "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400"
            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400"
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
        {!isCollapsed && (
          <div className="ml-3 flex-1">
            <div className="flex items-center justify-between">
              <span>{item.label}</span>
              {item.premium && (
                <SparklesIcon className="h-4 w-4 text-yellow-500" />
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {item.description}
            </p>
          </div>
        )}
      </Link>
    );
  };

  const QuickActionItem = ({ action, onClick }) => {
    return (
      <button
        onClick={onClick}
        className="group flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
      >
        <div className="relative">
          <action.icon className="h-5 w-5" />
          {action.badge && (
            <span className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full"></span>
          )}
        </div>
        {!isCollapsed && (
          <div className="ml-3 flex-1 text-left">
            <div className="flex items-center justify-between">
              <span>{action.label}</span>
              {action.premium && (
                <SparklesIcon className="h-4 w-4 text-yellow-500" />
              )}
              {action.badge && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  {action.badge}
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {action.description}
            </p>
          </div>
        )}
      </button>
    );
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Toggle Button */}
      <div className="flex justify-end p-2">
        <button
          onClick={onToggle}
          className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4" />
          )}
        </button>
      </div>

      {/* User Profile Summary */}
      {!isCollapsed && user && (
        <div className="px-3 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
              {user.displayName
                ? user.displayName.charAt(0).toUpperCase()
                : user.email.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user.displayName || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user.email}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Main Navigation */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="mb-4">
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Main
            </h3>
          )}
          <div className="mt-2 space-y-1">
            {mainNavItems.map((item) => (
              <NavItem key={item.path} item={item} onClick={onMobileClose} />
            ))}
          </div>
        </div>

        {/* User Navigation */}
        <div className="mb-4">
          {!isCollapsed && (
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Account
            </h3>
          )}
          <div className="mt-2 space-y-1">
            {userNavItems.map((item) => (
              <NavItem key={item.path} item={item} onClick={onMobileClose} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="mb-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Quick Actions
            </h3>
            <div className="mt-2 space-y-1">
              {quickActions.map((action) => (
                <QuickActionItem
                  key={action.id}
                  action={action}
                  onClick={() => {
                    navigate(action.path);
                    onMobileClose?.();
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* User Stats Summary */}
        {!isCollapsed && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Your Stats
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-center">
                <div className="font-semibold text-primary-600 dark:text-primary-400">
                  {userStats.applications}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  Applications
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-green-600 dark:text-green-400">
                  {userStats.interviews}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  Interviews
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-blue-600 dark:text-blue-400">
                  {userStats.connections}
                </div>
                <div className="text-gray-500 dark:text-gray-400">
                  Connections
                </div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-purple-600 dark:text-purple-400">
                  {userStats.profileViews}
                </div>
                <div className="text-gray-500 dark:text-gray-400">Views</div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Actions */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        {!isCollapsed && (
          <div className="mb-2">
            <Link
              to="/settings"
              className="flex items-center px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200"
              onClick={onMobileClose}
            >
              <Cog6ToothIcon className="h-5 w-5" />
              <span className="ml-3">Settings</span>
            </Link>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center w-full px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-200 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <ArrowLeftOnRectangleIcon className="h-5 w-5" />
          {!isCollapsed && <span className="ml-3">Sign Out</span>}
        </button>
      </div>
    </div>
  );

  // Mobile overlay
  if (isMobileOpen) {
    return (
      <>
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={onMobileClose}
        />
        <div className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 z-50 md:hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Menu
            </h2>
            <button
              onClick={onMobileClose}
              className="p-1 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop sidebar
  return (
    <div
      className={`fixed left-0 top-16 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 z-40 hidden md:block ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {sidebarContent}
    </div>
  );
};

export default Sidebar;
