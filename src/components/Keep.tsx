import { useState } from "react";
import { api } from "~/utils/api";
import AddNote from "./AddNote";
import NavBar from "./NavBar";
import Notes from "./Notes";
import SideBar from "./SideBar";

const Keep = () => {
  const [searchText, setSearchText] = useState("");
  const [isSideBarOpen, toggleSideBar] = useState(true);
  const { data: notes } = api.notes.getAll.useQuery();
  if (!notes) {
    return null;
  }

  const filterData = notes?.filter(
    (note) =>
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <NavBar
        toggleSideBar={toggleSideBar}
        isSideBarOpen={isSideBarOpen}
        searchText={searchText}
        setSearchText={setSearchText}
      />
      <div className="flex min-h-screen w-screen min-w-full pt-20">
        <SideBar isSideBarOpen={isSideBarOpen} />
        <div className="flex flex-[1.5] flex-col overflow-y-auto">
          <AddNote />
          <Notes data={filterData} />
        </div>
      </div>
    </>
  );
};

export default Keep;
