// import React from 'react'

import { useEffect, useState } from "react";
import ChartMap from "../../component/ChartMap";
import {
  FaChartPie,
  FaExclamationTriangle,
  FaMoneyBillWave,
  FaWallet,
} from "react-icons/fa";
import { moneyFormat } from "../../utils/common";
import { DashboardKeuangan, PosPembayaran } from "../../midleware/api";
import { Store } from "../../store/Store";
import moment from "moment";
import { Link } from "react-router-dom";
import { Input, Select } from "../../component/Input";

const Dashboard = () => {
  const { token } = Store();

  // cards
  const [totalIncome, setTotalIncome] = useState(0),
    [monthIncome, setMonthIncome] = useState(0),
    [todayIncome, setTodayIncome] = useState(0),
    [inArrearCount, setInArrearCount] = useState(0),
    [lunasPercentage, setLunasPercentage] = useState(0);

  // recent data
  const [recentPaidOff, setRecentPaidOff] = useState<any[]>([]);

  const getCards = async () => {
    try {
      const res = await DashboardKeuangan.getCards(token);
      const data = res.data;

      setTotalIncome(data.income?.total?.sum ?? 0);
      setMonthIncome(data.income?.this_month?.sum ?? 0);
      setTodayIncome(data.income?.this_day?.sum ?? 0);
      setLunasPercentage(data.bills?.success_percentage ?? 0);
      setInArrearCount(data.bills?.in_arrears ?? 0);
      setRecentPaidOff(data.bills?.recent_paidoff ?? []);
    } catch {}
  };

  useEffect(() => {
    getCards();
  }, []);

  // charts
  const [postPayments, setPostPayments] = useState<any[]>([]);

  const [postPaymentId, setPostPaymentId] = useState(""),
    [chartStartDate, setChartStartDate] = useState(""),
    [chartEndDate, setChartEndDate] = useState("");

  const getPostPayments = async () => {
    try {
      const res = await PosPembayaran.showAll(token, "", 0, 1000);
      setPostPayments(res.data?.data?.result ?? []);
    } catch {}
  };

  useEffect(() => {
    getPostPayments();
  }, []);

  return (
    <>
      <div className="w-full p-5">
        <div className="w-full flex flex-wrap gap-3 mt-3">
          <div className="stat w-fit grow bg-base-100 rounded-lg border">
            <div className="stat-figure text-primary">
              <FaWallet size={28} />
            </div>
            <div className="stat-title">Total pendapatan</div>
            <div className="stat-value overflow-hidden text-ellipsis text-primary">
              {moneyFormat(totalIncome)}
            </div>
          </div>
          <div className="stat w-fit grow bg-base-100 rounded-lg border">
            <div className="stat-figure text-primary">
              <FaMoneyBillWave size={28} />
            </div>
            <div className="stat-title">Pendapatan hari ini</div>
            <div className="stat-value overflow-hidden text-ellipsis text-primary">
              {moneyFormat(todayIncome)}
            </div>
          </div>
          <div className="stat w-fit grow bg-base-100 rounded-lg border">
            <div className="stat-figure text-primary">
              <FaMoneyBillWave size={28} />
            </div>
            <div className="stat-title">Pendapatan bulan ini</div>
            <div className="stat-value overflow-hidden text-ellipsis text-primary">
              {moneyFormat(monthIncome)}
            </div>
          </div>
          <div className="stat w-fit grow bg-base-100 rounded-lg border">
            <div className="stat-figure text-success">
              <FaChartPie size={28} />
            </div>
            <div className="stat-title">Persentase kelunasan</div>
            <div className="stat-value overflow-hidden text-ellipsis text-success">
              {lunasPercentage.toFixed(2)}%
            </div>
          </div>
          <div className="stat w-fit grow bg-base-100 rounded-lg border">
            <div className="stat-figure text-error">
              <FaExclamationTriangle size={28} />
            </div>
            <div className="stat-title">Jumlah menunggak</div>
            <div className="stat-value overflow-hidden text-ellipsis text-error">
              {inArrearCount}
            </div>
          </div>
        </div>

        <div className="divider"></div>

        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3">
          <div className="col-span-2">
            {/* chart filter  */}
            <div className="w-full flex items-center justify-end gap-3 flex-wrap">
              <div>
                <Select
                  placeholder="Pos Keuangan"
                  keyValue="id"
                  keyDisplay="name"
                  value={postPaymentId}
                  onChange={(e) => setPostPaymentId(e.target.value)}
                  options={postPayments}
                />
              </div>
              <div className="flex items-center">
                <Input
                  type="date"
                  value={chartStartDate}
                  onChange={(e) => setChartStartDate(e.target.value)}
                />
                <div className="w-4 h-1 bg-gray-400 relative -top-1"></div>
                <Input
                  type="date"
                  value={chartEndDate}
                  onChange={(e) => setChartEndDate(e.target.value)}
                />
              </div>
            </div>

            <div className="w-full bg-white p-3 rounded-md border">
              <ChartMap />
            </div>
          </div>

          {/* recent */}
          <div className="col-span-1">
            <div className="bg-base-100 p-3 rounded-lg border">
              <h4 className="text-lg font-bold mb-6">Pembayaran Terbaru</h4>

              {recentPaidOff.map((item, i) => (
                <div className="px-3" key={i}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-base sm:text-lg">
                        {item.student?.full_name ?? "-"}
                      </p>
                      <div className="flex gap-2 items-start">
                        <p className="text-sm text-gray-500">
                          {item.studentpaymentbill?.name ?? "-"}
                        </p>
                        <Link
                          to={
                            "/keuangan/jenis-pembayaran/" +
                              item.studentpaymentbill?.id ?? ""
                          }
                          className="btn btn-link px-0 btn-xs relative -top-1"
                        >
                          Lihat
                        </Link>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-end text-gray-500">
                        {item.paidoff_at
                          ? moment(item.paidoff_at).fromNow()
                          : "-"}
                      </p>
                    </div>
                  </div>
                  <div className="divider"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
