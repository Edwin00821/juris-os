"use client";

import { cn } from "@juris-os/ui/lib/utils";
import { Send, Sparkles, User } from "lucide-react";
import { useEffect, useRef } from "react";
import type { Document } from "@/modules/documents/types";
import { useCopilot } from "../hooks/use-copilot";
import { renderMarkdown } from "../lib/markdown-renderer";
import type { ResolutionQABlock } from "../types";

interface JudicialCopilotProps {
	caseNumber: string;
	documents: Document[];
	onAddToDoc: (block: ResolutionQABlock) => void;
}

export function JudicialCopilot({
	caseNumber,
	documents,
	onAddToDoc,
}: JudicialCopilotProps) {
	const { messages, input, setInput, isTyping, sendMessage } = useCopilot(
		caseNumber,
		documents,
		onAddToDoc,
	);
	const scrollRef = useRef<HTMLDivElement>(null);

	// biome-ignore lint/correctness/useExhaustiveDependencies: messages/isTyping are scroll triggers
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages, isTyping]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden bg-white">
			<div className="flex items-center gap-2 border-slate-100 border-b bg-slate-50/60 px-6 py-3">
				<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#002045]">
					<Sparkles className="h-3.5 w-3.5 text-white" />
				</div>
				<div className="flex-1">
					<p className="font-bold text-[#002045] text-xs">
						Copiloto Judicial — Análisis de Expedientes
					</p>
					<p className="text-[10px] text-slate-500">
						{documents.length > 0
							? `${documents.length} documento(s) analizados · Claude AI`
							: "Sin documentos · Claude AI"}
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
											— búsqueda completada
										</span>
									)}
								</p>
							)}
							<div
								className="space-y-1"
								// biome-ignore lint/security/noDangerouslySetInnerHtml: controlled AI responses
								dangerouslySetInnerHTML={{
									__html: renderMarkdown(msg.text),
								}}
							/>
							{msg.refs && msg.refs.length > 0 && (
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
							{msg.role === "ai" && msg.id !== "welcome" && (
								<p className="mt-2 flex items-center gap-1 font-bold text-[10px] text-emerald-700">
									<span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
									Agregado al documento de resolución
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
							void sendMessage();
						}
					}}
					className="flex-1 resize-none rounded-xl border-none bg-slate-50 p-3 text-sm placeholder:text-slate-400 focus:ring-2 focus:ring-[#002045]"
					placeholder="Pregunta algo sobre el expediente..."
				/>
				<button
					type="button"
					onClick={() => void sendMessage()}
					disabled={isTyping || !input.trim()}
					className="shrink-0 rounded-xl bg-[#002045] p-3 text-white shadow-md transition-opacity hover:opacity-90 disabled:opacity-40"
				>
					<Send className="h-4 w-4" />
				</button>
			</div>
		</div>
	);
}
