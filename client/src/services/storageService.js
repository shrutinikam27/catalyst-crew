/**
 * Firebase Storage Service — Upload/download files for SafeLink platform.
 * Handles complaint images, evidence, profile photos, emergency media.
 */

import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

/**
 * Upload a file to Firebase Storage
 * @param {File} file - The file to upload
 * @param {string} path - Storage path (e.g., 'complaints/userId/filename.jpg')
 * @returns {string} Download URL
 */
export const uploadFile = async (file, path) => {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};

/**
 * Upload a complaint image
 * @param {File} file - Image file
 * @param {string} userId - User ID
 * @param {string} complaintId - Complaint ID (optional, use timestamp if not available)
 * @returns {string} Download URL
 */
export const uploadComplaintImage = async (file, userId, complaintId = null) => {
  const id = complaintId || Date.now().toString();
  const ext = file.name.split('.').pop();
  const path = `complaints/${userId}/${id}.${ext}`;
  return uploadFile(file, path);
};

/**
 * Upload crime evidence
 * @param {File} file - Evidence file
 * @param {string} crimeId - Crime report ID
 * @returns {string} Download URL
 */
export const uploadCrimeEvidence = async (file, crimeId) => {
  const ext = file.name.split('.').pop();
  const path = `evidence/${crimeId}/${Date.now()}.${ext}`;
  return uploadFile(file, path);
};

/**
 * Upload user profile image
 * @param {File} file - Profile image file
 * @param {string} userId - User ID
 * @returns {string} Download URL
 */
export const uploadProfileImage = async (file, userId) => {
  const ext = file.name.split('.').pop();
  const path = `profiles/${userId}/avatar.${ext}`;
  return uploadFile(file, path);
};

/**
 * Upload emergency media (SOS attachments)
 * @param {File} file - Media file
 * @param {string} emergencyId - Emergency request ID
 * @returns {string} Download URL
 */
export const uploadEmergencyMedia = async (file, emergencyId) => {
  const ext = file.name.split('.').pop();
  const path = `emergencies/${emergencyId}/${Date.now()}.${ext}`;
  return uploadFile(file, path);
};

/**
 * Delete a file from Firebase Storage
 * @param {string} fileUrl - The full download URL of the file
 */
export const deleteFile = async (fileUrl) => {
  try {
    const fileRef = ref(storage, fileUrl);
    await deleteObject(fileRef);
  } catch (error) {
    console.error('Error deleting file:', error);
  }
};

/**
 * Get download URL for a storage path
 * @param {string} path - Storage path
 * @returns {string} Download URL
 */
export const getFileUrl = async (path) => {
  const fileRef = ref(storage, path);
  return getDownloadURL(fileRef);
};
