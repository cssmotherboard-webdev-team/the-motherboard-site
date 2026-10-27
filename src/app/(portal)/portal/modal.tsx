"use client";

import { createClient } from "@/lib/supabase/client";

export default function PageLoadPopup() {
  async function handleGoogleSignIn() {
    const supabase = createClient();

    const redirectTo = `${window.location.origin}/auth/callback?next=/portal/dashboard`;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo,
      },
    });

    if (error) {
      console.error("Google sign-in failed:", error.message);
      alert("Unable to sign in with Google. Please try again.");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
      <div
        role="dialog"
        aria-modal="true"
        className="w-230 max-w-230 h-130 rounded-2xl bg-white p-8 shadow-xl sm:p-12"
      >
        <div className="flex flex-col items-center text-black lg:mt-20">
          <div className="flex items-center justify-center whitespace-nowrap text-6xl leading-none tracking-[-2px]">
            <img
              src="/images/tmb_logo_black.png"
              alt="The Motherboard logo"
              className="mr-3 w-16"
            />

            <span className="font-light italic">the</span>
            <span>Mother</span>
            <span className="font-black tracking-[-2.5px]">
              board
            </span>
          </div>

          <span className="-mt-1 border-b-[3px] border-black px-1 text-7xl font-extrabold leading-none tracking-[-1px]">
            Portal
          </span>

          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              className="flex h-12 w-40 cursor-pointer items-center justify-center rounded-lg bg-[#4285F4] text-sm font-medium text-white transition hover:bg-[#357AE8]"
            >
              <span className="text-center leading-tight">
                Sign-in with
                <br />
                Google
              </span>
            </button>
          </div>
        </div>

        <div className="min-h-120 max-h-120" />
      </div>
    </div>
  );
}
