"use client";

import { cn } from "@juris-os/ui/lib/utils";
import { Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
	AI_FALLBACK,
	AI_RESPONSES,
	INITIAL_CHAT_MESSAGES,
} from "../hooks/use-copilot";
import type { ChatMessage, ResolutionQABlock } from "../types";

interface JudicialCopilotProps {
	onAddToDoc: (block: ResolutionQABlock) => void;
}

export function JudicialCopilot({ onAddToDoc }: JudicialCopilotProps) {
	const [messages, setMessages] = useState<ChatMessage[]>(
		INITIAL_CHAT_MESSAGES,
	);
	const [input, setInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);
	const scrollRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: messages/isTyping are used as scroll triggers
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages, isTyping]);

	function sendMessage() {
		const text = input.trim();
		if (!text || isTyping) return;
		setInput("");

		const userMsg: ChatMessage = {
			id: Date.now().toString(),
			role: "user",
			text,
		};
		setMessages((prev) => [...prev, userMsg]);
		setIsTyping(true);

		const delay = 1400 + Math.random() * 600;
		setTimeout(() => {
			const match = AI_RESPONSES.find((r) => r.pattern.test(text));
			const response = match ?? AI_FALLBACK;

			const aiMsg: ChatMessage = {
				id: (Date.now() + 1).toString(),
				role: "ai",
				text: response.answer,
				refs: response.refs,
				addedToDoc: true,
			};
			setMessages((prev) => [...prev, aiMsg]);
			setIsTyping(false);

			onAddToDoc({
				id: aiMsg.id,
				question: text,
				answer: response.docSummary,
				refs: response.refs,
			});
		}, delay);
	}

	return (
		<div
			className="flex flex-col border-slate-200 border-b bg-white"
			style={{ height: 380 }}
		>
			<div className="flex items-center gap-2 border-slate-100 border-b bg-slate-50/60 px-6 py-3">
				<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#002045]">
					<Sparkles className="h-3.5 w-3.5 text-white" />
				</div>
				<div className="flex-1">
					<p className="font-bold text-[#002045] text-xs">
						Copiloto Judicial — Búsqueda Semántica
					</p>
					<p className="text-[10px] text-slate-500">
						Indaga en los documentos del expediente y redacta automáticamente.
					</p>
				</div>
				<div className="flex items-center gap-1.5">
					<span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
					<span className="font-bold text-[10px] text-emerald-700">Activo</span>
				</div>
			</div>

			<div
				ref={scrollRef}
				className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-4"
			>
				{messages.map((msg) => (
					<div
						key={msg.id}
						className={cn(
							"flex items-start gap-3",
							msg.role === "user" && "justify-end",
						)}
					>
						{msg.role === "ai" && (
							<div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#002045]">
								<Sparkles className="h-3 w-3 text-white" />
							</div>
						)}
						<div
							className={cn(
								"max-w-[85%] px-4 py-3 text-sm",
								msg.role === "ai"
									? "rounded-[0_12px_12px_12px] bg-slate-100 text-slate-800"
									: "rounded-[12px_0_12px_12px] bg-[#002045] text-white",
							)}
						>
							{msg.role === "ai" && (
								<p className="mb-1.5 font-bold text-[#002045] text-xs">
									Copiloto Judicial{" "}
									{msg.id !== "welcome" && (
										<span className="font-normal text-[10px] text-slate-400">
											— búsqueda semántica completada
										</span>
									)}
								</p>
							)}
							<p
								className="leading-relaxed"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: controlled AI responses
								dangerouslySetInnerHTML={{ __html: msg.text }}
							/>
							{msg.refs && (
								<div className="mt-2 flex flex-wrap gap-1.5">
									{msg.refs.map((ref) => (
										<span
											key={ref}
											className="rounded bg-[#d6e3ff] px-2 py-0.5 font-bold text-[#002045] text-[10px]"
										>
											{ref}
										</span>
									))}
								</div>
							)}
							{msg.addedToDoc && (
								<p className="mt-2 flex items-center gap-1 font-bold text-[10px] text-emerald-700">
									<span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
									Añadido al documento de resolución
								</p>
							)}
						</div>
						{msg.role === "user" && (
							<div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#d6e3ff]">
								<User className="h-3 w-3 text-[#002045]" />
							</div>
						)}
					</div>
				))}

				{isTyping && (
					<div className="flex items-start gap-3">
						<div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#002045]">
							<Sparkles className="h-3 w-3 text-white" />
						</div>
						<div className="flex items-center gap-1 rounded-[0_12px_12px_12px] bg-slate-100 px-4 py-3">
							{[0, 200, 400].map((delay) => (
								<span
									key={delay}
									className="h-2 w-2 animate-bounce rounded-full bg-slate-400"
									style={{ animationDelay: `${delay}ms` }}
								/>
							))}
						</div>
					</div>
				)}
			</div>

			<div className="flex items-end gap-3 border-slate-100 border-t bg-white px-6 py-3">
				<textarea
					rows={1}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							sendMessage();
						}
					}}
					className="flex-1 resize-none rounded-xl border-none bg-slate-50 p-3 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-[#002045]"
					placeholder="Pregunta algo sobre el expediente..."
				/>
				<button
					type="button"
					onClick={sendMessage}
					disabled={isTyping || !input.trim()}
					className="shrink-0 rounded-xl bg-[#002045] p-3 text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-40"
				>
					<Send className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
