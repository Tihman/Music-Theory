import React, { useState } from 'react';
 
export const Table = () => {
  const [trackUrl, setTrackUrl] = useState('');
  const [trackName, setTrackName] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
 
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsDownloading(true);
    fetch(trackUrl)
      .then((response) => response.blob()) 
      .then((blob) => {
        let url = window.URL.createObjectURL(blob); 
        let a = document.createElement('a'); 
        a.href = url; 
        a.download = trackName;
        document.body.appendChild(a); 
        a.click();
        window.URL.revokeObjectURL(url); 
        setIsDownloading(false); 
      });  
  };  

  return (  
    <div>  
      <form onSubmit={handleSubmit}>  
        <input type="text" placeholder="Enter Track URL" value={trackUrl} onChange={e => setTrackUrl(e.target.value)} />  
        <input type="text" placeholder="Enter Track Name" value={trackName} onChange={e => setTrackName(e.target.value)} />  
        <button type="submit">{isDownloading ? 'Downloading...' : 'Download'}</button>  
      </form>  
    </div>  
  );  
};  