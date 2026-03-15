import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "EduMentor AI | Nairobi's Smart AI Tutor",
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
                {/* Google Fonts: Google Sans (system-equivalent) + Inter */}
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap"
                    rel="stylesheet"
                />
                <script dangerouslySetInnerHTML={{
                    __html: `
                        try {
                            var theme = localStorage.getItem('edu_theme') || 'sunset';
                            document.documentElement.setAttribute('data-theme', theme);
                        } catch(e) {}
                    `
                }} />
            </head>
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
