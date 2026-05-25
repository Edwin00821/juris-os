export type BaseEvent<TType extends string, TPayload> = {
	id: string;
	type: TType;
	occurredAt: Date;
	payload: TPayload;
};

export type CaseCreatedEvent = BaseEvent<
	"CaseCreated",
	{
		caseId: string;
		userId: string;
		caseType: string;
		aiMode: "AI_ASSISTED" | "MANUAL";
		title: string;
	}
>;

export type CaseAssignedEvent = BaseEvent<
	"CaseAssigned",
	{
		caseId: string;
		caseNumber: string;
		judgeId: string;
		assignedBy: string;
	}
>;

export type CaseStatusChangedEvent = BaseEvent<
	"CaseStatusChanged",
	{
		caseId: string;
		previousStatus: string;
		newStatus: string;
	}
>;

export type CaseFailedEvent = BaseEvent<
	"CaseFailed",
	{
		caseId: string;
		reason: string;
	}
>;

export type DocumentUploadedEvent = BaseEvent<
	"DocumentUploaded",
	{
		documentId: string;
		caseId: string;
		storageKey: string;
		documentType: string;
	}
>;

export type AiGenerationStartedEvent = BaseEvent<
	"AiGenerationStarted",
	{
		caseId: string;
		prompt: string;
	}
>;

export type AiGenerationCompletedEvent = BaseEvent<
	"AiGenerationCompleted",
	{
		caseId: string;
		documentId: string;
		storageKey: string;
	}
>;

export type AiGenerationFailedEvent = BaseEvent<
	"AiGenerationFailed",
	{
		caseId: string;
		reason: string;
	}
>;

export type DomainEvent =
	| CaseCreatedEvent
	| CaseAssignedEvent
	| CaseStatusChangedEvent
	| CaseFailedEvent
	| DocumentUploadedEvent
	| AiGenerationStartedEvent
	| AiGenerationCompletedEvent
	| AiGenerationFailedEvent;

export type DomainEventType = DomainEvent["type"];
