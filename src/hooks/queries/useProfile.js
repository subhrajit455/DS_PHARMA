import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../../services/authService";
import { useToastStore } from "../../store/useToastStore";
import { useAuthStore } from "../../store/useAuthStore";

/**
 * Hook to fetch user profile
 */
export const useProfile = () => {
  const { isAuthenticated } = useAuthStore();

  return useQuery({
    queryKey: ["profile"],
    queryFn: () => authService.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to update user profile
 */
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (profileData) => authService.updateProfile(profileData),
    onSuccess: (data) => {
      success("Profile updated successfully");
      // Update auth store with new user data
      setUser(data.data);
      // Invalidate profile query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err) => {
      error(err.response?.data?.message || "Failed to update profile");
    },
  });
};
