import React, { useState } from "react";
import { api } from "~/utils/api";
import NoteEditForm from "./EditNote";
import Modal from "./Modal";
import type { RouterOutputs } from "../utils/api";

type Note = RouterOutputs["notes"]["getAll"][number];
type Notes = RouterOutputs["notes"]["getAll"];

const Notes = ({ data }: { data: Notes }) => {
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [note, setNote] = useState<Note>();
  const ctx = api.useContext();
  const { mutate: destroy } = api.notes.destroy.useMutation({
    onSuccess: () => ctx.notes.getAll.invalidate(),
  });
  const { mutate: update } = api.notes.update.useMutation({
    onSuccess: () => ctx.notes.getAll.invalidate(),
  });

  const deleteNote = (noteId: string) => {
    destroy({ id: noteId });
  };

  const handleSetOpenOptions = (e: React.SyntheticEvent) => {
    console.log("supp");

    e.stopPropagation();
    setOpenOptions(!openOptions);
  };
  const pinNote = (isPinned: boolean, noteId: string) => {
    update({ id: noteId, isPinned });
  };
  const handleModalOpen = (e: React.SyntheticEvent, note: Note) => {
    e.stopPropagation();
    setNote(note);
    setOpenModal(true);
  };

  const noteOptions = [
    {
      icon: "PINN",
      render: (note: Note, index: number) => {
        return (
          <div
            key={index}
            className=" py-2 px-3 text-lg hover:bg-zinc-500"
            onClick={() => void pinNote(!note.isPinned, note.id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-pinned"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M9 4v6l-2 4v2h10v-2l-2 -4v-6" />
              <line x1="12" y1="16" x2="12" y2="21" />
              <line x1="8" y1="4" x2="16" y2="4" />
            </svg>
          </div>
        );
      },
    },
    {
      icon: "DELETE",
      render: (note: Note, index: number) => (
        <div
          key={index}
          className=" py-2 px-3 text-lg hover:bg-zinc-500"
          onClick={() => void deleteNote(note.id)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-trash"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#ffffff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="4" y1="7" x2="20" y2="7" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
            <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
            <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
          </svg>
        </div>
      ),
    },
  ];
  const RenderOptions = ({ note }: { note: Note }) => {
    return (
      <div
        className={`${
          openOptions ? "" : "hidden"
        } absolute top-8 right-4 z-10 min-w-max rounded-lg bg-zinc-700  py-2`}
      >
        {noteOptions.map((option, index) => option.render(note, index))}
      </div>
    );
  };

  const RenderNotesTiles = ({ notes }: { notes: Notes }) => {
    return (
      <div className="sm:grid-col-1 m-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {notes &&
          notes.map((note) => {
            return (
              <div
                onClick={(e) => handleModalOpen(e, note)}
                key={note.id}
                className={`row-[span_1_/_span_${
                  note.text.length % 10
                }] noteContainer relative break-words rounded-lg border-2 border-zinc-100 p-4 text-white `}
              >
                <div
                  className="options absolute top-2 right-2 rounded-full p-2 hover:bg-zinc-600 "
                  onClick={(e) => handleSetOpenOptions(e)}
                >
                  <RenderOptions note={note} />
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-dots-vertical"
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#ffffff"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <circle cx="12" cy="12" r="1" />
                    <circle cx="12" cy="19" r="1" />
                    <circle cx="12" cy="5" r="1" />
                  </svg>
                </div>

                <div className="p-1 text-lg font-semibold">{note.title}</div>
                <div className="text-md p-1">{note.text}</div>
              </div>
            );
          })}
      </div>
    );
  };
  return (
    <>
      {data?.filter((note) => note.isPinned).length ? (
        <div className="text-md ml-10 font-semibold uppercase text-zinc-400">
          Pinned
        </div>
      ) : (
        ""
      )}
      <RenderNotesTiles notes={data.filter((note) => note.isPinned)} />

      {data?.filter((note) => !note.isPinned).length ? (
        <div className="text-md ml-10 font-semibold uppercase text-zinc-400">
          Others
        </div>
      ) : (
        ""
      )}
      <RenderNotesTiles notes={data.filter((note) => !note.isPinned)} />
      <Modal
        show={openModal}
        isEdit={true}
        resource="Note"
        onClose={() => setOpenModal(false)}
      >
        <div className="min-w-max- min-h-max border-t-2">
          {note && (
            <NoteEditForm note={note} onSubmit={() => setOpenModal(false)} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default Notes;
