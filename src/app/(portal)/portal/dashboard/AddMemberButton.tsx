
"use client";

import { useState } from "react";
import AddMemberModal from "./AddMemberModal";

export default function AddMemberButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-11 min-w-[150px] items-center justify-center gap-2 rounded-md bg-[#0EA5F9] px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#0284C7] focus:outline-none focus:ring-2 focus:ring-[#0EA5F9] focus:ring-offset-2"
        >
          <span className="text-lg leading-none">+</span>
          Add member
        </button>
      </div>

      <AddMemberModal
        open={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
