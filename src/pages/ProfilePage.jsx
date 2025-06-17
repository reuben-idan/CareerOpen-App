import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/auth";
import analytics from "../services/analytics";
import {
  PencilIcon,
  UserPlusIcon,
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
  MapPinIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  UserCircleIcon,
  LinkIcon,
  XCircleIcon,
  HeartIcon,
  ShareIcon,
  BookmarkIcon,
  EyeIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  SparklesIcon,
  TrophyIcon,
  ClockIcon,
  CalendarIcon,
  BuildingOfficeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  PlusIcon,
  MinusIcon,
} from "@heroicons/react/24/outline";
import {
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon,
} from "@heroicons/react/24/solid";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileCard from "../components/profile/ProfileCard";
import EditProfileModal from "../components/profile/EditProfileModal";
import LoadingSpinner from "../components/common/LoadingSpinner";
import SkillsList from "../components/profile/SkillsList";
import ExperienceList from "../components/profile/ExperienceList";
import EducationList from "../components/profile/EducationList";
import ActivityFeed from "../components/social/ActivityFeed";
import { PaystackButton } from "react-paystack";
import { toast } from "react-toastify";
import Sidebar from "../components/layout/Sidebar";
import { EmployerLogos, PeopleGrid, GlassCard } from "../components";
import { useProfile } from "../context/profile";

