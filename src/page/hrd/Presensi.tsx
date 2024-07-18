import React, { useState } from "react";
// import ListAbsensi from "../../component/hrd/ListAbsensi";
// import TestRekap from "../../../TestRekap.json";

const PresensiPage = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };
  return (
    <div className="p-10 w-full ">
      <div className="w-full flex">
        <div className=" text-xl breadcrumbs w-full text-center items-center">
          <ul className="my-auto h-full">
            <li className="font-bold">
              <a>Presensi</a>
            </li>
            <li>Rekap Kehadiran</li>
          </ul>
        </div>
        <label className="input input-bordered input-md text-lg flex items-center gap-2 w-1/2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-4 h-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            className="grow"
            placeholder="Search"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </label>
      </div>

      <div className="">
        {/* <ListAbsensi data={TestRekap} searchQuery={searchQuery} /> */}
      </div>
    </div>
  );
};
export default PresensiPage;
