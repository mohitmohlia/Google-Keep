import React, { useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import type { RouterOutputs } from "~/utils/api";

type Label = RouterOutputs["labels"]["getAll"];

const AddNote = () => {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [isInputFocus, setInputFocus] = useState(false);
  const [labelOptionVisible, setlabelOptionsVisible] = useState(false);

  const [labelOptions, setLabelOptions] = useState<Label>([]);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const ctx = api.useContext();

  const { mutate: createNote } = api.notes.create.useMutation({
    onSuccess: () => {
      cleanInput();
      void ctx.notes.getAll.invalidate();
    },
  });
  const { data: labels } = api.labels.getAll.useQuery();

  useEffect(() => {
    if (labels) {
      setLabelOptions(labels);
    }
  }, [labels]);
  const formRef = useRef<HTMLFormElement>(null);

  function cleanInput() {
    setInputFocus(false);
    setTitle("");
    setText("");
    setSelectedLabels([]);
    setlabelOptionsVisible(false);
  }
  function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();
    if (!text) {
      return;
    }
    createNote({
      text,
      title,
      isPinned,
      labels: selectedLabels,
    });
  }

  function handleLabelOptionChange(labelId: string) {
    if (selectedLabels.includes(labelId)) {
      setSelectedLabels(selectedLabels.filter((o) => o !== labelId));
    } else {
      setSelectedLabels([...selectedLabels, labelId]);
    }
  }

  const yo = labels?.filter((label) => selectedLabels.includes(label.id));
  console.log(yo);
  useEffect(() => {
    function removeInputFocus(e: KeyboardEvent) {
      if (e.code === "Escape") {
        cleanInput();
      }
    }
    document.addEventListener("keydown", removeInputFocus);
    return () => document.removeEventListener("keydown", removeInputFocus);
  }, []);

  useEffect(() => {
    if (text) {
      setInputFocus(true);
    }
  }, [text]);

  // useEffect(() => {
  //   function closeInputBox(event: React.MouseEvent) {
  //     if (formRef.current && !formRef.current.contains(event.target)) {
  //       setInputFocus(false);
  //       setIsPinned(false);
  //       setText("");
  //       setTitle("");
  //     }
  //     return;
  //   }
  //   window.addEventListener("click", closeInputBox);
  //   return () => window.removeEventListener("click", closeInputBox);
  // }, [formRef]);

  return (
    <div className="flex justify-center">
      <form
        ref={formRef}
        className="relative m-12 w-2/4 rounded-lg border-2 border-zinc-500 p-2"
        onSubmit={(e) => void handleSubmit(e)}
      >
        <div
          role={"button"}
          className={`absolute ${
            isInputFocus ? "" : "hidden"
          } right-0 top-0 m-4`}
          onClick={() => setIsPinned(!isPinned)}
        >
          {isPinned ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
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
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
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
          className={`${
            isInputFocus ? "" : "hidden"
          } my-4 w-full rounded-lg  bg-zinc-800 p-2 text-2xl text-zinc-100 placeholder:font-semibold placeholder:text-zinc-500 focus:outline-none`}
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />
        <input
          placeholder="Take a Note"
          className=" w-full rounded-lg bg-zinc-800 p-2 text-xl text-zinc-100 placeholder:font-semibold placeholder:text-zinc-400 focus:outline-none"
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setInputFocus(true)}
          value={text}
        />
        <div className="flex">
          {labels
            ?.filter((label) => selectedLabels.includes(label.id))
            .map((label) => {
              return (
                <span
                  className="m-1 rounded-full border-2 p-2 text-sm text-zinc-100"
                  key={label.id}
                >
                  {label.name}
                </span>
              );
            })}
        </div>
        <div
          className={`${
            isInputFocus ? "" : "hidden"
          } my-1 flex justify-between`}
        >
          <div>
            <button
              disabled={!text}
              className={`rounded-lg px-4 py-2 font-semibold text-zinc-200 no-underline transition ${
                text ? "hover:bg-green-500/70" : "hover:bg-red-500/70"
              }`}
              type="submit"
            >
              Add Note
            </button>
            <button
              className={`rounded-lg px-4 py-2 font-semibold text-zinc-200 no-underline transition hover:bg-zinc-600`}
              type="button"
              onClick={() => setlabelOptionsVisible(!labelOptionVisible)}
            >
              Add label
              <div
                className={`${
                  labelOptionVisible ? "" : "hidden"
                } absolute z-[2] mt-2 ml-2 rounded-lg bg-zinc-700/100 text-zinc-100 `}
              >
                <div
                  className="flex flex-col justify-start  px-2 py-2"
                  onClick={(e) => e.stopPropagation()}
                >
                  {labelOptions.map((option) => (
                    <label
                      className="flex items-center justify-start p-2"
                      key={option.id}
                    >
                      <input
                        className="h-6 w-6 border-2 p-2  accent-zinc-500"
                        type="checkbox"
                        checked={selectedLabels.includes(option.id)}
                        onChange={() => handleLabelOptionChange(option.id)}
                        value={option.name}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="pl-1 text-lg font-normal text-zinc-100">
                        {" "}
                        {option.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </button>
          </div>
          <button
            className="rounded-lg px-4 py-2 text-zinc-200 hover:bg-slate-200/20"
            type="button"
            onClick={cleanInput}
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddNote;
