import mongoose from "mongoose";

const productInfoSchema = new mongoose.Schema(
  {
    rid: {
      type: String,
      required: true,
    },
    categoryId: {
      type: String,
    },
    images: {
      type: Array,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const ProductInfo = mongoose.model("ProductInfo", productInfoSchema);

export default ProductInfo;
