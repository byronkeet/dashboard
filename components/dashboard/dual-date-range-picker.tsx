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
import { Label } from "@/components/ui/label";

interface DateRangePickerProps {
	label: string;
	value: DateRange;
	onChange: (range: DateRange) => void;
}

function SingleDateRangePicker({
	label,
	value,
	onChange,
}: DateRangePickerProps) {
	const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>(
		value
	);

	const handleSelect = (range: DateRange | undefined) => {
		if (range) {
			setTempDateRange(range);
		}
	};

	const handleOpenChange = (open: boolean) => {
		if (!open && tempDateRange?.from && tempDateRange?.to) {
			onChange({
				from: tempDateRange.from,
				to: tempDateRange.to,
			});
		}
	};

	return (
		<div className='grid gap-2'>
			<Label>{label}</Label>
			<Popover onOpenChange={handleOpenChange}>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className='w-full justify-start text-left font-normal'
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{value?.from ? (
							value.to ? (
								<>
									{format(value.from, "LLL dd, y")} -{" "}
									{format(value.to, "LLL dd, y")}
								</>
							) : (
								format(value.from, "LLL dd, y")
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
						defaultMonth={value?.from}
						selected={tempDateRange}
						onSelect={handleSelect}
						numberOfMonths={1}
						className='md:hidden'
					/>
					<Calendar
						initialFocus
						mode='range'
						defaultMonth={value?.from}
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

export function DualDateRangePicker() {
	const {
		currentPeriod,
		comparablePeriod,
		setCurrentPeriod,
		setComparablePeriod,
	} = useDateRange();

	return (
		<div className='flex flex-col md:flex-row gap-4'>
			<div className='w-full md:w-[250px]'>
				<SingleDateRangePicker
					label='Current Period'
					value={currentPeriod}
					onChange={setCurrentPeriod}
				/>
			</div>
			<div className='w-full md:w-[250px]'>
				<SingleDateRangePicker
					label='Comparable Period'
					value={comparablePeriod}
					onChange={setComparablePeriod}
				/>
			</div>
		</div>
	);
}
