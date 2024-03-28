
import MyScheduler from "../../component/calendar";

const jadwalMengajar = () => {
  const appointments = [
    {
      title: "IPA - kelas VII",
      startDate: new Date("2024-03-11 07:03:44"),
      endDate: new Date("2024-03-11 09:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "MTK - kelas VII",
      startDate: new Date("2024-03-11 10:03:44"),
      endDate: new Date("2024-03-11 12:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "IPS - kelas VII",
      startDate: new Date("2024-03-12 07:03:44"),
      endDate: new Date("2024-03-12 09:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "BINDO - kelas VII",
      startDate: new Date("2024-03-12 10:03:44"),
      endDate: new Date("2024-03-12 12:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Tartili - kelas VII",
      startDate: new Date("2024-03-13 07:03:44"),
      endDate: new Date("2024-03-13 09:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Qur'an - kelas VII",
      startDate: new Date("2024-03-13 10:03:44"),
      endDate: new Date("2024-03-13 12:03:44"),
      priority: 2,
      location: "Room 3",
    },
   
  ];
  return (
    <div className="my-10 w-full flex flex-col items-center">
    <div className=" flex flex-col items-center w-full text-3xl font-bold text-center">
        <span>JADWAL KEGIATAN BELAJAR MENGAJAR</span>
        <span className="text-xl">Bulan Februari</span>
    </div>
    <div className="w-full p-6">
        <MyScheduler data={appointments}/>
    </div>

  </div>
  );
};

export default jadwalMengajar;
