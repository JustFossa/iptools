import Link from "next/link";
import { GoPerson } from "react-icons/go";
import { LuFileSearch } from "react-icons/lu";
import { PiDownload } from "react-icons/pi";

export default function Home() {
	const tools = [
		{ name: "My IP Info", id: "myip", icon: GoPerson },
		{ name: "IP Lookup", id: "lookup", icon: LuFileSearch },
		{ name: "Cloudflare Checker", id: "cloudflare", icon: PiDownload },
	];
	return (
		<>
			<h1 className="text-4xl font-bold mb-6">IP Tools</h1>
			<div className="flex flex-col gap-6">
				{tools.map((tool) => (
					<Link href={`/tools/${tool.id}`} key={tool.id} className="w-full">
						<div className="flex flex-row gap-4 items-center hover:text-button-foreground cursor-pointer rounded-md py-1 px-2 hover:bg-input/90 transition-colors duration-200">
							<tool.icon className="" />
							<h2 className="text-lg">{tool.name}</h2>
						</div>
					</Link>
				))}
			</div>
		</>
	);
}
