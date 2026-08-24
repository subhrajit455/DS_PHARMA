import React from "react";

const ProductActionButtons = ({
  onAddToCart,
  onViewCart,
  onRequestStock,
  isAdding,
  isOutOfStock,
}) => {
  const showRequestButton = isOutOfStock;

  return (
    <div className="flex gap-3 mt-6">
      {showRequestButton ? (
        <button
          onClick={onRequestStock}
          disabled={isAdding}
          className={`py-3 font-semibold transition-all duration-200 rounded-lg ${
            isAdding
              ? "cursor-not-allowed opacity-60 grayscale"
              : "cursor-pointer hover:shadow-lg active:scale-95"
          }`}
          style={{
            fontFamily: "Gyrotrope",
            fontSize: "16px",
            backgroundColor: "#F97316",
            color: "#FFFFFF",
            border: "none",
            width: "60%",
          }}
        >
          {isAdding ? "Submitting..." : "Request Stock"}
        </button>
      ) : (
        <button
          onClick={onAddToCart}
          disabled={isAdding}
          className={`py-3 font-semibold transition-all duration-200 rounded-lg ${
            isAdding
              ? "cursor-not-allowed opacity-60 grayscale"
              : "cursor-pointer hover:shadow-lg active:scale-95"
          }`}
          style={{
            fontFamily: "Gyrotrope",
            fontSize: "16px",
            backgroundColor: "#F97316",
            color: "#FFFFFF",
            border: "none",
            width: "60%",
          }}
        >
          {isAdding ? "Adding..." : "Add to Cart"}
        </button>
      )}

      <button
        onClick={onViewCart}
        className="py-3 font-semibold transition-all duration-200 border-2 rounded-lg cursor-pointer hover:bg-gray-50 active:scale-95"
        style={{
          fontFamily: "Gyrotrope",
          fontSize: "16px",
          borderColor: "#F97316",
          color: "#F97316",
          backgroundColor: "transparent",
          width: "30%",
        }}
      >
        View Cart &gt;&gt;
      </button>
    </div>
  );
};

export default ProductActionButtons;
