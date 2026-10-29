
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Member } from "./MembersList";
import {
  updateMemberLevel,
  updateMemberStatus,
  removeMember,
} from "./actions";

type MemberSettingsModalProps = {
  isOpen: boolean;
  member: Member | null;
  onClose: () => void;
};

type MemberLevel = Member["level"];
type ContributionStatus = Member["contribution_status"];

const levelLabels: Record<MemberLevel, string> = {
  level_1: "Level 1",
  level_2: "Level 2",
  level_3: "Level 3",
};

export default function MemberSettingsModal({
  isOpen,
  member,
  onClose,
}: MemberSettingsModalProps) {
  const router = useRouter();

  const [level, setLevel] = useState<MemberLevel>("level_1");
  const [status, setStatus] = useState<ContributionStatus>("active");
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (member) {
      setLevel(member.level);
      setStatus(member.contribution_status);
      setMessage("");
      setSuccess(false);
    }
  }, [member]);

  if (!isOpen || !member) return null;

  async function handleSave() {
    // Capture the selected member and explicitly handle null.
    const currentMember = member;

    if (!currentMember) {
      setMessage("No member selected.");
      return;
    }

    setPending(true);
    setMessage("");
    setSuccess(false);

    try {
      if (level !== currentMember.level) {
        const result = await updateMemberLevel(currentMember.id, level);

        if (!result.success) {
          setMessage(result.message);
          return;
        }
      }

      if (status !== currentMember.contribution_status) {
        const result = await updateMemberStatus(
          currentMember.id,
          status
        );

        if (!result.success) {
          setMessage(result.message);
          return;
        }
      }

      setSuccess(true);
      setMessage("Member settings saved successfully.");
      router.refresh();
    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  async function handleKick() {
    // Capture the selected member and explicitly handle null.
    const currentMember = member;

    if (!currentMember) {
      setMessage("No member selected.");
      return;
    }

    const confirmed = window.confirm(
      `Remove ${currentMember.email} from the authorized member list? They will no longer be able to access the portal.`
    );

    if (!confirmed) return;

    setPending(true);
    setMessage("");
    setSuccess(false);

    try {
      const result = await removeMember(currentMember.id);

      setMessage(result.message);
      setSuccess(result.success);

      if (result.success) {
        router.refresh();
        onClose();
      }
    } catch {
      setMessage("Unable to remove this member. Please try again.");
    } finally {
      setPending(false);
    }
  }

  function handleStatusToggle() {
    setStatus((current) => (current === "active" ? "inactive" : "active"));
    setMessage("");
    setSuccess(false);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !pending) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="member-settings-title"
        className="w-full max-w-[900px] rounded-[22px] bg-white p-6 shadow-xl sm:p-8"
      >
        {/* Modal heading */}
        <div className="flex items-center justify-between">
          <h2
            id="member-settings-title"
            className="text-4xl font-medium tracking-tight text-black"
          >
            Member Settings
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            aria-label="Close member settings"
            className="flex h-10 w-10 items-center justify-center text-4xl font-light leading-none text-black transition hover:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            ×
          </button>
        </div>

        {/* Member information */}
        <div className="mt-7 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
          {/* Profile placeholder */}
          <div className="flex shrink-0 justify-center sm:justify-start">
            <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#B8B8B8] text-center text-xs leading-4 text-white">
              Pub
              <br />
              Dept
            </div>
          </div>

          {/* Member name, email, and role */}
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            <input
              type="text"
              readOnly
              aria-label="Member name and university email"
              value={`${member.name} — ${member.email}`}
              className="h-11 w-full rounded-md bg-[#E9E9E9] px-4 text-center text-sm text-black outline-none"
            />

            <label className="sr-only" htmlFor="member-role">
              Privilege level
            </label>

            <select
              id="member-role"
              value={level}
              onChange={(event) => {
                setLevel(event.target.value as MemberLevel);
                setMessage("");
                setSuccess(false);
              }}
              disabled={pending}
              className="h-11 w-full cursor-pointer rounded-md bg-[#E9E9E9] px-4 text-center text-sm text-gray-700 outline-none transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-[65%]"
            >
              {Object.entries(levelLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Contribution status */}
          <button
            type="button"
            onClick={handleStatusToggle}
            disabled={pending}
            aria-label={`Set contribution status to ${
              status === "active" ? "inactive" : "active"
            }`}
            className="flex h-11 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md bg-[#E9E9E9] px-4 text-sm text-gray-700 transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "active" ? "Active" : "Inactive"}

            <span
              aria-hidden="true"
              className={`h-3 w-3 rounded-full ${
                status === "active" ? "bg-[#B8B8B8]" : "bg-gray-500"
              }`}
            />
          </button>
        </div>

        {/* Published works — placeholder, outside current scope */}
        <section className="mt-8">
          <h3 className="mb-3 text-xl font-normal text-black">
            Published Works
          </h3>

          <div
            aria-label="Published works"
            className="min-h-[150px] w-full rounded-md bg-[#EEEEEE]"
          />
        </section>

        {/* Feedback */}
        {message && (
          <p
            role="status"
            aria-live="polite"
            className={`mt-4 text-sm ${
              success ? "text-green-700" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {/* Bottom actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={handleKick}
            disabled={pending}
            className="h-10 rounded-lg bg-black px-5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Please wait..." : "Kick Member"}
          </button>

          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="h-10 rounded-lg bg-[#5D8CF8] px-5 text-sm font-medium text-white transition hover:bg-[#4778E8] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </section>
    </div>
  );
}
