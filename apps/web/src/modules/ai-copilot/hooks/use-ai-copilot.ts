"use client";

import { useQueryClient } from "@tanstack/react-query";
import { jsPDF } from "jspdf";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { apiClient } from "@/lib/api-client";
import { authClient } from "@/lib/auth-client";
import { uploadFiles } from "@/lib/uploadthing";
import { useDraftStore } from "@/modules/cases/stores/draft.store";

export type MessageRole = "bot" | "user";

export interface ChatMessage {
	id: string;
	role: MessageRole;
	text: string;
	timestamp: string;
}

export interface CaseData {
	title: string | null;
	description: string | null;
	category: string | null;
	incidentDate: string | null;
	counterpartyName: string | null;
	legalBasis: string | null;
	claims: string | null;
}

interface DraftAssistApiResponse {
	success: true;
	data: {
		reply: string;
		caseData: CaseData;
		progress: number;
	};
}

interface CaseApiResponse {
	success: true;
	data: { uuid: string; id: string };
}

interface GenerateDocumentApiResponse {
	success: true;
	data: { document: string };
}

type Counterparty = { name: string; address: string; id: string };

/** Renders the lawsuit markdown into a paginated A4 jsPDF document. */
function buildPdfDoc(markdown: string): jsPDF {
	const doc = new jsPDF({ unit: "pt", format: "a4" });
	const margin = 56;
	const pageHeight = doc.internal.pageSize.getHeight();
	const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
	let y = margin;

	for (const rawLine of markdown.split("\n")) {
		const line = rawLine.trimEnd();
		const isHeading = line.startsWith("#");
		const text = line
			.replace(/^#+\s*/, "")
			.replace(/\*\*/g, "")
			.replace(/^[-*]\s+/, "•  ");

		if (!text) {
			y += 8;
			continue;
		}

		doc.setFont("times", isHeading ? "bold" : "normal");
		doc.setFontSize(isHeading ? 14 : 11);
		const lineHeight = isHeading ? 20 : 16;

		for (const wrapped of doc.splitTextToSize(text, maxWidth) as string[]) {
			if (y > pageHeight - margin) {
				doc.addPage();
				y = margin;
			}
			doc.text(wrapped, margin, y);
			y += lineHeight;
		}
	}

	return doc;
}

const INITIAL_MESSAGE: ChatMessage = {
	id: "msg-0",
	role: "bot",
	text: "¡Hola! Soy su asistente legal con IA. Le ayudaré a redactar su demanda paso a paso.\n\nPara comenzar, **¿podría describir brevemente qué sucedió?** Cuénteme los hechos en sus propias palabras.",
	timestamp: "Ahora",
};

const EMPTY_CASE_DATA: CaseData = {
	title: null,
	description: null,
	category: null,
	incidentDate: null,
	counterpartyName: null,
	legalBasis: null,
	claims: null,
};

function now() {
	return new Date().toLocaleTimeString("es", {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function useAICopilot() {
	const router = useRouter();
	const queryClient = useQueryClient();
	const { data: session } = authClient.useSession();
	const saveDraftToStore = useDraftStore((s) => s.saveDraft);

	const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
	const [isTyping, setIsTyping] = useState(false);
	const [inputText, setInputText] = useState("");
	const [progress, setProgress] = useState(0);
	const [caseData, setCaseData] = useState<CaseData>(EMPTY_CASE_DATA);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [submitError, setSubmitError] = useState<string | null>(null);

	const [generatedDocument, setGeneratedDocument] = useState<string | null>(
		null,
	);
	const [isGenerating, setIsGenerating] = useState(false);
	const [generateError, setGenerateError] = useState<string | null>(null);

	const chatContainerRef = useRef<HTMLDivElement>(null);
	const pendingFilesRef = useRef<File[]>([]);
	const counterpartyRef = useRef<Counterparty>({
		name: "",
		address: "",
		id: "",
	});

	const plaintiff = {
		name: session?.user?.name ?? null,
		email: session?.user?.email ?? null,
	};

	const canGenerate = Boolean(
		caseData.title && caseData.description && caseData.claims,
	);

	const setPendingFiles = (files: File[]) => {
		pendingFilesRef.current = files;
	};

	const setCounterparty = (counterparty: Counterparty) => {
		counterpartyRef.current = counterparty;
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: messages/isTyping are used as scroll triggers
	useEffect(() => {
		if (chatContainerRef.current) {
			chatContainerRef.current.scrollTop =
				chatContainerRef.current.scrollHeight;
		}
	}, [messages, isTyping]);

	const sendMessage = async (text: string) => {
		if (!text.trim() || isTyping) return;

		const userMsg: ChatMessage = {
			id: `msg-${Date.now()}`,
			role: "user",
			text: text.trim(),
			timestamp: now(),
		};

		const nextMessages = [...messages, userMsg];
		setMessages(nextMessages);
		setInputText("");
		setIsTyping(true);

		try {
			const response = await apiClient<DraftAssistApiResponse>(
				"/ai/draft-assist",
				{
					method: "POST",
					body: JSON.stringify({
						messages: nextMessages
							.filter((m) => m.id !== "msg-0")
							.map((m) => ({ role: m.role, text: m.text })),
					}),
				},
			);

			const { reply, caseData: newData, progress: newProgress } = response.data;

			setMessages((prev) => [
				...prev,
				{
					id: `msg-${Date.now() + 1}`,
					role: "bot",
					text: reply,
					timestamp: now(),
				},
			]);

			setCaseData((prev) => ({
				...prev,
				...Object.fromEntries(
					Object.entries(newData).filter(([, v]) => v !== null),
				),
			}));
			setProgress(newProgress);
		} catch {
			setMessages((prev) => [
				...prev,
				{
					id: `msg-${Date.now() + 1}`,
					role: "bot",
					text: "Lo siento, ocurrió un error al procesar su mensaje. Por favor intente de nuevo.",
					timestamp: now(),
				},
			]);
		} finally {
			setIsTyping(false);
		}
	};

	const resetChat = () => {
		setMessages([{ ...INITIAL_MESSAGE, timestamp: now() }]);
		setProgress(0);
		setCaseData(EMPTY_CASE_DATA);
		setGeneratedDocument(null);
		setGenerateError(null);
		pendingFilesRef.current = [];
	};

	const generateDocument = async () => {
		if (!canGenerate || isGenerating) return;

		setIsGenerating(true);
		setGenerateError(null);

		try {
			const response = await apiClient<GenerateDocumentApiResponse>(
				"/ai/generate-document",
				{
					method: "POST",
					body: JSON.stringify({
						caseData,
						counterparty: counterpartyRef.current,
						plaintiff: {
							name: plaintiff.name ?? undefined,
							email: plaintiff.email ?? undefined,
						},
					}),
				},
			);
			setGeneratedDocument(response.data.document);
		} catch {
			setGenerateError(
				"No se pudo generar el documento. Intente nuevamente en unos momentos.",
			);
		} finally {
			setIsGenerating(false);
		}
	};

	const copyDocument = async () => {
		if (!generatedDocument) return;
		await navigator.clipboard.writeText(generatedDocument);
	};

	const downloadPdf = () => {
		if (!generatedDocument) return;
		const fileName = `${caseData.title || "demanda"}.pdf`;
		buildPdfDoc(generatedDocument).save(fileName);
	};

	const saveDraft = () => {
		const counterparty = counterpartyRef.current;
		saveDraftToStore({
			title: caseData.title || "",
			description: caseData.description || "",
			category: caseData.category || "",
			incidentDate: caseData.incidentDate || "",
			counterpartyName: counterparty.name || caseData.counterpartyName || "",
			counterpartyAddress: counterparty.address || "",
			counterpartyId: counterparty.id || "",
		});
	};

	const submitCase = async (counterparty: {
		name: string;
		address: string;
		id: string;
	}) => {
		setIsSubmitting(true);
		setSubmitError(null);

		try {
			const response = await apiClient<CaseApiResponse>("/cases", {
				method: "POST",
				body: JSON.stringify({
					title: caseData.title || "Demanda sin título",
					description: caseData.description || "",
					category: caseData.category || "labor",
					incidentDate:
						caseData.incidentDate || new Date().toISOString().split("T")[0],
					counterpartyName:
						counterparty.name || caseData.counterpartyName || "",
					counterpartyAddress: counterparty.address,
					counterpartyId: counterparty.id,
				}),
			});

			const caseUuid = response.data.uuid;

			if (caseUuid && generatedDocument) {
				const pdfBlob = buildPdfDoc(generatedDocument).output("blob");
				const pdfFile = new File(
					[pdfBlob],
					`${caseData.title || "demanda"}.pdf`,
					{ type: "application/pdf" },
				);
				const [uploaded] = await uploadFiles("caseDocumentUploader", {
					files: [pdfFile],
				});
				if (uploaded) {
					await apiClient("/documents", {
						method: "POST",
						body: JSON.stringify({
							caseId: caseUuid,
							fileName: uploaded.name,
							fileType: uploaded.type || "application/pdf",
							storageKey: uploaded.key,
							fileUrl: uploaded.ufsUrl,
							documentType: "brief",
						}),
					});
				}
			}

			const files = pendingFilesRef.current;

			if (files.length > 0 && caseUuid) {
				const uploaded = await uploadFiles("caseDocumentUploader", { files });
				await Promise.all(
					uploaded.map((file) =>
						apiClient("/documents", {
							method: "POST",
							body: JSON.stringify({
								caseId: caseUuid,
								fileName: file.name,
								fileType: file.type || "application/octet-stream",
								storageKey: file.key,
								fileUrl: file.ufsUrl,
								documentType: "evidence",
							}),
						}),
					),
				);
			}

			await queryClient.invalidateQueries({ queryKey: ["active-cases"] });
			router.push("/citizen");
			router.refresh();
		} catch {
			setSubmitError(
				"Ocurrió un error al registrar la demanda. Intente nuevamente.",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		messages,
		isTyping,
		inputText,
		setInputText,
		sendMessage,
		resetChat,
		progress,
		caseData,
		chatContainerRef,
		setPendingFiles,
		setCounterparty,
		isSubmitting,
		submitError,
		submitCase,
		plaintiff,
		canGenerate,
		generatedDocument,
		isGenerating,
		generateError,
		generateDocument,
		copyDocument,
		downloadPdf,
		saveDraft,
	};
}
