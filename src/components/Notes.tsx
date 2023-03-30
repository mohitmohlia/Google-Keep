import { Notes } from "@prisma/client";
import { useState } from "react";
import { api } from "~/utils/api";

const Notes = ({
  data,
  refetch,
}: {
  data: Notes[] | undefined;
  refetch: () => Promise<undefined>;
}) => {
  const [openOptions, setOpenOptions] = useState<boolean>(false);
  const { mutateAsync: destroy } = api.notes.destroy.useMutation();
  const { mutateAsync: update } = api.notes.update.useMutation();

  const deleteNote = async (noteId: string) => {
    await destroy({ id: noteId });
    await refetch();
  };

  const pinNote = async (isPinned: boolean, noteId: string) => {
    await update({ id: noteId, isPinned });
    await refetch();
  };

  const options = (noteId: string) => [
    {
      icon: "PIN",
      render: (note: Notes, index: number) => {
        return (
          <div
            key={index}
            className=" py-2 px-3 text-lg hover:bg-zinc-500"
            onClick={() => void pinNote(!note.isPinned, noteId)}
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
      render: (note: Notes, index: number) => (
        <div
          key={index}
          className=" py-2 px-3 text-lg hover:bg-zinc-500"
          onClick={() => void deleteNote(noteId)}
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
  return (
    <>
      {data?.filter((note) => note.isPinned).length ? (
        <div className="text-md ml-10 font-semibold uppercase text-zinc-400">
          Pinned
        </div>
      ) : (
        ""
      )}
      <div className="sm:grid-col-1 m-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data &&
          data
            .filter((note) => note.isPinned)
            .map((note) => {
              return (
                <div
                  key={note.id}
                  className={`row-[span_1_/_span_${
                    note.text.length % 10
                  }] noteContainer relative break-words rounded-lg border-2 border-zinc-100 p-4 text-white `}
                >
                  <div
                    className="options absolute top-2 right-2 rounded-full p-2 hover:bg-zinc-600 "
                    onClick={() => setOpenOptions(!openOptions)}
                  >
                    <div
                      className={`${
                        openOptions ? "" : "hidden"
                      } absolute top-8 right-4 z-10 min-w-max rounded-lg bg-zinc-700  py-2`}
                    >
                      {options(note.id).map((option, index) =>
                        option.render(note, index)
                      )}
                    </div>
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
      {data?.filter((note) => !note.isPinned).length ? (
        <div className="text-md ml-10 font-semibold uppercase text-zinc-400">
          Others
        </div>
      ) : (
        ""
      )}
      <div className="sm:grid-col-1 m-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data &&
          data
            .filter((note) => !note.isPinned)
            .map((note) => {
              return (
                <div
                  key={note.id}
                  className={`row-[span_1_/_span_${
                    note.text.length % 10
                  }] noteContainer relative break-words rounded-lg border-2 border-zinc-100 p-4 text-white `}
                >
                  <div
                    className="options absolute top-2 right-2 rounded-full p-2 hover:bg-zinc-600 "
                    onClick={() => setOpenOptions(!openOptions)}
                  >
                    <div
                      className={`${
                        openOptions ? "" : "hidden"
                      } absolute top-8 right-4 z-10 min-w-max rounded-lg bg-zinc-700  py-2`}
                    >
                      {options(note.id).map((option, index) =>
                        option.render(note, index)
                      )}
                    </div>
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
    </>
  );
};

export default Notes;
