import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { app } from "../../config/firebase";

const storage = getStorage(app);

// Upload a file and return the download URL
export const uploadFile = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (error) {
    console.error("Error uploading file:", error);
    throw new Error("Failed to upload file");
  }
};

// Upload profile picture
export const uploadProfilePicture = async (file, userId) => {
  const fileExtension = file.name.split(".").pop();
  const fileName = `profile-pictures/${userId}/profile.${fileExtension}`;
  return await uploadFile(file, fileName);
};

// Upload cover photo
export const uploadCoverPhoto = async (file, userId) => {
  const fileExtension = file.name.split(".").pop();
  const fileName = `cover-photos/${userId}/cover.${fileExtension}`;
  return await uploadFile(file, fileName);
};

// Delete a file from storage
export const deleteFile = async (filePath) => {
  try {
    const fileRef = ref(storage, filePath);
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw new Error("Failed to delete file");
  }
};

// Get file extension from URL
export const getFileExtension = (url) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    return pathname.split(".").pop();
  } catch {
    return "jpg"; // default fallback
  }
};

// Extract file path from download URL
export const getFilePathFromURL = (url) => {
  try {
    const urlObj = new URL(url);
    const pathname = urlObj.pathname;
    // Remove the /o/ prefix and decode the path
    const match = pathname.match(/\/o\/(.+?)\?/);
    if (match) {
      return decodeURIComponent(match[1]);
    }
    return null;
  } catch {
    return null;
  }
};
