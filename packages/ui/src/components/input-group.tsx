"use client";

import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "../lib/utils";
import { Input } from "./input";
import { Textarea } from "./textarea";

function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="input-group"
			className={cn(
				"group/input-group relative flex w-full items-center",
				className,
			)}
			{...props}
		/>
	);
}

const inputGroupAddonVariants = cva(
	"absolute top-1/2 z-10 flex -translate-y-1/2 items-center justify-center text-on-surface-variant [&>svg:not([class*='size-'])]:size-5",
	{
		variants: {
			align: {
				"inline-start": "left-4",
				"inline-end": "right-4",
				"block-start": "",
				"block-end": "",
			},
		},
		defaultVariants: {
			align: "inline-start",
		},
	},
);

function InputGroupAddon({
	className,
	align = "inline-start",
	...props
}: React.ComponentProps<"div"> & VariantProps<typeof inputGroupAddonVariants>) {
	return (
		<div
			data-slot="input-group-addon"
			data-align={align}
			className={cn(inputGroupAddonVariants({ align }), className)}
			{...props}
		/>
	);
}

function InputGroupButton({
	className,
	type = "button",
	...props
}: React.ComponentProps<"button">) {
	return (
		<button
			type={type}
			className={cn(
				"flex items-center justify-center rounded-full p-1 text-on-surface-variant transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
				className,
			)}
			{...props}
		/>
	);
}

function InputGroupText({ className, ...props }: React.ComponentProps<"span">) {
	return (
		<span
			className={cn(
				"flex items-center gap-2 text-on-surface-variant text-sm [&_svg:not([class*='size-'])]:size-5",
				className,
			)}
			{...props}
		/>
	);
}

function InputGroupInput({
	className,
	...props
}: React.ComponentProps<"input">) {
	return (
		<Input
			data-slot="input-group-control"
			className={cn(
				"bg-surface-container-highest placeholder:text-on-surface-variant/50",
				"group-has-data-[align=inline-start]/input-group:pl-12",
				"group-has-data-[align=inline-end]/input-group:pr-12",
				className,
			)}
			{...props}
		/>
	);
}

function InputGroupTextarea({
	className,
	...props
}: React.ComponentProps<"textarea">) {
	return (
		<Textarea
			data-slot="input-group-control"
			className={cn(
				"bg-surface-container-highest placeholder:text-on-surface-variant/50 group-has-data-[align=inline-end]/input-group:pr-12 group-has-data-[align=inline-start]/input-group:pl-12",
				className,
			)}
			{...props}
		/>
	);
}

export {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
};
