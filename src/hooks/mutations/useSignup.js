import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import useDataStore from "../../store/useDataStore";
import { useToastStore } from "../../store/useToastStore";

/**
 * Hook to handle user signup
 * Creates a new user in the global store and logs them in
 */
export const useSignup = () => {
  const navigate = useNavigate();
  const { login: storeLogin, users } = useDataStore();
  const addUser = useDataStore((state) => state.addUser);
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: async ({ fullName, name, email, password, phone }) => {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Check if user already exists
      const existingUser = users.find((u) => u.email === email);
      if (existingUser) {
        throw new Error("User with this email already exists");
      }

      // Create new user
      const newUser = {
        id: Date.now(),
        name: fullName || name,
        email,
        password,
        phone: phone || "",
        role: "user",
        address: null,
        orders: [],
        cart: [],
        wishlist: [],
      };

      return newUser;
    },

    onSuccess: (newUser) => {
      // Add user to global store
      if (addUser) {
        addUser(newUser);
      }

      // Log in the new user
      storeLogin(newUser);

      success("Account created successfully!");
      navigate("/");
    },

    onError: (err) => {
      const message = err.message || "Signup failed. Please try again.";
      error(message);
    },
  });
};
