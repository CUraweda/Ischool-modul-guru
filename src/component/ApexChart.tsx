import React from "react";
import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

interface ApexChartProps {
  data: {
    cuti: number[];
    izin: number[];
    hadir: number[];
    categories: string[];
    maxValue: number;
  };
}

const ApexChart: React.FC<ApexChartProps> = ({ data }) => {
  // Cek apakah semua data adalah nol
  const allZero =
    data.hadir.every((val) => val === 0) &&
    data.izin.every((val) => val === 0) &&
    data.cuti.every((val) => val === 0);

  if (allZero) {
    return (
      <div className="h-[350px]">
        Tidak ada data presensi untuk ditampilkan.
      </div>
    );
  }

  const series = [
    {
      name: "Hadir",
      data: data.hadir,
    },
    {
      name: "Izin",
      data: data.izin,
    },
    {
      name: "Cuti",
      data: data.cuti,
    },
  ];

  const options: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: data.categories,
    },
    yaxis: {
      min: 0,
      max: data.maxValue, // Atur sumbu Y berdasarkan nilai maksimum
      tickAmount: data.maxValue, // Tentukan jumlah tick sesuai nilai maksimum
      labels: {
        formatter: function (val) {
          return Math.floor(val).toString(); // label bilangan bulat
        },
      },
      title: {
        text: "Jumlah Hari",
      },
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return val + " hari";
        },
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={options}
          series={series}
          type="bar"
          height={400}
        />
      </div>
    </div>
  );
};

export default ApexChart;
