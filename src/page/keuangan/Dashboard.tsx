// import React from 'react'

import ChartMap from "../../component/ChartMap"

const Dashboard = () => {
  return (
    <>
     <div className="w-full p-5">
        <div className="w-full flex flex-wrap mt-3">
          <div className="w-full sm:w-1/3  p-3 ">
            <div className="w-full bg-white rounded-md shadow-lg flex justify-center items-center relative  overflow-hidden">
              <div className="w-24 h-52 py-10">
                <div className="w-full h-full bg-gradient-to-r from-orange-500 via-pink-500 to-yellow-500 rounded-full blur-xl"></div>
              </div>
              <div className="glass w-full h-52 absolute rounded-md p-4">
                <div className="flex justify-center items-center flex-col">
                  <span className="font-bold text-black">
                    Pendapatan Bulan ini
                  </span>
                  <div className="flex items-end">
                    <p>
                      <span className="font-semibold">Rp. </span>
                      <span className="text-[80px] font-bold">23.000</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/3  p-3 ">
            <div className="w-full bg-white rounded-md shadow-lg flex justify-center items-center relative  overflow-hidden">
              <div className="w-24 h-52 py-10">
                <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full blur-xl"></div>
              </div>
              <div className="glass w-full h-52 absolute rounded-md p-4">
                <div className="flex justify-center items-center flex-col">
                  <span className="font-bold text-black">
                    Pendapatan Hari Ini
                  </span>
                  <div className="flex items-end">
                    <p>
                      <span className="font-semibold">Rp. </span>
                      <span className="text-[80px] font-bold">23.000</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full sm:w-1/3  p-3 ">
            <div className="w-full bg-white rounded-md shadow-lg flex justify-center items-center relative  overflow-hidden">
              <div className="w-24 h-52 py-10">
                <div className="w-full h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-xl"></div>
              </div>
              <div className="glass w-full h-52 absolute rounded-md p-4">
                <div className="flex justify-center items-center flex-col">
                  <span className="font-bold text-black">
                    Total Pendapatan
                  </span>
                  <div className="flex items-end">
                    <p>
                      <span className="font-semibold">Rp. </span>
                      <span className="text-[80px] font-bold">23.000</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex justify-end gap-3 p-3 flex-wrap">
          <select
            className="select select-bordered bg-white w-40"
            // onChange={(e) =>
            //   formik.setFieldValue("semester", e.target.value)
            // }
          >
            <option>Pos Keuangan</option>
            <option value={1}>1</option>
            <option value={2}>2</option>
          </select>

          <div className="flex justify-center gap-2 items-center ">
            <input
              type="date"
              placeholder="Type here"
              className="input w-full"
            />
            -
            <input
              type="date"
              placeholder="Type here"
              className="input w-full"
            />
          </div>
        </div>

        <div className="w-full p-3 ">
          <div className="w-full bg-white p-3 rounded-md">
            <ChartMap />
          </div>
        </div>
      </div>
    </>
  )
}

export default Dashboard