export type FileUploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadedDocument {
	id: string;
	file: File;
	name: string;
	size: number;
	extension: string;
	status: FileUploadStatus;
	url?: string;
	progress: number;
}
