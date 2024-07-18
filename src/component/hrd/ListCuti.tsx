// import React, { useEffect, useState } from "react";
// import { TbTextSize } from "react-icons/tb";
// // import Select from "react-select";

// interface CutiData {
//   id: number;
//   data: {
//     nama: string;
//     tipe: string;
//     tanggal: string;
//     deskripsi: string;
//     status: string;
//     catatan: {
//       image: any;
//       hari: string;
//       jam: string;
//     };
//   };
// }

// type CutiList = CutiData[];

// interface ListCutiProps {
//   data: CutiList;
//   searchQuery: string;
// }

// const ListAbsensi: React.FC<ListCutiProps> = ({ data, searchQuery }) => {
//   const [filterDate, setFilterDate] = useState<string>("");
//   const [selectedFilters, setSelectedFilters] = useState<any[]>([]);
//   const filteredData = data.filter(
//     (item) =>
//       (item.data.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.data.tipe.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.data.deskripsi
//           .toLowerCase()
//           .includes(searchQuery.toLowerCase())) &&
//       (filterDate === "" || item.data.tanggal === filterDate) &&
//       (selectedFilters.length === 0 ||
//         selectedFilters.some(
//           (filter) =>
//             item.data.status === filter.value || item.data.tipe === filter.value
//         ))
//   );

//   const [currentDate, setCurrentDate] = useState<string>("");
//   const [currentClock, setClock] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const itemsPerPage = 7;

//   useEffect(() => {
//     const updateDateTime = () => {
//       const date = new Date();
//       const formattedDate = date.toLocaleDateString("en-US", {
//         year: "numeric",
//         month: "long",
//         day: "numeric",
//       });
//       const formattedClock = date.toLocaleTimeString("en-US", {
//         hour: "2-digit",
//         minute: "2-digit",
//         second: "2-digit",
//       });

//       setCurrentDate(formattedDate);
//       setClock(formattedClock);
//     };

//     updateDateTime();
//     const intervalId = setInterval(updateDateTime, 1000);

//     return () => clearInterval(intervalId);
//   }, []);

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchQuery, filterDate, selectedFilters]);

//   const indexOfLastItem = currentPage * itemsPerPage;
//   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
//   const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

//   const pageNumbers = [];
//   for (let i = 1; i <= Math.ceil(filteredData.length / itemsPerPage); i++) {
//     pageNumbers.push(i);
//   }

//   const filterOptions = [
//     { value: "Disetujui", label: "Disetujui" },
//     { value: "Tidak Disetujui", label: "Tidak Disetujui" },
//     { value: "Menunggu", label: "Menunggu" },
//     { value: "Cuti", label: "Cuti" },
//     { value: "Izin", label: "Izin" },
//   ];

//   const handleFilterChange = (selectedOptions: any) => {
//     setSelectedFilters(selectedOptions || []);
//   };

//   const handlePageChange = (pageNumber: number) => {
//     setCurrentPage(pageNumber);
//   };

//   const customStyles = {
//     control: (provided: any) => ({
//       ...provided,
//       borderRadius: "9999px",
//       height: "1rem",
//       borderColor: "#d1d5db",
//       fontSize: "0.875rem",
//       "&:hover": {
//         borderColor: "#9ca3af",
//       },
//     }),
//     multiValue: (provided: any) => ({
//       ...provided,
//       backgroundColor: "#e5e7eb",
//       borderRadius: "9999px",
//     }),
//     multiValueLabel: (provided: any) => ({
//       ...provided,
//       color: "#1f2937",
//     }),
//     multiValueRemove: (provided: any) => ({
//       ...provided,
//       color: "#6b7280",
//       "&:hover": {
//         backgroundColor: "#d1d5db",
//         color: "#1f2937",
//       },
//     }),
//   };

