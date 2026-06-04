"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useDraftStore } from "../stores/draft.store";

export function useLoadDraftFromUrl() {
	const searchParams = useSearchParams();
	const draftId = searchParams.get("draftId");
	const loadDraft = useDraftStore((state) => state.loadDraft);
	const setActiveDraft = useDraftStore((state) => state.setActiveDraft);

	useEffect(() => {
		if (draftId) {
			const draft = loadDraft(draftId);
			if (draft) {
				setActiveDraft(draftId);
			}
		} else {
			// Clear active draft if no draftId in URL
			setActiveDraft(null);
		}
	}, [draftId, loadDraft, setActiveDraft]);
}
