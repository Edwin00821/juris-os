"use client";

import { Button } from "@juris-os/ui/components/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@juris-os/ui/components/card";
import { ScrollArea } from "@juris-os/ui/components/scroll-area";
import { Textarea } from "@juris-os/ui/components/textarea";
import { cn } from "@juris-os/ui/lib/utils";
import { Bot, RefreshCw, Send } from "lucide-react";
import type * as React from "react";
import type { useAICopilot } from "../hooks/use-ai-copilot";

interface AIChatInterfaceProps {
	copilot: ReturnType<typeof useAICopilot>;
	className?: string;
}

export function AIChatInterface({ copilot, className }: AIChatInterfaceProps) {
	const {
		messages,
		isTyping,
		inputText,
		setInputText,
		sendMessage,
		resetChat,
		chatContainerRef,
	} = copilot;

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage(inputText);
		}
	};

	return (
		<Card
			className={cn(
				"flex h-180 flex-col overflow-hidden rounded-xl border-outline-variant bg-surface-container-lowest shadow-sm",
				className,
			)}
		>
			<CardHeader className="flex flex-row items-center gap-3 space-y-0 border-outline-variant border-b bg-surface-container-low px-6 py-4">
				<div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container">
					<Bot className="size-5 text-primary-fixed-dim" />
				</div>
				<div className="flex-1">
					<h3 className="font-bold font-headline text-primary text-sm">
						Asistente Legal IA
					</h3>
					<div className="flex items-center gap-1.5">
						<span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
						<span className="font-bold text-[10px] text-on-surface-variant uppercase tracking-widest">
							En línea
						</span>
					</div>
				</div>
				<Button
					variant="ghost"
					size="icon"
					onClick={resetChat}
					className="size-9 rounded-lg p-1.5 text-on-surface-variant transition-colors hover:bg-surface-container"
					title="Reiniciar conversación"
				>
					<RefreshCw className="size-5" />
				</Button>
			</CardHeader>

			<CardContent className="flex-1 overflow-hidden p-0">
				<ScrollArea ref={chatContainerRef} className="h-full p-6">
					<div className="space-y-4">
						{messages.map((msg) => (
							<div
								key={msg.id}
								className={cn(
									"slide-in-from-bottom-2 flex animate-in items-start gap-3 duration-200",
									msg.role === "user" && "justify-end",
								)}
							>
								{msg.role === "bot" && (
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed">
										<Bot className="size-4 text-primary" />
									</div>
								)}

								<div
									className={cn(
										"max-w-[85%] rounded-xl p-4",
										msg.role === "bot"
											? "rounded-tl-none bg-surface-container text-foreground"
											: "rounded-tr-none bg-primary text-white",
									)}
								>
									<p className="whitespace-pre-wrap text-sm leading-relaxed">
										{msg.text}
									</p>
									<span
										className={cn(
											"mt-2 block font-medium text-[10px]",
											msg.role === "bot"
												? "text-outline"
												: "text-primary-fixed-dim",
										)}
									>
										{msg.timestamp}
									</span>
								</div>
							</div>
						))}

						{isTyping && (
							<div className="fade-in flex animate-in items-start gap-3 duration-200">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed">
									<Bot className="size-4 text-primary" />
								</div>
								<div className="flex h-12 items-center gap-1.5 rounded-xl rounded-tl-none bg-surface-container px-5 py-4">
									<span
										className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant"
										style={{ animationDelay: "0ms" }}
									/>
									<span
										className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant"
										style={{ animationDelay: "150ms" }}
									/>
									<span
										className="h-2 w-2 animate-bounce rounded-full bg-on-surface-variant"
										style={{ animationDelay: "300ms" }}
									/>
								</div>
							</div>
						)}
					</div>
				</ScrollArea>
			</CardContent>

			<CardFooter className="border-outline-variant border-t bg-surface-container-low px-4 py-4">
				<div className="flex w-full items-end gap-3">
					<Textarea
						value={inputText}
						onChange={(e) => setInputText(e.target.value)}
						onKeyDown={handleKeyDown}
						rows={1}
						className="max-h-30 min-h-11 flex-1 resize-none rounded-xl border-none bg-surface-container-highest p-3 text-foreground text-sm focus-visible:ring-2 focus-visible:ring-primary/20"
						placeholder="Escriba su mensaje aquí..."
						style={{ height: inputText ? "auto" : "44px" }}
					/>
					<Button
						type="button"
						onClick={() => sendMessage(inputText)}
						disabled={!inputText.trim() || isTyping}
						size="icon"
						className="h-11 w-11 shrink-0 rounded-xl bg-primary p-3 text-white transition-colors hover:bg-primary/90 disabled:opacity-50"
					>
						<Send className="size-5" />
					</Button>
				</div>
			</CardFooter>
		</Card>
	);
}
