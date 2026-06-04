import { marked } from "marked";

export function renderMarkdown(text: string): string {
	const html = marked.parse(text, { breaks: true });

	const styledHtml = (html as string)
		.replace(
			/<h1>/g,
			'<h1 style="font-size: 1.125rem; font-weight: 700; margin: 0.5rem 0;">',
		) // 18px
		.replace(
			/<h2>/g,
			'<h2 style="font-size: 1rem; font-weight: 700; margin: 0.5rem 0;">',
		) // 16px
		.replace(
			/<h3>/g,
			'<h3 style="font-size: 0.95rem; font-weight: 600; margin: 0.375rem 0;">',
		) // 15px
		.replace(/<p>/g, '<p style="margin: 0.25rem 0; line-height: 1.5;">')
		.replace(/<ul>/g, '<ul style="margin: 0.25rem 0; padding-left: 1.25rem;">')
		.replace(/<ol>/g, '<ol style="margin: 0.25rem 0; padding-left: 1.25rem;">')
		.replace(/<li>/g, '<li style="margin: 0.125rem 0;">')
		.replace(/<strong>/g, '<strong style="font-weight: 700;">')
		.replace(/<em>/g, '<em style="font-style: italic;">')
		.replace(
			/<code>/g,
			'<code style="font-family: monospace; background: rgba(0,0,0,0.1); padding: 0.125rem 0.375rem; border-radius: 0.25rem;">',
		);

	return styledHtml;
}
