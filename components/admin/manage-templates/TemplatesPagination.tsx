"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface TemplatesPaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const pageSizes = [5, 10, 20, 50, 100];

export default function TemplatesPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: TemplatesPaginationProps) {

    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="flex items-center justify-between space-x-2 p-2 border-t">
       <div className="flex-1 text-sm text-muted-foreground">
            Showing {startItem} - {endItem} of {totalItems} templates
       </div>
      <div className="flex items-center space-x-4 lg:space-x-6">
         <div className="flex items-center space-x-2">
            <p className="text-sm font-medium hidden sm:block">Rows per page</p>
             <Select value={`${pageSize}`} onValueChange={(value) => { onPageSizeChange(Number(value)); }} >
                 <SelectTrigger className="h-8 w-[70px]"> <SelectValue placeholder={pageSize} /> </SelectTrigger>
                 <SelectContent side="top"> {pageSizes.map((size) => ( <SelectItem key={size} value={`${size}`}> {size} </SelectItem> ))} </SelectContent>
            </Select>
        </div>
         <div className="flex items-center justify-center text-sm font-medium"> Page {currentPage} of {totalPages} </div>
         <div className="flex items-center space-x-1">
             <Button variant="outline" className="h-8 w-8 p-0 hidden lg:flex" onClick={() => onPageChange(1)} disabled={!canGoPrevious} >
                <span className="sr-only">Go to first page</span> <ChevronsLeft className="h-4 w-4" />
             </Button>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => onPageChange(currentPage - 1)} disabled={!canGoPrevious} >
                <span className="sr-only">Go to previous page</span> <ChevronLeft className="h-4 w-4" />
             </Button>
            <Button variant="outline" className="h-8 w-8 p-0" onClick={() => onPageChange(currentPage + 1)} disabled={!canGoNext} >
                 <span className="sr-only">Go to next page</span> <ChevronRight className="h-4 w-4" />
             </Button>
            <Button variant="outline" className="h-8 w-8 p-0 hidden lg:flex" onClick={() => onPageChange(totalPages)} disabled={!canGoNext} >
                <span className="sr-only">Go to last page</span> <ChevronsRight className="h-4 w-4" />
             </Button>
         </div>
       </div>
    </div>
  );
}