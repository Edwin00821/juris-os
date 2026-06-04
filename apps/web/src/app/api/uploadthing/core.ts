import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@/lib/auth";

const f = createUploadthing();

export const ourFileRouter = {
	caseDocumentUploader: f({
		pdf: { maxFileSize: "16MB", maxFileCount: 10 },
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
			maxFileSize: "16MB",
			maxFileCount: 10,
		},
		image: { maxFileSize: "16MB", maxFileCount: 10 },
	})
		.middleware(async () => {
			const session = await auth.api.getSession({
				headers: await headers(),
			});
			if (!session?.user) throw new Error("Unauthorized");
			return { userId: session.user.id };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			return {
				uploadedBy: metadata.userId,
				fileUrl: file.ufsUrl,
				storageKey: file.key,
			};
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
