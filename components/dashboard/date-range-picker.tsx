"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useDateRange } from "@/lib/context/date-range-context";
import { useState } from "react";

export function DateRangePicker() {
	const { dateRange, setDateRange } = useDateRange();
	// Add temporary state for the date selection
	const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
		dateRange
	);

	// Handle temporary date selection
	const handleSelect = (range: DateRange | undefined) => {
		if (range) {
			setTempDateRange(range);
		}
	};

	// Handle final selection when popover closes
	const handleOpenChange = (open: boolean) => {
		if (!open && tempDateRange?.from && tempDateRange?.to) {
			// Only update the context when popover closes and we have both dates
			setDateRange({
				from: tempDateRange.from,
				to: tempDateRange.to,
			});
		}
	};

	return (
		<div className='grid gap-2'>
			<Popover onOpenChange={handleOpenChange}>
				<PopoverTrigger asChild>
					<Button
						id='date'
						variant={"outline"}
						className='w-full md:w-[300px] justify-start text-left font-normal'
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{dateRange?.from ? (
							dateRange.to ? (
								<>
									{format(dateRange.from, "LLL dd, y")} -{" "}
									{format(dateRange.to, "LLL dd, y")}
								</>
							) : (
								format(dateRange.from, "LLL dd, y")
							)
						) : (
							<span>Pick a date</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					className='w-auto p-0'
					align='start'
				>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={dateRange?.from}
						selected={tempDateRange}
						onSelect={handleSelect}
						numberOfMonths={1}
						className='md:hidden'
					/>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={dateRange?.from}
						selected={tempDateRange}
						onSelect={handleSelect}
						numberOfMonths={2}
						className='hidden md:block'
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
