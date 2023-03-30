import { useState } from "react";
import { api } from "~/utils/api";
import AddNote from "./AddNote";
import NavBar from "./NavBar";
import Notes from "./Notes";
import SideBar from "./SideBar";

const Keep = () => {
  const [searchText, setSearchText] = useState<string>("");
  const { data: notes, refetch } = api.notes.getAll.useQuery();

  const filterData = notes?.filter(
    (note) =>
      note.title.toLowerCase().includes(searchText.toLowerCase()) ||
      note.text.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <NavBar searchText={searchText} setSearchText={setSearchText} />
      <div className="flex min-h-screen w-screen min-w-full">
        <SideBar />
        <div className="flex flex-[1.5] flex-col">
          <AddNote refetch={refetch} />
          <Notes data={filterData} refetch={refetch} />
        </div>
      </div>
    </>
  );
};

export default Keep;
