import React, { useState } from 'react';
import { Sparkles, LayoutGrid } from 'lucide-react';
import { useFeaturedProducts } from '@/shared/hooks/queries/useFeaturedProducts';
import PharmacyProductCard from '@/user/components/product/components/PharmacyProductCard';
import Loading from '@/shared/components/common/Loading';
import ErrorState from '@/shared/components/common/ErrorState';
import { Pagination } from '@/admin/components/ui/Pagination';

const FeaturedProductsPage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    const { data: featuredData = [], isLoading, isError } = useFeaturedProducts();

    if (isLoading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loading size="large" text="Loading featured collection..." />
            </div>
        );
    }

    if (isError) {
        return <ErrorState message="Failed to load featured products. Please try again later." />;
    }

    // Ensure we have an array
    const products = Array.isArray(featuredData) ? featuredData : (featuredData?.data || []);

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

    return (
        <div className="bg-gray-50/30 min-h-screen py-8 sm:py-12 px-4">
            <div className="container mx-auto">
                <div className="mb-10 text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold border border-emerald-100 uppercase tracking-widest shadow-sm">
                        <Sparkles className="w-3.5 h-3.5" />
                        Exclusive Collection
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                        Featured Products
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base font-medium">
                        Explore our top-rated medical supplies and wellness products. Quality and reliability you can trust.
                    </p>
                </div>

                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6 md:gap-8 justify-items-center">
                            {paginatedProducts.map((item) => {
                                const product = item.product || item || {};
                                
                                // Skip invalid items
                                if (!product.name && !product.productId) return null;

                                const pid = product._id || product.id || item._id || item.id;
                                
                                // Robust Image Normalization
                                let displayImage = '';
                                if (typeof product.image === 'string') displayImage = product.image;
                                else if (product.image?.url) displayImage = product.image.url;
                                else if (Array.isArray(product.images) && product.images[0]) {
                                     displayImage = typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url;
                                }

                                return (
                                    <PharmacyProductCard 
                                        key={pid}
                                        id={pid}
                                        name={product.name}
                                        price={product.price}
                                        imageUrl={displayImage}
                                        image={displayImage}
                                        stock={product.stock}
                                        inStock={Number(product.stock) > 0}
                                        unit={product.unit || 'piece'}
                                        mrp={product.mrp}
                                        description={product.description}
                                    />
                                );
                            })}
                        </div>

                        {totalPages > 1 && (
                            <div className="mt-12 flex justify-center">
                                <Pagination 
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                    itemsPerPage={itemsPerPage}
                                    onItemsPerPageChange={setItemsPerPage}
                                />
                            </div>
                        )}
                    </>
                ) : (
                    <div className="py-20 text-center flex flex-col items-center gap-4 bg-white rounded-3xl border border-gray-100 shadow-xl max-w-lg mx-auto">
                        <div className="p-5 bg-gray-50 rounded-full">
                            <LayoutGrid className="w-12 h-12 text-gray-300" />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-xl font-bold text-gray-900">No Featured Products</h3>
                            <p className="text-gray-500 text-sm max-w-[280px]">Our curators are currently selecting new items for our featured collection.</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FeaturedProductsPage;
