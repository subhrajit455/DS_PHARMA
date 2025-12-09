import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import mockApi from "../../api/mockApi";
import useDataStore from "../../store/useDataStore";
import { useToastStore } from "../../store/useToastStore";

/**
 * Hook to handle user login
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { login: storeLogin } = useDataStore();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      // Use mockApi which accesses the global store
      return await mockApi.login(email, password);
    },

    onSuccess: ({ user }) => {
      // Update global store
      storeLogin(user);

      success("Login successful!");

      // Redirect based on role if needed, or just home
      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    },

    onError: (err) => {
      const message =
        err.message || "Login failed. Please check your credentials.";
      error(message);
    },
  });
};
