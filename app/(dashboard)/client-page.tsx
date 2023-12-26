"use client";

import { ComboBox, Item } from "@/components/combo-box";
import { DatePicker } from "@/components/date-picker";
import { Modal } from "@/components/modal";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import { CalendarIcon } from "lucide-react";
import * as React from "react";

const statuses = [
	{
		value: "backlog",
		label: "Backlog",
		icon: CalendarIcon,
	},
	{
		value: "todo",
		label: "Todo",
		icon: AvatarIcon,
	},
	{
		value: "in progress",
		label: "In Progress",
	},
	{
		value: "done",
		label: "Done",
	},
	{
		value: "canceled",
		label: "Canceled",
	},
];

function AvatarIcon() {
	return (
		<Avatar className="w-8 h-8 mr-2">
			<AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
			<AvatarFallback>CN</AvatarFallback>
		</Avatar>
	);
}

export function ClienTestPage() {
	const [date, setDate] = React.useState([new Date()]);
	const [selected, setSelected] = React.useState<Item | null>(null);

	return (
		<div>
			<ThemeSwitcher />

			<DatePicker mode="multiple" value={date} onChange={setDate} />

			<Modal
				title="Testing"
				description="This is a test modal."
				trigger={
					<Button variant="outline" className="w-fit align-middle leading-none">
						Click me
					</Button>
				}
			>
				<form className={cn("grid items-start gap-4")}>
					<div className="grid gap-2">
						<Label htmlFor="email">Email</Label>
						<Input type="email" id="email" defaultValue="shadcn@example.com" />
					</div>
					<div className="grid gap-2">
						<Label htmlFor="username">Username</Label>
						<Input id="username" defaultValue="@shadcn" />
					</div>
					<Button type="submit">Save changes</Button>
				</form>
			</Modal>

			<ComboBox
				items={statuses}
				selected={selected}
				onSelect={setSelected}
				searchable
			/>
		</div>
	);
}
