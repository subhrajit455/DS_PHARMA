import ProductInfo from "./productInfo.model.js";
import ProN from "./proN.model.js";

export const fetchProductsService = async (page, limit, query = "", stock) => {
  try {
    const pipeline = [
      {
        $addFields: {
          stockValue: {
            $convert: {
              input: "$stock",
              to: "double",
              onError: 0,
              onNull: 0,
            },
          },
        },
      },
      {
        $match: {
          $and: [
            {
              $or: [
                { name: { $regex: query, $options: "i" } },
                { company: { $regex: query, $options: "i" } },
              ],
            },
            ...(stock == 0
              ? [{ stockValue: { $lte: 0 } }]
              : stock == 1
                ? [{ stockValue: { $gt: 0 } }]
                : []),
          ],
        },
      },
    ];

    const products = await ProN.aggregate([
      ...pipeline,
      {
        $lookup: {
          from: "productinfos",
          localField: "rid",
          foreignField: "rid",
          as: "productInfoData",
        },
      },
      {
        $addFields: {
          images: {
            $ifNull: [{ $arrayElemAt: ["$productInfoData.images", 0] }, []],
          },
          categoryId: {
            $ifNull: [{ $arrayElemAt: ["$productInfoData.categoryId", 0] }, ""],
          },
          isFeatured: {
            $ifNull: [
              { $arrayElemAt: ["$productInfoData.isFeatured", 0] },
              false,
            ],
          },
        },
      },
      {
        $addFields: {
          categoryIdObject: {
            $cond: {
              if: { $ne: ["$categoryId", ""] },
              then: { $toObjectId: "$categoryId" },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryIdObject",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $addFields: {
          categoryDetails: {
            $ifNull: [{ $arrayElemAt: ["$categoryDetails", 0] }, {}],
          },
        },
      },
      {
        $project: {
          productInfoData: 0,
          categoryId: 0,
          categoryData: 0,
          categoryIdObject: 0,
          "categoryDetails.images": 0,
          stockValue: 0,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    const countResult = await ProN.aggregate([
      ...pipeline,
      {
        $count: "total",
      },
    ]);

    const totalProducts = countResult[0]?.total || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    return { products, totalProducts, totalPages };
  } catch (error) {
    throw error;
  }
};

export const getProductDetailsService = async (rid) => {
  try {
    const product = await ProN.aggregate([
      {
        $match: {
          rid,
        },
      },
      {
        $lookup: {
          from: "productinfos",
          localField: "rid",
          foreignField: "rid",
          as: "productInfoData",
        },
      },
      {
        $addFields: {
          images: {
            $ifNull: [{ $arrayElemAt: ["$productInfoData.images", 0] }, []],
          },
          categoryId: {
            $ifNull: [{ $arrayElemAt: ["$productInfoData.categoryId", 0] }, ""],
          },
          isFeatured: {
            $ifNull: [
              { $arrayElemAt: ["$productInfoData.isFeatured", 0] },
              false,
            ],
          },
        },
      },
      {
        $addFields: {
          categoryIdObject: {
            $cond: {
              if: { $ne: ["$categoryId", ""] },
              then: { $toObjectId: "$categoryId" },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryIdObject",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $addFields: {
          categoryDetails: {
            $ifNull: [{ $arrayElemAt: ["$categoryDetails", 0] }, {}],
          },
        },
      },
      {
        $project: {
          productInfoData: 0,
          categoryId: 0,
          categoryIdObject: 0,
          "categoryDetails.images": 0,
        },
      },
    ]);

    console.log("product :: ", product);

    return product[0] || null;
  } catch (error) {
    console.error("Error in getProductDetailsService:", error);
    throw error;
  }
};

export const fetchProductsByCategoryService = async (
  page,
  limit,
  query = "",
  categoryId,
) => {
  try {
    const products = await ProN.aggregate([
      {
        $match: {
          $or: [{ name: { $regex: query, $options: "i" } }],
          $or: [{ company: { $regex: query, $options: "i" } }],
        },
      },
      {
        $lookup: {
          from: "productinfos",
          localField: "rid",
          foreignField: "rid",
          as: "productInfoData",
        },
      },
      {
        $addFields: {
          images: {
            $ifNull: [{ $arrayElemAt: ["$productInfoData.images", 0] }, []],
          },
          categoryId: {
            $ifNull: [{ $arrayElemAt: ["$productInfoData.categoryId", 0] }, ""],
          },
          isFeatured: {
            $ifNull: [
              { $arrayElemAt: ["$productInfoData.isFeatured", 0] },
              false,
            ],
          },
        },
      },
      {
        $match: {
          categoryId: categoryId,
        },
      },
      {
        $addFields: {
          categoryIdObject: {
            $cond: {
              if: { $ne: ["$categoryId", ""] },
              then: { $toObjectId: "$categoryId" },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryIdObject",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $addFields: {
          categoryDetails: {
            $ifNull: [{ $arrayElemAt: ["$categoryDetails", 0] }, {}],
          },
        },
      },
      {
        $project: {
          productInfoData: 0,
          categoryId: 0,
          categoryIdObject: 0,
          "categoryDetails.images": 0,
        },
      },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: parseInt(limit),
      },
    ]);

    // Count total products in this category matching the query
    const allCategoryProducts = await ProN.aggregate([
      {
        $match: {
          $or: [{ name: { $regex: query, $options: "i" } }],
          $or: [{ company: { $regex: query, $options: "i" } }],
        },
      },
      {
        $lookup: {
          from: "productinfos",
          localField: "rid",
          foreignField: "rid",
          as: "productInfoData",
        },
      },
      {
        $addFields: {
          categoryId: {
            $ifNull: [{ $arrayElemAt: ["$productInfoData.categoryId", 0] }, ""],
          },
        },
      },
      {
        $match: {
          categoryId: categoryId,
        },
      },
      {
        $count: "total",
      },
    ]);

    const totalProducts = allCategoryProducts[0]?.total || 0;
    const totalPages = Math.ceil(totalProducts / limit);

    return { products, totalProducts, totalPages };
  } catch (error) {
    throw error;
  }
};

export const fetchFeaturedProductsService = async (query = "") => {
  try {
    const products = await ProductInfo.aggregate([
      {
        $match: {
          isFeatured: true,
          $or: [{ name: { $regex: query, $options: "i" } }],
          $or: [{ company: { $regex: query, $options: "i" } }],
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "rid",
          foreignField: "rid",
          as: "productData",
        },
      },
      {
        $addFields: {
          productDetails: {
            $ifNull: [{ $arrayElemAt: ["$productData", 0] }, {}],
          },
        },
      },
      {
        $addFields: {
          categoryIdObject: {
            $cond: {
              if: { $ne: ["$categoryId", ""] },
              then: { $toObjectId: "$categoryId" },
              else: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryIdObject",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      {
        $addFields: {
          categoryDetails: {
            $ifNull: [{ $arrayElemAt: ["$categoryDetails", 0] }, {}],
          },
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: [
              "$productDetails",
              {
                images: "$images",
                categoryDetails: "$categoryDetails",
                isFeatured: "$isFeatured",
              },
            ],
          },
        },
      },
      {
        $project: {
          categoryIdObject: 0,
          "categoryDetails.images": 0,
        },
      },
    ]);

    return products;
  } catch (error) {
    throw error;
  }
};

export const updateProductDetailsService = async (
  rid,
  images,
  categoryId,
  isFeatured,
) => {
  try {
    const existedProduct = await ProductInfo.findOne({ rid });

    if (!existedProduct) {
      await ProductInfo.create({ rid, categoryId, images, isFeatured });

      return getProductDetailsService(rid);
    }

    await ProductInfo.findOneAndUpdate(
      { rid },
      { images, categoryId, isFeatured },
      { new: true },
    );

    return getProductDetailsService(rid);
  } catch (error) {
    console.error("Error in updateProductDetailsService:", error);
    throw error;
  }
};

export const uploadProductImageService = async (rid, images) => {
  try {
    console.log({ rid, images });

    const existingProduct = await ProductInfo.findOne({ rid });

    if (!existingProduct) {
      const newProductInfo = new ProductInfo({
        rid,
        images,
      });
      await newProductInfo.save();

      console.log(newProductInfo);

      return newProductInfo;
    }

    const updatedProduct = await ProductInfo.findOneAndUpdate(
      { rid },
      { images: [...existingProduct.images, ...images] },
      { new: true },
    );

    console.log(updatedProduct);
    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

export const deleteProductImageService = async (rid, images) => {
  try {
    const updatedProduct = await ProductInfo.findOneAndUpdate(
      { rid },
      { images },
      { new: true },
    );

    return updatedProduct;
  } catch (error) {
    throw error;
  }
};

export const addCategoryToProductService = async (rid, categoryId) => {
  try {
    const existingProduct = await ProductInfo.findOne({ rid });

    if (!existingProduct) {
      const newProductInfo = new ProductInfo({
        rid,
        categoryId,
      });
      await newProductInfo.save();

      return newProductInfo;
    }

    const updatedProductInfo = await ProductInfo.findOneAndUpdate(
      { rid },
      { categoryId },
      { new: true },
    );

    return updatedProductInfo;
  } catch (error) {
    throw error;
  }
};
