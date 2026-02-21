import { Router } from "express";
import {
  addCategoryToProduct,
  deleteProductImage,
  fetchExpiredProducts,
  fetchExpiringProducts,
  fetchFeaturedProducts,
  fetchLowStockProducts,
  fetchProducts,
  fetchProductsByCategory,
  getProductDetails,
  updateProductDetails,
  uploadProductImage,
} from "./product.controller.js";
import { upload } from "../../middlewares/multer.middleware.js";

const productRoute = Router();

productRoute.get("/", fetchProducts);
productRoute.get("/category/:categoryId", fetchProductsByCategory);
productRoute.get("/details/:rid", getProductDetails);
productRoute.get("/featured", fetchFeaturedProducts);
productRoute.post(
  "/uploadImage/:rid",
  upload.fields([{ name: "images", maxCount: 4 }]),
  uploadProductImage,
);
productRoute.patch("/deleteImage/:rid", deleteProductImage);
productRoute.patch("/addCategory/:rid", addCategoryToProduct);
productRoute.put("/update/:rid", updateProductDetails);
productRoute.get("/low-stock", fetchLowStockProducts);
productRoute.get("/expiring", fetchExpiringProducts);
productRoute.get("/expired", fetchExpiredProducts);

export default productRoute;
