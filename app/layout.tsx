import "./globals.css";
import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import { ClientLayout } from "@/components/layout/client-layout";
import { metadata } from "./metadata";
import { AuthProvider } from "@/lib/context/auth-context";

const raleway = Raleway({ subsets: ["latin"] });

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={raleway.className}>
				<AuthProvider>
					<ClientLayout>{children}</ClientLayout>
				</AuthProvider>
			</body>
		</html>
	);
}
