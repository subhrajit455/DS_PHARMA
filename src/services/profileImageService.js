import useDataStore from "@/store/useDataStore";
import { validateImage } from "@/utils/imageValidation";

/**
 * Profile Image Service
 * Handles profile picture upload and removal
 */

export const profileImageService = {
  /**
   * Upload profile image
   * @param {number} userId - User ID
   * @param {File} file - Image file to upload
   * @returns {Promise<{imageUrl: string}>}
   * @throws {Error} If validation fails or upload fails
   */
  uploadProfileImage: async (userId, file) => {
    try {
      // Validate file
      validateImage(file);

      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", userId);

      const response = await fetch("/api/users/upload-profile-image", {
        method: "POST",
        // Note: Content-Type is set automatically by the browser for FormData
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to upload profile picture");
      }

      // Save to Zustand store to reflect changes instantly across the app
      useDataStore.getState().updateUserProfileImage(userId, data.imageUrl);

      return {
        success: true,
        imageUrl: data.imageUrl,
        message: data.message || "Profile picture uploaded successfully",
      };
    } catch (error) {
      console.error("Upload Error:", error);
      throw new Error(error.message || "Failed to upload profile picture");
    }
  },

  /**
   * Remove profile image
   * @param {number} userId - User ID
   * @returns {Promise<{success: boolean}>}
   */
  removeProfileImage: async (userId) => {
    try {
      const response = await fetch(
        `/api/users/remove-profile-image/${userId}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to remove profile picture");
      }

      // Remove from Zustand store
      useDataStore.getState().removeUserProfileImage(userId);

      return {
        success: true,
        message: data.message || "Profile picture removed successfully",
      };
    } catch (error) {
      console.error("Remove Error:", error);
      throw new Error(error.message || "Failed to remove profile picture");
    }
  },

  /**
   * Get current user's profile image
   * @param {number} userId - User ID
   * @returns {string | null} Profile image URL or null
   */
  getProfileImage: (userId) => {
    const state = useDataStore.getState();
    const user = state.users.find((u) => u.id === userId);
    return user?.profileImage || null;
  },
};

export default profileImageService;
