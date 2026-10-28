
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import DashboardIsland from "./DashboardIsland";
import Navbar from "./Navbar";
import AddMemberButton from "./AddMemberButton";
import MembersList from "./MembersList";

type MemberLevel = "level_1" | "level_2" | "level_3";
type ContributionStatus = "active" | "inactive";

export default async function DashboardPage() {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    redirect("/portal");
  }

  const actorEmail = user.email.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();

  let isAdmin = !!adminEmail && actorEmail === adminEmail;

  if (!isAdmin) {
    const { data: membership } = await supabase
      .from("authorized_users")
      .select("level")
      .eq("email", actorEmail)
      .maybeSingle();

    isAdmin = membership?.level === "level_3";
  }

  if (!isAdmin) {
    redirect("/portal");
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing server-side Supabase configuration.");
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

  const { data: rows, error } = await adminClient
    .from("authorized_users")
    .select("id, email, level, contribution_status")
    .order("email");

  if (error) {
    console.error("Failed to fetch members:", error.message);
    throw new Error("Unable to load members.");
  }

  const { data: authUsers, error: authError } =
    await adminClient.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });

  if (authError) {
    console.error("Failed to fetch Google profiles:", authError.message);
  }

  const usersByEmail = new Map(
    (authUsers?.users ?? []).map((authUser) => [
      authUser.email?.trim().toLowerCase(),
      authUser,
    ])
  );

  const members = (rows ?? []).map((row) => {
    const authUser = usersByEmail.get(row.email.trim().toLowerCase());
    const metadata = authUser?.user_metadata ?? {};

    return {
      id: row.id,
      email: row.email,
      level: row.level as MemberLevel,
      contribution_status: row.contribution_status as ContributionStatus,
      name:
        metadata.full_name ??
        metadata.name ??
        metadata.display_name ??
        row.email,
    };
  });

  return (
    <main className="min-h-screen w-full bg-[#EAEAEA] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <Navbar />

        <div
          className="grid min-h-[78vh] w-full grid-cols-1 gap-4
            lg:grid-cols-[minmax(0,2.35fr)_minmax(240px,0.9fr)] lg:gap-6"
        >
          <DashboardIsland className="min-h-[415px] h-full min-w-0">
            <AddMemberButton />
            <MembersList members={members} />
          </DashboardIsland>

          <div className="grid h-full min-h-[415px] grid-rows-2 gap-4 lg:gap-6">
            <DashboardIsland className="h-full min-h-[150px]" />
            <DashboardIsland className="h-full min-h-[180px]" />
          </div>
        </div>
      </div>
    </main>
  );
}
