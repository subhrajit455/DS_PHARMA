import React from 'react';
import { motion as Motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2, Package } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useDataStore from '@/store/useDataStore';
import { useToastStore } from '@/store/useToastStore';

const WishlistSection = () => {
    const navigate = useNavigate();
    const { wishlist, removeFromWishlist, moveToCart } = useDataStore();
    const { success, error } = useToastStore();

    const handleAddToCart = (product) => {
        if (!product.inStock && product.inStock !== undefined) {
            error("This product is currently out of stock");
            return;
        }
        moveToCart(product.id);
        success(`${product.name} moved to cart`);
    };

    const handleRemove = (productId) => {
        removeFromWishlist(productId);
        success("Item removed from wishlist");
    };

    if (wishlist.length === 0) {
        return (
            <Motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center"
                style={{ 
                maxHeight: 'calc(100vh - 250px)', 
                overflowY: 'auto', 
                padding: window.innerWidth >= 640 ? '10px' : '5px', 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none', 
                marginTop: window.innerWidth >= 640 ? '30px' : '0',
                marginBottom: '0px'
            }}
            >
            <div className="flex flex-col items-center justify-center gap-2">
                <div className="w-20 h-20 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart className="w-10 h-10 text-pink-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto text-md">
                    Save items you love here and they'll be waiting for you when you're ready to buy.
                </p>
                <button 
                    onClick={() => navigate('/')}
                    className=" text-sm px-8 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-md hover:shadow-lg"
                    style={{ padding: window.innerWidth >= 640 ? '5px 10px' : '2px 10px' }}
                >
                    Explore Products
                </button>
                </div>
            </Motion.div>
        );
    }

    return (
        <div className="space-y-6"
        style={{ 
                height: 'calc(100vh - 150px)', 
                overflowY: 'auto', 
                padding: window.innerWidth >= 640 ? '10px' : '5px', 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none', 
                marginTop: window.innerWidth >= 640 ? '20px' : '0',
                marginBottom: '0px'
            }}>
            <div className="flex justify-between items-center">
                <h2 className="text-md font-bold text-gray-900" style={{ fontFamily: 'Gyrotrope' }}>
                    My Wishlist ({wishlist.length})
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6" style={{ padding: window.innerWidth >= 640 ? '10px' : '5px' }}>
                {wishlist.map((item) => (
                    <Motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col sm:flex-row h-full transition-all hover:shadow-md"
                        style={{ padding: window.innerWidth >= 640 ? '10px' : '5px' }}
                    >
                        {/* Product Image */}
                        <div 
                            className="relative w-full sm:w-40 h-40 sm:h-full bg-gray-50 cursor-pointer overflow-hidden group"
                            onClick={() => navigate(`/product/${item.id}`)}
                        >
                            <img 
                                src={item.image || item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                            {!item.inStock && item.inStock !== undefined && (
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                    <span className="text-white text-xs font-bold px-2 py-1 bg-red-500 rounded">Out of Stock</span>
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="flex-1 p-5 flex flex-col justify-between relative">
                            <div className="flex justify-end absolute top-0 right-0">
                                <button 
                                    onClick={() => handleRemove(item.id)}
                                    className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                    title="Remove from wishlist"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div style={{ padding: window.innerWidth >= 640 ? '5px 10px' : '5px' }}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 
                                        className="font-bold text-lg text-gray-900 line-clamp-1 cursor-pointer hover:text-emerald-600 transition-colors"
                                        onClick={() => navigate(`/product/${item.id}`)}
                                    >
                                        {item.name}
                                    </h3>
                                    
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                                    {item.genericName || 'Description not available'}
                                </p>
                            </div>

                            <div className="flex items-center justify-between mt-4" style={{ padding: window.innerWidth >= 640 ? '5px 10px' : '5px' }}>
                                <span className="text-base font-bold text-emerald-600">
                                    ₹{item.price?.toFixed(2)}
                                </span>
                                <button 
                                    style={{ padding: window.innerWidth >= 640 ? '2px 5px' : '2px 5px' }}
                                    onClick={() => handleAddToCart(item)}
                                    disabled={!item.inStock && item.inStock !== undefined}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-all shadow-sm ${
                                        !item.inStock && item.inStock !== undefined
                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                            : 'bg-emerald-600 text-white hover:bg-emerald-700 hover:shadow-md active:scale-95'
                                    }`}
                                >
                                    <ShoppingCart className="w-4 h-4" />
                                    <span className="hidden sm:inline text-xs" style={{marginTop:'3px'}}>Add to Cart</span>
                                    <span className="sm:hidden text-xs" style={{marginTop:'3px'}}>Add</span>
                                </button>
                            </div>
                        </div>
                    </Motion.div>
                ))}
            </div>
        </div>
    );
};

export default WishlistSection;
