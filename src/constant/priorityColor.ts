export const priorityColor = {
  rendah: "#DBEAFF",
  sedang: "#FFEDB8",
  tinggi: "#FFB8B8",
};

export const statusColor = {
  dikerjakan: priorityColor.rendah,
  belumDikerjakan: "#D9D9D9",
  selesai: "#B8FFD5",
};

export const statusConfig = {
  belumDikerjakan: {
    label: "Belum Dikerjakan",
    colorKey: "belumDikerjakan",
  },
  dikerjakan: {
    label: "Dikerjakan",
    colorKey: "dikerjakan",
  },
  selesai: {
    label: "Selesai",
    colorKey: "selesai",
  },
};
