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
	"How did you hear about Taludi?": string;
	"Name of Travel Agent"?: string;
	"Any Further Comments or Recommendations?"?: string;
	"Full Name": string;
	"Overall Comment Sentiment"?: "Positive" | "Negative";
	"Submitted On (UTC)": string;
	Nationality: string;
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
export interface StatsComparisonData {
	current: Stats;
	previous?: Stats;
	percentageChange?: {
		totalGuests: number;
		totalSubmissions: number;
		averageOTS: number;
		averageWRS: number;
	};
}

// Update the generic ComparisonData type
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
