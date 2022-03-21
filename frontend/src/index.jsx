import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import Button from '@mui/material/Button';
import {FormControl, InputLabel, Select, MenuItem} from '@mui/material';


import './assets/stylesheets/style.css';

// webpack hard-codes process.env.BACKEND_PORT in the build
const BACKEND_PORT = process.env.BACKEND_PORT;
const baseUrl = window.location.hostname;
const backendUrl = `http://${baseUrl}:${BACKEND_PORT}`;

// Asynchronous function for getting data from the backend /api/greeting endpoint
const getGreetingFromBackend = async () => {
  try {
    const url = `${backendUrl}/api/greeting`;
    console.log(`Getting greeting from ${url}`);
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    console.error(error);
  }
  return { greeting: 'Could not get greeting from backend' };
};


const BackendGreeting = (props) => {
  
  const [age, setAge] = useState(0);

  const handleChange = (event) => {
    setAge(event.target.value);
  }

  return (
  <div>
    <Button variant='contained'>Hello World</Button>

    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">Age</InputLabel>
      <Select
      labelId="demo-simple-select-label"
      id="demo-simple-select"
      value={age}
      label="Age"
      onChange={handleChange}
      >
      <MenuItem value={10}>Ten</MenuItem>
      <MenuItem value={20}>Twenty</MenuItem>
      <MenuItem value={30}>Thirty</MenuItem>
    </Select>
  </FormControl>
    <p>
      Backend says:
      {' '}
      {props.greeting}
    </p>
  </div>
);}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      greeting: '',
    };
  }

  async componentDidMount() {
    const response = await getGreetingFromBackend();
    this.setState({ greeting: response.greeting });
  }

  render() {
    return (
      <BackendGreeting greeting={this.state.greeting} />
    );
  }
}

ReactDOM.render(
  <App />,
  document.getElementById('root'),
);
