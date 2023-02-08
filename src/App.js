import logo from './logo.svg';
import { useState } from 'react';
import './App.css';
import Composer from './components/Composer/Composer';
import Map from './components/Map/Map';
import Preview from './components/Preview/Preview';


function App(){
  return (
    <>
    <div className="App">
      <Composer />
    </div>
    </>
  );
}

export default App;
