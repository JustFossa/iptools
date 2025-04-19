import { SearchBar } from "@/components/SearchBar";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { FiGithub } from "react-icons/fi";

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col md:flex-row gap-4 md:items-start items-center">
			<div className="flex flex-col w-[70%] md:w-[50%]">
				<div className="p-4">
					<h1 className="text-4xl font-bold text-left mb-3">IP Info</h1>
					<p className="text-2xl">
						IP Info is a powerful set of tools that allows you to get
						information about an IP address.
					</p>
				</div>

				<Link
					href="https://github.com/JustFossa/iptools"
					referrerPolicy="no-referrer"
					target="_blank"
					className="flex flex-row self-center gap-2 text-lg text-center p-4 hover:text-button-foreground transition-colors duration-200"
				>
					<FiGithub className="text-2xl" />
					Source code
				</Link>
				<SearchBar />
			</div>
			<div className="p-4  w-[70%] md:w-[50%]">{children}</div>
		</div>
	);
}
