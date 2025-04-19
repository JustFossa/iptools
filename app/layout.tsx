import type { Metadata } from "next";
import { Roboto_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/theme-provider";

const robotoMono = Roboto_Mono({
	subsets: ["latin"],
	weight: "variable",
	style: ["normal", "italic"],
	variable: "--font-geist-mono",
});
export const metadata: Metadata = {
	title: "IP Info",
	description:
		"A powerful set of tools that allows you to get information about an IP address.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className={`${robotoMono.variable} antialiased`}>
				<ThemeProvider
					attribute="class"
					defaultTheme="system"
					enableSystem
					disableTransitionOnChange
				>
					<div className="flex flex-row items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
						<div className="container max-w-4xl mx-auto px-4">{children}</div>
					</div>
				</ThemeProvider>
			</body>
		</html>
	);
}
