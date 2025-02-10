import { NextResponse } from "next/server";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const { username, password } = body;

		// Check credentials against environment variables
		if (
			username === process.env.USERNAME &&
			password === process.env.PASSWORD
		) {
			return NextResponse.json({ success: true });
		}

		return NextResponse.json(
			{ error: "Invalid credentials" },
			{ status: 401 }
		);
	} catch (error) {
		return NextResponse.json(
			{ error: "Authentication failed" },
			{ status: 500 }
		);
	}
}
