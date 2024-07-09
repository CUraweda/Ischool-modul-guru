import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { ApexOptions } from 'apexcharts';

interface MonthDataSeries {
  prices: number[];
  dates: string[];
}

interface SeriesType {
  name: string;
  data: number[];
}

const monthDataSeries1: MonthDataSeries = {
  prices: [10000, 41000, 35000, 51000, 49000, 62000, 69000, 91000, 148000],
  dates: [
    '2018-09-19T00:00:00.000Z',
    '2018-09-20T01:30:00.000Z',
    '2018-09-21T02:30:00.000Z',
    '2018-09-22T03:30:00.000Z',
    '2018-09-23T04:30:00.000Z',
    '2018-09-24T05:30:00.000Z',
    '2018-09-25T06:30:00.000Z',
    '2018-09-26T07:30:00.000Z',
    '2018-09-27T08:30:00.000Z'
  ]
};

const ChartMap: React.FC = () => {
  const [series] = useState<SeriesType[]>([
    {
      name: "Total (Rupiah)",
      data: monthDataSeries1.prices
    }
  ]);

  const [options] = useState<ApexOptions>({
    chart: {
      type: 'area',
      height: 400,
      zoom: {
        enabled: true
      }
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      curve: 'straight'
    },
    title: {
      text: 'Pendapatan',
      align: 'left'
    },
   
    labels: monthDataSeries1.dates,
    xaxis: {
      type: 'datetime',
    },
    yaxis: {
      opposite: false
    },
    legend: {
      horizontalAlign: 'right'
    }
  });

  return (
    <div>
      <div id="chart" className=''>
        <ReactApexChart options={options} series={series} type="area" height={450} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ChartMap;
