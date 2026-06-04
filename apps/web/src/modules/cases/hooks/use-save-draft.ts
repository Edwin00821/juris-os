"use client";

import type { LawsuitDraft, LawsuitDraftData } from "../stores/draft.store";
import { useDraftStore } from "../stores/draft.store";

export type { LawsuitDraft, LawsuitDraftData };

export function useSaveDraft() {
	const { saveDraft, updateDraft, loadDraft, deleteDraft, clearAllDrafts } =
		useDraftStore();

	const loadAllDrafts = (): LawsuitDraft[] => {
		return useDraftStore.getState().drafts;
	};

	const loadDraftById = (id: string): LawsuitDraft | null => {
		return loadDraft(id);
	};

	return {
		saveDraft,
		updateDraft,
		loadAllDrafts,
		loadDraftById,
		deleteDraft,
		clearAllDrafts,
	};
}
