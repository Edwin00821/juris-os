import { useEffect, useRef, useState } from "react";

export type MessageRole = "bot" | "user";

export interface ChatMessage {
	id: string;
	role: MessageRole;
	text: string;
	timestamp: string;
}

const INITIAL_MESSAGE: ChatMessage = {
	id: "msg-0",
	role: "bot",
	text: "¡Hola! Soy su asistente legal con IA. Le ayudaré a redactar su demanda paso a paso.\n\nPara comenzar, **¿podría describir brevemente qué sucedió?** Cuénteme los hechos en sus propias palabras.",
	timestamp: "Ahora",
};

export function useAICopilot() {
	const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
	const [isTyping, setIsTyping] = useState(false);
	const [inputText, setInputText] = useState("");
	const [progress, setProgress] = useState(0);

	const chatContainerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages, isTyping]);

	const sendMessage = async (text: string) => {
		if (!text.trim()) return;

		const userMsg: ChatMessage = {
			id: `msg-${Date.now()}`,
			role: "user",
			text: text.trim(),
			timestamp: new Date().toLocaleTimeString("es", {
				hour: "2-digit",
				minute: "2-digit",
			}),
		};

		setMessages((prev) => [...prev, userMsg]);
		setInputText("");
		setIsTyping(true);

		setTimeout(() => {
			const botMsg: ChatMessage = {
				id: `msg-${Date.now() + 1}`,
				role: "bot",
				text: "Entiendo. ¿Podría indicarme la fecha aproximada en que ocurrieron estos hechos y si tiene algún documento que lo respalde?",
				timestamp: new Date().toLocaleTimeString("es", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			};
			setMessages((prev) => [...prev, botMsg]);
			setIsTyping(false);
			setProgress((p) => Math.min(p + 20, 100));
		}, 1500);
	};

	const resetChat = () => {
		setMessages([
			{
				...INITIAL_MESSAGE,
				timestamp: new Date().toLocaleTimeString("es", {
					hour: "2-digit",
					minute: "2-digit",
				}),
			},
		]);
		setProgress(0);
	};

	return {
		messages,
		isTyping,
		inputText,
		setInputText,
		sendMessage,
		resetChat,
		progress,
		chatContainerRef,
	};
}
