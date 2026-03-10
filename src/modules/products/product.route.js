import { Router } from 'express';
import {
  addCategoryToProduct,
  fetchExpiredProducts,
  fetchExpiringProducts,
  fetchFeaturedProducts,
  fetchLowStockProducts,
  fetchProducts,
  fetchProductsByCategory,
  getProductDetails,
  updateProductDetails,
} from './product.controller.js';

const productRoute = Router();

productRoute.get('/', fetchProducts);
productRoute.get('/category/:categoryId', fetchProductsByCategory);
productRoute.get('/details/:rid', getProductDetails);
productRoute.get('/featured', fetchFeaturedProducts);
productRoute.patch('/addCategory/:rid', addCategoryToProduct);
productRoute.put('/update/:rid', updateProductDetails);
productRoute.get('/low-stock', fetchLowStockProducts);
productRoute.get('/expiring', fetchExpiringProducts);
productRoute.get('/expired', fetchExpiredProducts);

export default productRoute;
