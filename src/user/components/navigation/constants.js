import { Home, Package, LayoutGrid, ShoppingBag } from "lucide-react";

// Navigation menu items
export const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home, guest: true, auth: true },
  { name: "Shop", href: "/shop", icon: ShoppingBag, guest: true, auth: true },
  {
    name: "Categories",
    href: "#categories",
    icon: LayoutGrid,
    guest: true,
    auth: true,
  },
  { name: "Orders", href: "/orders", icon: Package, guest: false, auth: true },
];

// No mock data allowed. Search suggestions now come from searchService.