//   const handledetail = () => {
//     const modal = document.getElementById("my_modal_2") as HTMLDialogElement;
//     modal.showModal();
//   };
//   const handleconfirm = (state: String) => {
//     if ((state = "Disetujui")) {
//       const modal = document.getElementById("my_modal_4") as HTMLDialogElement;
//       modal.showModal();
//     } else {
//       const modal = document.getElementById("my_modal_4") as HTMLDialogElement;
//       modal.showModal();
//     }
//   };
//   return (
//     <div className="w-full">
//       <div className="flex-grow border-t border-gray-400 drop-shadow-sm my-5"></div>
//       <div className="flex w-full justify-between">
//         <div className="badge badge-md rounded-badge h-fit my-5 drop-shadow-sm bg-[#ffffffc2] text-md">
//           Semua
//           <div className="pl-5">{filteredData.length}</div>
//         </div>
//         <div className="my-auto flex gap-4">
//           <label className="input input-bordered input-sm text-md  rounded-full flex items-center gap-2 w-fit my-auto">
//             <input
//               type="date"
//               className="grow"
//               value={filterDate}
//               onChange={(e) => setFilterDate(e.target.value)}
//               placeholder="Search"
//             />
//           </label>
//           {/* <Select
//             isMulti
//             options={filterOptions}
//             className="basic-multi-select"
//             classNamePrefix="select"
//             styles={customStyles}
//             onChange={handleFilterChange}
//           /> */}
//         </div>
//       </div>
//       <div className="overflow-x-auto card h-fit min-h-[55vh] w-full bg-base-100 shadow-xl p-5">
//         <table className="table text-md">
//           <thead>
//             <tr>
//               <th>No</th>
//               <th>Nama</th>
//               <th>Tipe</th>
//               <th>Tanggal</th>
//               <th>Deskripsi</th>
//               <th>Status</th>
//               <th>Catatan</th>
//               <th>Action</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentItems.map((item, index) => (
//               <tr className="hover" key={item.id}>
//                 <td>{indexOfFirstItem + index + 1}</td>
//                 <td>{item.data.nama}</td>
//                 <td>
//                   <div
//                     className={`badge badge-md rounded-md px-3 h-fit drop-shadow-sm text-md ${
//                       item.data.tipe === "Izin"
//                         ? "text-[#3d6b2e] bg-[#8ef96ac2]"
//                         : item.data.tipe === "Cuti"
//                           ? "text-[#6b2e2e] bg-[#f96a6a]"
//                           : ""
//                     }`}
//                   >
//                     {item.data.tipe}
//                   </div>
//                 </td>{" "}
//                 <td>{item.data.tanggal}</td>
//                 <td>{item.data.deskripsi}</td>
//                 <td>
//                   <div
//                     className={`badge badge-md rounded-md px-3 h-fit drop-shadow-sm text-md ${
//                       item.data.status === "Disetujui"
//                         ? "text-[#3d6b2e] bg-[#8ef96ac2]"
//                         : item.data.status === "Tidak Disetujui"
//                           ? "text-[#6b2e2e] bg-[#f96a6a]"
//                           : item.data.status === "Menunggu"
//                             ? "text-[#6b2e2e] bg-[#f9f46a]"
//                             : ""
//                     }`}
//                   >
//                     {item.data.status}
//                   </div>
//                 </td>
//                 <td>
//                   <button
//                     className="btn btn-square btn-ghost"
//                     onClick={handledetail}
//                   >
//                     <svg
//                       width="22"
//                       height="25"
//                       viewBox="0 0 26 29"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         d="M22.882 20.9411L20.0586 18.1177"
//                         stroke="#6A6B6B"
//                         stroke-width="1.2"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                       />
//                       <path
//                         d="M13 25.1764V28H15.8236L25 18.8236L22.1764 16L13 25.1764Z"
//                         stroke="#6A6B6B"
//                         stroke-width="1.2"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                       />
//                       <path
//                         d="M1 13H8.5"
//                         stroke="#6A6B6B"
//                         stroke-width="1.2"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                       />
//                       <path
//                         d="M25 10V7C25 5.34314 23.6569 4 22 4H4C2.34314 4 1 5.34314 1 7V25C1 26.6569 2.34314 28 4 28H8.5"
//                         stroke="#6A6B6B"
//                         stroke-width="1.2"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                       />
//                       <path
//                         d="M17.5 1V7"
//                         stroke="#6A6B6B"
//                         stroke-width="1.2"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                       />
//                       <path
//                         d="M8.5 1V7"
//                         stroke="#6A6B6B"
//                         stroke-width="1.2"
//                         stroke-linecap="round"
//                         stroke-linejoin="round"
//                       />
//                     </svg>
//                   </button>
//                 </td>
//                 <td>
//                   <div className="flex-none dropdown dropdown-end">
//                     <button
//                       tabIndex={0}
//                       role="button"
//                       className="btn btn-square btn-ghost m-1"
//                     >
//                       <svg
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         className="inline-block w-4 h-4 stroke-current"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="2"
//                           d="M12 5h.01M12 12h.01M12 19h.01M12 6a1 1 0 100-2 1 1 0 000 2zm0 7a1 1 0 100-2 1 1 0 000 2zm0 7a1 1 0 100-2 1 1 0 000 2z"
//                         ></path>
//                       </svg>
//                     </button>
//                     <ul
//                       tabIndex={0}
//                       className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
//                     >
//                       <li>
//                         <div
//                           className=""
//                           onClick={() => handleconfirm("disetujui")}
//                         >
//                           Setujui Permintaan
//                         </div>
//                       </li>
//                       <li>
//                         <div
//                           className=""
//                           onClick={() => handleconfirm("tidak disetujui")}
//                         >
//                           Tidak Disetujui
//                         </div>
//                       </li>
//                     </ul>
//                   </div>

