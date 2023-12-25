"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { addDays, format } from "date-fns";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerFooter,
	DrawerHeader,
	DrawerTrigger,
} from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { DateState, useDateState } from "@/hooks/use-dates-state";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/utils/cn";
import { type DateRange, type DaySelectionMode } from "react-day-picker";

function formatDate(mode: DaySelectionMode, date: DateState) {
	if (mode === "single" && date instanceof Date) {
		return format(date as Date, "PPP");
		// biome-ignore lint/style/noUselessElse: <explanation>
	} else if (mode === "multiple" && Array.isArray(date)) {
		// Assuming date is an array of Date objects
		const dates = date as Date[];
		return dates.map((date) => format(date, "PP")).join(", ");

		// biome-ignore lint/style/noUselessElse: <explanation>
	} else if (mode === "range" && date instanceof Object) {
		// Assuming date is an object with 'from' and 'to' Date properties
		const range = date as DateRange;

		if (range?.from) {
			if (range.to) {
				return `${format(range.from, "LLL dd, y")} - ${format(
					range.to,
					"LLL dd, y",
				)}`;
			}

			return format(range.from, "LLL dd, y");
		}
	} else {
		return <span>Pick a date</span>;
	}
}

export function DatePicker({ mode = "single" }: { mode: DaySelectionMode }) {
	const [open, setOpen] = React.useState(false);
	const [date, setDate] = useDateState(mode);

	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant={"outline"}
						className={cn(
							"w-[240px] justify-start text-left h-fit font-normal whitespace-normal break-normal",
							!date && "text-muted-foreground",
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{formatDate(mode, date)}
					</Button>
				</PopoverTrigger>
				<PopoverContent
					align="start"
					className="flex w-auto flex-col space-y-2 p-2"
				>
					{mode === "single" ? (
						<Select
							onValueChange={(value) =>
								setDate(addDays(new Date(), parseInt(value)))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectItem value="0">Today</SelectItem>
								<SelectItem value="1">Tomorrow</SelectItem>
								<SelectItem value="3">In 3 days</SelectItem>
								<SelectItem value="7">In a week</SelectItem>
							</SelectContent>
						</Select>
					) : null}

					<div className="rounded-md border">
						{/* @ts-ignore */}
						<Calendar
							initialFocus
							mode={mode}
							selected={date}
							onSelect={setDate}
						/>
					</div>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[240px] justify-start text-left h-fit font-normal whitespace-normal break-normal",
						!date && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{formatDate(mode, date)}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				{mode === "single" ? (
					<DrawerHeader className="text-left">
						<Select
							onValueChange={(value) =>
								setDate(addDays(new Date(), parseInt(value)))
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select" />
							</SelectTrigger>
							<SelectContent position="popper">
								<SelectItem value="0">Today</SelectItem>
								<SelectItem value="1">Tomorrow</SelectItem>
								<SelectItem value="3">In 3 days</SelectItem>
								<SelectItem value="7">In a week</SelectItem>
							</SelectContent>
						</Select>
					</DrawerHeader>
				) : null}

				{mode === "single" ? (
					<Calendar
						initialFocus
						mode="single"
						selected={date as Date}
						onSelect={setDate}
					/>
				) : mode === "range" ? (
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={(date as DateRange)?.from}
						selected={date as DateRange}
						onSelect={setDate}
					/>
				) : mode === "multiple" ? (
					<Calendar
						initialFocus
						mode="multiple"
						selected={date as Date[]}
						onSelect={setDate}
					/>
				) : null}

				<DrawerFooter className="pt-2">
					<DrawerClose asChild>
						<Button variant="outline">Cancel</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
}
