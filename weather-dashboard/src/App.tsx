import React from 'react';
import logo from './logo.svg';
import './App.css';
import WeatherComponent from './WeatherComponent';
import Temp from './tempComponent'
import Radiation from './radiationComponent'


function App() {
  return (
    <div className="App">
      <WeatherComponent />
      <Temp />
      <Radiation />
      
     
    </div>
  );
}

export default App;
