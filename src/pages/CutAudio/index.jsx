import React from "react";
import { CutExample } from "../CutExample";


export const CutAudio = () => {
  return (
    <div>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="stylesheet" href="style1.css" />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossOrigin="anonymous" referrerPolicy="no-referrer" /> 
      <title>Music Music</title>
      <header>
        <h1>Обрезка аудио</h1>
      </header>
      <main>
        <div className="player-container">
          <CutExample/>
        </div>
      </main>
      <footer />
    </div>
  );
};
