"use client";

import { useState } from "react";
import { addMember } from "./actions";
import { useRouter } from "next/navigation";

type AddMemberModalProps = {
  open: boolean;
  onClose: () => void;
};

export default function AddMemberModal({
  open,
  onClose,
}: AddMemberModalProps) {
  const [email, setEmail] = useState("");
  const [level, setLevel] = useState<"level_1" | "level_2" | "level_3">(
    "level_1"
  );
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  if (!open) return null;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    setSuccess(false);

    try {
      const result = await addMember(email, level);

      setMessage(result.message);
      setSuccess(result.success);


      if (result.success) {
        setEmail("");
        setLevel("level_1");

        // Clear the success message after a short delay
        setTimeout(() => {
          setMessage("");
          setSuccess(false);
        }, 2000);
      }

    } catch {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  function handleClose() {
    if (pending) return;
    setMessage("");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-member-title"
        className="w-full max-w-[500px] rounded-[22px] bg-white p-6 shadow-xl sm:p-8"
      >
        <h2
          id="add-member-title"
          className="text-2xl font-medium tracking-tight text-black"
        >
          New Member
        </h2>

        <form onSubmit={handleSubmit} className="mt-7">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
            <div className="flex shrink-0 justify-center sm:pt-1">
              <div className="flex h-[88px] w-[88px] items-center justify-center rounded-full bg-[#B8B8B8] text-center text-xs leading-4 text-white">
                Pub
                <br />
                Dept
              </div>
            </div>

            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <label className="sr-only" htmlFor="member-email">
                University email
              </label>
              <input
                id="member-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="University Email"
                disabled={pending}
                className="h-11 w-full rounded-md bg-[#E9E9E9] px-4 text-center text-sm text-black outline-none transition placeholder:text-gray-600 focus:bg-white focus:ring-2 focus:ring-[#5D8CF8] disabled:opacity-60"
              />

              <label className="sr-only" htmlFor="member-level">
                Assign level
              </label>
              <select
                id="member-level"
                value={level}
                onChange={(event) =>
                  setLevel(event.target.value as typeof level)
                }
                disabled={pending}
                className="h-11 w-full cursor-pointer rounded-md bg-[#E9E9E9] px-4 text-center text-sm text-gray-700 outline-none transition focus:bg-white focus:ring-2 focus:ring-[#5D8CF8] disabled:opacity-60"
              >
                <option value="level_1">Level 1 — Member</option>
                <option value="level_2">Level 2 — Elevated</option>
                <option value="level_3">Level 3 — Administrator</option>
              </select>
            </div>
          </div>

          {message && (
            <p
              role="status"
              className={`mt-4 text-sm ${
                success ? "text-green-700" : "text-red-600"
              }`}
            >
              {message}
            </p>
          )}

          <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleClose}
              disabled={pending}
              className="h-10 rounded-lg px-5 text-sm text-gray-600 transition hover:bg-gray-100 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={pending}
              className="h-10 rounded-lg bg-[#5D8CF8] px-5 text-sm font-medium text-white transition hover:bg-[#4778E8] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? "Adding..." : "Add member"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
