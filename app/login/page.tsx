"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import { useAuth } from "@/lib/context/auth-context";

export default function LoginPage() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const { login } = useAuth();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (
			username === process.env.NEXT_PUBLIC_USERNAME &&
			password === process.env.NEXT_PUBLIC_PASSWORD
		) {
			login();
		} else {
			setError("Invalid credentials");
		}
	};

	return (
		<div className='min-h-screen flex items-center justify-center bg-gray-50'>
			<Card className='w-full max-w-md'>
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
							/>
						</div>
						<div className='space-y-2'>
							<Input
								type='password'
								placeholder='Password'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete='current-password'
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
		</div>
	);
}
