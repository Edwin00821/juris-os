"use client";

import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import type { Document } from "@/modules/documents/types";
import type { ChatMessage, ResolutionQABlock } from "../types";

interface CopilotApiResponse {
	success: true;
	data: {
		answer: string;
		refs: string[];
	};
}

function buildWelcomeMessage(
	docCount: number,
	caseNumber: string,
): ChatMessage {
	return {
		id: "welcome",
		role: "ai",
		text:
			docCount > 0
				? `He analizado <strong>${docCount} documento(s)</strong> del expediente <strong>${caseNumber}</strong>. Puedo responder preguntas específicas sobre el caso, buscar precedentes y redactar los hallazgos directamente en el documento de resolución. ¿Por dónde empezamos?`
				: `He cargado el expediente <strong>${caseNumber}</strong>. Aún no hay documentos analizados, pero puedo ayudarte con preguntas generales sobre el caso. ¿Por dónde empezamos?`,
	};
}

export function useCopilot(
	caseNumber: string,
	documents: Document[],
	onAddToDoc: (block: ResolutionQABlock) => void,
) {
	const [messages, setMessages] = useState<ChatMessage[]>(() => [
		buildWelcomeMessage(documents.length, caseNumber),
	]);
	const [input, setInput] = useState("");
	const [isTyping, setIsTyping] = useState(false);

	async function sendMessage() {
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

		try {
			const response = await apiClient<CopilotApiResponse>("/ai/copilot", {
				method: "POST",
				body: JSON.stringify({ caseNumber, question: text }),
			});

			const { answer, refs } = response.data;
			const aiMsg: ChatMessage = {
				id: (Date.now() + 1).toString(),
				role: "ai",
				text: answer,
				refs: refs.length > 0 ? refs : undefined,
			};

			setMessages((prev) => [...prev, aiMsg]);

			onAddToDoc({
				id: aiMsg.id,
				question: text,
				answer,
				refs,
			});
		} catch {
			const errorMsg: ChatMessage = {
				id: (Date.now() + 1).toString(),
				role: "ai",
				text: "Ocurrió un error al consultar el expediente. Inténtalo de nuevo.",
			};
			setMessages((prev) => [...prev, errorMsg]);
		} finally {
			setIsTyping(false);
		}
	}

	return { messages, input, setInput, isTyping, sendMessage };
}
