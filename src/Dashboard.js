import React, { useState, useEffect } from 'react';
import { Container, Typography, Divider, TextField, MenuItem } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function Dashboard({ data }) {
  const [xAxisVariable, setXAxisVariable] = useState('searchTerm');
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    // Destroy existing chart instance before rendering a new one
    if (chartInstance) {
      chartInstance.destroy();
    }

    // Render new chart instance
    const newChartInstance = renderChart();
    setChartInstance(newChartInstance);

    // Clean up chart instance on component unmount
    return () => {
      if (newChartInstance) {
        newChartInstance.destroy();
      }
    };
  }, [data, xAxisVariable]); // Re-render chart when data, filter, or x-axis variable changes

  const renderChart = () => {
    let labels;
    let counts;

    switch (xAxisVariable) {
      case 'date':
        // Extract dates from data and sort them chronologically
        const dates = data.map(item => new Date(item.createdAt));
        dates.sort((a, b) => a - b);

        // Count occurrences of each date
        counts = dates.reduce((acc, date) => {
          const formattedDate = date.toLocaleDateString();
          acc[formattedDate] = (acc[formattedDate] || 0) + 1;
          return acc;
        }, {});

        labels = Object.keys(counts);
        break;

      case 'type':
        // Calculate counts for each type
        counts = data.reduce((acc, item) => {
          acc[item.type] = (acc[item.type] || 0) + 1;
          return acc;
        }, {});

        labels = Object.keys(counts);
        break;

      case 'source':
        // Calculate counts for each source
        counts = data.reduce((acc, item) => {
          acc[item.source] = (acc[item.source] || 0) + 1;
          return acc;
        }, {});

        labels = Object.keys(counts);
        break;

      default: // 'searchTerm' or default
        // Calculate counts for each search term
        counts = data.reduce((acc, item) => {
          acc[item.searchTerm] = (acc[item.searchTerm] || 0) + 1;
          return acc;
        }, {});

        labels = Object.keys(counts);
        break;
    }

    return new Chart(document.getElementById('bar-chart'), {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Count',
            backgroundColor: 'rgba(75,192,192,1)',
            borderColor: 'rgba(0,0,0,1)',
            borderWidth: 1,
            data: Object.values(counts),
          },
        ],
      },
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
            },
          }],
        },
      },
    });
  };

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>

      <div>
        <TextField
          select
          label="X-Axis Variable"
          value={xAxisVariable}
          onChange={e => setXAxisVariable(e.target.value)}
        >
          <MenuItem value="searchTerm">Search Term</MenuItem>
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="type">Type</MenuItem>
          <MenuItem value="source">Source</MenuItem>
        </TextField>
      </div>

      <Divider />

      <div style={{ marginTop: '20px' }}>
        <Typography variant="h5" gutterBottom>
          {xAxisVariable === 'date' ? 'Date Counts' : 'Search Term Counts'} (Bar Graph)
        </Typography>
        <canvas id="bar-chart" />
      </div>
    </Container>
  );
}

export default Dashboard;
