
"use server";

import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";

type MemberLevel = "level_1" | "level_2" | "level_3";

export async function addMember(email: string, level: MemberLevel) {
  const normalizedEmail = email.trim().toLowerCase();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return { success: false, message: "Enter a valid email address." };
  }

  if (!["level_1", "level_2", "level_3"].includes(level)) {
    return { success: false, message: "Select a valid privilege level." };
  }

  const supabase = await createServerClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return { success: false, message: "Please sign in again." };
  }

  const actorEmail = user.email.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  let isAdmin = !!adminEmail && actorEmail === adminEmail;

  if (!isAdmin) {
    const { data: membership, error: membershipError } = await supabase
      .from("authorized_users")
      .select("level")
      .eq("email", actorEmail)
      .maybeSingle();

    if (membershipError) {
      console.error("Administrator check failed:", membershipError.message);
      return { success: false, message: "Unable to verify your permissions." };
    }

    isAdmin = membership?.level === "level_3";
  }

  if (!isAdmin) {
    return {
      success: false,
      message: "You do not have permission to add members.",
    };
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error("Missing server-side Supabase environment variables.");
    return { success: false, message: "Server configuration is incomplete." };
  }

  const adminClient = createSupabaseAdminClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  const { error: insertError } = await adminClient
    .from("authorized_users")
    .insert({
      email: normalizedEmail,
      level,
      contribution_status: "active",
    });

  if (insertError) {
    if (insertError.code === "23505") {
      return {
        success: false,
        message: "This email is already registered.",
      };
    }

    console.error("Member insertion failed:", insertError.message);
    return {
      success: false,
      message: "Unable to add the member. Please try again.",
    };
  }

  return {
    success: true,
    message: `${normalizedEmail} was added successfully.`,
  };
}
