import React from "react";
import Layout from "../component/Layout";
import guru from "../assets/guru.png";
import asesment from "../assets/Asesmen.png"
import { FaDownload } from "react-icons/fa";

const dashboard = () => {
  return (
    <div>
      <Layout name="Overview">
        <div className="flex justify-center my-10 flex-col items-center">
          <span className="text-3xl font-bold">Dashboard Guru</span>
          <div className="flex justify-between w-full flex-wrap">
            <div className="p-3 sm:w-1/3 w-full">
              <div className="bg-green-200 w-full rounded-md p-3 flex flex-col items-center gap-3">
                <span className="text-2xl font-bold">Presensi</span>
                <div className="w-full flex">
                  <div className="w-2/5">
                    <div className="w-full flex justify-center">
                      <img src={guru} alt="guru" className="w-32" />
                    </div>
                  </div>
                  <div className="w-3/5 flex flex-col items-center px-3 gap-3">
                    <div className="w-full flex justify-between">
                      <span>Hadir ( Ontime )</span>
                      <span>9</span>
                    </div>
                    <div className="w-full flex justify-between">
                      <span>sakit</span>
                      <span>9</span>
                    </div>
                    <div className="w-full flex justify-between">
                      <span>Cuti</span>
                      <span>9</span>
                    </div>
                    <div className="w-full flex justify-between">
                      <span>Alfa</span>
                      <span>9</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 sm:w-1/3 w-full">
              <div className="bg-red-200 w-full rounded-md p-3 flex flex-col items-center gap-3">
                <span className="text-2xl font-bold">Asesment</span>
                <div className="w-full flex">
                  <div className="w-2/5">
                    <div className="w-full flex justify-center">
                      <img src={asesment} alt="guru" className="w-32" />
                    </div>
                  </div>
                  <div className="w-3/5 flex flex-col items-center px-3 gap-3">
                    <div className="w-full flex justify-between">
                      <span>Narasi</span>
                      <span>9 jan</span>
                      <span><FaDownload /></span>
                    </div>
                    <div className="w-full flex justify-between">
                      <span>Portofolio</span>
                      <span>9 jan</span>
                      <span><FaDownload /></span>
                    </div>
                    <div className="w-full flex justify-between">
                      <span>Rapot angka</span>
                      <span>9 jan</span>
                      <span><FaDownload /></span>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
            <div className="p-3 sm:w-1/3 w-full">
            <div className="bg-blue-200 w-full rounded-md p-3 flex flex-col items-center gap-3">
                <span className="text-2xl font-bold">Overview</span>
                <div className="w-full flex">
                  <div className="w-2/5">
                    <div className="w-full flex justify-center">
                      <img src={asesment} alt="guru" className="w-32" />
                    </div>
                  </div>
                  <div className="w-3/5 flex flex-col items-center px-3 gap-3">
                    <div className="w-full flex justify-between">
                      <span>Narasisdsad</span>
                      <span>9 jan</span>
                      <span><FaDownload /></span>
                    </div>
                    <div className="w-full flex justify-between">
                      <span>Portofolio</span>
                      <span>9 jan</span>
                      <span><FaDownload /></span>
                    </div>
                    <div className="w-full flex justify-between">
                      <span>Rapot angka</span>
                      <span>9 jan</span>
                      <span><FaDownload /></span>
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default dashboard;