//                   {/* dialog */}
//                   <dialog id="my_modal_2" className="modal ">
//                     <div className="modal-box">
//                       <form method="dialog">
//                         <div className="flex justify-between items-center align-middle font-bold">
//                           <h1 className="text-xl">Detail</h1>
//                           <button className="btn btn-sm btn-circle btn-ghost">
//                             ✕
//                           </button>
//                         </div>
//                       </form>
//                       <div className="mt-5">
//                         <figure className="rounded-xl bg-cover">
//                           <img
//                             src="https://ideas.or.id/wp-content/themes/consultix/images/no-image-found-360x250.png"
//                             alt="Shoes"
//                             className="w-full h-[300px] bg-cover"
//                           />
//                         </figure>
//                         <div className="card-body text-lg">
//                           <h2 className="card-title font-semibold">
//                             {item.data.nama} {"*" + item.data.status}
//                           </h2>
//                           <div className="my-2 grid-cols-2 grid">
//                             <div className="w-1/2">
//                               <p className="font-semibold">Tanggal</p>
//                               <p>{item.data.tanggal}</p>
//                             </div>
//                             <div className="w-1/2">
//                               <p className="font-semibold">Hari/ Jam</p>
//                               <p>{item.data.tanggal}</p>
//                             </div>
//                           </div>
//                           <ul className="my-2">
//                             <li className="font-semibold">Deskripsi</li>
//                             <li>{item.data.deskripsi}</li>
//                           </ul>
//                         </div>
//                       </div>
//                     </div>
//                   </dialog>
//                   <dialog id="my_modal_4" className="modal">
//                     <div className="modal-box">
//                       <h3 className="font-bold text-lg">Konfirmasi!</h3>
//                       <p className="py-4">
//                         Tekan OK untuk mengonfirmasi bahwa pilihan Anda telah
//                         disimpan.
//                       </p>
//                       <div className="modal-action">
//                         <form method="dialog">
//                           <button className="btn btn-outline btn-error">
//                             Batal
//                           </button>
//                         </form>
//                         <form method="dialog">
//                           <button className="btn btn-primary">Ok</button>
//                         </form>
//                       </div>
//                     </div>
//                   </dialog>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       <div className="flex justify-center items-center h-fit">
//         <div className="join text-sm w-full max-w-fit my-8 mx-auto">
//           {pageNumbers.map((number) => (
//             <button
//               key={number}
//               onClick={() => handlePageChange(number)}
//               className={`join-item btn ${
//                 currentPage === number ? "btn-active" : ""
//               }`}
//             >
//               {number}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ListAbsensi;
