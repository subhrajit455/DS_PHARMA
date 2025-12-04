import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { addressService } from "../../services/addressService";
import { useToastStore } from "../../store/useToastStore";

/**
 * Hook to fetch all addresses
 */
export const useAddresses = () => {
  return useQuery({
    queryKey: ["addresses"],
    queryFn: () => addressService.fetchAddresses(),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Hook to add a new address
 */
export const useAddAddress = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (addressData) => addressService.addAddress(addressData),
    onSuccess: () => {
      success("Address added successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (err) => {
      error(err.response?.data?.message || "Failed to add address");
    },
  });
};

/**
 * Hook to update an address
 */
export const useUpdateAddress = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: ({ id, data }) => addressService.updateAddress(id, data),
    onSuccess: () => {
      success("Address updated successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (err) => {
      error(err.response?.data?.message || "Failed to update address");
    },
  });
};

/**
 * Hook to delete an address
 */
export const useDeleteAddress = () => {
  const queryClient = useQueryClient();
  const { success, error } = useToastStore();

  return useMutation({
    mutationFn: (id) => addressService.deleteAddress(id),
    onSuccess: () => {
      success("Address deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
    onError: (err) => {
      error(err.response?.data?.message || "Failed to delete address");
    },
  });
};
