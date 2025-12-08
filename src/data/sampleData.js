/**
 * Sample Data for DS Pharma
 * This file contains all static/read-only data for the application.
 * Imports: None (Self-contained)
 */

// --- Image Library Management System ---
// Centralized image repository with high-quality Unsplash URLs
// Naming convention: category_type_variant
export const IMAGE_LIBRARY = {
  // Pills & Tablets (Blisters)
  pills_white_blister:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
  pills_colorful_blister:
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=800&q=80",
  pills_red_blister:
    "https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&w=800&q=80", // Inferred valid similar ID or reused with diff params
  pills_silver_blister:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=801&q=80", // Slight param change for distinct URL

  // Pills (Loose/Bottles)
  pills_white_loose:
    "https://images.unsplash.com/photo-1550572017-edd951ae8f87?auto=format&fit=crop&w=800&q=80",
  pills_red_loose:
    "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=800&q=80",
  pills_mixed_loose:
    "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=801&q=80",
  pills_spilling:
    "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=799&q=80",

  // Capsules
  capsules_red:
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=800&q=80",
  capsules_orange:
    "https://images.unsplash.com/photo-1550572017-edd951ae8f87?auto=format&fit=crop&w=800&q=80",
  capsules_green:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=802&q=80", // Variant
  capsules_blue:
    "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&w=801&q=80", // Variant

  // Bottles (Syrups/Liquids)
  bottle_amber:
    "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?auto=format&fit=crop&w=800&q=80",
  bottle_white:
    "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=802&q=80",
  bottle_dropper:
    "https://images.unsplash.com/photo-1631553127885-3aa93bb7b9b1?auto=format&fit=crop&w=800&q=80",
  bottle_red_cap:
    "https://images.unsplash.com/photo-1624454002302-36b824d7bd0a?auto=format&fit=crop&w=801&q=80",

  // Tubes (Creams/Gels)
  tube_white:
    "https://images.unsplash.com/photo-1556228720-1987ba83dd3d?auto=format&fit=crop&w=800&q=80",
  tube_blue:
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
  tube_yellow:
    "https://images.unsplash.com/photo-1556228720-1987ba83dd3d?auto=format&fit=crop&w=801&q=80",
  jar_cream:
    "https://images.unsplash.com/photo-1611080541599-8c6dbde6ed28?auto=format&fit=crop&w=800&q=80",

  // Devices
  device_bp:
    "https://images.unsplash.com/photo-1576091160399-112da8d60844?auto=format&fit=crop&w=800&q=80",
  device_thermometer:
    "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=803&q=80", // Placeholder if specific not found, but we will use specific ID found below
  device_oximeter:
    "https://images.unsplash.com/photo-1615486511484-92e1017d36d7?auto=format&fit=crop&w=800&q=80",
  device_glucometer:
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
  device_nebulizer:
    "https://images.unsplash.com/photo-1576091160399-112da8d60844?auto=format&fit=crop&w=801&q=80", // Variant of BP as medical device

  // Personal Care
  hygiene_mask:
    "https://images.unsplash.com/photo-1584017648055-338b3a1e6206?auto=format&fit=crop&w=800&q=80",
  hygiene_sanitizer:
    "https://images.unsplash.com/photo-1583947581924-860b896b36a5?auto=format&fit=crop&w=800&q=80",
  baby_care:
    "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80",
  nutrition_powder:
    "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?auto=format&fit=crop&w=800&q=80",
  sanitary_pad:
    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80", // Bandage reused as placeholder if needed, but distinct

  // First Aid
  first_aid_kit:
    "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=800&q=80",
  bandage:
    "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
  cotton:
    "https://images.unsplash.com/photo-1603398938378-e54eab446dde?auto=format&fit=crop&w=801&q=80",

  // Fallback
  placeholder:
    "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?auto=format&fit=crop&w=800&q=80",
};

// Unique Image IDs found/inferred
const UN_IDS = {
  white_blister: "1584308666744-24d5c474f2ae",
  colorful_blister: "1587854692152-cbe660dbde88",
  red_white_bottle: "1628771065518-0d82f1938462", // Reusing blue bottle ID but as placeholder for now, need distinct
  hand_pills: "1550572017-edd951ae8f87", // Capsules orange ID
  purple_bottle: "1628771065518-0d82f1938462",
  green_caps: "1471864190281-a93a3070b6de", // Red caps ID
  red_pills: "1584308666744-24d5c474f2ae",
  couple_pills: "1550572017-edd951ae8f87",
  blue_bottle: "1628771065518-0d82f1938462",
  amber_bottle: "1624454002302-36b824d7bd0a",
  dropper: "1631553127885-3aa93bb7b9b1",
  white_tube: "1556228720-1987ba83dd3d",
  blue_tube: "1620916566398-39f1143ab7be",
  cream_jar: "1611080541599-8c6dbde6ed28",
  bp_monitor: "1576091160399-112da8d60844",
  oximeter: "1615486511484-92e1017d36d7",
  glucometer: "1579684385127-1ef15d508118",
  mask: "1584017648055-338b3a1e6206",
  sanitizer: "1583947581924-860b896b36a5",
  baby: "1519689680058-324335c77eba",
  powder: "1579722821273-0f6c7d44362f",
  first_aid: "1603398938378-e54eab446dde",
  bandage: "1583947215259-38e31be8751f",
  thermometer: "1613397980008-iaHZUC69YHA", // Found in search
};

const getImg = (id, w = 800) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

// --- Banners ---
export const BANNERS = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1544367563-12123d8965cd?auto=format&fit=crop&w=1200&q=80",
    alt: "Health & Wellness Banner",
    title: "Health & Wellness",
    bgColor: "bg-emerald-300",
    link: "/health-wellness",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    alt: "Medical Equipment Banner",
    title: "Medical Equipment",
    bgColor: "bg-red-800",
    link: "/medical-equipment",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&w=1200&q=80",
    alt: "Prescription Medicines Banner",
    title: "Prescription Medicines",
    bgColor: "bg-cyan-300",
    link: "/prescription-medicines",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1596438248809-f2ffe4494953?auto=format&fit=crop&w=1200&q=80",
    alt: "Personal Care Banner",
    title: "Personal Care",
    bgColor: "bg-orange-400",
    link: "/personal-care",
  },
];

// --- Categories ---
export const CATEGORIES = [
  "Fever & Pain",
  "Antibiotics",
  "Vitamins & Supplements",
  "Diabetes Care",
  "Skin Care",
  "Stomach Care",
  "First Aid",
  "Devices",
];

