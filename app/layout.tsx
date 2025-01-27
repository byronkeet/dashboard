import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClientLayout } from "@/components/layout/client-layout";
import { metadata } from "./metadata";
import { AuthProvider } from "@/lib/context/auth-context";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={inter.className}>
				<AuthProvider>
					<ClientLayout>{children}</ClientLayout>
				</AuthProvider>
			</body>
		</html>
	);
}
