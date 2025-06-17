import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useUser } from "../context/auth";
import { useToast } from "../context/toast";
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
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { profile, fetchProfileById, updateProfile } = useProfile();
  const { showToast } = useToast();
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activities, setActivities] = useState([]);

  // Initialize component
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Fetch profile data
  const fetchData = useCallback(async () => {
    if (!isMounted || !userId) return;

    setIsLoading(true);
    setError(null);

    try {
      await fetchProfileById(userId);
      if (profile?.activities && Array.isArray(profile.activities)) {
        setActivities(profile.activities);
      }
    } catch (err) {
      setError(err.message);
      showToast("Error loading profile", "error");
    } finally {
      setIsLoading(false);
    }
  }, [isMounted, userId, fetchProfileById, profile?.activities, showToast]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCloseEdit = () => {
    setIsEditing(false);
  };

  const handleUpdateProfile = async (updatedData) => {
    try {
      await updateProfile(updatedData);
      showToast("Profile updated successfully", "success");
      setIsEditing(false);
      await fetchData(); // Refresh profile data
    } catch (err) {
      showToast("Failed to update profile", "error");
      throw err; // Re-throw to let the modal handle the error
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Profile
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Profile Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          The profile you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Go Home
        </button>
      </div>
    );
  }

  const isOwnProfile = user?.uid === userId;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProfileHeader
        profile={profile}
        isOwnProfile={isOwnProfile}
        onEdit={handleEdit}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <ProfileCard profile={profile} />
          <SkillsList skills={profile.skills || []} />
          <ExperienceList experience={profile.experience || []} />
          <EducationList education={profile.education || []} />
        </div>

        <div className="space-y-8">
          <ActivityFeed activities={activities} />
        </div>
      </div>

      {isEditing && (
        <EditProfileModal
          isOpen={isEditing}
          onClose={handleCloseEdit}
          profile={profile}
          onUpdate={handleUpdateProfile}
        />
      )}
    </div>
  );
};

export default ProfilePage;