const ProfilePage = () => {
  const { user } = useUser();
  const { profile, loading, error, updateProfile, fetchProfileById } =
    useProfile();
  const { userId } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isConnected, setIsConnected] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [viewCount, setViewCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Payment configuration
  const publicKey = "pk_test_90800a7e8af8e9abef7680fabff8026047606e40";
  const [paymentData, setPaymentData] = useState({
    email: "",
    name: "",
    phone: "",
  });

  useEffect(() => {
    if (userId) {
      fetchProfileById(userId);
    }
  }, [userId, fetchProfileById]);

  useEffect(() => {
    if (user && profile) {
      setIsOwnProfile(user.uid === userId);
      setViewCount(profile?.stats?.profileViews || 0);
    }
  }, [user, userId, profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      await updateProfile(updatedData);
      setIsEditing(false);
      setShowEditModal(false);
      toast.success("Profile updated successfully!");
      analytics.track("update_profile", { profileId: userId });
    } catch (err) {
      toast.error("Failed to update profile");
      analytics.track("profile_update_error", { error: err.message });
    }
  };

  const handleConnect = async () => {
    try {
      setIsConnected(true);
      toast.success("Connection request sent!");
      analytics.track("connection_request", { profileId: userId });
    } catch (err) {
      setError("Failed to send connection request");
      toast.error("Failed to send connection request");
      analytics.track("connection_request_error", { error: err.message });
    }
  };

  const handleFollow = async () => {
    try {
      setIsFollowing(!isFollowing);
      toast.success(
        isFollowing ? "Unfollowed successfully" : "Following successfully"
      );
      analytics.track("profile_follow", {
        profileId: userId,
        action: isFollowing ? "unfollow" : "follow",
      });
    } catch (err) {
      setError("Failed to update follow status");
      toast.error("Failed to update follow status");
      analytics.track("profile_follow_error", { error: err.message });
    }
  };

  const handleMessage = () => {
    navigate(`/messages/${userId}`);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from likes" : "Added to likes");
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    toast.success(
      isBookmarked ? "Removed from bookmarks" : "Added to bookmarks"
    );
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success("Profile link copied to clipboard!");
  };

  const handlePaymentSuccess = () => {
    setIsPremium(true);
    setShowPaymentModal(false);
    toast.success(
      "Premium subscription activated! Welcome to CareerOpen Premium."
    );
  };

  const handlePaymentClose = () => {
    setShowPaymentModal(false);
    toast.info("Payment cancelled. You can upgrade to premium anytime.");
  };

  const paymentProps = {
    email: paymentData.email,
    amount: 500000, // 5000 GHS in kobo
    currency: "GHS",
    metadata: {
      name: paymentData.name,
      phone: paymentData.phone,
      userId: user?.uid,
    },
    publicKey,
    text: "Upgrade to Premium",
    onSuccess: handlePaymentSuccess,
    onClose: handlePaymentClose,
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <XCircleIcon className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {error === "Profile not found" ? "Profile Not Found" : "Error Loading Profile"}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button onClick={() => navigate("/")} className="btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 px-4">
        <div className="max-w-md w-full text-center">
          <div className="text-gray-600 mb-4">
            <UserCircleIcon className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Profile Not Found
          </h2>
          <p className="text-gray-600 mb-4">The requested profile could not be found.</p>
          <button onClick={() => navigate("/")} className="btn">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: UserCircleIcon },
    { id: "experience", name: "Experience", icon: BriefcaseIcon },
    { id: "education", name: "Education", icon: AcademicCapIcon },
    { id: "skills", name: "Skills", icon: StarIcon },
    { id: "activity", name: "Activity", icon: ClockIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-64">
        {/* Profile Header */}
        <div className="relative">
          {/* Background Cover */}
          <div className="h-64 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

            {/* Floating Elements */}
            <div className="absolute top-4 left-4 opacity-20">
              <PeopleGrid maxImages={3} showOnMobile={false} />
            </div>
            <div className="absolute top-4 right-4 opacity-20">
              <EmployerLogos />
            </div>

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
            <GlassCard className="p-6 lg:p-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  {/* Avatar */}
                  <div className="relative">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold shadow-2xl border-4 border-white/20">
                      {profile.avatar ? (
                        <img
                          src={profile.avatar}
                          alt={profile.name}
                          className="h-32 w-32 rounded-full object-cover"
                        />
                      ) : (
                        profile.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      )}
                    </div>
                    {isPremium && (
                      <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full shadow-lg">
                        <TrophyIcon className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Profile Details */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h1 className="text-3xl font-bold text-gray-900">
                        {profile.name}
                      </h1>
                      {isPremium && (
                        <SparklesIcon className="h-6 w-6 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-xl text-gray-600 mb-2">
                      {profile.title}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPinIcon className="h-4 w-4" />
                        <span>{profile.location}</span>
                      </div>
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
                        onClick={handleConnect}
                        disabled={isConnected}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                          isConnected
                            ? "bg-green-600 hover:bg-green-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
                        }`}
                      >
                        {isConnected ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-2 inline" />
                            Connected
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className="h-4 w-4 mr-2 inline" />
                            Connect
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleFollow}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                          isFollowing
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white"
                        }`}
                      >
                        {isFollowing ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 mr-2 inline" />
                            Following
                          </>
                        ) : (
                          <>
                            <PlusIcon className="h-4 w-4 mr-2 inline" />
                            Follow
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleMessage}
                        className="px-6 py-3 rounded-xl font-medium bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 hover:bg-white transition-all duration-200"
                      >
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2 inline" />
                        Message
                      </button>
                    </>
                  )}

                  {isOwnProfile && (
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-6 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <PencilIcon className="h-4 w-4 mr-2 inline" />
                      Edit Profile
                    </button>
                  )}

                  <button
                    onClick={handleLike}
                    className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-all duration-200"
                  >
                    {isLiked ? (
                      <HeartSolidIcon className="h-4 w-4 text-red-500" />
                    ) : (
                      <HeartIcon className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={handleBookmark}
                    className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-all duration-200"
                  >
                    <BookmarkIcon className="h-4 w-4" />
                  </button>

                  <button
                    onClick={handleShare}
                    className="p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-gray-200 hover:bg-white transition-all duration-200"
                  >
                    <ShareIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Bio */}
              <div className="mt-6">
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl font-bold text-blue-600">
                    {profile.stats.connections}
                  </div>
                  <div className="text-sm text-gray-600">Connections</div>
                </div>
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl font-bold text-green-600">
                    {profile.stats.profileViews}
                  </div>
                  <div className="text-sm text-gray-600">Profile Views</div>
                </div>
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl font-bold text-purple-600">
                    {profile.stats.postViews}
                  </div>
                  <div className="text-sm text-gray-600">Post Views</div>
                </div>
                <div className="text-center p-4 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
                  <div className="text-2xl font-bold text-orange-600">
                    {profile.stats.endorsements}
                  </div>
                  <div className="text-sm text-gray-600">Endorsements</div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Card */}
              <ProfileCard
                profile={profile}
                onEdit={() => setShowEditModal(true)}
              />

              {/* Tabs */}
              <GlassCard className="overflow-hidden">
                <div className="border-b border-white/20">
                  <nav className="flex space-x-8 px-6" aria-label="Tabs">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors duration-200 ${
                            activeTab === tab.id
                              ? "border-blue-500 text-blue-600"
                              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{tab.name}</span>
                        </button>
                      );
                    })}
                  </nav>
                </div>

                <div className="p-6">
                  {activeTab === "overview" && (
                    <div className="space-y-6">
                      {/* Skills Preview */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Top Skills
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {profile.skills.slice(0, 6).map((skill, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800"
                            >
                              {skill.name}
                              <span className="ml-2 text-xs text-blue-600">
                                {skill.level}
                              </span>
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Recent Experience */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                          Recent Experience
                        </h3>
                        <div className="space-y-4">
                          {profile.experience.slice(0, 2).map((exp) => (
                            <div
                              key={exp.id}
                              className="border-l-4 border-blue-500 pl-4"
                            >
                              <h4 className="font-medium text-gray-900">
                                {exp.title}
                              </h4>
                              <p className="text-gray-600">
                                {exp.company} • {exp.location}
                              </p>
                              <p className="text-sm text-gray-500">
                                {exp.startDate} - {exp.endDate || "Present"}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "experience" && (
                    <ExperienceList experience={profile.experience} />
                  )}

                  {activeTab === "education" && (
                    <EducationList education={profile.education} />
                  )}

                  {activeTab === "skills" && (
                    <SkillsList skills={profile.skills} />
                  )}

                  {activeTab === "activity" && (
                    <ActivityFeed activities={profile.activities} />
                  )}
                </div>
              </GlassCard>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Premium Upgrade Card */}
              {!isPremium && (
                <GlassCard className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                  <div className="flex items-center space-x-2 mb-4">
                    <SparklesIcon className="h-6 w-6" />
                    <h3 className="text-lg font-semibold">
                      Upgrade to Premium
                    </h3>
                  </div>
                  <p className="text-sm mb-4 opacity-90">
                    Unlock advanced features, priority support, and exclusive
                    content.
                  </p>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-white text-orange-600 font-medium py-2 px-4 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Upgrade Now
                  </button>
                </GlassCard>
              )}

              {/* Contact Information */}
              <GlassCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{profile.email}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">{profile.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {profile.website}
                    </a>
                  </div>
                </div>
              </GlassCard>

              {/* Certifications */}
              <GlassCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Certifications
                </h3>
                <div className="space-y-3">
                  {profile.certifications.map((cert, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      <div>
                        <div className="font-medium text-gray-900">
                          {cert.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {cert.issuer} • {cert.date}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </GlassCard>

              {/* Languages */}
              <GlassCard>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Languages
                </h3>
                <div className="space-y-2">
                  {profile.languages.map((lang, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-700">{lang.name}</span>
                      <span className="text-sm text-gray-500">
                        {lang.level}
                      </span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>

        {/* Edit Profile Modal */}
        {showEditModal && (
          <EditProfileModal
            isOpen={showEditModal}
            profile={profile}
            onClose={() => setShowEditModal(false)}
            onSave={handleUpdateProfile}
          />
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <GlassCard className="max-w-md w-full">
              <div className="text-center mb-6">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
                  <SparklesIcon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Upgrade to Premium
                </h3>
                <p className="text-gray-600 mt-2">
                  Get access to exclusive features and priority support
                </p>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">
                    Priority job applications
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Advanced analytics</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Direct messaging</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Premium support</span>
                </div>
              </div>

              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    value={paymentData.name}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={paymentData.email}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={paymentData.phone}
                    onChange={(e) =>
                      setPaymentData({ ...paymentData, phone: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </form>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <PaystackButton
                  {...paymentProps}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium"
                />
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
