import React, { useState, useEffect } from 'react';
import Table from './Table';
import Dashboard from './Dashboard';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';

function App() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('https://497pklv78d.execute-api.us-east-1.amazonaws.com/api/items');
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const jsonData = await response.json();
        setData(jsonData);
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Impersonation Profile Data</h1>
      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <Typography variant="body1">Loading data, please wait...</Typography>
          <CircularProgress />
        </div>
      ) : (
        <>
          <Table data={data.items} />
          <Dashboard data={data.items} />
        </>
      )}
    </div>
  );
}

export default App;
