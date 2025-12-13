# Image Upload Functionality Guide

## Overview

The CareerOpen App now includes comprehensive image upload functionality for user profiles. Users can upload and edit both profile pictures and cover photos with a modern, intuitive interface.

## Features

### 1. Profile Picture Upload

- **Location**: Profile page and Edit Profile modal
- **Supported Formats**: JPEG, JPG, PNG, WebP
- **Size Limit**: Maximum 5MB
- **Recommended**: Square image (1:1 aspect ratio)
- **Storage**: Uploaded to Firebase Storage under `profile-pictures/{userId}/profile.{extension}`

### 2. Cover Photo Upload

- **Location**: Profile page and Edit Profile modal
- **Supported Formats**: JPEG, JPG, PNG, WebP
- **Size Limit**: Maximum 5MB
- **Recommended**: 1200x300px (4:1 aspect ratio)
- **Storage**: Uploaded to Firebase Storage under `cover-photos/{userId}/cover.{extension}`

### 3. Image Management Features

- **Preview**: Real-time image preview before upload
- **Validation**: File type and size validation
- **Remove**: Option to remove uploaded images
- **Hover Effects**: Interactive hover overlays for editing
- **Loading States**: Visual feedback during upload process

## Components

### ImageUpload Component

```jsx
import { ImageUpload } from "../components";

<ImageUpload
  currentImage={profile.photoURL}
  onImageChange={handleImageChange}
  onImageRemove={handleImageRemove}
  type="profile" // or "cover"
  disabled={false}
/>;
```

**Props:**

- `currentImage`: Current image URL or null
- `onImageChange`: Callback when a new image is selected
- `onImageRemove`: Callback when image is removed
- `type`: "profile" or "cover" (affects styling)
- `disabled`: Whether the upload is disabled
- `className`: Additional CSS classes

### Storage Service

```javascript
import {
  uploadProfilePicture,
  uploadCoverPhoto,
  deleteFile,
} from "../services/storage";

// Upload profile picture
const profileURL = await uploadProfilePicture(file, userId);

// Upload cover photo
const coverURL = await uploadCoverPhoto(file, userId);

// Delete file
await deleteFile(filePath);
```

## Usage Examples

### 1. In EditProfileModal

The EditProfileModal now includes dedicated sections for image uploads:

```jsx
// Profile Images Section
<div>
  <h3>Profile Images</h3>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Profile Picture */}
    <ImageUpload
      currentImage={formData.photoURL}
      onImageChange={handleProfileImageChange}
      onImageRemove={handleProfileImageRemove}
      type="profile"
      disabled={isSubmitting}
    />

    {/* Cover Photo */}
    <ImageUpload
      currentImage={formData.coverPhoto}
      onImageChange={handleCoverImageChange}
      onImageRemove={handleCoverImageRemove}
      type="cover"
      disabled={isSubmitting}
    />
  </div>
</div>
```

### 2. In ProfileCard

The ProfileCard displays images with hover effects for editing:

```jsx
<ProfileCard profile={profile} onEdit={() => setShowEditModal(true)} />
```

## File Structure

```
src/
├── components/
│   ├── common/
│   │   └── ImageUpload.jsx          # Reusable image upload component
│   └── profile/
│       ├── ProfileCard.jsx          # Updated with image display
│       └── EditProfileModal.jsx     # Updated with image upload
├── services/
│   └── storage/
│       └── index.js                 # Firebase storage utilities
└── pages/
    └── ProfilePage.jsx              # Updated to use ProfileCard
```

## Firebase Configuration

Ensure your Firebase configuration includes storage bucket:

```javascript
const firebaseConfig = {
  // ... other config
  storageBucket: "your-project.appspot.com",
};
```

## Security Rules

Make sure your Firebase Storage rules allow authenticated users to upload:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /profile-pictures/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /cover-photos/{userId}/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Error Handling

The system includes comprehensive error handling:

- **File Type Validation**: Only allows supported image formats
- **File Size Validation**: Enforces 5MB maximum
- **Upload Errors**: Displays user-friendly error messages
- **Network Errors**: Graceful fallback for failed uploads

## User Experience

### Visual Feedback

- **Loading States**: Spinner during upload
- **Hover Effects**: Interactive overlays on profile images
- **Preview**: Real-time image preview
- **Success/Error Messages**: Toast notifications

### Accessibility

- **Keyboard Navigation**: Full keyboard support
- **Screen Reader Support**: Proper ARIA labels
- **Focus Management**: Logical tab order
- **Error Announcements**: Screen reader accessible error messages

## Best Practices

1. **Image Optimization**: Consider implementing client-side image compression
2. **Progressive Loading**: Use lazy loading for better performance
3. **Fallback Images**: Provide default images when uploads fail
4. **Caching**: Implement proper caching strategies
5. **CDN**: Consider using a CDN for faster image delivery

## Future Enhancements

- Image cropping and editing tools
- Multiple image upload support
- Image compression and optimization
- Advanced image filters and effects
- Bulk image management
- Image analytics and usage tracking
