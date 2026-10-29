"use client";

import { useState } from "react";
import MemberSettingsModal from "./MemberSettingsModal";

export type Member = {
  id: string;
  email: string;
  level: "level_1" | "level_2" | "level_3";
  contribution_status: "active" | "inactive";
  name: string;
};

type MembersListProps = {
  members: Member[];
};

const levelLabels: Record<Member["level"], string> = {
  level_1: "Level 1",
  level_2: "Level 2",
  level_3: "Level 3",
};

export default function MembersList({ members }: MembersListProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  return (
    <div className="mt-5 min-w-0">
      {/* Column headings */}
      <div
        className="grid grid-cols-[64px_minmax(0,1fr)_100px_40px] items-center gap-2 px-1
        sm:grid-cols-[72px_minmax(0,1fr)_120px_40px] sm:gap-4"
      >
        <span aria-hidden="true" />

        <h3 className="text-center text-2xl font-semibold text-black">
          Member
        </h3>

        <h3 className="text-center text-2xl font-semibold text-black lg:-ml-35">
          Status
        </h3>

        <span aria-hidden="true" />
      </div>

      {/* Member rows */}
      <div className="mt-6 max-h-[min(48vh,480px)] space-y-5 overflow-y-auto pr-2">
        {members.length === 0 ? (
          <p className="py-10 text-center text-base text-gray-500">
            No members have been added yet.
          </p>
        ) : (
          members.map((member) => (
            <div
              key={member.id}
              className="grid min-h-[72px] grid-cols-[56px_minmax(0,1fr)_100px_40px]
              items-center gap-2 px-1 sm:grid-cols-[64px_minmax(0,1fr)_120px_40px] sm:gap-2"
            >
              {/* Profile photo placeholder */}
              <div
                aria-hidden="true"
                className="h-16 w-16 animate-pulse
               lg:ml-12 rounded-full bg-[#B8B8B8] sm:h-20 sm:w-20"
              />

              {/* Name, email, and level */}
              <div className="min-w-0 pl-1 sm:pl-2">
                <p className="truncate text-lg font-semibold text-gray-900 lg:ml-50">
                  {member.name}
                </p>

                <p className="truncate text-base text-gray-500 lg:ml-50">
                  {member.email}
                </p>

                <p className="mt-1 text-sm text-gray-400 lg:ml-50">
                  {levelLabels[member.level]}
                </p>
              </div>

              {/* Contribution status */}
              <div className="flex justify-center">
                <span
                  className={`rounded-full px-3 py-1.5 text-md font-medium lg:-ml-35 ${
                    member.contribution_status === "active"
                      ? "bg-[#E6F4EA] text-[#267344]"
                      : "bg-[#F1F1F1] text-gray-500"
                  }`}
                >
                  {member.contribution_status === "active"
                    ? "Active"
                    : "Inactive"}
                </span>
              </div>

              {/* Settings button */}
              <button
                type="button"
                onClick={() => setSelectedMember(member)}
                aria-label={`Settings for ${member.email}`}
                title="Member settings"
                className="h-10 w-10 rounded-md bg-[#FFE0A3] text-lg
                text-gray-700 opacity-80 hover:bg-[#FFCE7B]"
              >
                <span aria-hidden="true">⋯</span>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Member settings modal */}
      <MemberSettingsModal
        isOpen={selectedMember !== null}
        member={selectedMember}
        onClose={() => setSelectedMember(null)}
      />
    </div>
  );
}
