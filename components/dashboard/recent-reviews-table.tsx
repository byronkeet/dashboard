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
import { PaginationNumbers } from "@/components/ui/pagination-numbers";
import { useState } from "react";

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
		"created_at",
		"Wildlife Comment Sentiment",
		"Hospitality Comment Sentiment",
		"Overall Comment Sentiment",
	];

	// Group fields by category
	const fieldGroups: Record<string, string[]> = {
		"General Information": [
			"Full Name",
			"Email Address",
			"Submitted On (UTC)",
			"Nationality",
			"Name of Travel Agent",
		],
		"Trip Experience": [
			"Overall Trip Experience",
			"Would you recommend Tuludi to your friends?",
		],
		"Wildlife Experience": [
			"Overall Wildlife Experience",
			"Rate Your Guide",
			"Your Guide",
			"Key Sightings",
		],
		"Accommodation & Facilities": [
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
			sentiment: review["Wildlife Comment Sentiment"],
		},
		{
			title: "Hospitality Comments",
			content:
				review[
					"Any Further Comments or Recommendations about our hospitality?"
				],
			icon: "🏠",
			sentiment: review["Hospitality Comment Sentiment"],
		},
		{
			title: "General Comments",
			content: review["Any Further Comments or Recommendations?"],
			icon: "💭",
			sentiment: review["Overall Comment Sentiment"],
		},
	];

	// Get all remaining fields that aren't in any group
	const allGroupedFields = [
		...excludeFields,
		...Object.values(fieldGroups).flat(),
		"Email Address",
	];
	const remainingFields = Object.keys(review).filter(
		(field) =>
			!allGroupedFields.includes(field) &&
			!comments.some((c) => c.content === review[field])
	);

	// Add remaining fields to a "Other Information" group if any exist
	if (remainingFields.length > 0) {
		fieldGroups["Other Information"] = remainingFields;
	}

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

							// Format other ratings (out of 5)
							if (
								typeof value === "number" &&
								(field.includes("Rating") ||
									[
										"Your Accommodation",
										"The Camp Facilities",
										"The Food",
										"Housekeeping",
										"Our Staff",
										"Rate Your Guide",
									].includes(field))
							) {
								value = `${value}/5`;
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
					{comments.map(({ title, content, icon, sentiment }) => {
						if (!content) return null;

						return (
							<div
								key={title}
								className='bg-gray-50 rounded-lg p-4 border border-gray-100'
							>
								<div className='flex items-start justify-between mb-2'>
									<div className='flex items-center gap-2'>
										<span className='text-xl'>{icon}</span>
										<h4 className='font-medium text-gray-900'>
											{title}
										</h4>
									</div>
									{sentiment && (
										<span
											className={`px-2 py-1 rounded-md text-xs ${
												sentiment.toUpperCase() ===
												"POSITIVE"
													? "bg-green-100 text-green-800"
													: "bg-red-100 text-red-800"
											}`}
										>
											{sentiment.toUpperCase()}
										</span>
									)}
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

function ReviewDialogContent({ review }: { review: Review }) {
	const [showEmailInput, setShowEmailInput] = useState(false);
	const [emails, setEmails] = useState("");
	const [status, setStatus] = useState<
		"idle" | "loading" | "success" | "error"
	>("idle");

	const handleEmailSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setStatus("loading");
		try {
			const response = await fetch(
				"https://n8n.zeet.agency/webhook/tuludi-email-review",
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ emails, review }),
				}
			);
			if (response.ok) {
				setStatus("success");
				setEmails("");
			} else {
				setStatus("error");
			}
		} catch (error) {
			setStatus("error");
		}
	};

	return (
		<>
			<DialogHeader>
				<DialogTitle>Review Details</DialogTitle>
			</DialogHeader>
			<ReviewDetails review={review} />
			<div className='mt-4 border-t pt-4'>
				{!showEmailInput ? (
					<Button
						onClick={() => setShowEmailInput(true)}
						variant='outline'
						size='sm'
					>
						Email
					</Button>
				) : (
					<form
						onSubmit={handleEmailSubmit}
						className='flex flex-col space-y-2'
					>
						<input
							value={emails}
							onChange={(e) => setEmails(e.target.value)}
							placeholder='Enter emails separated by comma'
							className='border p-2 rounded'
						/>
						<div className='flex items-center gap-2'>
							<Button
								type='submit'
								size='sm'
							>
								Send Email
							</Button>
							<Button
								onClick={() => setShowEmailInput(false)}
								size='sm'
								variant='ghost'
							>
								Cancel
							</Button>
						</div>
						{status === "loading" && (
							<p className='text-sm text-gray-500'>Sending...</p>
						)}
						{status === "success" && (
							<p className='text-sm text-green-600'>
								Email sent successfully.
							</p>
						)}
						{status === "error" && (
							<p className='text-sm text-red-600'>
								Failed to send email.
							</p>
						)}
					</form>
				)}
			</div>
		</>
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
										<DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
											<ReviewDialogContent
												review={review}
											/>
										</DialogContent>
									</Dialog>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
			<div className='mt-4'>
				<PaginationNumbers
					currentPage={currentPage}
					totalPages={totalPages}
					onPageChange={onPageChange}
				/>
			</div>
		</div>
	);
}
