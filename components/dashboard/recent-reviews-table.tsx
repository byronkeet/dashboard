import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Check, X } from "lucide-react";

interface Review {
	id: string;
	"Full Name": string;
	"Submitted On (UTC)": string;
	"Overall Trip Experience": number;
	"Overall Wildlife Experience": number;
	"Would you recommend Tuludi to your friends?": boolean;
	[key: string]: any; // For other fields that will show in details
}

interface ReviewDetailsProps {
	review: Review;
}

interface RecentReviewsTableProps {
	data: Review[];
	isLoading: boolean;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

// Component to display review details in a dialog
function ReviewDetails({ review }: ReviewDetailsProps) {
	// Fields to exclude from details view
	const excludeFields = [
		"id",
		"tableData",
		"Any Further Comments or Recommendations about our wildlife experience?",
		"Any Further Comments or Recommendations about our hospitality?",
		"Any Further Comments or Recommendations?",
	];

	// Group fields by category
	const fieldGroups = {
		"General Information": ["Full Name", "Submitted On (UTC)", "Email"],
		"Trip Experience": [
			"Overall Trip Experience",
			"Overall Wildlife Experience",
			"Would you recommend Tuludi to your friends?",
			"What was the highlight of your stay?",
		],
		Ratings: [
			"Your Accommodation",
			"The Camp Facilities",
			"The Food",
			"Housekeeping",
			"Our Staff",
		],
	};

	// Comments section
	const comments = [
		{
			title: "Wildlife Experience Comments",
			content:
				review[
					"Any Further Comments or Recommendations about our wildlife experience?"
				],
			icon: "🦁",
		},
		{
			title: "Hospitality Comments",
			content:
				review[
					"Any Further Comments or Recommendations about our hospitality?"
				],
			icon: "🏠",
		},
		{
			title: "General Comments",
			content: review["Any Further Comments or Recommendations?"],
			icon: "💭",
		},
	];

	return (
		<div className='max-h-[80vh] overflow-y-auto px-4'>
			{/* Regular fields */}
			{Object.entries(fieldGroups).map(([groupName, fields]) => (
				<div
					key={groupName}
					className='mb-6'
				>
					<h3 className='font-semibold text-lg mb-3'>{groupName}</h3>
					<div className='grid gap-3'>
						{fields.map((field) => {
							if (!review[field]) return null;

							let value = review[field];

							// Format date
							if (field === "Submitted On (UTC)") {
								value = format(new Date(value), "PPP");
							}

							// Format boolean
							if (typeof value === "boolean") {
								value = value ? "Yes" : "No";
							}

							// Format numbers (ratings)
							if (
								typeof value === "number" &&
								field.includes("Experience")
							) {
								value = `${(value * 10).toFixed(0)}%`;
							}

							return (
								<div
									key={field}
									className='grid grid-cols-1 md:grid-cols-2 gap-2'
								>
									<div className='text-sm font-medium text-gray-500'>
										{field}
									</div>
									<div className='text-sm'>{value}</div>
								</div>
							);
						})}
					</div>
				</div>
			))}

			{/* Comments section */}
			<div className='mb-6'>
				<h3 className='font-semibold text-lg mb-3'>Comments</h3>
				<div className='space-y-4'>
					{comments.map(({ title, content, icon }) => {
						if (!content) return null;

						return (
							<div
								key={title}
								className='bg-gray-50 rounded-lg p-4 border border-gray-100'
							>
								<div className='flex items-center gap-2 mb-2'>
									<span className='text-xl'>{icon}</span>
									<h4 className='font-medium text-gray-900'>
										{title}
									</h4>
								</div>
								<p className='text-sm text-gray-600 whitespace-pre-wrap'>
									{content}
								</p>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export function RecentReviewsTable({
	data,
	isLoading,
	currentPage,
	totalPages,
	onPageChange,
}: RecentReviewsTableProps) {
	if (isLoading) {
		return (
			<div className='space-y-3'>
				<div className='h-[400px] animate-pulse bg-gray-100 rounded-lg' />
			</div>
		);
	}

	return (
		<div className='space-y-4'>
			<div className='rounded-md border'>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Review Date</TableHead>
							<TableHead className='text-center'>OTS</TableHead>
							<TableHead className='text-center'>WES</TableHead>
							<TableHead className='text-center'>
								Would Recommend
							</TableHead>
							<TableHead className='text-right'>
								Details
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((review) => (
							<TableRow key={review.id}>
								<TableCell className='font-medium'>
									{review["Full Name"]}
								</TableCell>
								<TableCell>
									{format(
										new Date(review["Submitted On (UTC)"]),
										"PP"
									)}
								</TableCell>
								<TableCell className='text-center'>
									{(
										Number(
											review["Overall Trip Experience"]
										) * 10
									).toFixed(0)}
									%
								</TableCell>
								<TableCell className='text-center'>
									{(
										Number(
											review[
												"Overall Wildlife Experience"
											]
										) * 10
									).toFixed(0)}
									%
								</TableCell>
								<TableCell className='text-center'>
									{review[
										"Would you recommend Tuludi to your friends?"
									] ? (
										<Check className='h-4 w-4 mx-auto text-green-500' />
									) : (
										<X className='h-4 w-4 mx-auto text-red-500' />
									)}
								</TableCell>
								<TableCell className='text-right'>
									<Dialog>
										<DialogTrigger asChild>
											<Button
												variant='ghost'
												size='sm'
											>
												View
											</Button>
										</DialogTrigger>
										<DialogContent className='max-w-2xl'>
											<DialogHeader>
												<DialogTitle>
													Review Details
												</DialogTitle>
											</DialogHeader>
											<ReviewDetails review={review} />
										</DialogContent>
									</Dialog>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			<div className='flex items-center justify-center space-x-2'>
				<Button
					variant='outline'
					size='sm'
					onClick={() => onPageChange(currentPage - 1)}
					disabled={currentPage === 1}
				>
					Previous
				</Button>
				<span className='text-sm'>
					Page {currentPage} of {totalPages}
				</span>
				<Button
					variant='outline'
					size='sm'
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
				>
					Next
				</Button>
			</div>
		</div>
	);
}
