
"use server";

import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

type MemberLevel = "level_1" | "level_2" | "level_3";
type ContributionStatus = "active" | "inactive";

type ActionResult = {
  success: boolean;
  message: string;
};

const DASHBOARD_PATH = "/portal/dashboard";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

function isValidLevel(level: string): level is MemberLevel {
  return ["level_1", "level_2", "level_3"].includes(level);
}

function isValidContributionStatus(
  status: string
): status is ContributionStatus {
  return status === "active" || status === "inactive";
}

function getAdminEmail(): string {
  return normalizeEmail(
    process.env.ADMIN_EMAIL ?? "ccs.motherboard@g.msuiit.edu.ph"
  );
}

function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing server-side Supabase configuration.");
  }

  return createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Verify the signed-in user is an administrator.
 * Returns the service-role client only after authorization succeeds.
 */
async function getAuthorizedAdmin() {
  const supabase = await createServerClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return {
      success: false as const,
      message: "Please sign in again.",
    };
  }

  const actorEmail = normalizeEmail(user.email);
  const adminEmail = getAdminEmail();

  // The configured administrator has implicit Level 3 privileges.
  if (actorEmail === adminEmail) {
    try {
      return {
        success: true as const,
        client: createAdminClient(),
        actorEmail,
        adminEmail,
      };
    } catch (error) {
      console.error("Admin client initialization failed:", error);

      return {
        success: false as const,
        message: "Server configuration is incomplete.",
      };
    }
  }

  // All other administrators must have Level 3 in the database.
  const { data: membership, error: membershipError } = await supabase
    .from("authorized_users")
    .select("level")
    .eq("email", actorEmail)
    .maybeSingle();

  if (membershipError) {
    console.error("Administrator check failed:", membershipError.message);

    return {
      success: false as const,
      message: "Unable to verify your permissions.",
    };
  }

  if (membership?.level !== "level_3") {
    return {
      success: false as const,
      message: "You do not have permission to manage members.",
    };
  }

  try {
    return {
      success: true as const,
      client: createAdminClient(),
      actorEmail,
      adminEmail,
    };
  } catch (error) {
    console.error("Admin client initialization failed:", error);

    return {
      success: false as const,
      message: "Server configuration is incomplete.",
    };
  }
}

/**
 * Add a member to the authorization list.
 */
export async function addMember(
  email: string,
  level: MemberLevel
): Promise<ActionResult> {
  const normalizedEmail = normalizeEmail(email);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    return {
      success: false,
      message: "Enter a valid email address.",
    };
  }

  if (!isValidLevel(level)) {
    return {
      success: false,
      message: "Select a valid privilege level.",
    };
  }

  const auth = await getAuthorizedAdmin();

  if (!auth.success) {
    return { success: false, message: auth.message };
  }

  const { error } = await auth.client
    .from("authorized_users")
    .insert({
      email: normalizedEmail,
      level,
      contribution_status: "active",
    });

  if (error) {
    if (error.code === "23505") {
      return {
        success: false,
        message: "This email is already registered.",
      };
    }

    console.error("Member insertion failed:", error.message);

    return {
      success: false,
      message: "Unable to add the member. Please try again.",
    };
  }

  revalidatePath(DASHBOARD_PATH);

  return {
    success: true,
    message: `${normalizedEmail} was added successfully.`,
  };
}

/**
 * Change a member's privilege level.
 *
 * The configured administrator can demote other Level 3 members.
 * Other Level 3 administrators cannot demote Level 3 members.
 * The configured administrator cannot be demoted.
 */
