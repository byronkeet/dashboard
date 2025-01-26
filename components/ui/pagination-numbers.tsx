import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationNumbersProps {
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function PaginationNumbers({
	currentPage,
	totalPages,
	onPageChange,
}: PaginationNumbersProps) {
	const getPageNumbers = () => {
		const pages = [];
		const maxVisiblePages = 5;

		// Always show first page
		pages.push(1);

		if (totalPages <= maxVisiblePages) {
			// Show all pages if total is less than or equal to maxVisiblePages
			for (let i = 2; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Show pages with ellipsis
			if (currentPage <= 3) {
				pages.push(2, 3, 4, "...", totalPages);
			} else if (currentPage >= totalPages - 2) {
				pages.push(
					"...",
					totalPages - 3,
					totalPages - 2,
					totalPages - 1,
					totalPages
				);
			} else {
				pages.push(
					"...",
					currentPage - 1,
					currentPage,
					currentPage + 1,
					"...",
					totalPages
				);
			}
		}

		return pages;
	};

	return (
		<div className='flex items-center justify-center space-x-2'>
			<Button
				variant='outline'
				size='sm'
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
			>
				<ChevronLeft className='h-4 w-4' />
			</Button>

			{getPageNumbers().map((page, index) => (
				<Button
					key={index}
					variant={currentPage === page ? "default" : "outline"}
					size='sm'
					onClick={() =>
						typeof page === "number" ? onPageChange(page) : null
					}
					disabled={typeof page !== "number"}
					className={typeof page !== "number" ? "cursor-default" : ""}
				>
					{page}
				</Button>
			))}

			<Button
				variant='outline'
				size='sm'
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
			>
				<ChevronRight className='h-4 w-4' />
			</Button>
		</div>
	);
}
