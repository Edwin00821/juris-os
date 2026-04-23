import type { Metadata } from "next";
import { JudgeCalendarPage } from "@/modules/judge/pages/judge-calendar-page";

export const metadata: Metadata = {
	title: "Calendario Judicial | Justicia Soberana",
	description: "Agenda de audiencias y citas judiciales programadas.",
};

export default function Calendar() {
	return <JudgeCalendarPage />;
}
