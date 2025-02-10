"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";

export default function LoginPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const response = await fetch("/api/auth", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					username,
					password,
				}),
			});

			const data = await response.json();

			if (response.ok) {
				login();
				router.push("/");
				router.refresh();
			} else {
				setError(data.error || "Invalid credentials");
			}
		} catch (error) {
			setError("An error occurred during login");
		}
	};

	return (
		<main className='fixed inset-0 flex items-center justify-center bg-gray-50 overflow-hidden'>
			<Card className='w-full max-w-md mx-4'>
				<CardHeader>
					<CardTitle className='text-2xl text-center flex items-center justify-center gap-2'>
						<LogIn className='h-6 w-6' />
						Login
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleSubmit}
						className='space-y-4'
						suppressHydrationWarning
					>
						<div className='space-y-2'>
							<Input
								type='text'
								placeholder='Username'
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								autoComplete='username'
								suppressHydrationWarning
							/>
						</div>
						<div className='space-y-2'>
							<Input
								type='password'
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete='current-password'
								suppressHydrationWarning
							/>
						</div>
						{error && (
							<p className='text-sm text-red-500 text-center'>
								{error}
							</p>
						)}
						<Button
							type='submit'
							className='w-full'
							suppressHydrationWarning
						>
							Sign In
						</Button>
					</form>
				</CardContent>
			</Card>
		</main>
	);
}
