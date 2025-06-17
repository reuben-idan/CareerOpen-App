import React, { useState, useEffect } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { useUser } from "../../context/auth";
import analytics from "../../services/analytics";
import {
  uploadProfilePicture,
  uploadCoverPhoto,
  deleteFile,
  getFilePathFromURL,
} from "../../services/storage";
import ImageUpload from "../common/ImageUpload";
import { useProfile } from "../../context/profile";

const EditProfileModal = ({ isOpen, onClose, profile: profileProp }) => {
  const { user } = useUser();
  const { profile, updateProfile } = useProfile();
  const currentProfile = profileProp || profile;
  const [formData, setFormData] = useState({
    displayName: currentProfile?.displayName || currentProfile?.name || "",
    headline: currentProfile?.headline || currentProfile?.title || "",
    about: currentProfile?.about || currentProfile?.bio || "",
    location: currentProfile?.location || "",
    email: currentProfile?.email || "",
    phone: currentProfile?.phone || "",
    website: currentProfile?.website || "",
    skills: currentProfile?.skills || [],
    experience: currentProfile?.experience || [],
    education: currentProfile?.education || [],
    photoURL: currentProfile?.photoURL || "",
    coverPhoto: currentProfile?.coverPhoto || "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Handle escape key
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSkillChange = (e) => {
    const skills = e.target.value.split(",").map((skill) => skill.trim());
    setFormData((prev) => ({
      ...prev,
      skills,
    }));
  };

  const handleProfileImageChange = (file) => {
    setProfileImageFile(file);
  };

  const handleCoverImageChange = (file) => {
    setCoverImageFile(file);
  };

  const handleProfileImageRemove = () => {
    setProfileImageFile(null);
    setFormData((prev) => ({
      ...prev,
      photoURL: "",
    }));
  };

  const handleCoverImageRemove = () => {
    setCoverImageFile(null);
    setFormData((prev) => ({
      ...prev,
      coverPhoto: "",
    }));
  };

  const uploadImages = async () => {
    const uploads = {};

    // Upload profile picture if changed
    if (profileImageFile) {
      setIsUploadingImage(true);
      try {
        const profileURL = await uploadProfilePicture(
          profileImageFile,
          user.uid
        );
        uploads.photoURL = profileURL;
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw new Error("Failed to upload profile picture");
      } finally {
        setIsUploadingImage(false);
      }
    }

    // Upload cover photo if changed
    if (coverImageFile) {
      setIsUploadingImage(true);
      try {
        const coverURL = await uploadCoverPhoto(coverImageFile, user.uid);
        uploads.coverPhoto = coverURL;
      } catch (error) {
        console.error("Error uploading cover photo:", error);
        throw new Error("Failed to upload cover photo");
      } finally {
        setIsUploadingImage(false);
      }
    }

    return uploads;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Upload images first
      const uploadedImages = await uploadImages();

      // Combine form data with uploaded image URLs
      const finalFormData = {
        ...formData,
        ...uploadedImages,
      };

      await updateProfile(finalFormData);
      analytics.track("profile_update", { userId: currentProfile?.id });
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />

        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full mx-auto shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <Dialog.Title className="text-xl font-semibold text-gray-900 dark:text-white">
              Edit Profile
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {error && (
              <div className="mb-4 p-4 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400">
                {error}
              </div>
            )}

            <div className="space-y-6">
              {/* Profile Images Section */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Profile Images
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Profile Picture */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Profile Picture
                    </label>
                    <ImageUpload
                      currentImage={formData.photoURL}
                      onImageChange={handleProfileImageChange}
                      onImageRemove={handleProfileImageRemove}
                      type="profile"
                      disabled={isSubmitting || isUploadingImage}
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Recommended: Square image, max 5MB
                    </p>
                  </div>

                  {/* Cover Photo */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cover Photo
                    </label>
                    <ImageUpload
                      currentImage={formData.coverPhoto}
                      onImageChange={handleCoverImageChange}
                      onImageRemove={handleCoverImageRemove}
                      type="cover"
                      disabled={isSubmitting || isUploadingImage}
                    />
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      Recommended: 1200x300px, max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="displayName"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="headline"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Headline
                    </label>
                    <input
                      type="text"
                      id="headline"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="location"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Location
                    </label>
                    <input
                      type="text"
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="website"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <label
                  htmlFor="about"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  About
                </label>
                <textarea
                  id="about"
                  name="about"
                  rows={4}
                  value={formData.about}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              {/* Skills */}
              <div>
                <label
                  htmlFor="skills"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={handleSkillChange}
                  className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                />
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isUploadingImage}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

export default EditProfileModal;
