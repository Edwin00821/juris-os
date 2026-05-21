import type { DomainEvent, DomainEventType } from "./event-types";

type EventHandler<T extends DomainEvent> = (event: T) => Promise<void>;

// In-memory event bus for inter-module communication.
// Modules emit domain events without direct references to each other.
// Handlers run in parallel via Promise.allSettled — one failure doesn't block others.
class EventBus {
	// biome-ignore lint/suspicious/noExplicitAny: <>
	private handlers = new Map<DomainEventType, EventHandler<any>[]>();

	on<T extends DomainEvent>(
		eventType: T["type"],
		handler: EventHandler<T>,
	): void {
		const existing = this.handlers.get(eventType) ?? [];
		this.handlers.set(eventType, [...existing, handler]);
	}

	async emit<T extends DomainEvent>(event: T): Promise<void> {
		const eventHandlers = this.handlers.get(event.type) ?? [];

		if (eventHandlers.length === 0) return;

		const results = await Promise.allSettled(
			eventHandlers.map((handler) => handler(event)),
		);

		results.forEach((result, index) => {
			if (result.status === "rejected") {
				console.error(
					`[EventBus] Handler #${index} failed for "${event.type}":`,
					result.reason,
				);
			}
		});
	}

	off(eventType: DomainEventType): void {
		this.handlers.delete(eventType);
	}
}

export const eventBus = new EventBus();
