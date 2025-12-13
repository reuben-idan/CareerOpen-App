import React, { useState, useRef } from "react";
import { CameraIcon, XMarkIcon, PhotoIcon } from "@heroicons/react/24/outline";

const ImageUpload = ({
  currentImage,
  onImageChange,
  onImageRemove,
  onImageSelect,
  type = "profile", // "profile" or "cover"
  className = "",
  disabled = false,
}) => {
  const [preview, setPreview] = useState(currentImage);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      alert("File size must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target.result);
    };
    reader.readAsDataURL(file);

    // Call parent handler
    if (onImageSelect) {
      onImageSelect(file);
    }
    if (onImageChange) {
      onImageChange(file);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onImageRemove) {
      onImageRemove();
    }
    if (onImageSelect) {
      onImageSelect(null);
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const isProfile = type === "profile";
  const containerClasses = isProfile
    ? "relative w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-lg"
    : "relative w-full h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-600";

  return (
    <div className={`${containerClasses} ${className}`}>
      {/* Current Image or Placeholder */}
      {preview ? (
        <img
          src={preview}
          alt={isProfile ? "Profile" : "Cover"}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          {isProfile ? (
            <PhotoIcon className="h-12 w-12 text-gray-400" />
          ) : (
            <div className="text-center">
              <PhotoIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isProfile ? "Add Photo" : "Add Cover Photo"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upload Overlay */}
      {!disabled && (
        <div
          onClick={handleClick}
          className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-200 flex items-center justify-center cursor-pointer"
        >
          <div className="text-center text-white">
            <CameraIcon className="h-6 w-6 mx-auto mb-1" />
            <span className="text-sm">
              {isProfile ? "Change Photo" : "Change Cover"}
            </span>
          </div>
        </div>
      )}

      {/* Remove Button */}
      {preview && !disabled && (
        <button
          onClick={handleRemoveImage}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 shadow-lg transition-colors duration-200"
          type="button"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}

      {/* Loading Overlay */}
      {isUploading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-2"></div>
            <span className="text-sm">Uploading...</span>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled}
      />
    </div>
  );
};

export default ImageUpload;
