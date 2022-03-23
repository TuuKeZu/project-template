import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';


import { Chart as ChartJS } from 'chart.js/auto'
import { Line } from 'react-chartjs-2';

import './assets/stylesheets/style.css';

// webpack hard-codes process.env.BACKEND_PORT in the build
const BACKEND_PORT = process.env.BACKEND_PORT;
const baseUrl = window.location.hostname;
// const backendUrl = `http://${baseUrl}:${BACKEND_PORT}`;
const backendUrl = `http://localhost:9000`;

// options for a chart
const options = {
  maintainAspectRatio: false,
}

// fetch sensor data from backend
const getData = async () => {

  // the format in which data is passed to a chart
  const data = {
    datasets: [
      {
        label: 'Temperature (°C)',
        data: [],
        borderColor: 'rgb(220, 0, 0)',
      },
      {
        label: 'Humidity (%RH)',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
      }
    ],
    labels: []
  }

  const res = await fetch(`${backendUrl}/api/events/all`);
  const { results } = await res.json();

  // add the fetched data into the data structure above
  results.forEach(datapoint => {
    data.datasets[0].data.push(datapoint.temperature);
    data.datasets[1].data.push(datapoint.humidity);
    data.labels.push(datapoint.createdAt);
  });

  return data;
}

const getSensors = async () => {
  const res = await fetch(`${backendUrl}/api/events/sensors`);
  const { results } = await res.json();

  console.log(results);

  return results.filter(result => result != null).map((result, index) => 
    <MenuItem key={index} value={index}>{result}</MenuItem>
  );
}

const App = () => {
  const [data, setData] = useState();
  const [sensorList, setSensorList] = useState([]);
  const [sensor, setSensor] = useState(0);

  const handleChange = (event) => {
    setSensor(event.target.value);
    
  }

  // useEffect will be run only on the first render
  useEffect(async () => {
    // here we get the data from the backend...
    const chartData = await getData();
    console.log(chartData);
    // ...and store it for later use
    setData(chartData);

    const sensorData = await getSensors();
    console.log(sensorData);
    setSensorList(sensorData);
  }, []);

  // display loading text until we have fetched the data
  if (!data) {
    return <div>Loading</div>
  }


  return (
    <div className='chart'>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Sensor</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={sensor}
            label="Sensor"
            onChange={handleChange}
          >
          
          { sensorList }
        </Select>
      </FormControl>
      <Line data={data} opotions={options} />
    </div>
  );
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
