import { category } from "@/user/components";


const config = {
  productBaseUrl: `${import.meta.env.VITE_URL}/product`,
  categoryBaseUrl: `${import.meta.env.VITE_URL}/category`,
};

export const productUrl = {
  getAllProducts: `${config.productBaseUrl}`,
  createProduct: `${config.productBaseUrl}`,
    updateProduct: `${config.productBaseUrl}`,
    deleteProduct: `${config.productBaseUrl}`,
}

export const categoryUrl = {
  getAllCategories: `${config.categoryBaseUrl}`,
};