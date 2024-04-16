import Demo from "../../component/CalendarEdit";


const AgendaKegiatan = () => {
  
  
  return (
    <div className="my-10 w-full flex flex-col items-center">
        <div className=" flex flex-col items-center w-full text-3xl font-bold">
            <span>AGENDA KEGIATAN GURU</span>
        
        </div>
        <div className="w-full p-6">
           {/* <MyScheduler data={appointments}/> */}
           <Demo/>
        </div>

      </div>
  );
};

export default AgendaKegiatan;
