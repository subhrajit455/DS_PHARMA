import React, { useState, useEffect } from 'react';
import { Search, Star, StarOff, Package, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card, CardContent } from '../../components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { productService } from '../../api/productService'; // Assuming we can reuse this service or mock it

const FeaturedProducts = () => {
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [allProducts, setAllProducts] = useState([]); // For the add modal
    
    // Missing state variables restored
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Add modal search
    const [addSearchQuery, setAddSearchQuery] = useState('');

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            try {
                // Fetch ALL products first
                const response = await productService.getProducts({ search: searchQuery }); 
                // Filter only highlighted for the main view
                const all = response.data;
                const highlighted = all.filter(p => p.isHighlighted);
                setProducts(highlighted);
                
                // For the "Add" modal, we want non-highlighted products
                 if (isAddModalOpen) {
                    const nonHighlighted = all.filter(p => !p.isHighlighted);
                    setAllProducts(nonHighlighted);
                }

            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch products');
            } finally {
                setIsLoading(false);
            }
        };
        fetchProducts();
    }, [searchQuery, isAddModalOpen]); // Re-fetch when modal opens to get fresh list

    const handleAdd = async (product) => {
         try {
            await productService.updateProduct(product.id, { isHighlighted: true });
            
            // Update local state immediately
            setProducts(prev => [...prev, { ...product, isHighlighted: true }]);
            setAllProducts(prev => prev.filter(p => p.id !== product.id));

            toast.success('Added to Highlighted Products');
        } catch (error) {
            console.error(error);
            toast.error('Failed to update highlighted status');
        }
    };

    const handleRemove = async (product) => {
         try {
            await productService.updateProduct(product.id, { isHighlighted: false });
            setProducts(prev => prev.filter(p => p.id !== product.id));
            toast.success('Removed from Highlighted Products');
        } catch (error) {
            console.error(error);
            toast.error('Failed to remove status');
        }
    };


    const filteredAddProducts = allProducts.filter(p => 
        p.name.toLowerCase().includes(addSearchQuery.toLowerCase())
    );

    // Pagination Logic
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="h-full flex flex-col space-y-4 p-2 sm:p-4" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)', padding: '10px 10px 0px 10px'}}>
             <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 shrink-0">
                <div>
                   <h2 className="text-xl sm:text-2xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2">
                     Highlighted Products
                     <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-emerald-500" />
                   </h2>
                   <p className="text-gray-500 text-[10px] sm:text-[8px] sm:text-xs md:text-sm mt-0.5">Manage products highlighted on the home page</p>
                </div>
                <Button onClick={() => setIsAddModalOpen(true)} className="gap-1" style={{ padding: '0px 5px'}}>
                    <Package className="h-4 w-4" /> <span className="hidden sm:inline" style={{ marginTop: '3px'}}>Add Product</span><span className="sm:hidden">Add</span>
                </Button>
             </div>

             <Card className="flex-1 flex flex-col min-h-0 shadow-sm border-gray-200/60 bg-white/50 backdrop-blur-xl">
                <CardContent className="flex-1 flex flex-col p-2 sm:p-3 md:p-4 min-h-0">
                    <div className="flex items-center gap-4 mb-2 sm:mb-3 md:mb-4 shrink-0" style={{ paddingBottom: '5px' }}>
                        <div className="relative w-full lg:w-72">
                            <Search className="absolute right-2.5 top-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            <Input 
                                placeholder="Search featured products..." 
                                className="pl-8 sm:pl-9 text-[8px] sm:text-sm h-9 sm:h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-auto rounded-md border border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '8px 5px' }}>Product Name</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '8px 5px' }}>Category</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '8px 5px' }}>Price</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm text-center" style={{ padding: '8px 5px' }}>Status</TableHead>
                                    <TableHead className="text-right font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '8px 5px' }}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900"></div>
                                                <span className="text-[8px] sm:text-sm">Loading...</span>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : paginatedProducts.length > 0 ? (
                                    paginatedProducts.map((product) => (
                                        <TableRow key={product.id} className="hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100">
                                            <TableCell className="font-medium text-gray-900 text-[8px] sm:text-sm" style={{ padding: '8px 5px' }}>
                                                <div className="flex items-center gap-2">
                                                    <div className="p-1.5 sm:p-2 bg-gray-100 rounded-lg text-gray-600">
                                                        <Package className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </div>
                                                    {product.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '8px 5px' }}>{product.category}</TableCell>
                                            <TableCell className="text-gray-900 font-bold text-[8px] sm:text-sm" style={{ padding: '8px 5px' }}>₹{product.price}</TableCell>
                                            <TableCell className="text-center" style={{ padding: '8px 5px' }}>
                                                <span className="inline-flex items-center px-2 sm:px-2.5 py-0.5 rounded-full text-[8px] sm:text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    Highlighted
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right" style={{ padding: '8px 5px' }}>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm"
                                                    onClick={() => handleRemove(product)}
                                                    className="text-red-500 hover:text-red-700 gap-1 hover:bg-red-50 text-[8px] sm:text-sm h-7 sm:h-8"
                                                >
                                                    <StarOff className="h-3 w-3 sm:h-4 sm:w-4 mr-0 sm:mr-2" /> <span className="hidden sm:inline" style={{ marginTop: '7px' }}>Remove</span>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-gray-500 text-[8px] sm:text-sm">
                                            No highlighted products found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                     {!isLoading && products.length > 0 && (
                        <div className="shrink-0 mt-4 pt-4" style={{ paddingTop: '10px' }}>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(products.length / itemsPerPage)}
                                onPageChange={(page) => setCurrentPage(page)}
                                itemsPerPage={itemsPerPage}
                                onItemsPerPageChange={(val) => {
                                    setItemsPerPage(val);
                                    setCurrentPage(1);
                                }}
                            />
                        </div>
                    )}
                </CardContent>
             </Card>

             {/* Add Modal */}
             {isAddModalOpen && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" >
                     <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-4 sm:p-6 flex flex-col max-h-[80vh]" style={{ padding: '10px'}}>
                         <div className="flex justify-between items-center mb-4 shrink-0">
                             <h3 className="text-lg font-bold">Select Product to Highlight</h3>
                             <Button variant="ghost" size="sm" onClick={() => setIsAddModalOpen(false)}>Close</Button>
                         </div>
                         
                         <Input 
                            placeholder="Search products..." 
                            className="mb-4 shrink-0"
                            value={addSearchQuery}
                            onChange={(e) => setAddSearchQuery(e.target.value)}
                         />

                         <div className="flex-1 overflow-auto rounded-md" style={{ marginTop: '10px'}}>
                            <Table>
                                <TableBody>
                                    {filteredAddProducts.map(p => (
                                        <TableRow key={p.id} className="hover:bg-gray-50" >
                                            <TableCell className="text-[8px] sm:text-sm">{p.name}</TableCell>
                                            <TableCell className="text-[8px] sm:text-sm">₹{p.price}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" onClick={() => handleAdd(p)} className="text-[8px] sm:text-sm h-7 sm:h-8">Select</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredAddProducts.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-8 text-gray-500 text-sm">No products found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                         </div>
                     </div>
                 </div>
             )}
        </div>
    );
};

export default FeaturedProducts;
