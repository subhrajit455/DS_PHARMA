import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/useAuthStore";
import { useToastStore } from "../../store/useToastStore";

/**
 * Hook to handle user login
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: authService.login,

    onSuccess: (data) => {
      // Expecting { data: { user, token } } from API/mock service
      const userData = data.data?.user || data.user;
      const token = data.data?.token || data.token;

      login(userData, token);
      success("Login successful!");
      navigate("/");
    },

    onError: (err) => {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      error(message);
    },
  });
};
