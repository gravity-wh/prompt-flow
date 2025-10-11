import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PromptFlow - Discover & Share AI Prompts",
  description: "The next-generation platform for sharing and discovering high-quality AI generative ideas. Browse prompts like TikTok!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
