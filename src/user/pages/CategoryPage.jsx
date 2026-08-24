import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { m, motion } from "framer-motion";
import { LayoutGrid, Package, ArrowRight } from "lucide-react";

const apiurl = import.meta.env.VITE_MEDIA_CLOUD_BASE_URL;

const CategoryPage = () => {
  const [allCategory, setAllCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getAllCategory = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiurl}/api/v1/categories`);
      setAllCategory(response.data?.data?.categories || []);
      setError(null);
    } catch (err) {
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllCategory();
  }, []);

  // Loader
  if (loading) {
    return (
      <div style={styles.loaderContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loaderText}>Loading Categories...</p>
      </div>
    );
  }

  // Error
  if (error) {
    return (
      <div style={styles.center}>
        <p style={{ color: "red" }}>{error}</p>
        <button style={styles.button} onClick={getAllCategory}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Hero */}
        <div style={styles.hero}>
          <div style={styles.badge}>
            <LayoutGrid size={14} />
            <span>Curated Selection</span>
          </div>

          <h1 style={styles.title}>
            Shop by <span style={{ color: "#6366f1" }}>Category</span>
          </h1>

          <p style={styles.subtitle}>
            Explore categories and discover products
          </p>
        </div>

        {/* Grid */}
        <div style={styles.grid}>
          {allCategory.map((category) => (
            <motion.div
              key={category._id}
              whileHover={{ y: -5 }}
              style={styles.card}
              onClick={() => navigate(`/category/${category._id}`)}
            >
              {/* Image */}
              <div style={styles.imageContainer}>
                <img
                  src={
                    category.images?.[0]?.url ||
                    "https://via.placeholder.com/400x500"
                  }
                  alt={category.name}
                  style={styles.image}
                />

                <div style={styles.iconBadge}>
                  <Package size={16} color="#6366f1" />
                </div>
              </div>

              {/* Content */}
              <div style={styles.cardContent}>
                <div style={styles.cardHeader}>
                  <h3 style={styles.cardTitle}>{category.name}</h3>
                  <ArrowRight size={16} color="#999" />
                </div>

                <p style={styles.cardSub}>View products</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty */}
        {allCategory.length === 0 && (
          <div style={styles.empty}>
            <LayoutGrid size={48} color="#ccc" />
            <h3>No Categories Found</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(to bottom, #f9fafb, #ffffff)",
    padding: "80px 16px",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  hero: {
    textAlign: "center",
    marginBottom: "40px",
  },

  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "6px 12px",
    borderRadius: "999px",
    border: "1px solid #e5e7eb",
    background: "#fff",
    fontSize: "12px",
    margin:"20px"
  },

  title: {
    fontSize: "28px",
    fontWeight: "800",
    marginBottom: "10px",
  },

  subtitle: {
    color: "#6b7280",
    fontSize: "14px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "16px",
  },

  card: {
    background: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
    cursor: "pointer",
    overflow: "hidden",
    transition: "0.3s",
  },

  imageContainer: {
    position: "relative",
    height: "150px",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  iconBadge: {
    position: "absolute",
    top: "8px",
    right: "8px",
    background: "rgba(255,255,255,0.9)",
    padding: "6px",
    borderRadius: "50%",
  },

  cardContent: {
    padding: "10px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  cardTitle: {
    fontSize: "14px",
    fontWeight: "600",
  },

  cardSub: {
    fontSize: "12px",
    color: "#9ca3af",
    marginTop: "4px",
  },

  empty: {
    textAlign: "center",
    marginTop: "50px",
  },

  loaderContainer: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },

  loaderText: {
    marginTop: "10px",
    color: "#6b7280",
  },

  center: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: "10px",
  },

  button: {
    padding: "8px 16px",
    background: "#6366f1",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};