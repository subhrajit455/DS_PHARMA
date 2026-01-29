import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuthStore } from "@/store/useAuthStore";
import { decodeToken } from "@/shared/utils/decodeToken";
import toastUtil from "@/shared/utils/toast";

/**
 * Hook to handle user login
 */
export const useLogin = () => {
  const navigate = useNavigate();
  const { login: storeLogin } = useAuthStore();

  return useMutation({
    mutationFn: async ({ email, password }) => {
      const response = await authService.login({ email, password });
      return response;
    },

    onSuccess: async (response) => {
      // 1. Extract Token and User from response
      const token =
        response.data?.token || response.token || response.accessToken;
      let user = response.data?.user || response.user || response.customer;

      if (!token) {
        toastUtil.error("Invalid login response: No token received");
        return;
      }

      // 2. Persist Token for interceptor use
      localStorage.setItem("authToken", token);

      // 3. Extract identity from token if missing from login response
      if (!user) {
        const decoded = decodeToken(token);
        if (decoded) {
          user = {
            id: decoded.id || decoded.sub || decoded._id,
            role: decoded.role || "user",
            email: decoded.email,
          };
        } else {
          toastUtil.error("Login failed: Could not parse identity from token");
          return;
        }
      }

      // 4. Update global auth state
      storeLogin(user, token);

      toastUtil.success("Welcome back!");

      // 5. Navigate based on role or redirect param
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect");

      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate(redirectPath || "/");
      }
    },

    onError: (err) => {
      const message =
        err.message || "Login failed. Please check your credentials.";
      toastUtil.error(message);
    },
  });
};
