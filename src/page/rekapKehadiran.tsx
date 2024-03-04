import React from "react";
import Layout from "../component/Layout";
import Calendar from "../component/calendar";

const jadwalMengajar = () => {
  return (
    <Layout name="rekap kehadiran">
      <div className="my-10 w-full flex flex-col items-center">
        <div className=" flex flex-col items-center w-full text-3xl font-bold">
            <span>KEHADIRAN GURU TAHUN 2023 / 2024</span>
            <span className="text-xl">Bulan Februari</span>
        </div>
        <div className="w-full p-6">
            <Calendar/>
        </div>

      </div>
    </Layout>
  );
};

export default jadwalMengajar;
