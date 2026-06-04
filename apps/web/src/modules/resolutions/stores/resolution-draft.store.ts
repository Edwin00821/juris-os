"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

// Action chosen in the CaseStatusSelector while drafting the sentence.
export type ResolutionAction = "PENDING_RESOLUTION" | "CLOSED" | null;

export interface ResolutionDraft {
	content: string; // editor HTML of the sentence body
	action: ResolutionAction;
	savedAt: number;
}

interface ResolutionDraftStore {
	// Keyed by caseNumber (e.g. CIV-2025-0001) — one draft per case.
	drafts: Record<string, ResolutionDraft>;

	saveDraft: (
		caseNumber: string,
		data: { content: string; action: ResolutionAction },
	) => void;
	setAction: (caseNumber: string, action: ResolutionAction) => void;
	getDraft: (caseNumber: string) => ResolutionDraft | null;
	clearDraft: (caseNumber: string) => void;
}

export const useResolutionDraftStore = create<ResolutionDraftStore>()(
	persist(
		(set, get) => ({
			drafts: {},

			saveDraft: (caseNumber, data) => {
				set((state) => ({
					drafts: {
						...state.drafts,
						[caseNumber]: { ...data, savedAt: Date.now() },
					},
				}));
			},

			setAction: (caseNumber, action) => {
				set((state) => {
					const existing = state.drafts[caseNumber];
					return {
						drafts: {
							...state.drafts,
							[caseNumber]: {
								content: existing?.content ?? "",
								action,
								savedAt: existing?.savedAt ?? Date.now(),
							},
						},
					};
				});
			},

			getDraft: (caseNumber) => get().drafts[caseNumber] ?? null,

			clearDraft: (caseNumber) => {
				set((state) => {
					const { [caseNumber]: _removed, ...rest } = state.drafts;
					return { drafts: rest };
				});
			},
		}),
		{
			name: "resolution-drafts-store",
		},
	),
);
