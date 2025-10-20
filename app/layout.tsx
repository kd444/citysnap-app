import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "City Snap - No-Key City Information",
    description:
        "Get weather, sunrise/sunset, holidays, and more for any city using free public APIs",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className="bg-white min-h-screen">{children}</body>
        </html>
    );
}
