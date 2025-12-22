import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "@/services/authService";
import { useToastStore } from "@/store/useToastStore";
import useDataStore from "@/store/useDataStore";

/**
 * Hook to fetch user profile
 */
export const useProfile = () => {
  const isAuthenticated = useDataStore((state) => state.isAuthenticated);

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
  const updateUser = useDataStore((state) => state.login); // Reuse login to update current user

  return useMutation({
    mutationFn: (profileData) => authService.updateProfile(profileData),
    onSuccess: (data) => {
      success("Profile updated successfully");
      // Update data store with new user data
      updateUser(data.data);
      // Invalidate profile query to refetch fresh data
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
    onError: (err) => {
      error(err.response?.data?.message || "Failed to update profile");
    },
  });
};
