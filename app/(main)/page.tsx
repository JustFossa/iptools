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
		<div className="p-4 w-[50%]">
			<h1 className="text-4xl font-bold mb-4">IP Tools</h1>
			<div className="flex flex-col gap-5">
				{tools.map((tool) => (
					<div key={tool.id} className="w-full">
						<div className="flex flex-row gap-4 items-center hover:text-blue-500 cursor-pointer rounded-md p-1 hover:bg-input/90 transition-colors duration-200">
							<tool.icon className="text-lg" />
							<h2 className="text-lg">{tool.name}</h2>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
