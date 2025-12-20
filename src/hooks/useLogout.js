import { useNavigate } from "react-router-dom";
import useDataStore from "@/store/useDataStore";
import { useToastStore } from "@/store/useToastStore";

export const useLogout = () => {
  const navigate = useNavigate();
  const logoutStore = useDataStore((state) => state.logout);
  const { success } = useToastStore();

  const logout = () => {
    // 1. Clear authentication state
    logoutStore();

    // 2. Redirect to homepage explicitly
    // Using replace to prevent back-button navigation to protected profile
    navigate("/", { replace: true });

    // Optional: Show success message
    success("Signed out successfully");
  };

  return logout;
};
