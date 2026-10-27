import type { Metadata } from "next"
import "./globals.css"
import ClientLayout from "./components/clientLayout";

export const metadata: Metadata = {
  title: "The Motherboard",
  description: "The official website for Mindanao State University - Iligan Institute of Technology's College of Computer Studies's official student publication, The Motherboard.",
  keywords: ["The Motherboard", "TMB", "Mindanao State University", "Iligan Institute of Technology", "Mindanao State University - Iligan Institute of Technology", "MSU", "IIT", "MSU-IIT", "College of Computer Studies", "CCS", "The Motherboard Website", "The Motherboard Website 2025"],
  icons: {
    icon: "/tmb_logo.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <ClientLayout>
        {children}
      </ClientLayout>
    </html>
  )
}
