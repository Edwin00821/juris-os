import { Button } from "@juris-os/ui/components/button";
import { getSession } from "@/lib/auth";

export default async function Home() {
	const session = await getSession();

	return (
		<div className="container mx-auto max-w-3xl px-4 py-2">
			<pre className="overflow-x-auto font-mono text-sm">Juris OS</pre>
			<p>{session?.user.name}</p>
			<p>{session?.user.role}</p>

			<Button>Click</Button>
		</div>
	);
}
