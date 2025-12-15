import React from 'react';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../utils/cn';

export const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  itemsPerPage,
  onItemsPerPageChange,
  className 
}) => {
    // Helper to generate page numbers
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Always include first page, last page, current page, and surrounding pages
            if (currentPage <= 3) {
                 for(let i = 1; i <= 4; i++) pages.push(i);
                 if (totalPages > 5) pages.push('...');
                 pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                if (totalPages > 5) pages.push('...');
                for(let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                 if (currentPage > 3) pages.push('...');
                 pages.push(currentPage - 1);
                 pages.push(currentPage);
                 pages.push(currentPage + 1);
                 if (currentPage < totalPages - 2) pages.push('...');
                 pages.push(totalPages);
            }
        }
        return pages;
    };

    if (totalPages <= 0 && (!itemsPerPage || !onItemsPerPageChange)) return null;

    return (
        <div className={cn("flex flex-row flex-wrap items-center justify-between gap-4 py-4", className)}>
            
            {/* Items Per Page Selector */}
            {itemsPerPage && onItemsPerPageChange && (
                 <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>Show</span>
                    <select 
                        value={itemsPerPage}
                        onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                        className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-emerald-500 focus:border-emerald-500 block p-1 px-2 outline-none cursor-pointer"
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                        <option value={50}>50</option>
                    </select>
                    <span>entries</span>
                </div>
            )}
            
            {(totalPages > 1) ? (
                <div className="flex items-center gap-1 sm:gap-2 ml-auto">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-6 w-6 p-0 sm:w-auto sm:px-3 gap-1"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        <span className="hidden sm:inline" style={{marginTop: '2px'}}>Previous</span>
                    </Button>

                    <div className="flex items-center gap-1 sm:gap-2">
                        {getPageNumbers().map((page, index) => (
                            <React.Fragment key={index}>
                                {page === '...' ? (
                                    <span className="text-gray-400 text-sm px-2">...</span>
                                ) : (
                                    <Button
                                        variant={currentPage === page ? "primary" : "ghost"}
                                        size="sm"
                                        onClick={() => onPageChange(page)}
                                        className={cn(
                                            "h-6 w-6 p-0 font-medium",
                                            currentPage === page 
                                            ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200"
                                            : "text-gray-600 hover:bg-gray-100"
                                        )}
                                    >
                                        {page}
                                    </Button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-6 w-6 p-0 sm:w-auto sm:px-3 gap-1"
                    >
                        <span className="hidden sm:inline mt-1" style={{marginTop: '2px'}}>Next</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                 <div className="flex-1" /> // Spacer if only 1 page but items per page is shown
            )}
        </div>
    );
};
