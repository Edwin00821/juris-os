"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface LawsuitDraftData {
	title: string;
	description: string;
	category: string;
	incidentDate: string;
	counterpartyName: string;
	counterpartyAddress: string;
	counterpartyId: string;
}

export interface LawsuitDraft extends LawsuitDraftData {
	id: string;
	savedAt: number;
}

interface DraftStore {
	drafts: LawsuitDraft[];
	activeDraftId: string | null;

	// Actions
	saveDraft: (data: LawsuitDraftData) => string;
	updateDraft: (id: string, data: Partial<LawsuitDraftData>) => void;
	loadDraft: (id: string) => LawsuitDraft | null;
	deleteDraft: (id: string) => void;
	setActiveDraft: (id: string | null) => void;
	getActiveDraft: () => LawsuitDraft | null;
	clearAllDrafts: () => void;
}

export const useDraftStore = create<DraftStore>()(
	persist(
		(set, get) => ({
			drafts: [],
			activeDraftId: null,

			saveDraft: (data: LawsuitDraftData) => {
				const draftId = Math.random().toString(36).substring(2, 11);
				const newDraft: LawsuitDraft = {
					...data,
					id: draftId,
					savedAt: Date.now(),
				};

				set((state) => ({
					drafts: [...state.drafts, newDraft],
					activeDraftId: draftId,
				}));

				return draftId;
			},

			updateDraft: (id: string, data: Partial<LawsuitDraftData>) => {
				set((state) => ({
					drafts: state.drafts.map((draft) =>
						draft.id === id
							? { ...draft, ...data, savedAt: Date.now() }
							: draft,
					),
				}));
			},

			loadDraft: (id: string) => {
				const draft = get().drafts.find((d) => d.id === id);
				return draft || null;
			},

			deleteDraft: (id: string) => {
				set((state) => ({
					drafts: state.drafts.filter((d) => d.id !== id),
					activeDraftId:
						state.activeDraftId === id ? null : state.activeDraftId,
				}));
			},

			setActiveDraft: (id: string | null) => {
				set({ activeDraftId: id });
			},

			getActiveDraft: () => {
				const { drafts, activeDraftId } = get();
				if (!activeDraftId) return null;
				return drafts.find((d) => d.id === activeDraftId) || null;
			},

			clearAllDrafts: () => {
				set({ drafts: [], activeDraftId: null });
			},
		}),
		{
			name: "lawsuit-drafts-store",
		},
	),
);
