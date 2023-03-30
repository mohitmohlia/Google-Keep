import { signOut, useSession } from "next-auth/react";
import { type Dispatch } from "react";

import Image from "next/image";
const NavBar = ({
  searchText,
  setSearchText,
}: {
  searchText: string;
  setSearchText: Dispatch<string>;
}) => {
  const { data: sessionData } = useSession();

  return (
    <nav className="w-full border-b-2 border-zinc-600 bg-zinc-800">
      <ul className="flex">
        <li className="py-5 px-4 text-4xl text-zinc-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="icon icon-tabler icon-tabler-menu-2"
            width="36"
            height="36"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="#ffffff"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </li>
        <li className=" flex flex-grow items-center py-4  px-2 text-4xl text-zinc-100">
          <div className="px-2">
            <Image src={"/keep.png"} width={50} height={50} alt="keep logo" />
          </div>
          <span>Keep</span>
        </li>
        <li className="flex flex-grow-[2] items-center justify-center">
          <div className="flex h-14 w-full items-center rounded-lg bg-zinc-700">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-search ml-4"
              width="36"
              height="36"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ffffff"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <circle cx="10" cy="10" r="7" />
              <line x1="21" y1="21" x2="15" y2="15" />
            </svg>

            <input
              type="text"
              placeholder="Search"
              className="ml-4 h-3/4 w-full rounded-lg bg-zinc-700 text-2xl text-zinc-50 placeholder:text-zinc-500 focus:outline-none"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <button className="mr-4" onClick={() => setSearchText("")}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-x"
                width="36"
                height="36"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#ffffff"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </li>
        <li className="flex flex-grow justify-center p-4">
          <div className="flex flex-row">
            <Image
              src={sessionData?.user.image || ""}
              alt={sessionData?.user.name || "author"}
              height={50}
              width={50}
            />
            <button
              className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
              onClick={() => void signOut()}
            >
              Sign Out
            </button>
          </div>
        </li>
      </ul>
    </nav>
  );
};

export default NavBar;
