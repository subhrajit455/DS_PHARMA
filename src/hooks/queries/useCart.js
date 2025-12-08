import { useQuery } from "@tanstack/react-query";
import { cartService } from "../../services/cartService";
import { useCartStore } from "../../store/useCartStore";
import { useEffect } from "react";

export const useCart = () => {
  const setData = useCartStore((state) => state.setData);

  const query = useQuery({
    queryKey: ["cart"],
    queryFn: () => cartService.getCart(),
    staleTime: 0, // Always fetch latest
  });

  // Sync with store
  useEffect(() => {
    if (query.data && query.data.data) {
      // Assuming mock service returns { data: items }
      // Store might expect just items array depending on implementation
      setData(query.data.data);
    }
  }, [query.data, setData]);

  return query;
};