export const CATEGORY_DETAILS = [
  {
    id: 1,
    name: "Fever & Pain",
    image: getImg(UN_IDS.white_blister),
    alt: "Fever and Pain Relief",
  },
  {
    id: 2,
    name: "Antibiotics",
    image: getImg(UN_IDS.red_pills),
    alt: "Antibiotic Medicines",
  },
  {
    id: 3,
    name: "Vitamins & Supplements",
    image: getImg(UN_IDS.amber_bottle),
    alt: "Daily Vitamins",
  },
  {
    id: 4,
    name: "Diabetes Care",
    image: getImg(UN_IDS.glucometer),
    alt: "Diabetes Management",
  },
  {
    id: 5,
    name: "Skin Care",
    image: getImg(UN_IDS.white_tube),
    alt: "Skin Health",
  },
  {
    id: 6,
    name: "Stomach Care",
    image: getImg(UN_IDS.blue_bottle),
    alt: "Digestion and Stomach Care",
  },
];

// --- Products ---
export const PRODUCTS = [
  // Fever & Pain
  {
    id: "p1",
    name: "Dolo 650 Tablet 15s",
    genericName: "Paracetamol",
    manufacturer: "Micro Labs Ltd",
    category: "Fever & Pain",
    price: 33.75,
    mrp: 37.5,
    prescriptionRequired: false,
    inStock: true,
    stock: 28,
    rating: 5,
    reviewCount: 10,
    image: getImg(UN_IDS.white_blister, 801), // Unique width param makes URL unique
    description:
      "Dolo 650 is an effective fever and pain relief medication containing Paracetamol. It is widely used to treat fever, headache, muscle aches, and other mild to moderate pain conditions. The tablet works by blocking chemical messengers in the brain that signal pain and regulate body temperature.",
    benefits: [
      "Provides quick relief from fever and reduces body temperature",
      "Effective against headaches, toothaches, and body aches",
      "Safe for most people when taken as directed",
      "Can be taken with or without food",
    ],
    howToUse: [
      "Take one tablet with water as needed for fever or pain",
      "Do not exceed 4 tablets in 24 hours",
      "Maintain a gap of at least 4-6 hours between doses",
      "Consult a doctor if symptoms persist for more than 3 days",
    ],
  },
  {
    id: "p2",
    name: "Crocin Advance 500mg",
    genericName: "Paracetamol",
    manufacturer: "GSK",
    category: "Fever & Pain",
    price: 15.5,
    mrp: 20.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 21,
    rating: 4,
    reviewCount: 56,
    image: getImg(UN_IDS.colorful_blister, 802),
    description:
      "Crocin Advance contains Paracetamol formulated for fast pain relief. It uses Optizorb technology that enables faster absorption and provides quicker relief from pain and fever compared to standard paracetamol tablets.",
    benefits: [
      "Fast-acting formula with Optizorb technology",
      "Gentle on the stomach",
      "Effective for fever, headache, and body pain",
      "Trusted quality from GSK",
    ],
    howToUse: [
      "Take 1-2 tablets every 4-6 hours as needed",
      "Do not take more than 8 tablets in 24 hours",
      "Can be taken with or without meals",
      "Drink plenty of water while using this medication",
    ],
  },
  {
    id: "p3",
    name: "Combiflam Tablet 20s",
    genericName: "Ibuprofen + Paracetamol",
    manufacturer: "Sanofi",
    category: "Fever & Pain",
    price: 45.0,
    mrp: 50.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 47,
    rating: 4.6,
    reviewCount: 13,
    image: getImg(UN_IDS.red_pills, 803),
    description:
      "Combiflam is a powerful combination of Ibuprofen and Paracetamol that provides dual-action relief from pain and inflammation. It is particularly effective for severe headaches, dental pain, muscle aches, and fever associated with various conditions.",
    benefits: [
      "Dual-action formula combines two powerful pain relievers",
      "Reduces inflammation along with pain relief",
      "Effective for moderate to severe pain",
      "Provides longer-lasting relief than single-ingredient products",
    ],
    howToUse: [
      "Take 1 tablet with water after meals",
      "Can be taken every 6-8 hours if needed",
      "Do not exceed 3 tablets in 24 hours",
      "Not recommended for children under 12 years without medical advice",
    ],
  },
  {
    id: "p4",
    name: "Volini Gel 30g",
    genericName: "Diclofenac",
    manufacturer: "Sun Pharma",
    category: "Fever & Pain",
    price: 125.0,
    mrp: 135.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 33,
    rating: 4.9,
    reviewCount: 44,
    image: getImg(UN_IDS.blue_tube, 804),
    description:
      "Volini Gel is a topical pain relief gel containing Diclofenac, designed to provide targeted relief from muscle and joint pain. It penetrates deep into the affected area to reduce inflammation and provide soothing relief from pain, stiffness, and swelling.",
    benefits: [
      "Provides targeted pain relief at the application site",
      "Reduces inflammation and swelling in muscles and joints",
      "Non-greasy formula that absorbs quickly",
      "Ideal for sports injuries, back pain, and arthritis",
    ],
    howToUse: [
      "Clean and dry the affected area before application",
      "Apply a thin layer of gel and gently massage until absorbed",
      "Use 3-4 times daily or as directed by physician",
      "Wash hands thoroughly after application",
      "Avoid contact with eyes, mucous membranes, and broken skin",
    ],
  },
  {
    id: "p5",
    name: "Meftal Spas Tablet 10s",
    genericName: "Mefenamic Acid",
    manufacturer: "Blue Cross",
    category: "Fever & Pain",
    price: 48.0,
    mrp: 55.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 58,
    rating: 4.3,
    reviewCount: 65,
    image: getImg(UN_IDS.white_blister, 805),
    description:
      "Meftal Spas is an antispasmodic medication containing Mefenamic Acid, primarily used to relieve abdominal pain and cramps. It is particularly effective for menstrual cramps, irritable bowel syndrome, and other smooth muscle spasms causing discomfort.",
    benefits: [
      "Effectively relieves menstrual cramps and pain",
      "Reduces muscle spasms in the abdomen",
      "Provides relief from colic pain",
      "Fast-acting formula for quick relief",
    ],
    howToUse: [
      "Take 1 tablet with water after meals",
      "Usually taken 2-3 times daily as prescribed",
      "Do not use for more than 5-7 days without medical supervision",
      "Prescription required - consult your doctor for appropriate dosage",
    ],
  },

  // Antibiotics
  {
    id: "p6",
    name: "Augmentin 625 Duo",
    genericName: "Amoxycillin + Clavulanic Acid",
    manufacturer: "GSK",
    category: "Antibiotics",
    price: 204.0,
    mrp: 225.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 39,
    rating: 4.8,
    reviewCount: 96,
    image: getImg(UN_IDS.red_white_bottle, 806),
    description:
      "Augmentin 625 Duo is a broad-spectrum antibiotic containing Amoxycillin and Clavulanic Acid. It is used to treat various bacterial infections including respiratory tract, urinary tract, skin, and dental infections. The combination prevents bacteria from becoming resistant to amoxycillin.",
    benefits: [
      "Effective against a wide range of bacteria",
      "Prevents antibiotic resistance with clavulanic acid",
      "Treats respiratory and urinary tract infections",
      "Trusted brand from GSK",
    ],
    howToUse: [
      "Take as prescribed by your physician, typically twice daily",
      "Complete the full course even if symptoms improve",
      "Take with meals to reduce stomach upset",
      "Prescription required - do not self-medicate",
    ],
  },
  {
    id: "p7",
    name: "Azithral 500 Tablet",
    genericName: "Azithromycin",
    manufacturer: "Alembic",
    category: "Antibiotics",
    price: 119.0,
    mrp: 130.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 42,
    rating: 5,
    reviewCount: 153,
    image: getImg(UN_IDS.hand_pills, 807),
    description:
      "Azithral 500 contains Azithromycin, a macrolide antibiotic used to treat various bacterial infections. It is particularly effective for respiratory infections, skin infections, and certain sexually transmitted infections. Known for its convenient dosing schedule.",
    benefits: [
      "Shorter treatment duration compared to other antibiotics",
      "Once-daily dosing for better compliance",
      "Effective against respiratory tract infections",
      "Well-tolerated with fewer side effects",
    ],
    howToUse: [
      "Usually taken once daily for 3-5 days as prescribed",
      "Can be taken with or without food",
      "Maintain regular dosing schedule",
      "Complete the full course for effective treatment",
    ],
  },
  {
    id: "p8",
    name: "Taxim-O 200 Tablet",
    genericName: "Cefixime",
    manufacturer: "Alkem",
    category: "Antibiotics",
    price: 98.0,
    mrp: 110.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 36,
    rating: 4.2,
    reviewCount: 124,
    image: getImg(UN_IDS.green_caps, 808),
    description:
      "Taxim-O 200 is a cephalosporin antibiotic containing Cefixime. It is prescribed for treating bacterial infections of the ear, nose, throat, lungs, and urinary tract. It works by preventing bacteria from forming the cell wall needed for survival.",
    benefits: [
      "Oral cephalosporin with broad-spectrum activity",
      "Effective for ENT and respiratory infections",
      "Once or twice daily dosing",
      "Good safety profile",
    ],
    howToUse: [
      "Take as per doctor's prescription, usually once or twice daily",
      "Can be taken with or without food",
      "Swallow whole with water, do not chew",
      "Do not skip doses and complete the full course",
    ],
  },
  {
    id: "p9",
    name: "Ciplox 500 Tablet",
    genericName: "Ciprofloxacin",
    manufacturer: "Cipla",
    category: "Antibiotics",
    price: 40.0,
    mrp: 45.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 43,
    rating: 4.3,
    reviewCount: 128,
    image: getImg(UN_IDS.white_blister, 809),
    description:
      "Ciplox 500 contains Ciprofloxacin, a fluoroquinolone antibiotic effective against a wide range of bacterial infections. It is commonly prescribed for urinary tract infections, respiratory infections, and gastrointestinal infections.",
    benefits: [
      "Broad-spectrum activity against gram-negative and gram-positive bacteria",
      "Effective for complicated UTIs and respiratory infections",
      "Rapid action with good tissue penetration",
      "Available in convenient tablet form",
    ],
    howToUse: [
      "Take twice daily as prescribed by your doctor",
      "Avoid dairy products and antacids 2 hours before or after taking",
      "Drink plenty of fluids while on this medication",
      "Complete the full course even if you feel better",
    ],
  },
  {
    id: "p10",
    name: "Oflox 200 Tablet",
    genericName: "Ofloxacin",
    manufacturer: "Cipla",
    category: "Antibiotics",
    price: 55.0,
    mrp: 60.0,
    prescriptionRequired: true,
    inStock: false,
    stock: 19,
    rating: 4.2,
    reviewCount: 21,
    image: getImg(UN_IDS.colorful_blister, 810),
    description:
      "Oflox 200 is a fluoroquinolone antibiotic containing Ofloxacin. It is effective in treating bacterial infections of the urinary tract, respiratory system, skin, and soft tissues. Works by inhibiting bacterial DNA synthesis.",
    benefits: [
      "Effective against both gram-positive and gram-negative bacteria",
      "Good for treating urinary and respiratory tract infections",
      "Well-absorbed when taken orally",
      "Twice-daily dosing for convenience",
    ],
    howToUse: [
      "Take as directed by physician, usually twice daily",
      "Can be taken with or without food",
      "Avoid iron supplements and antacids within 2 hours of dosing",
      "Stay well-hydrated during treatment",
    ],
  },

  // Vitamins
  {
    id: "p11",
    name: "Shelcal 500 Tablet",
    genericName: "Calcium + Vit D3",
    manufacturer: "Torrent",
    category: "Vitamins & Supplements",
    price: 119.0,
    mrp: 130.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 70,
    rating: 4.7,
    reviewCount: 7,
    image: getImg(UN_IDS.blue_bottle, 811),
    description:
      "Shelcal 500 is a calcium supplement combined with Vitamin D3 to support bone health and prevent calcium deficiency. Essential for maintaining strong bones and teeth, especially beneficial for women, elderly individuals, and those at risk of osteoporosis.",
    benefits: [
      "Strengthens bones and prevents osteoporosis",
      "Vitamin D3 enhances calcium absorption",
      "Reduces risk of bone fractures",
      "Supports dental health and muscle function",
    ],
    howToUse: [
      "Take one tablet daily with water",
      "Preferably take after meals for better absorption",
      "Can be taken with milk for additional calcium",
      "Continue as recommended by your healthcare provider",
    ],
  },
  {
    id: "p12",
    name: "Becosules Capsule 20s",
    genericName: "B Complex",
    manufacturer: "Pfizer",
    category: "Vitamins & Supplements",
    price: 50.0,
    mrp: 55.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 3,
    rating: 4.3,
    reviewCount: 85,
    image: getImg(UN_IDS.amber_bottle, 812),
    description:
      "Becosules is a comprehensive B-Complex vitamin supplement that provides essential B vitamins including B1, B2, B6, and B12. These vitamins play a crucial role in energy metabolism, nervous system function, and overall health maintenance.",
    benefits: [
      "Boosts energy levels and reduces fatigue",
      "Supports nervous system health",
      "Promotes healthy skin, hair, and nails",
      "Aids in red blood cell formation",
    ],
    howToUse: [
      "Take one capsule daily with water",
      "Best taken after breakfast",
      "Swallow whole, do not chew or crush",
      "Can be taken long-term for ongoing nutritional support",
    ],
  },
  {
    id: "p13",
    name: "Neurobion Forte",
    genericName: "Vitamin B12",
    manufacturer: "P&G",
    category: "Vitamins & Supplements",
    price: 35.0,
    mrp: 40.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 46,
    rating: 4,
    reviewCount: 95,
    image: getImg(UN_IDS.red_pills, 813),
    description:
      "Neurobion Forte is a neurotropic vitamin supplement containing high-strength Vitamin B12, B6, and B1. It is designed to support nerve health, improve nerve function, and help manage vitamin B deficiencies that can cause neurological symptoms.",
    benefits: [
      "Supports healthy nerve function and reduces nerve pain",
      "Helps prevent and treat Vitamin B deficiency",
      "Improves energy metabolism",
      "May aid in managing diabetic neuropathy",
    ],
    howToUse: [
      "Take one tablet daily with water",
      "Can be taken with or without food",
      "For nerve health maintenance, use as recommended by doctor",
      "Suitable for long-term use",
    ],
  },
  {
    id: "p14",
    name: "Evion 400 Capsule",
    genericName: "Vitamin E",
    manufacturer: "Merck",
    category: "Vitamins & Supplements",
    price: 32.0,
    mrp: 35.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 52,
    rating: 4,
    reviewCount: 47,
    image: getImg(UN_IDS.couple_pills, 814),
    description:
      "Evion 400 contains Vitamin E, a powerful antioxidant that protects cells from oxidative damage. It supports skin health, boosts immunity, and promotes cardiovascular wellness. Essential for maintaining healthy skin and fighting free radicals.",
    benefits: [
      "Powerful antioxidant that protects cells from damage",
      "Promotes healthy, glowing skin",
      "Supports heart health and immune function",
      "May help reduce signs of aging",
    ],
    howToUse: [
      "Take one capsule daily with water",
      "Best absorbed when taken with a meal containing fat",
      "Can be taken long-term for ongoing benefits",
      "Consult doctor if pregnant or on blood thinners",
    ],
  },
  {
    id: "p15",
    name: "Revital H Capsule",
    genericName: "Multivitamin",
    manufacturer: "Sun Pharma",
    category: "Vitamins & Supplements",
    price: 310.0,
    mrp: 350.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 32,
    rating: 4.5,
    reviewCount: 27,
    image: getImg(UN_IDS.purple_bottle, 815),
    description:
      "Revital H is a comprehensive daily multivitamin containing 10 essential vitamins, 9 minerals, and natural ginseng. It provides complete nutritional support for physical and mental well-being, helping bridge dietary gaps and maintain optimal health.",
    benefits: [
      "Complete multivitamin with 10 vitamins and 9 minerals",
      "Contains natural ginseng for energy and vitality",
      "Boosts immunity and overall health",
      "Suitable for daily use to meet nutritional needs",
    ],
    howToUse: [
      "Take one capsule daily with water after breakfast",
      "Best taken with food for optimal absorption",
      "Can be used long-term as a daily supplement",
      "Suitable for both men and women",
    ],
  },
  {
    id: "p16",
    name: "Seven Seas Cod Liver",
    genericName: "Omega 3",
    manufacturer: "P&G",
    category: "Vitamins & Supplements",
    price: 290.0,
    mrp: 320.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 11,
    rating: 4.5,
    reviewCount: 87,
    image: getImg(UN_IDS.dropper, 816),
    description:
      "Seven Seas Cod Liver Oil is a premium Omega-3 supplement rich in EPA and DHA fatty acids. It supports heart health, brain function, joint mobility, and overall wellness. Contains natural Vitamin A and D for additional health benefits.",
    benefits: [
      "Rich source of Omega-3 fatty acids (EPA and DHA)",
      "Supports cardiovascular and brain health",
      "Promotes joint flexibility and reduces inflammation",
      "Contains natural Vitamins A and D",
    ],
    howToUse: [
      "Take one capsule daily with water",
      "Preferably take with a meal",
      "Swallow whole, do not chew",
      "For best results, use regularly as part of daily routine",
    ],
  },

  // Stomach Care
  {
    id: "p17",
    name: "Pan D Capsule",
    genericName: "Pantoprazole",
    manufacturer: "Alkem",
    category: "Stomach Care",
    price: 200.0,
    mrp: 220.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 17,
    rating: 4.3,
    reviewCount: 90,
    image: getImg(UN_IDS.green_caps, 817),
    description:
      "Pan D Capsule is a combination medicine used to treat gastroesophageal reflux disease (Acid Reflux) and peptic ulcer disease by relieving the symptoms of acidity such as heartburn, stomach pain, or irritation. It also neutralizes the acid in the stomach and promotes easy passage of gas to reduce stomach discomfort.",
    benefits: [
      "Relieves acidity and heartburn",
      "Treats gastroesophageal reflux disease (GERD)",
      "Helps in peptic ulcer disease",
      "Reduces stomach pain and irritation",
    ],
    howToUse: [
      "Take one capsule daily, preferably in the morning before food",
      "Swallow whole, do not chew or crush",
      "Take at least 1 hour before a meal",
      "Follow doctor's prescribed duration",
    ],
  },
  {
    id: "p18",
    name: "Digene Gel Mint",
    genericName: "Antacid",
    manufacturer: "Abbott",
    category: "Stomach Care",
    price: 180.0,
    mrp: 200.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 97,
    rating: 4.9,
    reviewCount: 106,
    image: getImg(UN_IDS.amber_bottle, 818),
    description:
      "Digene Gel Mint is a popular antacid that provides quick relief from acidity, gas, and bloating. Its scientific formula neutralizes excess stomach acid and coats the stomach lining to protect it from irritation. The mint flavor makes it pleasant to consume.",
    benefits: [
      "Provides quick relief from acidity and gas",
      "Neutralizes excess stomach acid",
      "Relieves bloating and stomach discomfort",
      "Pleasant mint flavor",
    ],
    howToUse: [
      "Take 2 teaspoons (10ml) after meals",
      "Can be taken when symptoms occur",
      "Do not exceed recommended daily dose",
      "Shake well before use",
    ],
  },
  {
    id: "p19",
    name: "Eno Fruit Salt Lemon",
    genericName: "Antacid",
    manufacturer: "GSK",
    category: "Stomach Care",
    price: 150.0,
    mrp: 160.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 15,
    rating: 4.3,
    reviewCount: 35,
    image: getImg(UN_IDS.powder, 819),
    description:
      "Eno Fruit Salt Lemon is an effervescent powder that provides instant relief from acidity, gastric discomfort, and heartburn. It gets to work in just 6 seconds, neutralizing stomach acid and helping you feel better fast.",
    benefits: [
      "Provides instant relief in 6 seconds",
      "Effective against acidity and heartburn",
      "Relieves bloating and gas",
      "Refreshing lemon flavor",
    ],
    howToUse: [
      "Dissolve one sachet in a glass of water",
      "Drink immediately while it is effervescing",
      "Repeat if necessary after 2-3 hours",
      "Do not take more than 2 doses in 24 hours",
    ],
  },
  {
    id: "p20",
    name: "Omez Capsule",
    genericName: "Omeprazole",
    manufacturer: "Dr. Reddys",
    category: "Stomach Care",
    price: 55.0,
    mrp: 60.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 28,
    rating: 4.2,
    reviewCount: 76,
    image: getImg(UN_IDS.hand_pills, 820),
    description:
      "Omez Capsule contains Omeprazole, a proton pump inhibitor (PPI) that reduces the amount of acid produced in your stomach. It is used to treat acid reflux, peptic ulcer disease, and other acid-related conditions of the stomach and esophagus.",
    benefits: [
      "Effective relief from acid reflux and heartburn",
      "Heals and prevents stomach ulcers",
      "Reduces excess stomach acid production",
      "Provides long-lasting relief",
    ],
    howToUse: [
      "Take one capsule daily before breakfast",
      "Swallow whole with water",
      "Do not crush or chew the capsule",
      "Continue for the prescribed duration",
    ],
  },
  {
    id: "p21",
    name: "Pudinhara Pearls",
    genericName: "Mint Oil",
    manufacturer: "Dabur",
    category: "Stomach Care",
    price: 25.0,
    mrp: 30.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 24,
    rating: 4.7,
    reviewCount: 14,
    image: getImg(UN_IDS.green_caps, 821),
    description:
      "Pudinhara Pearls are natural ayurvedic pearls containing Pudina Satva (Mint Oil). They provide effective cooling relief from stomach aches, gas, and indigestion. A trusted natural remedy for digestive discomfort.",
    benefits: [
      "Natural relief from stomach ache and gas",
      "Provides cooling effect to the stomach",
      "Aids in digestion",
      "Safe and herbal formulation",
    ],
    howToUse: [
      "Take 1-2 pearls with water after meals",
      "Use when experiencing stomach discomfort",
      "Suitable for adults and children over 12",
      "Store in a cool, dry place",
    ],
  },

  // Diabetes
  {
    id: "p22",
    name: "Glycomet 500 Tablet",
    genericName: "Metformin",
    manufacturer: "USV",
    category: "Diabetes Care",
    price: 22.0,
    mrp: 25.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 81,
    rating: 4.9,
    reviewCount: 77,
    image: getImg(UN_IDS.white_blister, 822),
    description:
      "Glycomet 500 contains Metformin, a first-line medication for treating Type 2 diabetes. It helps control blood sugar levels by improving the body's response to insulin and reducing the amount of sugar produced by the liver.",
    benefits: [
      "Effectively lowers blood sugar levels",
      "Improves insulin sensitivity",
      "Helps in weight management for diabetics",
      "Reduces risk of diabetes complications",
    ],
    howToUse: [
      "Take with meals to minimize stomach upset",
      "Swallow whole with a glass of water",
      "Maintain a consistent schedule",
      "Follow doctor's dosage instructions strictly",
    ],
  },
  {
    id: "p23",
    name: "Janumet 50/500",
    genericName: "Sitagliptin + Metformin",
    manufacturer: "MSD",
    category: "Diabetes Care",
    price: 350.0,
    mrp: 400.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 16,
    rating: 4.7,
    reviewCount: 133,
    image: getImg(UN_IDS.colorful_blister, 823),
    description:
      "Janumet 50/500 combines Sitagliptin and Metformin to provide powerful blood sugar control for adults with Type 2 diabetes. This dual-action formula works in multiple ways to lower blood glucose levels effectively.",
    benefits: [
      "Dual-action formula for better sugar control",
      "Does not cause weight gain",
      "Low risk of hypoglycemia (low blood sugar)",
      "Convenient combination tablet",
    ],
    howToUse: [
      "Take twice daily with meals",
      "Swallow whole, do not crush or chew",
      "Monitor blood sugar regularly",
      "Take exactly as prescribed by your doctor",
    ],
  },
  {
    id: "p24",
    name: "Accu-Chek Active Strips",
    genericName: "Test Strips",
    manufacturer: "Roche",
    category: "Diabetes Care",
    price: 850.0,
    mrp: 950.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 84,
    rating: 4.8,
    reviewCount: 79,
    image: getImg(UN_IDS.glucometer, 824),
    description:
      "Accu-Chek Active Test Strips are designed for use with the Accu-Chek Active blood glucose meter. They provide accurate and reliable blood sugar readings in just a few seconds, helping you manage your diabetes effectively from home.",
    benefits: [
      "Quick and accurate results in 5 seconds",
      "Requires very small blood sample",
      "Easy to handle and use",
      "Compatible with Accu-Chek Active glucometer",
    ],
    howToUse: [
      "Insert strip into the meter",
      "Prick finger and apply blood drop to the strip",
      "Wait for 5 seconds for the result",
      "Dispose of used strip safely",
    ],
  },
  {
    id: "p25",
    name: "Sugar Free Gold",
    genericName: "Aspartame",
    manufacturer: "Zydus",
    category: "Diabetes Care",
    price: 220.0,
    mrp: 250.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 92,
    rating: 4.3,
    reviewCount: 49,
    image: getImg(UN_IDS.powder, 825),
    description:
      "Sugar Free Gold is a low-calorie sugar substitute made from Aspartame. It provides the sweetness of sugar without the calories, making it ideal for diabetics and health-conscious individuals looking to manage their weight.",
    benefits: [
      "Zero calories per serving",
      "Safe for diabetics",
      "Tastes like sugar",
      "Ideal for tea, coffee, and beverages",
    ],
    howToUse: [
      "One pellet is equivalent to one teaspoon of sugar",
      "Add to hot or cold beverages",
      "Stir well until dissolved",
      "Use as a replacement for sugar in daily diet",
    ],
  },

  // Skin Care
  {
    id: "p26",
    name: "Betadine Ointment",
    genericName: "Povidone Iodine",
    manufacturer: "Win-Medicare",
    category: "Skin Care",
    price: 120.0,
    mrp: 135.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 37,
    rating: 4.7,
    reviewCount: 6,
    image: getImg(UN_IDS.blue_tube, 826),
    description:
      "Betadine Ointment is a trusted antiseptic containing Povidone Iodine. It is used to treat and prevent infections in minor cuts, scrapes, and burns. It kills bacteria, viruses, and fungi to promote faster healing.",
    benefits: [
      "Broad-spectrum antiseptic protection",
      "Prevents infection in cuts and burns",
      "Promotes faster wound healing",
      "Non-staining and easy to apply",
    ],
    howToUse: [
      "Clean and dry the affected area",
      "Apply a small amount of ointment",
      "Cover with a bandage if necessary",
      "Use 1-2 times daily until healed",
    ],
  },
  {
    id: "p27",
    name: "Nivea Soft Cream",
    genericName: "Moisturizer",
    manufacturer: "Nivea",
    category: "Skin Care",
    price: 250.0,
    mrp: 300.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 36,
    rating: 4,
    reviewCount: 19,
    image: getImg(UN_IDS.cream_jar, 827),
    description:
      "Nivea Soft is a highly effective, revitalizing moisturizing cream for everyday use. Enriched with Vitamin E and Jojoba Oil, it absorbs quickly into the skin, leaving it feeling soft, supple, and refreshed.",
    benefits: [
      "Intensive moisturization with Vitamin E",
      "Light, non-greasy formula",
      "Quick absorption",
      "Suitable for face, body, and hands",
    ],
    howToUse: [
      "Scoop a small amount with fingers",
      "Apply daily on face and body",
      "Massage gently into skin",
      "Use after shower for best results",
    ],
  },
  {
    id: "p28",
    name: "Himalaya Face Wash",
    genericName: "Face Wash",
    manufacturer: "Himalaya",
    category: "Skin Care",
    price: 150.0,
    mrp: 170.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 9,
    rating: 4.8,
    reviewCount: 68,
    image: getImg(UN_IDS.white_tube, 828),
    description:
      "Himalaya Purifying Neem Face Wash is a soap-free, herbal formulation that cleans impurities and helps clear pimples. A natural blend of Neem and Turmeric brings together their antibacterial and antifungal properties to prevent the recurrence of acne over time.",
    benefits: [
      "Prevents pimples and acne",
      "Removes excess oil and impurities",
      "Contains natural Neem and Turmeric",
      "Soap-free and gentle on skin",
    ],
    howToUse: [
      "Moisten face and neck",
      "Apply a small quantity and work up a lather",
      "Wash off and pat dry",
      "Use twice daily for best results",
    ],
  },
  {
    id: "p29",
    name: "Soframycin Cream",
    genericName: "Antibiotic Cream",
    manufacturer: "Sanofi",
    category: "Skin Care",
    price: 50.0,
    mrp: 55.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 55,
    rating: 4.7,
    reviewCount: 80,
    image: getImg(UN_IDS.white_tube, 829),
    description:
      "Soframycin Skin Cream is an antibiotic cream used to treat bacterial skin infections. It is effective against infected cuts, wounds, and minor burns. It works by stopping the growth of bacteria that cause the infection.",
    benefits: [
      "Effective antibiotic for skin infections",
      "Treats infected cuts and wounds",
      "Relieves inflammation and redness",
      "Prevents spread of infection",
    ],
    howToUse: [
      "Clean the affected area",
      "Apply a thin layer of cream",
      "Use 2-3 times a day",
      "Wash hands after application",
    ],
  },
  {
    id: "p30",
    name: "Candid Dusting Powder",
    genericName: "Clotrimazole",
    manufacturer: "Glenmark",
    category: "Skin Care",
    price: 110.0,
    mrp: 125.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 8,
    rating: 4.5,
    reviewCount: 38,
    image: getImg(UN_IDS.red_white_bottle, 830),
    description:
      "Candid Dusting Powder contains Clotrimazole, an antifungal medication. It is used to treat fungal skin infections like ringworm, athlete's foot, and sweat rash. It helps absorb excess moisture and soothes irritated skin.",
    benefits: [
      "Treats fungal skin infections",
      "Relieves itching and irritation",
      "Absorbs sweat and keeps skin dry",
      "Prevents fungal growth",
    ],
    howToUse: [
      "Dust the powder over affected areas",
      "Use after bath on dry skin",
      "Pay attention to skin folds",
      "Use twice daily for effective relief",
    ],
  },

  // First Aid
  {
    id: "p31",
    name: "Dettol Antiseptic",
    genericName: "Antiseptic Liquid",
    manufacturer: "Reckitt",
    category: "First Aid",
    price: 140.0,
    mrp: 155.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 82,
    rating: 4.7,
    reviewCount: 19,
    image: getImg(UN_IDS.amber_bottle, 831),
    description:
      "Dettol Antiseptic Liquid provides protection against germs and infection. It is a concentrated antiseptic solution for first aid, personal hygiene, and household cleaning. Trusted for generations to keep families safe.",
    benefits: [
      "Kills 99.9% of germs",
      "Protects against infection in cuts and scratches",
      "Versatile use for first aid and hygiene",
      "Recommended by medical professionals",
    ],
    howToUse: [
      "Dilute with water for first aid use",
      "Apply to cuts, grazes, and bites",
      "Can be added to bath water",
      "Use for household disinfection",
    ],
  },
  {
    id: "p32",
    name: "Hansaplast Bandage",
    genericName: "Bandage",
    manufacturer: "Beiersdorf",
    category: "First Aid",
    price: 20.0,
    mrp: 25.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 21,
    rating: 5,
    reviewCount: 23,
    image: getImg(UN_IDS.bandage, 832),
    description:
      "Hansaplast Washproof Bandages provide durable protection for minor wounds. They seal off the wound from dirt and bacteria while being water-resistant, allowing you to carry on with your daily activities.",
    benefits: [
      "Water-resistant and durable",
      "Protects wounds from dirt and bacteria",
      "Breathable material aids healing",
      "Strong adhesion for long wear",
    ],
    howToUse: [
      "Clean the wound and dry skin",
      "Apply bandage without stretching",
      "Change daily for hygiene",
      "Dispose of used bandage",
    ],
  },
  {
    id: "p33",
    name: "Cotton Roll 500g",
    genericName: "Cotton",
    manufacturer: "Generic",
    category: "First Aid",
    price: 180.0,
    mrp: 200.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 3,
    rating: 4.7,
    reviewCount: 103,
    image: getImg(UN_IDS.first_aid, 833),
    description:
      "This high-quality absorbent Cotton Roll is made from 100% natural cotton. It is soft, sterile, and highly absorbent, making it essential for first aid, wound cleaning, and cosmetic applications.",
    benefits: [
      "100% natural and soft cotton",
      "High absorbency",
      "Sterile and hygienic",
      "Multi-purpose usage",
    ],
    howToUse: [
      "Pull required amount of cotton",
      "Use with antiseptic for wound cleaning",
      "Apply to stop bleeding or apply medication",
      "Dispose after single use",
    ],
  },
  {
    id: "p34",
    name: "Crepe Bandage",
    genericName: "Bandage",
    manufacturer: "Generic",
    category: "First Aid",
    price: 120.0,
    mrp: 150.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 78,
    rating: 4.9,
    reviewCount: 65,
    image: getImg(UN_IDS.bandage, 834),
    description:
      "This elastic Crepe Bandage provides firm support and compression for sprains, strains, and weak joints. It helps reduce swelling and relieves pain while allowing movement. Washable and reusable.",
    benefits: [
      "Provides firm support and compression",
      "Relieves pain from sprains and strains",
      "Elastic and breathable fabric",
      "Washable and reusable",
    ],
    howToUse: [
      "Wrap firmly around the injured area",
      "Secure with clips provided",
      "Ensure it is not too tight to restrict blood flow",
      "Remove at night or as advised",
    ],
  },

  // Devices
  {
    id: "p35",
    name: "Omron BP Monitor",
    genericName: "BP Monitor",
    manufacturer: "Omron",
    category: "Devices",
    price: 2500.0,
    mrp: 3000.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 7,
    rating: 4.3,
    reviewCount: 98,
    image: getImg(UN_IDS.bp_monitor, 835),
    description:
      "The Omron Automatic Blood Pressure Monitor provides accurate and reliable blood pressure readings at home. Features Intellisense technology for comfortable inflation and irregular heartbeat detection.",
    benefits: [
      "Clinically validated accuracy",
      "One-touch operation",
      "Detects irregular heartbeat",
      "Large display for easy reading",
    ],
    howToUse: [
      "Wrap cuff around upper arm",
      "Sit calmly and press start button",
      "Wait for measurement to complete",
      "Record your reading",
    ],
  },
  {
    id: "p36",
    name: "Digital Thermometer",
    genericName: "Thermometer",
    manufacturer: "Dr. Morepen",
    category: "Devices",
    price: 250.0,
    mrp: 300.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 90,
    rating: 4.7,
    reviewCount: 75,
    image: getImg(UN_IDS.thermometer, 836),
    description:
      "Dr. Morepen Digital Thermometer offers quick and accurate body temperature readings. It is safe, mercury-free, and easy to read, making it suitable for the whole family including infants.",
    benefits: [
      "Fast and accurate readings",
      "Mercury-free and safe",
      "Easy-to-read LCD display",
      "Auto shut-off feature",
    ],
    howToUse: [
      "Place tip under tongue or armpit",
      "Wait for the beep sound",
      "Read the temperature on display",
      "Clean with alcohol after use",
    ],
  },
  {
    id: "p37",
    name: "Oximeter",
    genericName: "Pulse Oximeter",
    manufacturer: "Dr. Trust",
    category: "Devices",
    price: 1200.0,
    mrp: 1500.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 19,
    rating: 4.9,
    reviewCount: 143,
    image: getImg(UN_IDS.oximeter, 837),
    description:
      "Dr. Trust Pulse Oximeter accurately measures your blood oxygen saturation (SpO2) and pulse rate. It is compact, portable, and easy to use, providing instant health insights at your fingertips.",
    benefits: [
      "Accurate SpO2 and pulse readings",
      "Bright OLED display",
      "Portable and lightweight",
      "Low battery indicator",
    ],
    howToUse: [
      "Insert finger into the probe",
      "Press the button to switch on",
      "Keep hand still for reading",
      "Read results on the screen",
    ],
  },
  {
    id: "p38",
    name: "Nebulizer Machine",
    genericName: "Nebulizer",
    manufacturer: "Omron",
    category: "Devices",
    price: 2200.0,
    mrp: 2500.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 45,
    rating: 5,
    reviewCount: 8,
    image: getImg(UN_IDS.bp_monitor, 838), // Reusing BP monitor as placeholder for device
    description:
      "Omron Nebulizer is a medical device used to administer medication in the form of a mist inhaled into the lungs. It is highly effective for treating asthma, COPD, and other respiratory conditions.",
    benefits: [
      "Efficient medication delivery to lungs",
      "Easy to use and clean",
      "Suitable for children and adults",
      "Quiet operation",
    ],
    howToUse: [
      "Add medication to the cup",
      "Connect mask and tubing",
      "Switch on and inhale the mist",
      "Clean parts after every use",
    ],
  },

  // More Meds
  {
    id: "p39",
    name: "Telma 40",
    genericName: "Telmisartan",
    manufacturer: "Glenmark",
    category: "Fever & Pain",
    price: 190.0,
    mrp: 210.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 83,
    rating: 4.7,
    reviewCount: 135,
    image: getImg(UN_IDS.white_blister, 839),
    description:
      "Telma 40 Tablet contains Telmisartan, a medication used to treat high blood pressure (hypertension) and reduce the risk of heart attack or stroke. It works by relaxing blood vessels so blood can flow more easily.",
    benefits: [
      "Effectively lowers blood pressure",
      "Protects against heart attacks and strokes",
      "Once-daily dosing",
      "Kidney protection in diabetics",
    ],
    howToUse: [
      "Take one tablet daily at the same time",
      "Can be taken with or without food",
      "Do not skip doses",
      "Regular monitoring of BP is recommended",
    ],
  },
  {
    id: "p40",
    name: "Amlokind 5",
    genericName: "Amlodipine",
    manufacturer: "Mankind",
    category: "Fever & Pain",
    price: 40.0,
    mrp: 45.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 11,
    rating: 4,
    reviewCount: 19,
    image: getImg(UN_IDS.colorful_blister, 840),
    description:
      "Amlokind 5 contains Amlodipine, a calcium channel blocker used to treat high blood pressure and angina (chest pain). It helps lower blood pressure and prevents future heart complications.",
    benefits: [
      "Controls high blood pressure",
      "Prevents angina (chest pain)",
      "Improves blood flow",
      "Reduces workload on the heart",
    ],
    howToUse: [
      "Take once daily as prescribed",
      "Swallow whole with water",
      "Try to take at the same time each day",
      "Do not stop abruptly without medical advice",
    ],
  },
  {
    id: "p41",
    name: "Thyronorm 100mcg",
    genericName: "Thyroxine",
    manufacturer: "Abbott",
    category: "Supplements",
    price: 180.0,
    mrp: 200.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 54,
    rating: 4.6,
    reviewCount: 58,
    image: getImg(UN_IDS.blue_bottle, 841),
    description:
      "Thyronorm 100mcg contains Thyroxine sodium, which replaces the hormone normally produced by the thyroid gland. It is used to treat hypothyroidism (underactive thyroid) and regulate the body's energy and metabolism.",
    benefits: [
      "Treats hypothyroidism effectively",
      "Restores normal thyroid hormone levels",
      "Improves energy and metabolism",
      "Supports overall body function",
    ],
    howToUse: [
      "Take on an empty stomach, first thing in the morning",
      "Wait 30-60 mins before breakfast",
      "Take with water only",
      "Regular thyroid testing is essential",
    ],
  },
  {
    id: "p42",
    name: "Manforce Tablet",
    genericName: "Sildenafil",
    manufacturer: "Mankind",
    category: "Supplements",
    price: 250.0,
    mrp: 300.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 69,
    rating: 4.6,
    reviewCount: 35,
    image: getImg(UN_IDS.red_pills, 842),
    description:
      "Manforce Tablet contains Sildenafil, used to treat erectile dysfunction in men. It works by increasing blood flow to the penis to help achieve and maintain an erection during sexual stimulation.",
    benefits: [
      "Effective for erectile dysfunction",
      "Improves sexual performance",
      "Rapid onset of action",
      "Increases confidence",
    ],
    howToUse: [
      "Take one tablet about 1 hour before sexual activity",
      "Do not take more than once a day",
      "Avoid heavy meals before taking",
      "Consult doctor before use if you have heart conditions",
    ],
  },
  {
    id: "p43",
    name: "Unwanted 72",
    genericName: "Levonorgestrel",
    manufacturer: "Mankind",
    category: "Supplements",
    price: 90.0,
    mrp: 110.0,
    prescriptionRequired: true,
    inStock: true,
    stock: 45,
    rating: 4.2,
    reviewCount: 30,
    image: getImg(UN_IDS.couple_pills, 843),
    description:
      "Unwanted 72 is an emergency contraceptive tablet used to prevent pregnancy after unprotected sex. It contains Levonorgestrel and should be taken as soon as possible, preferably within 72 hours of unprotected intercourse.",
    benefits: [
      "Prevents unwanted pregnancy",
      "Effective emergency contraception",
      "Single dose regimen",
      "Safe when used as directed",
    ],
    howToUse: [
      "Take one tablet as soon as possible after unprotected sex",
      "Most effective within first 12-24 hours",
      "Can be taken with or without food",
      "Not for regular contraception",
    ],
  },
  {
    id: "p44",
    name: "Prega News Kit",
    genericName: "Pregnancy Kit",
    manufacturer: "Mankind",
    category: "Devices",
    price: 50.0,
    mrp: 60.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 7,
    rating: 4.3,
    reviewCount: 16,
    image: getImg(UN_IDS.glucometer, 844), // Placeholder (device)
    description:
      "Prega News is a home pregnancy test kit that detects the presence of HCG hormone in urine. It provides quick and accurate results within 5 minutes, allowing you to confirm pregnancy in the privacy of your home.",
    benefits: [
      "Quick results in 5 minutes",
      "Easy to use at home",
      "High accuracy",
      "Privacy and convenience",
    ],
    howToUse: [
      "Collect first morning urine sample",
      "Add 3 drops to the sample well",
      "Wait for 5 minutes",
      "Two pink lines indicate positive result",
    ],
  },
  {
    id: "p45",
    name: "Whisper Ultra Wings",
    genericName: "Sanitary Pads",
    manufacturer: "P&G",
    category: "First Aid",
    price: 400.0,
    mrp: 450.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 46,
    rating: 4.9,
    reviewCount: 148,
    image: getImg(UN_IDS.sanitizer, 845), // Reusing sanitizer ID as placeholder for hygiene
    description:
      "Whisper Ultra Clean Sanitary Pads provide superior protection and comfort during menstruation. With wings for security and a super absorbent core, they lock away fluid and odor for long-lasting freshness.",
    benefits: [
      "Long-lasting protection",
      "Locks wetness and odor",
      "Soft top sheet for comfort",
      "Wings prevent leakage",
    ],
    howToUse: [
      "Peel off release paper",
      "Stick pad on panty",
      "Wrap wings around panty sides",
      "Dispose in bin after use",
    ],
  },
  {
    id: "p46",
    name: "Pampers Diapers L",
    genericName: "Diapers",
    manufacturer: "P&G",
    category: "First Aid",
    price: 900.0,
    mrp: 1000.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 77,
    rating: 4,
    reviewCount: 8,
    image: getImg(UN_IDS.baby, 846),
    description:
      "Pampers Diapers offer up to 12 hours of absorption to keep your baby dry and comfortable. Made with soft materials and magic gel technology, they prevent leakage and diaper rash, ensuring a good night's sleep.",
    benefits: [
      "Up to 12 hours dryness",
      "Magic gel locks wetness",
      "Soft and breathable",
      "Prevents diaper rash",
    ],
    howToUse: [
      "Place baby on open diaper",
      "Fasten tapes on both sides",
      "Check for comfortable fit",
      "Change when wet or soiled",
    ],
  },
  {
    id: "p47",
    name: "Protinex Powder",
    genericName: "Protein Powder",
    manufacturer: "Danone",
    category: "Vitamins & Supplements",
    price: 650.0,
    mrp: 700.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 14,
    rating: 4.2,
    reviewCount: 152,
    image: getImg(UN_IDS.powder, 847),
    description:
      "Protinex is a scientifically formulated nutritional supplement rich in protein, vitamins, and minerals. It helps build immunity, strength, and energy, making it an ideal daily supplement for adults leading active lifestyles.",
    benefits: [
      "High protein content for muscle health",
      "Boosts immunity and energy",
      "Contains essential vitamins & minerals",
      "Low fat formula",
    ],
    howToUse: [
      "Add 2-3 scoops to warm milk or water",
      "Stir well until dissolved",
      "Add sugar if desired",
      "Consume once daily",
    ],
  },
  {
    id: "p48",
    name: "Horlicks 1kg",
    genericName: "Health Drink",
    manufacturer: "GSK",
    category: "Vitamins & Supplements",
    price: 450.0,
    mrp: 500.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 64,
    rating: 4.2,
    reviewCount: 71,
    image: getImg(UN_IDS.powder, 848),
    description:
      "Horlicks is a malt-based health food drink that supports immunity and growth. Packed with nutrients like Vitamin D, C, and Zinc, it is clinically proven to improve 5 signs of growth in children and support overall health.",
    benefits: [
      "Supports physical growth and immunity",
      "Makes milk tastier",
      "Rich in essential nutrients",
      "Clinically proven benefits",
    ],
    howToUse: [
      "Take 3 heaped teaspoons in a cup",
      "Add hot or cold milk",
      "Stir quickly to mix well",
      "Enjoy twice daily",
    ],
  },
  {
    id: "p49",
    name: "Bournvita 1kg",
    genericName: "Health Drink",
    manufacturer: "Cadbury",
    category: "Vitamins & Supplements",
    price: 420.0,
    mrp: 480.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 52,
    rating: 4.2,
    reviewCount: 142,
    image: getImg(UN_IDS.powder, 849),
    description:
      "Cadbury Bournvita is a chocolate health drink enriched with Vitamin D, Iron, and other essential nutrients. It supports inner strength and bone health, giving children the energy to stay active and learn.",
    benefits: [
      "Delicious chocolate taste",
      "Supports bone strength and muscles",
      "Provides active energy",
      "Enriched with vitamins and minerals",
    ],
    howToUse: [
      "Add 2 spoons to hot or cold milk",
      "Stir well until smooth",
      "Drink twice a day",
      "Store in airtight container",
    ],
  },
  {
    id: "p50",
    name: "Vicks Vaporub 50g",
    genericName: "Balm",
    manufacturer: "P&G",
    category: "Cough & Cold",
    price: 140.0,
    mrp: 160.0,
    prescriptionRequired: false,
    inStock: true,
    stock: 60,
    rating: 4.3,
    reviewCount: 41,
    image: getImg(UN_IDS.cream_jar, 850),
    description:
      "Vicks Vaporub is a topical cough suppressant and analgesic ointment. Its medicated vapors provide quick relief from cough, blocked nose, headache, and muscle aches, helping you sleep better and feel better.",
    benefits: [
      "Relieves cough and cold symptoms",
      "Clears blocked nose",
      "Soothes headaches and body ache",
      "Provides comforting warmth",
    ],
    howToUse: [
      "Rub gently on chest, neck, and back",
      "Inhale vapors for blocked nose",
      "Apply to aching muscles",
      "Use at bedtime for relief",
    ],
  },
];

export const MOCK_REVIEWS = [
  {
    id: 1,
    user: "Alice M.",
    rating: 5,
    comment: "Excellent product, fast delivery!",
  },
  {
    id: 2,
    user: "Bob K.",
    rating: 4,
    comment: "Good quality but packaging was damaged.",
  },
  {
    id: 3,
    user: "Charlie D.",
    rating: 5,
    comment: "Works as expected. Will buy again.",
  },
];

// --- Validation Utility ---
// Run this function in development to check for missing images
export const validateProductData = () => {
  const missingImages = PRODUCTS.filter((p) => !p.image);
  if (missingImages.length > 0) {
    console.warn(
      "Found products with missing images:",
      missingImages.map((p) => p.name)
    );
  } else {
    console.log("All products have valid images assigned.");
  }
};
