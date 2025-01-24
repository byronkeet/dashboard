"use client";

import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useDateRange } from "@/lib/context/date-range-context";
import { DateRange } from "@/lib/types";

export function DateRangePicker() {
  const { dateRange, setDateRange } = useDateRange();

  // Handle date selection
  const handleSelect = (range: DateRange | undefined) => {
    if (range) {
      // If we have a from date but no to date, keep the selection open
      if (range.from && !range.to) {
        setDateRange({ from: range.from, to: range.from });
      }
      // If we have both dates, update the range
      else if (range.from && range.to) {
        setDateRange({ from: range.from, to: range.to });
      }
    }
  };

  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className="w-full md:w-[300px] justify-start text-left font-normal"
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
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
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={1}
            className="md:hidden"
          />
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            className="hidden md:block"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}