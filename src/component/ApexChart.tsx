import ReactApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const ApexChart = () => {
  const series = [
    {
      name: "Masuk",
      data: [12, 30, 29, 31, 12, 23, 23, 12, 12],
    },
    {
      name: "Izin",
      data: [3, 2, 4, 5, 5, 10, 10, 12, 3],
    },
    {
      name: "Cuti",
      data: [4, 2, 1, 0, 12, 12, 8, 1, 12],
    },
  ];
  const option: ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "90%",
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
      categories: [
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
      ],
    },

    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return +val + " hari";
        },
      },
    },
  };

  return (
    <div>
      <div id="chart">
        <ReactApexChart
          options={option}
          series={series}
          type="bar"
          height={300}
        />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
