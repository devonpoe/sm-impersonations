import React, { useState, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';

const PageGraph = ({ pageData }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const chartRef = useRef(null);

  useEffect(() => {
    // Filter pageData based on searchTerm
    const filtered = pageData.filter(item => item.searchTerm === searchTerm);
    setFilteredData(filtered);

    // Destroy previous Chart instance before rendering a new one
    if (chartRef.current) {
      chartRef.current.chartInstance.destroy();
    }
  }, [pageData, searchTerm]);

  const getDataByDate = () => {
    const dataByDate = {};
    filteredData.forEach(item => {
      const date = item.createdAt.split('T')[0];
      if (dataByDate[date]) {
        dataByDate[date]++;
      } else {
        dataByDate[date] = 1;
      }
    });
    return Object.values(dataByDate);
  };

  const getLabels = () => {
    const labels = [];
    filteredData.forEach(item => {
      const date = item.createdAt.split('T')[0];
      if (!labels.includes(date)) {
        labels.push(date);
      }
    });
    return labels;
  };

  const chartData = {
    labels: getLabels(),
    datasets: [
      {
        label: 'Pages Found',
        data: getDataByDate(),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: 'time',
        time: {
          unit: 'day',
        },
      },
      y: {
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search Term"
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />
      <Line ref={chartRef} data={chartData} options={options} />
    </div>
  );
};

export default PageGraph;
