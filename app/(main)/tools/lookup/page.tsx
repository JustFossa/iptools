"use client";
import { Button } from "@/components/ui/button";
import { FaLongArrowAltLeft } from "react-icons/fa";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { FaMapMarkerAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { Suspense } from "react";
import axios from "axios";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import dynamic from "next/dynamic";

interface IIpInfo {
	ip: string;
	city: string;
	country_name: string;
	region: string;
	org?: string;
	asn?: string;
	timezone?: string;
	postal?: string;
	latitude: number;
	longitude: number;
}

const Map = dynamic(() => import("@/components/Map"), {
	ssr: false,
	loading: () => <p>Loading map...</p>,
});

export default function Lookup() {
	const [ipInfo, setIpInfo] = useState<IIpInfo | null>(null);
	const params = useSearchParams();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [open, setIsOpen] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	useEffect(() => {
		if (!params.get("ip")) {
			setError("");
			return;
		}
		const fetchIpInfo = async () => {
			try {
				setIsLoading(true);
				const res = await axios.get(
					`https://ipapi.co/${params.get("ip")}/json/?key=${
						process.env.NEXT_PUBLIC_API_KEY
					}`
				);
				if (res.data.error) {
					setIpInfo(null);
					setError(res.data.reason);
					setIsLoading(false);
					return;
				}
				setIpInfo(res.data);
				setError(null);
			} catch (error) {
				console.error("Error fetching IP info:", error);
				setError("Failed to fetch IP information.");
				setIpInfo(null);
			} finally {
				setIsLoading(false);
			}
		};
		fetchIpInfo();
	}, [params.get("ip")]);

	return (
		<div className="flex flex-col gap-4 ">
			<div className="flex flex-row justify-between items-center">
				<Button
					onClick={() => router.replace("/")}
					variant="ghost"
					className="hover:text-button-foreground cursor-pointer w-auto self-start"
				>
					<FaLongArrowAltLeft /> Back to tools
				</Button>
				{ipInfo && (
					<Button
						variant="outline"
						className="hover:text-red-500 cursor- flex flex-row gap-2 cursor-pointer items-center"
						onClick={() => {
							router.replace("/tools/lookup");
							setIpInfo(null);
							setError(null);
							setIsOpen(false);
						}}
					>
						<RxCross2 /> Clear
					</Button>
				)}
			</div>

			<h1 className="text-3xl font-bold">IP Lookup</h1>
			{!ipInfo ? (
				<p className="text-lg">
					Enter an IP address or domain in the search box to look up its
					information.
				</p>
			) : (
				<p className="text-lg">
					Showing information for{" "}
					<span className="font-semibold">{ipInfo.ip}</span>
				</p>
			)}
			<Suspense>
				{!isLoading && !error && ipInfo && (
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
								<p className="text-lg  p-1">IPv4 Information</p>
								{open ? <IoIosArrowUp className="" /> : <IoIosArrowDown />}
							</Button>
						</CollapsibleTrigger>
						<CollapsibleContent className="w-full p-4 space-y-4">
							<Table>
								<TableBody className="cursor-default">
									<TableRow>
										<TableCell className="font-semibold">IP Address</TableCell>
										<TableCell className="">{ipInfo.ip}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-semibold">Location</TableCell>
										<TableCell className="">
											{ipInfo.city}, {ipInfo.region}, {ipInfo.country_name}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-semibold">ISP</TableCell>
										<TableCell className="">{ipInfo.org || "N/A"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-semibold">ASN</TableCell>
										<TableCell className="">{ipInfo.asn || "N/A"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-semibold">Time zone</TableCell>
										<TableCell className="">
											{ipInfo.timezone || "N/A"}
										</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-semibold">Postal Code</TableCell>
										<TableCell className="">{ipInfo.postal || "N/A"}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell className="font-semibold">Coordinates</TableCell>
										<TableCell className="flex flex-row justify-between items-center">
											<div className="flex flex-col">
												<span>{ipInfo.latitude} </span>
												<span>{ipInfo.longitude}</span>
											</div>
											<Dialog
												open={isDialogOpen}
												onOpenChange={setIsDialogOpen}
											>
												<DialogTrigger asChild>
													<Button
														variant="outline"
														className="scale-90 hover:text-button-foreground cursor-pointer"
													>
														<FaMapMarkerAlt /> View on Map
													</Button>
												</DialogTrigger>
												<DialogContent>
													<DialogHeader>
														<DialogTitle>Map Location</DialogTitle>
														<DialogDescription>
															This is your appproximate location based on
															latitude and longitude
														</DialogDescription>
													</DialogHeader>
													<div className="h-96 w-full">
														<Map
															lat={ipInfo.latitude}
															lon={ipInfo.longitude}
															city={ipInfo.city}
															country={ipInfo.country_name}
														/>
													</div>
												</DialogContent>
											</Dialog>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</CollapsibleContent>
					</Collapsible>
				)}
			</Suspense>
			{error && !isLoading && (
				<p className="text-red-500 text-sm mt-2 text-center">{error}</p>
			)}
		</div>
	);
}
