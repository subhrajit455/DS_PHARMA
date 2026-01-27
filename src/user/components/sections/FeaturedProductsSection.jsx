import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, PackageX } from 'lucide-react';
import productService from '@/services/productService';
import { PharmacyProductCard } from '@/user/components/product';
import { ProductGridSkeleton } from '@/shared/components/skeletons/ProductSkeleton';

const FeaturedProductsSection = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchFeatured = async () => {
            setLoading(true);
            setError(false);
            try {
                const data = await productService.getFeaturedProducts();
                if (isMounted) {
                    setProducts(data || []);
                }
            } catch (err) {
                console.error("Failed to load featured products:", err);
                if (isMounted) setError(true);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchFeatured();
        return () => { isMounted = false; };
    }, []);

    const handleProductClick = (product) => {
        navigate(`/product/${product.id || product._id}`);
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 sm:py-12">
                <div className="mb-8">
                    <div className="h-10 w-64 bg-gray-200 animate-pulse rounded-lg mb-4" />
                    <div className="h-4 w-96 bg-gray-100 animate-pulse rounded-lg" />
                </div>
                <ProductGridSkeleton count={4} />
            </div>
        );
    }

    // Don't render anything if there's an error OR no products (as per user request "Show ONLY admin-selected")
    if (error || products.length === 0) return null;

    return (
        <div className="container mx-auto px-4 py-8 sm:py-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 flex items-center gap-3" style={{ fontFamily: 'Gyrotrope' }}>
                        Featured Products
                        <Sparkles className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500 fill-yellow-500 animate-pulse" />
                    </h2>
                    <p className="text-gray-500 text-sm sm:text-base mt-2 max-w-2xl" style={{ fontFamily: 'Gyrotrope' }}>
                        Handpicked healthcare essentials curated by our experts.
                    </p>
                </div>
                
                <button 
                    onClick={() => navigate('/featured')}
                    className="group flex items-center gap-2 text-emerald-600 font-bold text-sm sm:text-base hover:text-emerald-700 transition-all active:scale-95"
                    style={{ fontFamily: 'Gyrotrope' }}
                >
                    View All
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {products.slice(0, 5).map((product) => (
                    <PharmacyProductCard 
                        key={product.id || product._id}
                        {...product}
                        onCardClick={() => handleProductClick(product)}
                    />
                ))}
            </div>
        </div>
    );
};

export default FeaturedProductsSection;
