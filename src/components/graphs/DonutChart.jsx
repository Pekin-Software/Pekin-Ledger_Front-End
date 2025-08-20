import React, { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './graphStyles.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

const DonutChart = () => {
    // Example values
  const oldValue = 190567;
  const newValue = 200000;

  const percentageChange = ((newValue - oldValue) / oldValue) * 100;

  
  let arrow = '';
  let color = '';

  if (percentageChange > 0) {
    arrow = '↑';
    color = 'green';
  } else if (percentageChange < 0) {
    arrow = '↓';
    color = 'red';
  } else {
    arrow = '→';
    color = 'blue';
  }

  const data = useMemo(() => ({
    labels: ['Store', 'Ordered'],
    datasets: [
      {
        data: [70, 30],
        backgroundColor: ['#1c1c1c', '#656565'],
        borderWidth: 0,
        cutout: '60%',
      },
    ],
  }), []);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
  display: true,
  formatter: (value) => `${value}%`,
  color: '#1d1b1bff',
  backgroundColor: '#e4e6e9ff',     
  borderRadius: 50,           
  padding: {
    top: 5,
    bottom: 4,
    left: 2,
    right: 2,
  },
  font: {
    size: 9,
    weight: 'bold',
  },
  align: 'center',
  anchor: 'center',
  clip: false,
},
 tooltip: {
  enabled: false,
},
},
}), []);

  return (
    <div className='donut-container'>
      <div className='donut-header'>   
        <h4 className='donut-title'>Order Report</h4>
        <div>
          <p className='lrd'>LRD$ {newValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
          <p>USD$ 952.8</p>
          <p className='ratio'>
            <span style={{ color }}>{arrow} {Math.abs(percentageChange).toFixed(1)}%</span> vs last Week
          </p>        
        </div>
      </div>
       <div className='donut-graph'>
        <div className='graph'> <Doughnut data={data} options={options} /></div>
        <div className="custom-legend">
          <div><span className="dot store"></span> Store</div>
          <div><span className="dot ordered"></span> Ordered</div>
        </div>
       </div>
    </div>
  );
};

export default DonutChart;
