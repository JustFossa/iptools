import { NextRequest } from "next/server";

const RECORD_TYPES = ["A", "AAAA", "MX", "NS", "TXT", "CNAME"];

export async function GET(req: NextRequest) {
	const domain = req.nextUrl.searchParams.get("domain");

	if (!domain) {
		return new Response(JSON.stringify({ error: "Missing domain parameter" }), {
			status: 400,
		});
	}

	const results: { name: string; type: string; content: string }[] = [];

	try {
		for (const type of RECORD_TYPES) {
			const response = await fetch(
				`https://cloudflare-dns.com/dns-query?name=${domain}&type=${type}`,
				{
					headers: {
						Accept: "application/dns-json",
					},
				}
			);

			const data = await response.json();

			if (Array.isArray(data.Answer)) {
				for (const record of data.Answer) {
					results.push({
						name: record.name,
						type: getRecordTypeName(record.type),
						content: record.data,
					});
				}
			}
		}

		return new Response(JSON.stringify(results), {
			headers: {
				"Content-Type": "application/json",
				"Access-Control-Allow-Origin": "*", // Adjust for production
			},
			status: 200,
		});
	} catch (error: any) {
		console.error("DNS query error:", error);
		return new Response(
			JSON.stringify({ error: "DNS lookup failed", message: error.message }),
			{ status: 500 }
		);
	}
}

// Map numeric type to string (Cloudflare DNS uses numeric codes in response)
function getRecordTypeName(code: number): string {
	const TYPES: Record<number, string> = {
		1: "A",
		28: "AAAA",
		15: "MX",
		2: "NS",
		16: "TXT",
		5: "CNAME",
	};
	return TYPES[code] || `TYPE${code}`;
}
