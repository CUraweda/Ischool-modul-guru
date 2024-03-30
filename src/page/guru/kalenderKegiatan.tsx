import Demo from "../../component/CalendarEdit";


const KalenderKegiatan = () => {
  const appointments = [
    {
      title: "Kunjungan",
      startDate: new Date("2024-03-11 07:03:44"),
      endDate: new Date("2024-03-11 09:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Rapat",
      startDate: new Date("2024-03-12 07:03:44"),
      endDate: new Date("2024-03-12 09:03:44"),
      priority: 2,
      location: "Room 3",
    },
    {
      title: "Rapat bersama walimurid",
      startDate: new Date("2024-03-13 07:03:44"),
      endDate: new Date("2024-03-13 09:03:44"),
      priority: 2,
      location: "Room 3",
    },
   
   
  ];
  
  return (
    <div className="my-10 w-full flex flex-col items-center">
        <div className=" flex flex-col items-center w-full text-3xl font-bold">
            <span>KALENDER KEGIATAN TAHUN 2023 / 2024</span>
        
        </div>
        <div className="w-full p-6">
           {/* <MyScheduler data={appointments}/> */}
           <Demo/>
        </div>

      </div>
  );
};

export default KalenderKegiatan;
