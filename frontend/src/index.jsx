import React, { Component, useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {FormControl, InputLabel, Select, MenuItem, Button} from '@mui/material';


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

let sensorList = [];

// fetch sensor data from backend
const getData = async (sensor_id = String) => {
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

  const res = await fetch(`${backendUrl}/api/events/?sensor_id=${sensor_id}`);
  const { results } = await res.json();

  // add the fetched data into the data structure above
  results.forEach(datapoint => {
    data.datasets[0].data.push(datapoint.temperature);
    data.datasets[1].data.push(datapoint.humidity);
    data.labels.push(formatDateTime(datapoint.createdAt));
  });

  return data;
}

const getSensors = async () => {
  const res = await fetch(`${backendUrl}/api/events/sensors`);
  const { results } = await res.json();

  sensorList = results.filter(result => result != null);

  return results.filter(result => result != null).map((result, index) =>
    <MenuItem key={index} value={index}>{result}</MenuItem>
  );
}

const App = () => {
  const [data, setData] = useState();
  const [sensorElementList, setSensorList] = useState([]);
  const [sensor, setSensor] = useState(0);

  const handleChange = async (event) => {
    setSensor(event.target.value);
    setData(await getData(sensorList[event.target.value]));
  }

  const handleRefresh = async () => {
    setData(await getData(sensorList[sensor]));
  }

  // useEffect will be run only on the first render
  useEffect(async () => {
    // here we get the data from the backend...
    
    const sensorData = await getSensors();
    setSensorList(sensorData);


    const chartData = await getData(sensorList[0]);
    // ...and store it for later use
    setData(chartData);
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
          
          { sensorElementList }
        </Select>
      </FormControl>
      <Line data={data} opotions={options} />
      <Button onClick={() => handleRefresh()}>Refresh</Button>
    </div>
  );
}

const formatDateTime = (raw = string) => {
  const d = new Date(raw);
  const WEEKDAYS = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thrusday',
    'Friday',
    'Saturday'
  ]

  return `${WEEKDAYS[d.getDay()]} ${formatAMPM(d)}`;
}

// https://stackoverflow.com/questions/8888491/how-do-you-display-javascript-datetime-in-12-hour-am-pm-format
function formatAMPM(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0'+minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;

  return strTime;
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
