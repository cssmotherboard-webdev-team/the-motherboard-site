
import type { Metadata } from "next";
import "../../../globals.css";

export const metadata: Metadata = {
  title: "The Motherboard | Portal",
  description:
    "The official Web Portal for Mindanao State University - Iligan Institute of Technology's College of Computer Studies' official student publication, The Motherboard.",
  keywords: [
    "The Motherboard",
    "TMB",
    "Mindanao State University",
    "Iligan Institute of Technology",
    "Mindanao State University - Iligan Institute of Technology",
    "MSU",
    "IIT",
    "MSU-IIT",
    "College of Computer Studies",
    "CCS",
    "The Motherboard Website",
    "The Motherboard Website 2025",
  ],
  icons: {
    icon: "/tmb_logo.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div>
         {children}
        </div>
        </body>
    </html>
  );
}
