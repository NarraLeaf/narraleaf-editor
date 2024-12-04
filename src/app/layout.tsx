import type { Metadata } from "next";
import "@lib/styles/base.css";

export const metadata: Metadata = {
  title: "NarraLeaf Editor",
  description: "NarraLeaf Editor",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
