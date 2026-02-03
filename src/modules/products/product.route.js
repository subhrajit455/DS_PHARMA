import { Router } from "express";
import {
  addCategoryToProduct,
  deleteProductImage,
  fetchFeaturedProducts,
  fetchProducts,
  fetchProductsByCategory,
  getProductDetails,
  updateProductDetails,
  uploadProductImage,
} from "./product.controller.js";

const productRoute = Router();

productRoute.get("/", fetchProducts);
productRoute.get("/category/:categoryId", fetchProductsByCategory);
productRoute.get("/details/:rid", getProductDetails);
productRoute.get("/featured", fetchFeaturedProducts);
productRoute.put("/uploadImage/:rid", uploadProductImage);
productRoute.patch("/deleteImage/:rid", deleteProductImage);
productRoute.patch("/addCategory/:rid", addCategoryToProduct);
productRoute.put("/update/:rid", updateProductDetails);

export default productRoute;
