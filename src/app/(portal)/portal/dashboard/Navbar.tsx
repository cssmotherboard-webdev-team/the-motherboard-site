"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type GoogleProfile = {
  name: string;
  email: string;
  picture: string | null;
};

export default function Navbar() {
  const [profile, setProfile] = useState<GoogleProfile | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const router = useRouter();

  async function handleSignOut() {
    setIsSigningOut(true);

    const supabase = createClient();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Failed to sign out:", error.message);
      setIsSigningOut(false);
      return;
    }

    router.replace("/portal");
    router.refresh();
  }

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile() {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) return;

      const user = data.user;
      const metadata = user.user_metadata ?? {};

      console.log("Google user metadata:", metadata);
      console.log("Avatar URL:", metadata.avatar_url);
      console.log("Picture URL:", metadata.picture);

      setProfile({
        name: metadata.full_name ?? metadata.name ?? "Google User",
        email: user.email ?? "",
        picture:
          metadata.avatar_url ??
          metadata.picture ??
          metadata.picture_url ??
          metadata.avatar ??
          null,
      });
    }

    loadProfile();
  }, []);

  return (
    <nav className="mb-5 flex min-h-[76px] w-full items-center justify-between rounded-[20px] bg-white px-5 py-4 sm:px-7">
      {/* Left side: navbar title */}
      <div className="min-w-0">
        <p className="text-lg font-semibold tracking-tight text-black">
          The Motherboard
        </p>
        <p className="text-xs text-gray-500">Portal</p>
      </div>

      {/* Right side: signed-in Google account and sign out */}
      <div className="flex items-center gap-3">
        {profile && (
          <>
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-black">
                {profile.name}
              </p>
              <p className="max-w-[220px] truncate text-xs text-gray-500">
                {profile.email}
              </p>
            </div>

            {profile.picture ? (
              <img
                src={profile.picture}
                alt="Google profile"
                referrerPolicy="no-referrer"
                onLoad={() => console.log("Profile photo loaded")}
                onError={() =>
                  console.error("Profile photo failed:", profile.picture)
                }
                className="h-10 w-10 shrink-0 rounded-full border border-gray-200 object-cover"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-200 font-semibold text-gray-600">
                {profile.name.charAt(0).toUpperCase()}
              </div>
            )}

            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSigningOut ? "Signing out..." : "Sign Out"}
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
