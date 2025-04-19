"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

export const SearchBar = () => {
	const [ipInfo, setIpInfo] = useState(null);
	const [input, setInput] = useState("");
	const router = useRouter();
	const [error, setError] = useState("");

	const handleSearch = async () => {
		try {
			let endpoint = input;
			if (input == "me" || input == "" || input == "localhost") {
				endpoint = "";
			}

			const response = await axios.get(
				`https://ipapi.co/${input}/json/?key=${process.env.NEXT_PUBLIC_API_KEY}`
			);

			if (response.data.error) {
				setError(response.data.reason);
				setIpInfo(null);
				return;
			}
			setInput("");
			setError("");
			router.replace(`/tools/lookup?ip=${response.data.ip}`);
			console.log(response.data);
		} catch (error) {
			console.error("Error fetching IP info:", error);
		}
	};

	return (
		<div className="p-8 flex flex-col">
			<div className="flex rounded-lg border border-input overflow-hidden">
				<Input
					placeholder="IPV4 / IPV6"
					className="border-none rounded-none"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key == "Enter" && handleSearch()}
				/>
				<Button
					onClick={handleSearch}
					className="border-none rounded-none bg-background text-foreground hover:bg-input/90 cursor-pointer hover:text-button-foreground"
				>
					<IoSearchOutline className="text-xl font-bold" />
				</Button>
			</div>
			{error && (
				<p className="text-red-500 text-sm mt-2 text-center">{error}</p>
			)}
		</div>
	);
};
