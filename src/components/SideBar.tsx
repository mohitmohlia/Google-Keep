import React, { useEffect, useRef, useState } from "react";
import type { RouterOutputs } from "~/utils/api";
import { api } from "~/utils/api";
import Modal from "./Modal";
import Spinner from "./Spinner";

type labelsObjType = {
  [key: string]: { name: string; isHovered: boolean };
};
type Label = RouterOutputs["labels"]["getAll"][number];

const SideBar = ({ isSideBarOpen }: { isSideBarOpen: boolean }) => {
  const [showLabelModal, setShowLabelModal] = useState(false);
  const [isCreateLabelFocus, setIsCreateLabelFocus] = useState(false);
  const createRef = useRef(null);
  const [name, setName] = useState("");
  const [labelsObj, setLabelsObj] = useState<labelsObjType>({});
  const ctx = api.useContext();

  const { data: labels, isLoading: isLabelLoading } =
    api.labels.getAll.useQuery();
  const { mutate: createLabel, isLoading: isCreatingLabel } =
    api.labels.create.useMutation({
      onSuccess: () => {
        void ctx.labels.getAll.invalidate();
        setName("");
      },
    });
  const { mutate: editLabel, isLoading: isEditingLabel } =
    api.labels.update.useMutation({
      onSuccess: () => ctx.labels.getAll.invalidate(),
    });
  const { mutate: deleteLabel, isLoading: isDeletingLabel } =
    api.labels.delete.useMutation({
      onSuccess: () => {
        void ctx.labels.getAll.invalidate();
        void ctx.notes.getAll.invalidate();
      },
    });

  useEffect(() => {
    if (labels) {
      const obj = labels.reduce(
        (labels: labelsObjType, label) => ({
          ...labels,
          [label.id]: {
            ...labels[label.id],
            name: label.name,
            isHovered: false,
          },
        }),
        {}
      );
      setLabelsObj(obj);
    }
  }, [labels]);

  function handleCreateLabelFocus() {
    if (isCreateLabelFocus) {
      setIsCreateLabelFocus(false);
    } else {
      setIsCreateLabelFocus(true);
      createRef.current.focus();
    }
  }
  const handleLabelEditChange = (event: React.SyntheticEvent, label: Label) => {
    const newLabelName = (event.target as HTMLInputElement).value;
    const updatedObj: labelsObjType = {
      ...labelsObj,
      [label.id]: {
        ...labelsObj[label.id],
        name: newLabelName,
      },
    };
    setLabelsObj(updatedObj);
  };

  const handleHover = (labelId: string, shouldHover: boolean) => {
    const newObj: labelsObjType = {
      ...labelsObj,
      [labelId]: {
        ...labelsObj[labelId],
        isHovered: shouldHover,
      },
    };
    setLabelsObj(newObj);
  };

  if (!labels) {
    return <div />;
  }

  return (
    <div className="w-min">
      <div
        className={`flex items-center ${
          isSideBarOpen ? "rounded-r-full" : "rounded-full"
        }  w-max min-w-full p-4 text-2xl text-zinc-300 hover:bg-zinc-300/30`}
      >
        <div className="">
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
            <path d="M9 16a5 5 0 1 1 6 0a3.5 3.5 0 0 0 -1 3a2 2 0 0 1 -4 0a3.5 3.5 0 0 0 -1 -3" />
            <line x1="9.7" y1="17" x2="14.3" y2="17" />
          </svg>
        </div>
        <span className={`${isSideBarOpen ? "" : "hidden"} px-8`}>Notes</span>
      </div>
      {isLabelLoading ? (
        <Spinner />
      ) : (
        labels.map((label) => {
          return (
            <div
              key={label.id}
              className={`flex items-center ${
                isSideBarOpen ? "rounded-r-full" : "rounded-full"
              }  w-max min-w-full p-4 text-2xl text-zinc-300 hover:bg-zinc-300/30`}
            >
              <div className="">
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
                  <circle cx="8.5" cy="8.5" r="1" fill="currentColor" />
                  <path d="M4 7v3.859c0 .537 .213 1.052 .593 1.432l8.116 8.116a2.025 2.025 0 0 0 2.864 0l4.834 -4.834a2.025 2.025 0 0 0 0 -2.864l-8.117 -8.116a2.025 2.025 0 0 0 -1.431 -.593h-3.859a3 3 0 0 0 -3 3z" />
                </svg>
              </div>
              <span
                className={`${
                  isSideBarOpen ? "" : "hidden"
                } px-8 first-letter:capitalize`}
              >
                {label.name}
              </span>
            </div>
          );
        })
      )}
      <div
        className={`flex items-center ${
          isSideBarOpen ? "rounded-r-full" : "rounded-full"
        }  w-max min-w-full p-4 text-2xl text-zinc-300 hover:bg-zinc-300/30`}
        onClick={() => setShowLabelModal(true)}
      >
        <div className="">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-pencil"
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
            <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
            <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
          </svg>
        </div>
        <span className={`${isSideBarOpen ? "" : "hidden"} px-8`}>
          Edit labels
        </span>
      </div>
      <div
        className={`flex items-center ${
          isSideBarOpen ? "rounded-r-full" : "rounded-full"
        }  w-max min-w-full p-4 text-2xl text-zinc-300 hover:bg-zinc-300/30`}
      >
        <div className="">
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
            <rect x="3" y="4" width="18" height="4" rx="2" />
            <path d="M5 8v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-10" />
            <line x1="10" y1="12" x2="14" y2="12" />
          </svg>
        </div>
        <span className={`${isSideBarOpen ? "" : "hidden"} px-8`}>Archive</span>
      </div>
      <Modal
        show={showLabelModal}
        isEdit={true}
        resource="label"
        onClose={() => setShowLabelModal(false)}
      >
        <div className="min-w-max- min-h-max border-t-2">
          <div className="create label m-2 flex items-center p-4 text-zinc-200">
            <div onClick={handleCreateLabelFocus}>
              {isCreateLabelFocus ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-x"
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-plus"
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
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              )}
            </div>
            <form className="flex">
              <input
                ref={createRef}
                type="text"
                className="bg-transparent px-2 text-2xl leading-5 placeholder:text-lg focus:outline-none"
                placeholder="Create new label"
                onChange={(e) => setName(e.target.value)}
                value={name}
                onFocus={() => setIsCreateLabelFocus(true)}
              />
              <button
                className="h-10 w-10"
                type="submit"
                onClick={() => createLabel({ name })}
                disabled={isCreatingLabel || !name || !isCreateLabelFocus}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`icon icon-tabler icon-tabler-check ${
                    isCreateLabelFocus ? "" : "hidden"
                  }`}
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
                  <path d="M5 12l5 5l10 -10" />
                </svg>
              </button>
            </form>
            <div />
          </div>
          {labels.map((label) => {
            return (
              <div
                className="edit label m-2 flex items-center  p-4 text-zinc-200"
                key={label.id}
                onMouseEnter={() => handleHover(label.id, true)}
                onMouseLeave={() => handleHover(label.id, false)}
              >
                <div onClick={() => deleteLabel({ id: label.id })}>
                  {labelsObj[label.id]?.isHovered ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-trash"
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
                      <line x1="4" y1="7" x2="20" y2="7" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                      <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
                      <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-pencil"
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
                      <path d="M4 20h4l10.5 -10.5a1.5 1.5 0 0 0 -4 -4l-10.5 10.5v4" />
                      <line x1="13.5" y1="6.5" x2="17.5" y2="10.5" />
                    </svg>
                  )}
                </div>
                <form className="flex">
                  <input
                    type="text"
                    className="bg-transparent px-2 text-2xl leading-5 placeholder:text-lg focus:outline-none"
                    placeholder="Edit label"
                    onChange={(event) => handleLabelEditChange(event, label)}
                    value={labelsObj[label.id]?.name}
                  />
                  <button
                    disabled={isEditingLabel || !labelsObj[label.id]}
                    onClick={() =>
                      editLabel({
                        name: labelsObj[label.id]?.name || "",
                        id: label.id,
                      })
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon icon-tabler icon-tabler-check"
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
                      <path d="M5 12l5 5l10 -10" />
                    </svg>
                  </button>
                </form>
              </div>
            );
          })}
          <div className="m-2 flex justify-end border-t-2">
            <button className="flex rounded-lg px-4 py-3 text-lg text-zinc-100 hover:bg-zinc-700">
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SideBar;
