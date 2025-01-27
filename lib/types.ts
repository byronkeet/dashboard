// Date range types
export interface DateRange {
	from: Date;
	to: Date;
}

// Review types
export interface Review {
	"Your Accommodation": number;
	"The Camp Facilities": number;
	"The Food": number;
	Housekeeping: number;
	"Our Staff": number;
	id: string;
	name: string;
	date: string;
	ots: number;
	wes: number;
	recommend: boolean;
}

export interface PaginatedResponse<T> {
	data: T[];
	metadata: {
		currentPage: number;
		totalPages: number;
		totalItems: number;
		itemsPerPage: number;
	};
}

// Add comparison types for stats
export interface ComparisonData<T> {
	current: T;
	previous?: T;
	percentageChange?: number;
}

export interface Stats {
	totalGuests: number;
	totalSubmissions: number;
	averageOTS: number;
	averageWRS: number;
}
