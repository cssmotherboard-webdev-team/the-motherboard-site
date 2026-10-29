import Image from 'next/image';
import PageLoadPopup from "./modal";

export default function Home() {
  return (
    // 1. Parent container must be 'relative'
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">

      {/* 2. Optimized background image */}
      <Image
        src="/portal/bg_signin.png" // Path starts from the public folder
        alt="Background"
        fill
        quality={80}
        priority
        className="absolute inset-0 -z-10 object-cover" // Tailwind absolute layering
      />


      {/* 3. Your page content goes here */}
      <div className="text-white text-center">
        <PageLoadPopup />
      </div>
    </div>
  );
}
