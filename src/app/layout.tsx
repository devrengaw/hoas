import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOAS | Hub of Advertising Sales",
  description: "A inteligência que conecta o mercado publicitário.",
};

import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