export async function updateMemberLevel(
  memberId: string,
  level: MemberLevel
): Promise<ActionResult> {
  if (!memberId || typeof memberId !== "string") {
    return { success: false, message: "Invalid member." };
  }

  if (!isValidLevel(level)) {
    return {
      success: false,
      message: "Select a valid privilege level.",
    };
  }

  const auth = await getAuthorizedAdmin();

  if (!auth.success) {
    return { success: false, message: auth.message };
  }

  const { data: target, error: lookupError } = await auth.client
    .from("authorized_users")
    .select("id, email, level")
    .eq("id", memberId)
    .maybeSingle();

  if (lookupError) {
    console.error("Member lookup failed:", lookupError.message);

    return {
      success: false,
      message: "Unable to find this member.",
    };
  }

  if (!target) {
    return {
      success: false,
      message: "This member no longer exists.",
    };
  }

  const targetEmail = normalizeEmail(target.email);

  // Protect the configured administrator's account.
  if (
    targetEmail === auth.adminEmail &&
    level !== "level_3"
  ) {
    return {
      success: false,
      message: "The configured administrator cannot be demoted.",
    };
  }

  // Only the configured administrator can demote another Level 3 member.
  if (
    target.level === "level_3" &&
    level !== "level_3" &&
    auth.actorEmail !== auth.adminEmail
  ) {
    return {
      success: false,
      message:
        "Only the configured administrator can demote a Level 3 member.",
    };
  }

  const { error } = await auth.client
    .from("authorized_users")
    .update({ level })
    .eq("id", memberId);

  if (error) {
    console.error("Member role update failed:", error.message);

    return {
      success: false,
      message: "Unable to update the member's role.",
    };
  }

  revalidatePath(DASHBOARD_PATH);

  return {
    success: true,
    message: "Member role updated successfully.",
  };
}

/**
 * Change contribution status without changing login authorization.
 */
export async function updateMemberStatus(
  memberId: string,
  status: ContributionStatus
): Promise<ActionResult> {
  if (!memberId || typeof memberId !== "string") {
    return { success: false, message: "Invalid member." };
  }

  if (!isValidContributionStatus(status)) {
    return {
      success: false,
      message: "Select a valid contribution status.",
    };
  }

  const auth = await getAuthorizedAdmin();

  if (!auth.success) {
    return { success: false, message: auth.message };
  }

  const { data: target, error: lookupError } = await auth.client
    .from("authorized_users")
    .select("id, email")
    .eq("id", memberId)
    .maybeSingle();

  if (lookupError) {
    console.error("Member lookup failed:", lookupError.message);

    return {
      success: false,
      message: "Unable to find this member.",
    };
  }

  if (!target) {
    return {
      success: false,
      message: "This member no longer exists.",
    };
  }

  const { error } = await auth.client
    .from("authorized_users")
    .update({ contribution_status: status })
    .eq("id", memberId);

  if (error) {
    console.error("Contribution status update failed:", error.message);

    return {
      success: false,
      message: "Unable to update contribution status.",
    };
  }

  revalidatePath(DASHBOARD_PATH);

  return {
    success: true,
    message: "Contribution status updated successfully.",
  };
}

/**
 * Remove a member from the portal's authorization list.
 * This does not delete their Supabase Auth account.
 */
export async function removeMember(
  memberId: string
): Promise<ActionResult> {
  if (!memberId || typeof memberId !== "string") {
    return { success: false, message: "Invalid member." };
  }

  const auth = await getAuthorizedAdmin();

  if (!auth.success) {
    return { success: false, message: auth.message };
  }

  const { data: target, error: lookupError } = await auth.client
    .from("authorized_users")
    .select("id, email")
    .eq("id", memberId)
    .maybeSingle();

  if (lookupError) {
    console.error("Member lookup failed:", lookupError.message);

    return {
      success: false,
      message: "Unable to find this member.",
    };
  }

  if (!target) {
    return {
      success: false,
      message: "This member no longer exists.",
    };
  }

  const targetEmail = normalizeEmail(target.email);

  // The configured administrator cannot be removed.
  if (targetEmail === auth.adminEmail) {
    return {
      success: false,
      message: "The configured administrator cannot be removed.",
    };
  }

  const { error } = await auth.client
    .from("authorized_users")
    .delete()
    .eq("id", memberId);

  if (error) {
    console.error("Member removal failed:", error.message);

    return {
      success: false,
      message: "Unable to remove this member. Please try again.",
    };
  }

  revalidatePath(DASHBOARD_PATH);

  return {
    success: true,
    message: `${targetEmail} was removed from the portal's authorized member list.`,
  };
}
