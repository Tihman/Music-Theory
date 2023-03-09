import React from "react";
import './App.css';
import { Piano1 } from './components/Piano.js';

export const Piano = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Piano1 />
      </header>
    </div>
  );
}