import React, { useState } from 'react';
import { Plus, Edit, Trash2, Search, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Button } from '@/admin/components/ui/Button';
import { Input } from '@/admin/components/ui/Input';
import { Card, CardContent } from '@/admin/components/ui/Card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/admin/components/ui/Table';
import ConfirmationModal from '@/admin/components/ui/ConfirmationModal';
import { Pagination } from '@/admin/components/ui/Pagination';

import useDataStore from '@/store/useDataStore';

const CategoriesList = () => {
    // Connect to Store
    const categories = useDataStore((state) => state.categories);
    const products = useDataStore((state) => state.products);
    const addCategory = useDataStore((state) => state.addCategory);
    const updateCategory = useDataStore((state) => state.updateCategory);
    const deleteCategory = useDataStore((state) => state.deleteCategory);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    // Use isVisible instead of status string for better logic control
    const [currentCategory, setCurrentCategory] = useState({ name: '', slug: '', isVisible: true });
    const [isEditing, setIsEditing] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Compute products count for each category
    const categoriesWithCounts = categories.map(cat => {
        // Match exact name string
        const count = products.filter(p => p.category === cat.name).length;
        // Generate slug if missing
        const slug = cat.slug || cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        return { ...cat, products: count, slug };
    });

    const filteredCategories = categoriesWithCounts.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleSave = () => {
        if (!currentCategory.name) {
            toast.error('Category name is required');
            return;
        }

        if (isEditing) {
            updateCategory(currentCategory.id, currentCategory);
            toast.success('Category updated successfully');
        } else {
            const newCategory = {
                ...currentCategory,
                products: 0, // In a real app, this would be computed or 0 for new
                slug: currentCategory.name.toLowerCase().replace(/\s+/g, '-')
            };
            addCategory(newCategory);
            toast.success('Category created successfully');
        }
        setIsModalOpen(false);
        resetForm();
    };

    const handleDelete = () => {
        deleteCategory(currentCategory.id);
        setIsDeleteModalOpen(false);
        toast.success('Category deleted successfully');
    };

    const openEditModal = (category) => {
        setCurrentCategory(category);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openDeleteModal = (category) => {
        setCurrentCategory(category);
        setIsDeleteModalOpen(true);
    };

    const resetForm = () => {
        setCurrentCategory({ name: '', slug: '', isVisible: true });
        setIsEditing(false);
    };

    return (
        <div className="flex-1 h-full flex flex-col space-y-4 p-2 sm:p-4 lg:p-6 animate-in fade-in slide-in-from-bottom-6 duration-700" style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0fdfa 100%)' }}>
             <div className="flex sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 shrink-0" style={{ padding: '5px' }}>
                <div>
                   <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-linear-to-r from-gray-900 via-emerald-800 to-teal-800 bg-clip-text text-transparent flex items-center gap-2 sm:gap-3">
                    Categories
                    <Sparkles className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-emerald-500" />
                   </h2>
                   <p className="text-[8px] sm:text-sm text-gray-600 mt-1 sm:mt-2 font-medium">Manage product categories</p>
                </div>
                <Button onClick={() => { resetForm(); setIsModalOpen(true); }} className="gap-1" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' , padding: '0px 5px', color: 'white' }}>
                   <Plus className="h-4 w-4" /> <span className="hidden sm:inline" style={{ marginTop: '3px'}}>Add Category</span><span className="sm:hidden" style={{marginTop: '3px'}}>Add</span>
                </Button>
             </div>

             <Card className="flex-1 flex flex-col min-h-0 shadow-sm border-gray-200/60 bg-white/50 backdrop-blur-xl" style={{ padding: '5px 10px' }}>
                <CardContent className="flex-1 flex flex-col p-2 sm:p-3 md:p-4 min-h-0">
                    <div className="flex items-center gap-4 mb-2 sm:mb-3 md:mb-4 shrink-0" style={{ paddingBottom: '5px' }}>
                        <div className="relative w-full lg:w-72">
                            <Search className="absolute right-2.5 top-2 h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                            <Input 
                                placeholder="Search categories..." 
                                className="pl-8 sm:pl-9 text-[8px] sm:text-sm h-9 sm:h-10"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Table Container - Takes available space */}
                    <div className="flex-1 overflow-auto rounded-md border border-gray-200">
                        <Table>
                            <TableHeader>
                                <TableRow style={{ background: 'linear-gradient(to right, #f0fdf4, #f0fdfa)' }}>
                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '8px 5px', background: 'rgba(16, 185, 129, 0.1)' }}>Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '8px 5px', background: 'rgba(16, 185, 129, 0.1)' }}>Slug</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm hidden md:table-cell" style={{ padding: '8px 5px', background: 'rgba(16, 185, 129, 0.1)' }}>Products</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '8px 5px', background: 'rgba(16, 185, 129, 0.1)' }}>Visibility</TableHead>
                    <TableHead className="text-right font-semibold text-gray-700 text-[8px] sm:text-sm" style={{ padding: '8px 5px', background: 'rgba(16, 185, 129, 0.1)' }}>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {paginatedCategories.length > 0 ? (
                                    paginatedCategories.map((category) => (
                                        <TableRow key={category.id} className="hover:bg-emerald-50/50 transition-all duration-200 border-b border-gray-100">
                                            <TableCell className="font-medium text-gray-900 text-[8px] sm:text-sm" style={{ padding: '8px 5px' }}>
                                                <div className="flex items-center gap-2">
                                                    {category.name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-500 text-[8px] sm:text-sm hidden sm:table-cell" style={{ padding: '8px 5px' }}>{category.slug}</TableCell>
                                            <TableCell className="text-gray-900 text-[8px] sm:text-sm hidden md:table-cell" style={{ padding: '8px 5px' }}>{category.products}</TableCell>
                                            <TableCell style={{ padding: '8px 5px' }}>
                                                <span className={`px-2 py-1 text-[8px] sm:text-xs font-medium rounded-full ${category.isVisible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {category.isVisible ? 'Visible' : 'Hidden'}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-right" style={{ padding: '8px 5px' }}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 text-blue-600 hover:bg-blue-50" onClick={() => openEditModal(category)}>
                                                        <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" className="h-7 w-7 sm:h-8 sm:w-8 text-red-600 hover:bg-red-50" onClick={() => openDeleteModal(category)}>
                                                        <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-24 text-center text-gray-500 text-[8px] sm:text-sm">
                                            No categories found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination - Fixed at bottom */}
                    {filteredCategories.length > 0 && (
                        <div className="shrink-0 mt-4 pt-4" style={{bottom:'0', marginTop:'10px'}}>
                            <Pagination
                                currentPage={currentPage}
                                totalPages={Math.ceil(filteredCategories.length / itemsPerPage)}
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

             {/* Add/Edit Modal (Simplified inline) */}
             {isModalOpen && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" style={{ padding: '10px'}}>
                     <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-4 sm:p-6" style={{ padding: '5px 10px'}}>
                         <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit Category' : 'Add Category'}</h3>
                         <div className="space-y-4">
                             <div>
                                 <label className="text-[8px] sm:text-sm font-medium text-gray-700">Category Name</label>
                                 <Input 
                                     value={currentCategory.name}
                                     onChange={(e) => setCurrentCategory({...currentCategory, name: e.target.value })}
                                     placeholder="e.g. Heart Care"
                                     className="mt-1"
                                 />
                             </div>
                             <div>
                                 <label className="text-[8px] sm:text-sm font-medium text-gray-700">Visibility</label>
                                 <select 
                                     style={{ padding: '8px 5px' }}
                                     value={currentCategory.isVisible}
                                     onChange={(e) => setCurrentCategory({...currentCategory, isVisible: e.target.value === 'true' })}
                                     className="w-full mt-1 rounded-md border border-gray-200 p-2 text-[8px] sm:text-sm"
                                 >
                                     <option value={true}>Visible</option>
                                     <option value={false}>Hidden</option>
                                 </select>
                             </div>
                             <div className="flex justify-end gap-3 mt-6">
                                 <Button variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                                 <Button variant="primary" onClick={handleSave}>{isEditing ? 'Update' : 'Create'}</Button>
                             </div>
                         </div>
                     </div>
                 </div>
             )}

             <ConfirmationModal 
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDelete}
                title="Delete Category"
                message={`Are you sure you want to delete "${currentCategory.name}"? This action cannot be undone.`}
                confirmText="Delete"
                variant="danger"
             />
        </div>
    );
};

export default CategoriesList;