import type { Metadata } from "next";
import { Chivo } from "next/font/google";
import "./globals.css";

// Import Chivo font
const chivo = Chivo({ subsets: ["latin"], weight: ["100", "300", "400", "700", "900"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={chivo.className}>{children}</body>
    </html>
  );
}

