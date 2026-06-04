"use client";

import { useCallback, useMemo } from "react";
import type { LawsuitDraftData } from "../stores/draft.store";
import { useDraftStore } from "../stores/draft.store";

export function useActiveDraft() {
	const activeDraftId = useDraftStore((state) => state.activeDraftId);
	const getActiveDraft = useDraftStore((state) => state.getActiveDraft);
	const setActiveDraft = useDraftStore((state) => state.setActiveDraft);
	const updateDraft = useDraftStore((state) => state.updateDraft);
	const saveDraft = useDraftStore((state) => state.saveDraft);

	// Recalculate activeDraft when activeDraftId changes
	const activeDraft = useMemo(() => {
		return getActiveDraft();
	}, [activeDraftId, getActiveDraft]);

	// Call getActiveDraft() fresh each time to ensure current value
	const saveOrUpdateActiveDraft = useCallback(
		(data: LawsuitDraftData) => {
			const current = getActiveDraft();
			if (current) {
				updateDraft(current.id, data);
				return current.id;
			}
			return saveDraft(data);
		},
		[getActiveDraft, updateDraft, saveDraft],
	);

	return {
		activeDraftId,
		activeDraft,
		setActiveDraft,
		saveOrUpdateActiveDraft,
		updateDraft,
		saveDraft,
	};
}
