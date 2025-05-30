import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
	title: "SBU Ranks",
	description: "Vote daily for the best spots on campus.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body className="bg-white text-gray-900 font-sans flex flex-col min-h-screen">
				<Navbar />
				<main className="flex-grow">{children}</main>
				<Footer />
				<Analytics />
			</body>
		</html>
	);
}
