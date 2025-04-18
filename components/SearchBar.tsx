"use client";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { IoSearchOutline } from "react-icons/io5";
import axios from "axios";
import { useState } from "react";

export const SearchBar = () => {
	const [ipInfo, setIpInfo] = useState(null);
	const [input, setInput] = useState("");
	const [error, setError] = useState("");

	const handleSearch = async () => {
		try {
			let endpoint = input;
			if (input == "me" || input == "" || input == "localhost") {
				endpoint = "";
			}

			const response = await axios.get(`https://ipapi.co/${input}/json/`);

			if (response.data.error) {
				setError(response.data.reason);
				setIpInfo(null);
				return;
			}

			setIpInfo(response.data);
			setError("");
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
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key == "Enter" && handleSearch()}
				/>
				<Button
					onClick={handleSearch}
					className="border-none rounded-none bg-background text-foreground hover:bg-input/90 cursor-pointer hover:text-blue-500"
				>
					<IoSearchOutline className="text-xl " />
				</Button>
			</div>
			{error && (
				<p className="text-red-500 text-sm mt-2 text-center">{error}</p>
			)}
		</div>
	);
};
