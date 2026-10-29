
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import DashboardIsland from "./DashboardIsland";
import Navbar from "./Navbar";
import AddMemberButton from "./AddMemberButton";
import MembersList from "./MembersList";

type MemberLevel = "level_1" | "level_2" | "level_3";
type ContributionStatus = "active" | "inactive";

const levelLabels: Record<MemberLevel, string> = {
  level_1: "Level 1",
  level_2: "Level 2",
  level_3: "Level 3",
};

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

  const isConfiguredAdmin = !!adminEmail && actorEmail === adminEmail;

  // Fetch the signed-in user's membership.
  const { data: ownMembership, error: membershipError } = await supabase
    .from("authorized_users")
    .select("id, email, level, contribution_status")
    .eq("email", actorEmail)
    .maybeSingle();

  if (membershipError) {
    console.error("Failed to fetch the current membership:", membershipError.message);
    throw new Error("Unable to load your membership.");
  }

  // The configured administrator may not have a row in authorized_users.
  if (!isConfiguredAdmin && !ownMembership) {
    redirect("/portal");
  }

  const ownLevel: MemberLevel = isConfiguredAdmin
    ? "level_3"
    : (ownMembership!.level as MemberLevel);

  const ownStatus: ContributionStatus =
    (ownMembership?.contribution_status as ContributionStatus | undefined) ??
    "active";

  const isAdmin = isConfiguredAdmin || ownLevel === "level_3";

  // Only administrators need the service-role client and complete member list.
  let members: {
    id: string;
    email: string;
    level: MemberLevel;
    contribution_status: ContributionStatus;
    name: string;
  }[] = [];

  if (isAdmin) {
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

    members = (rows ?? []).map((row) => {
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
  }

  return (
    <main className="min-h-screen w-full bg-[#EAEAEA] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-[1440px]">
        <Navbar />

        <div
          className="grid min-h-[78vh] w-full grid-cols-1 gap-4
            lg:grid-cols-[minmax(0,2.35fr)_minmax(240px,0.9fr)] lg:gap-6"
        >
          <DashboardIsland className="min-h-[415px] h-full min-w-0">
            {isAdmin ? (
              <>
                <AddMemberButton />
                <MembersList members={members} />
              </>
            ) : (
              <div className="flex h-full min-h-[360px] flex-col items-center justify-center text-center">
                <h1 className="text-3xl font-semibold text-black">
                  Welcome to The Motherboard Portal
                </h1>

                <p className="mt-3 text-base text-gray-500">
                  You are signed in and authorized to access the portal.
                </p>
              </div>
            )}
          </DashboardIsland>

          <div className="grid h-full min-h-[415px] grid-rows-2 gap-4 lg:gap-6">
            <DashboardIsland className="h-full min-h-[150px]">
              <h2 className="text-xl font-medium text-black">Membership</h2>

              <p className="mt-5 text-base text-gray-500">Privilege level</p>
              <p className="mt-1 text-2xl font-semibold text-black">
                {levelLabels[ownLevel]}
              </p>
            </DashboardIsland>

            <DashboardIsland className="h-full min-h-[180px]">
              <h2 className="text-xl font-medium text-black">
                Contribution Status
              </h2>

              <div className="mt-5 flex items-center gap-3">
                <span
                  className={`h-3 w-3 rounded-full ${
                    ownStatus === "active" ? "bg-[#267344]" : "bg-gray-500"
                  }`}
                />

                <span
                  className={`text-lg font-medium ${
                    ownStatus === "active" ? "text-[#267344]" : "text-gray-500"
                  }`}
                >
                  {ownStatus === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="mt-3 text-sm text-gray-500">
                Your current contribution status.
              </p>
            </DashboardIsland>
          </div>
        </div>
      </div>
    </main>
  );
}
