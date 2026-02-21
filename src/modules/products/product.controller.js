import ApiResponse from "../../utils/apiResponse.js";
import asyncHandler from "../../utils/asyncHandler.js";
import {
  addCategoryToProductService,
  deleteProductImageService,
  fetchExpiredProductsService,
  fetchExpiringProductsService,
  fetchFeaturedProductsService,
  fetchLowStockProductsService,
  fetchProductsByCategoryService,
  fetchProductsService,
  getProductDetailsService,
  updateProductDetailsService,
  uploadProductImageService,
} from "./product.service.js";

export const fetchProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 25,
    query = "",
    sortBy = "name",
    order = 1,
    stock = 2,
    minPrice = 0,
    maxPrice = "",
    is_deleted = "0",
  } = req.query;

  const {
    products,
    totalProducts,
    totalInventoryValue,
    totalPages,
    totalInStock,
    totalOutStock,
  } = await fetchProductsService(
    Number(page),
    Number(limit),
    query.trim().toLowerCase(),
    sortBy,
    Number(order),
    Number(stock),
    Number(minPrice),
    Number(maxPrice),
    is_deleted,
  );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        totalProducts,
        totalInventoryValue,
        totalInStock,
        totalOutStock,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Products fetched successfully",
    ),
  );
});

export const fetchProductsByCategory = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, query = "" } = req.query;
  const { categoryId } = req.params;

  const { products, totalProducts, totalPages } =
    await fetchProductsByCategoryService(
      page,
      limit,
      query.trim().toLowerCase(),
      categoryId,
    );

  res.status(200).json(
    new ApiResponse(
      200,
      {
        products,
        totalProducts,
        page: Number(page),
        limit: Number(limit),
        totalPages: Number(totalPages),
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Products fetched successfully",
    ),
  );
});

export const getProductDetails = asyncHandler(async (req, res) => {
  const { rid } = req.params;

  const product = await getProductDetailsService(rid);

  res
    .status(200)
    .json(
      new ApiResponse(200, product, "Product details fetched successfully"),
    );
});

export const fetchFeaturedProducts = asyncHandler(async (req, res) => {
  const { query = "" } = req.query;

  const products = await fetchFeaturedProductsService(
    query.trim().toLowerCase(),
  );

  res
    .status(200)
    .json(
      new ApiResponse(200, products, "Featured products fetched successfully"),
    );
});

export const updateProductDetails = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const { images, categoryId, isFeatured, hsnCode } = req.body;

  const updatedProduct = await updateProductDetailsService(
    rid,
    images,
    categoryId,
    Boolean(isFeatured),
    hsnCode,
  );

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product details updated successfully",
      ),
    );
});

export const uploadProductImage = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const { images } = req.files;

  const updatedProduct = await uploadProductImageService(String(rid), images);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product image uploaded successfully",
      ),
    );
});

export const deleteProductImage = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const { images } = req.body;

  const updatedProduct = await deleteProductImageService(rid, images);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Product image deleted successfully",
      ),
    );
});

export const addCategoryToProduct = asyncHandler(async (req, res) => {
  const { rid } = req.params;
  const { categoryId } = req.body;

  const updatedProduct = await addCategoryToProductService(rid, categoryId);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedProduct,
        "Category added to product successfully",
      ),
    );
});

export const fetchLowStockProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, query = "" } = req.query;

  const { lowStockProducts, totalProducts, totalPages } =
    await fetchLowStockProductsService(page, limit, query.trim().toLowerCase());
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        lowStockProducts,
        totalProducts,
        totalPages,
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Low stock products fetched successfully",
    ),
  );
});

export const fetchExpiringProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, days = 30, query = "" } = req.query;

  const { expiringProducts, totalProducts, totalPages } =
    await fetchExpiringProductsService(
      page,
      limit,
      days,
      query.trim().toLowerCase(),
    );
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        expiringProducts,
        totalProducts,
        totalPages,
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Expiring products fetched successfully",
    ),
  );
});

export const fetchExpiredProducts = asyncHandler(async (req, res) => {
  const { page = 1, limit = 25, query = "" } = req.query;

  const { expiredProducts, totalProducts, totalPages } =
    await fetchExpiredProductsService(page, limit, query.trim().toLowerCase());
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        expiredProducts,
        totalProducts,
        totalPages,
        currentPage: Number(page),
        hasMore: Number(page) < Number(totalPages),
      },
      "Expired products fetched successfully",
    ),
  );
});
