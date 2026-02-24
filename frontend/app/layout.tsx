import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "EduMentor AI | Nairobi's Smart Tutor",
    description: "Learn smarter with AI-powered tutoring designed for Kenyan students. Experience productive struggle with Imani, your AI mentor.",
    keywords: ["education", "AI tutor", "Nairobi", "Kenya", "learning", "gamification"],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
