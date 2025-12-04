import { useCartStore } from '../../store/useCartStore';
import { useAddToCart } from '../../hooks/mutations/useAddToCart';
import { ShoppingCart, Trash2 } from 'lucide-react';

/**
 * Example CartBadge Component
 * Demonstrates how to use Zustand cart store
 */
export function CartBadge() {
  const totalItems = useCartStore((state) => state.getTotalItems());
  
  return (
    <div className="relative">
      <ShoppingCart size={24} />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </div>
  );
}

/**
 * Example ProductCard Component
 * Demonstrates how to add products to cart using React Query mutation
 */
export function ProductCard({ product }) {
  const { mutate: addToCart, isPending } = useAddToCart();
  const itemQuantity = useCartStore((state) => state.getItemQuantity(product.id));
  
  const handleAddToCart = () => {
    addToCart({ product, quantity: 1 });
  };
  
  return (
    <div className="border rounded-lg p-4">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded" />
      <h3 className="font-bold mt-2">{product.name}</h3>
      <p className="text-gray-600">₹{product.price}</p>
      
      {itemQuantity > 0 && (
        <p className="text-sm text-green-600 mt-1">
          {itemQuantity} in cart
        </p>
      )}
      
      <button
        onClick={handleAddToCart}
        disabled={isPending}
        className="mt-2 w-full bg-orange-500 text-white py-2 rounded hover:bg-orange-600 disabled:opacity-50"
      >
        {isPending ? 'Adding...' : 'Add to Cart'}
      </button>
    </div>
  );
}

/**
 * Example CartSummary Component
 * Shows all items in cart with remove functionality
 */
export function CartSummary() {
  const { items, getTotalPrice, removeItem, updateQuantity } = useCartStore();
  
  if (items.length === 0) {
    return <div className="text-center text-gray-500 py-8">Your cart is empty</div>;
  }
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Shopping Cart</h2>
      
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-4 border-b pb-4">
          <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
          
          <div className="flex-1">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-gray-600">₹{item.price}</p>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => updateQuantity(item.id, item.quantity - 1)}
              className="px-3 py-1 border rounded"
            >
              -
            </button>
            <span className="px-4">{item.quantity}</span>
            <button
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="px-3 py-1 border rounded"
            >
              +
            </button>
          </div>
          
          <p className="font-bold">₹{item.price * item.quantity}</p>
          
          <button
            onClick={() => removeItem(item.id)}
            className="text-red-500 hover:text-red-700"
          >
            <Trash2 size={20} />
          </button>
        </div>
      ))}
      
      <div className="pt-4 border-t">
        <div className="flex justify-between text-xl font-bold">
          <span>Total:</span>
          <span>₹{getTotalPrice()}</span>
        </div>
      </div>
    </div>
  );
}
