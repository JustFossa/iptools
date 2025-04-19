"use client";
import { Button } from "@/components/ui/button";
import { FaLongArrowAltLeft, FaMapMarkerAlt } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import axios from "axios";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import { IoSearchOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

type CFRecord = {
	id: string;
	name: string;
	type: string;
	content: string;
};

export default function Cloudflare() {
	const [domainInfo, setDomainInfo] = useState<CFRecord[] | null>(null);
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [open, setIsOpen] = useState<boolean>(false);
	const [domain, setDomain] = useState<string>("");

	const fetchDomainInfo = async () => {
		if (!domain) {
			setError("Please enter a domain name.");
			return;
		}
		setIsLoading(true);
		try {
			const res = await axios.get(`/api/dns?domain=${domain}`);
			if (res.data.error) {
				setDomainInfo(null);
				setError(res.data.reason);
				return;
			} else {
				setDomainInfo(res.data);
				setError(null);
			}
		} catch (err) {
			setError("Error fetching domain information.");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<div className="flex flex-row justify-between items-center">
				<Button
					onClick={() => router.replace("/")}
					variant="ghost"
					className="hover:text-button-foreground cursor-pointer w-auto self-start"
				>
					<FaLongArrowAltLeft /> Back to tools
				</Button>
				{domainInfo && (
					<Button
						variant="outline"
						className="hover:text-red-500 cursor- flex flex-row gap-2 cursor-pointer items-center"
						onClick={() => {
							router.replace("/tools/cloudflare");
							setDomainInfo(null);
							setDomain("");
							setError(null);
							setIsOpen(false);
						}}
					>
						<RxCross2 /> Clear
					</Button>
				)}
			</div>

			<h1 className="text-3xl font-bold">Cloudflare Checker</h1>
			{domainInfo ? (
				<p className="text-lg">
					Showing DNS records for <span className="font-bold">{domain}</span>
				</p>
			) : (
				<p className="text-lg">
					Check if a website is using Cloudflare for protection, CDN, or DNS
					services.
				</p>
			)}
			{!domainInfo && (
				<div className="flex flex-row  rounded-lg border border-input overflow-hidden">
					<Input
						placeholder="Enter domain name (e.g., example.com)"
						className="border-none rounded-none"
						value={domain}
						onChange={(e) => setDomain(e.target.value)}
						onKeyDown={(e) => e.key == "Enter" && fetchDomainInfo()}
					/>
					<Button
						onClick={fetchDomainInfo}
						className="rounded-none bg-background text-foreground hover:bg-input/90 cursor-pointer hover:text-button-foreground"
					>
						<IoSearchOutline />
					</Button>
				</div>
			)}
			{!isLoading && !error && domainInfo && (
				<Collapsible
					open={open}
					onOpenChange={setIsOpen}
					className="w-full border-input border rounded-lg overflow-hidden"
				>
					<CollapsibleTrigger className="w-full" asChild>
						<Button
							variant="outline"
							className="w-full flex flex-row justify-between items-center border-none  cursor-pointer bg-background dark:bg-background "
						>
							<p className="text-lg  p-1">Domain Information</p>
							{open ? <IoIosArrowUp className="" /> : <IoIosArrowDown />}
						</Button>
					</CollapsibleTrigger>
					<CollapsibleContent className="w-full p-4 space-y-4">
						<Table>
							<TableBody className="cursor-default">
								{domainInfo &&
									domainInfo.map((item: CFRecord) => (
										<TableRow key={item.id}>
											<TableCell className="font-semibold">
												{item.type}
											</TableCell>
											<TableCell className="">{item.name}</TableCell>
											<TableCell className="">{item.content}</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</CollapsibleContent>
				</Collapsible>
			)}
			{error && !isLoading && (
				<p className="text-red-500 text-sm mt-2 text-center">{error}</p>
			)}
		</div>
	);
}
