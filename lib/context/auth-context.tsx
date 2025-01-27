"use client";

import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface AuthContextType {
	isAuthenticated: boolean;
	login: () => void;
	logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [isAuthenticated, setIsAuthenticated] = useState(false);
	const router = useRouter();

	useEffect(() => {
		const authCookie = document.cookie
			.split("; ")
			.find((row) => row.startsWith("isAuthenticated="));
		setIsAuthenticated(!!authCookie);
	}, []);

	const login = () => {
		document.cookie = "isAuthenticated=true; path=/; max-age=86400"; // 24 hours
		setIsAuthenticated(true);
		router.push("/");
	};

	const logout = () => {
		document.cookie =
			"isAuthenticated=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
		setIsAuthenticated(false);
		router.push("/login");
	};

	return (
		<AuthContext.Provider value={{ isAuthenticated, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
}
