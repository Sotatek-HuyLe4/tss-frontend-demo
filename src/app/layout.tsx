import type { Metadata } from "next";

import "./globals.scss";

export const metadata: Metadata = {
  title: "TSS App",
  description: "Tss app for generate key, singning message for tss service",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
