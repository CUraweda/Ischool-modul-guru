import MyScheduler from "../../component/calendar";

const JadwalDinas = () => {
  const appointments = [
    {
      title: "Rapat rutin",
      startDate: new Date("2024-03-11 07:03:44"),
      endDate: new Date("2024-03-11 09:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Dinas Luar",
      startDate: new Date("2024-03-12 07:03:44"),
      endDate: new Date("2024-03-12 09:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Study Tour",
      startDate: new Date("2024-03-13 07:03:44"),
      endDate: new Date("2024-03-13 09:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Study Tour ke 2",
      startDate: new Date("2024-03-14 07:03:44"),
      endDate: new Date("2024-03-14 09:03:44"),
      priority: 2,
      location: "Room 3",
    },
  ];
  return (
    <div className="my-10 w-full flex flex-col items-center">
      <div className="flex flex-col items-center w-full text-3xl font-bold justify-center text-center">
        <span>JADWAL KEDINASAN TAHUN 2024</span>
        <span className="text-xl">Bulan Februari</span>
      </div>
      <div className="w-full p-6">
        <MyScheduler data={appointments} />
      </div>
    </div>
  );
};

export default JadwalDinas;
