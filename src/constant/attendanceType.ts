export const listType = [
  { id: 1, category: "Type", value: "Masuk" },
  { id: 2, category: "Type", value: "Keluar" },
  { id: 3, category: "Status", value: "Terlalu Cepat" },
  { id: 4, category: "Status", value: "Tepat Waktu" },
  { id: 5, category: "Status", value: "Terlambat" },
];

export const worktimeType = {
  masuk: "bg-[#8ef96ac2] text-[#3d6b2e]",
  keluar: "bg-[#f96a6a] text-[#6b2e2e]",
};

export const attendanceStatus = {
  "Tepat Waktu": worktimeType.masuk,
  "Diluar Jadwal": worktimeType.keluar,
  Terlambat: "bg-[#f9f46a] text-[#6b2e2e]",
};
