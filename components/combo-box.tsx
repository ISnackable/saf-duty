"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
} from "@/components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { useMediaQuery } from "@/hooks/use-media-query";
import { type LucideIcon } from "lucide-react";

export type Item = {
	label: string;
	value: string;
	icon?: LucideIcon | React.ComponentType<React.ComponentProps<"svg">>;
};

interface ComboBoxProps {
	placeholder?: string;
	searchable?: boolean;
	items: Item[];
	selected: Item | null;
	onSelect: (item: Item | null) => void;
}

export function ComboBox({
	placeholder,
	searchable,
	items,
	selected,
	onSelect,
}: ComboBoxProps) {
	const [open, setOpen] = React.useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");

	if (isDesktop) {
		return (
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant="outline"
						aria-expanded={open}
						className="w-[150px] justify-start align-middle"
					>
						{selected ? <>&#x3E; {selected.label}</> : <>+ Pick value</>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-[200px] p-0" align="start">
					<Command>
						{searchable && (
							<CommandInput placeholder={placeholder ?? "Search..."} />
						)}

						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								{items.map((item) => (
									<CommandItem
										key={item.value}
										value={item.value}
										onSelect={(value) => {
											onSelect(
												items.find((priority) => priority.value === value) ||
													null,
											);
											setOpen(false);
										}}
									>
										{item.icon && (
											<item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
										)}
										{item.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</PopoverContent>
			</Popover>
		);
	}

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>
				<Button
					variant="outline"
					className="w-[150px] justify-start align-middle"
				>
					{selected ? <>&#x3E; {selected.label}</> : <>+ Pick value</>}
				</Button>
			</DrawerTrigger>
			<DrawerContent>
				<div className="mt-4 border-t">
					<Command>
						{searchable && (
							<CommandInput placeholder={placeholder ?? "Search..."} />
						)}

						<CommandList>
							<CommandEmpty>No results found.</CommandEmpty>
							<CommandGroup>
								{items.map((item) => (
									<CommandItem
										key={item.value}
										value={item.value}
										onSelect={(value) => {
											onSelect(
												items.find((priority) => priority.value === value) ||
													null,
											);
											setOpen(false);
										}}
									>
										{item.icon && (
											<item.icon className="mr-2 h-4 w-4 text-muted-foreground" />
										)}
										{item.label}
									</CommandItem>
								))}
							</CommandGroup>
						</CommandList>
					</Command>
				</div>
			</DrawerContent>
		</Drawer>
	);
}
