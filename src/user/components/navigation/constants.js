import { Home, Package, Info, Phone } from "lucide-react";

// Navigation menu items
export const NAV_ITEMS = [
  { name: "Home", href: "/", icon: Home },
  { name: "Orders", href: "/orders", icon: Package },
  { name: "About Us", href: "#about", icon: Info },
  { name: "Contact Us", href: "#contact", icon: Phone },
];

// Mock product data for search suggestions
export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: 12,
    image: "/src/assets/images/medicine.jpeg",
    category: "Pain Relief",
  },
  {
    id: 2,
    name: "Pharmeasy Fish Oil 1000mg",
    price: 1500,
    image: "/src/assets/images/medicine.jpeg",
    category: "Supplements",
  },
  {
    id: 3,
    name: "Vitamin D3 Capsules",
    price: 450,
    image: "/src/assets/images/medicine.jpeg",
    category: "Vitamins",
  },
  {
    id: 4,
    name: "Aspirin 75mg",
    price: 25,
    image: "/src/assets/images/medicine.jpeg",
    category: "Cardiovascular",
  },
  {
    id: 5,
    name: "Amoxicillin 250mg",
    price: 85,
    image: "/src/assets/images/medicine.jpeg",
    category: "Antibiotics",
  },
];
