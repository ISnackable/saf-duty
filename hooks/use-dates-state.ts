import { addDays } from "date-fns";
import { useState } from "react";
import { type DateRange, type DaySelectionMode } from "react-day-picker";

export type DateState = Date | Date[] | DateRange | undefined;
type ObjectType<T> = T extends "single"
	? Date | undefined
	: T extends "multiple"
	  ? Date[] | undefined
	  : T extends "range"
		  ? DateRange | undefined
		  : never;

export function useDateState<T extends DaySelectionMode>(
	mode: T,
): [ObjectType<T>, (newDate: ObjectType<T>) => void] {
	const [date, setDate] = useState<ObjectType<T>>(() => {
		switch (mode) {
			case "single":
				return new Date() as ObjectType<T>;
			case "range":
				return {
					from: new Date(),
					to: addDays(new Date(), 5),
				} as ObjectType<T>;
			case "multiple":
				return [new Date(), addDays(new Date(), 5)] as ObjectType<T>;
			default:
				return undefined as ObjectType<T>;
		}
	});

	const setDateState = (newDate: ObjectType<T>) => {
		if (typeof newDate !== "undefined") {
			setDate(newDate);
		}
	};

	return [date, setDateState];
}
