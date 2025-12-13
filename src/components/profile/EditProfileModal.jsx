import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { Dialog } from "@headlessui/react";
import { useUser } from "../../context/auth";
import analytics from "../../services/analytics";
import storageService from "../../services/api/storage";
import ImageUpload from "../common/ImageUpload";

const EditProfileModal = ({ isOpen = false, onClose, profile, onUpdate }) => {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    displayName: "",
    headline: "",
    about: "",
    location: "",
    email: "",
    phone: "",
    website: "",
    skills: [],
    experience: [],
    education: [],
    photoURL: "",
    coverPhoto: "",
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

  // Reset form data when modal opens with a new profile
  useEffect(() => {
    if (isOpen && profile) {
      setFormData({
        displayName: profile.displayName || profile.name || "",
        headline: profile.headline || profile.title || "",
        about: profile.about || profile.bio || "",
        location: profile.location || "",
        email: profile.email || "",
        phone: profile.phone || "",
        website: profile.website || "",
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
        photoURL: profile.photoURL || "",
        coverPhoto: profile.coverPhoto || "",
      });
    }
  }, [isOpen, profile?.id]);

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

    if (profileImageFile) {
      setIsUploadingImage(true);
      try {
        const result = await storageService.uploadProfilePicture(
          profileImageFile,
          user.uid
        );
        uploads.photoURL = result.url;
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        throw new Error("Failed to upload profile picture");
      } finally {
        setIsUploadingImage(false);
      }
    }

    if (coverImageFile) {
      setIsUploadingImage(true);
      try {
        const result = await storageService.uploadCoverPhoto(coverImageFile, user.uid);
        uploads.coverPhoto = result.url;
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
      // First upload any new images
      const uploadedImages = await uploadImages();

      // Then update the profile with all changes
      const finalFormData = {
        ...formData,
        ...uploadedImages,
        updatedAt: new Date().toISOString(),
      };

      await onUpdate(finalFormData);
      analytics.track("profile_update", { userId: profile?.id });
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
                      Recommended: 16:9 ratio, max 5MB
                    </p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Basic Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="displayName"
                      value={formData.displayName}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Headline
                    </label>
                    <input
                      type="text"
                      name="headline"
                      value={formData.headline}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  About
                </label>
                <textarea
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Skills (comma-separated)
                </label>
                <input
                  type="text"
                  name="skills"
                  value={formData.skills.join(", ")}
                  onChange={handleSkillChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || isUploadingImage}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Dialog>
  );
};

EditProfileModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  profile: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    name: PropTypes.string,
    headline: PropTypes.string,
    title: PropTypes.string,
    about: PropTypes.string,
    bio: PropTypes.string,
    location: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    website: PropTypes.string,
    skills: PropTypes.arrayOf(PropTypes.string),
    experience: PropTypes.array,
    education: PropTypes.array,
    photoURL: PropTypes.string,
    coverPhoto: PropTypes.string,
  }),
  onUpdate: PropTypes.func.isRequired,
};

export default EditProfileModal;
