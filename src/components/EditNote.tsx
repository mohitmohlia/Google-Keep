import type { Notes } from "@prisma/client";
import React, { useState } from "react";
import { api } from "~/utils/api";

const NoteEditForm = ({
  note,
  onSubmit,
}: {
  note: Notes;
  onSubmit: () => void;
}) => {
  const [text, setText] = useState<string>(note.text);
  const [title, setTitle] = useState<string>(note.title);
  const [isPinned, setIsPinned] = useState<boolean>(note.isPinned);
  const ctx = api.useContext();
  const { mutate: update } = api.notes.update.useMutation({
    onSuccess: () => {
      void ctx.notes.getAll.invalidate();
      onSubmit();
    },
  });

  function handleEditNote(e: React.SyntheticEvent) {
    e.preventDefault();
    update({ id: note.id, text, title, isPinned });
  }

  return (
    <form
      className="flex flex-col items-end rounded-lg p-4"
      onSubmit={(e) => void handleEditNote(e)}
      //onSubmit={test}
    >
      <div
        role={"button"}
        className={`w-max p-4`}
        onClick={() => setIsPinned(!isPinned)}
      >
        {isPinned ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#ffffff"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M9 4v6l-2 4v2h10v-2l-2 -4v-6" />
            <line x1="12" y1="16" x2="12" y2="21" />
            <line x1="8" y1="4" x2="16" y2="4" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="40"
            height="40"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="#ffffff"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="3" y1="3" x2="21" y2="21" />
            <path d="M15 4.5l-3.249 3.249m-2.57 1.433l-2.181 .818l-1.5 1.5l7 7l1.5 -1.5l.82 -2.186m1.43 -2.563l3.25 -3.251" />
            <line x1="9" y1="15" x2="4.5" y2="19.5" />
            <line x1="14.5" y1="4" x2="20" y2="9.5" />
          </svg>
        )}
      </div>
      <input
        placeholder="Title"
        className={` my-4 w-full min-w-[40rem] rounded-lg bg-zinc-800 px-4 text-2xl text-zinc-100 placeholder:font-semibold placeholder:text-zinc-500 focus:outline-none`}
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />
      <input
        // rows={7}
        placeholder="Text"
        className={`my-4 w-full resize-none rounded-lg bg-zinc-800 px-4 text-2xl text-zinc-100 placeholder:font-semibold placeholder:text-zinc-500 focus:outline-none`}
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <button
        className={`rounded-lg px-4 py-2 font-semibold text-zinc-200 no-underline transition-colors duration-300 ${
          text ? "hover:bg-green-500/70" : "hover:bg-red-500/70"
        }`}
        type="submit"
        onClick={(e) => void handleEditNote(e)}
      >
        Edit
      </button>
    </form>
  );
};

export default NoteEditForm;
