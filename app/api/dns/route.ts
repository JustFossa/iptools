// pages/api/dns.ts

import axios from "axios";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
	const domain = req.nextUrl.searchParams.get("domain");
	const API_TOKEN = process.env.CF_API_TOKEN;

	if (!API_TOKEN) {
		return new Response("API token not found", { status: 500 });
	}

	const zoneId = await axios
		.get(`https://api.cloudflare.com/client/v4/zones?name=${domain}`, {
			headers: {
				Authorization: `Bearer ${API_TOKEN}`,
				"Content-Type": "application/json",
			},
		})
		.then((res) => {
			return res.data.result[0].id;
		});

	try {
		const { data } = await axios.get(
			`https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
			{
				headers: {
					Authorization: `Bearer ${API_TOKEN}`,
					"Content-Type": "application/json",
				},
			}
		);

		// Optional: handle errors returned by Cloudflare
		if (!data.success) {
			return new Response(
				JSON.stringify({ error: "Error fetching DNS records" }),
				{ status: 500 }
			);
		}

		return new Response(JSON.stringify(data.result), {
			headers: {
				"Content-Type": "application/json",
			},
		});
	} catch (err: any) {
		console.error("Error fetching DNS records:", err);
		return new Response(
			JSON.stringify({ error: "Error fetching DNS records" }),
			{ status: 500 }
		);
	}
}
