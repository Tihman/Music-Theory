import React from "react";
import Spectr from "./src/App";

export const Spectrogram = () => {
  return ( 
    <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'}}>
        {/* <header className="App-header"> */}
          <Spectr/>  
        {/* </header> */}
        
    </div> 
        
  )
}