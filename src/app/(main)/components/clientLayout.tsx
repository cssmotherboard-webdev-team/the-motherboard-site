"use client";

import React, { useRef } from "react";
import Header from "../sections/header";
import { useHeaderHeight } from "../hooks/useHeaderHeight";
import Footer from "../sections/footer";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  // Get Header height for dynamic spacing between header and main content
  const headerRef = useRef<HTMLDivElement>(null);
  const headerHeight = useHeaderHeight(headerRef);

  return (
    <body className="antialiased">      
      <div className="relative">
        <Header ref={headerRef} />
        <main style={{ paddingTop: `${headerHeight + 40}px` }}>{children}</main>
        <Footer />
      </div>
    </body>
  )
}