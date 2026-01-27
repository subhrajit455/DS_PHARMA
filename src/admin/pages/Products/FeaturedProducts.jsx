import React, { useState } from 'react';
import { Search, Sparkles, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/admin/components/ui/Button';
import { Input } from '@/admin/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/admin/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/admin/components/ui/Table';
import { Pagination } from '@/admin/components/ui/Pagination';
import Loading from '@/shared/components/common/Loading';
import ConfirmationModal from '@/admin/components/ui/ConfirmationModal';
import ProductSelectionModal from '@/admin/components/products/ProductSelectionModal';
import { 
  useFeaturedProducts, 
  useAddFeaturedProduct, 
  useRemoveFeaturedProduct 
} from '@/shared/hooks/queries/useFeaturedProducts';
import { FALLBACK_IMAGE, handleImageError } from '@/shared/constants/assets';

// Base API URL for image helpers
const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.0.123:5000';

const FeaturedProducts = () => {
    // State
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Confirmation for Delete ONLY
    const [deleteModal, setDeleteModal] = useState({ isOpen: false, featuredId: null, productId: null });

    // API Hooks
    // 1. Fetch Featured Products (Single Source of Truth)
    const { data: featuredData = [], isLoading: isFeaturedLoading, isError: isFeaturedError } = useFeaturedProducts();
    const addMutation = useAddFeaturedProduct();
    const removeMutation = useRemoveFeaturedProduct();

    // Normalization
    const featuredList = Array.isArray(featuredData) ? featuredData : (featuredData?.data || []);

    // Helper: Image URL
    const getImageUrl = (image) => {
        if (!image) return FALLBACK_IMAGE;
        let url = '';
        if (typeof image === 'string') url = image;
        else if (image.url) url = image.url;
        else if (Array.isArray(image)) url = image[0]?.url || image[0] || '';

        if (!url) return FALLBACK_IMAGE;
        if (url.startsWith('http')) return url;
        const cleanPath = url.startsWith('/') ? url.substring(1) : url;
        return `${API_URL}/${cleanPath}`;
    };

    // --- Search & Filter Logic (Client-Side for Featured List) ---
    const filteredProducts = featuredList.filter(item => {
        const product = item.product || item;
        const name = product.name || '';
        return name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // --- Pagination Logic ---
    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

    // --- Handlers ---

    // Open Add Modal
    const handleOpenAddModal = () => setIsAddModalOpen(true);

    // Add Product (from Modal)
    const handleAddProduct = async (productId) => {
        try {
            await addMutation.mutateAsync(productId);
            setIsAddModalOpen(false); // Close on success
        } catch (error) {
            console.error("Failed to add featured product", error);
        }
    };

    // Open Remove Confirmation
    const handleOpenRemoveModal = (featuredId, productId) => {
        setDeleteModal({ isOpen: true, featuredId, productId });
    };

    // Confirm Remove
    const handleConfirmRemove = async () => {
        try {
            if (deleteModal.featuredId) {
                await removeMutation.mutateAsync(deleteModal.featuredId);
            }
        } catch (error) {
            console.error("Failed to remove featured product", error);
        } finally {
            setDeleteModal({ ...deleteModal, isOpen: false });
        }
    };

    // Render Loading
    if (isFeaturedLoading) {
        return (
            <div className="flex h-[50vh] items-center justify-center">
                <Loading size="large" text="Syncing featured products..." />
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full space-y-4 sm:space-y-6 max-w-full overflow-x-hidden animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)', padding: '0px 1rem' }}>
             
             {/* Header Section with ADD Button */}
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0" style={{ padding: '10px 0px' }}>
                <div>
                   <h2 className="text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2">
                     Featured Products
                     <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 text-emerald-500" />
                   </h2>
                </div>
                
                <div className="flex items-center gap-3">
                    {/* Backend Error Warning */}
                    {isFeaturedError && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg text-red-600 text-[10px] sm:text-xs font-medium">
                            <AlertCircle className="w-4 h-4" />
                            Sync Issue
                        </div>
                    )}

                    {/* Add Button */}
                    <Button 
                        onClick={handleOpenAddModal}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Add Product
                    </Button>
                </div>
             </div>

             {/* Main Content Card */}
             <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-gray-200/60 bg-white/50 backdrop-blur-xl">
                <CardHeader className="pb-3 border-b border-gray-50 bg-gray-50/30">
                    <CardTitle className="text-base sm:text-lg font-bold text-gray-800">Featured Collection</CardTitle>
                    <CardDescription className="text-[10px] sm:text-xs">Manage the products displayed on your home page</CardDescription>
                </CardHeader>
                
                <CardContent className="flex flex-col h-full p-2 sm:p-4 overflow-hidden">
                    {/* Search Bar */}
                    <div className="flex items-center gap-4 mb-4" style={{ paddingBottom: '10px' }}>
                        <div className="relative w-full lg:w-72">
                            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input 
                                placeholder="Search featured..." 
                                className="pl-10 h-10 text-sm"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    </div>

                    {/* Table */}
                    <div className="flex-1 overflow-auto rounded-xl border border-gray-100 shadow-sm bg-white">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-gray-50/50">
                                    <TableHead className="font-bold text-gray-700 py-4 w-15 text-center sticky top-0 bg-gray-50 z-10">SR No</TableHead>
                                    <TableHead className="font-bold text-gray-700 py-4 sticky top-0 bg-gray-50 z-10 w-20">Image</TableHead>
                                    <TableHead className="font-bold text-gray-700 py-4 sticky top-0 bg-gray-50 z-10">Product Name</TableHead>
                                    <TableHead className="font-bold text-gray-700 py-4 hidden md:table-cell sticky top-0 bg-gray-50 z-10">Price</TableHead>
                                    <TableHead className="text-right font-bold text-gray-700 py-4 sticky top-0 bg-gray-50 z-10">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedProducts.length > 0 ? (
                                    paginatedProducts.map((item, index) => {
                                        // Handle nested structure: item might be the product itself or contain { product: ... }
                                        const product = item.product || item || {};
                                        // The 'id' for deletion is the record ID (item._id) if it exists, otherwise assume item._id/product._id mapping
                                        // Based on previous code: "found?._id || found?.id || productId"
                                        // We'll pass the item ID for deletion.
                                        const featuredRecordId = item._id || item.id; 
                                        const pid = product._id || product.id;

                                        const displayImage = getImageUrl(product.image || product.images);
                                        const serialNumber = (currentPage - 1) * itemsPerPage + index + 1;

                                        return (
                                            <TableRow key={featuredRecordId} className="hover:bg-emerald-50/30 transition-colors border-b border-gray-50">
                                                <TableCell className="py-4 text-center text-gray-500 font-medium text-xs w-15">{serialNumber}</TableCell>
                                                <TableCell className="py-4">
                                                    <div className="h-10 w-10 rounded-lg overflow-hidden border border-gray-100 bg-gray-50">
                                                        <img 
                                                            src={displayImage} 
                                                            alt={product.name} 
                                                            className="h-full w-full object-cover"
                                                            onError={handleImageError}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell className="py-4 font-semibold text-gray-900 text-sm">{product.name || 'Unknown Product'}</TableCell>
                                                <TableCell className="py-4 font-bold text-emerald-700 hidden md:table-cell">₹{product.price || 0}</TableCell>
                                                <TableCell className="py-4 text-right">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="sm"
                                                        onClick={() => handleOpenRemoveModal(featuredRecordId, pid)}
                                                        className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 p-0 rounded-full"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-48 text-center text-gray-400 text-sm">
                                            <div className="flex flex-col items-center gap-2">
                                                <Sparkles className="w-8 h-8 opacity-20" />
                                                No featured products found. <br/> Click "Add Product" to start featuring items.
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    <div className="mt-4 shrink-0">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            itemsPerPage={itemsPerPage}
                            onItemsPerPageChange={(val) => {
                                setItemsPerPage(val);
                                setCurrentPage(1);
                            }}
                        />
                    </div>
                </CardContent>
             </Card>

             {/* Add Product Modal */}
             <ProductSelectionModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSelect={handleAddProduct}
                isSubmitting={addMutation.isPending}
                featuredIds={featuredList.map(p => {
                    const product = p.product || p;
                    return product._id || product.id || p.productId || p._id; // Robust ID extraction
                })}
             />

             {/* Remove Confirmation Modal */}
             <ConfirmationModal 
                isOpen={deleteModal.isOpen}
                onClose={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                onConfirm={handleConfirmRemove}
                title="Remove from Featured"
                message="Are you sure you want to remove this product from your featured list?"
                confirmText="Remove"
                isLoading={removeMutation.isPending}
             />
        </div>
    );
};

export default FeaturedProducts;
