import React, { Fragment, useState, useEffect} from 'react'
import WaveSurfer from 'wavesurfer.js';
import {saveAs} from 'file-saver';
var RegionsPlugin = require("wavesurfer.js/dist/plugin/wavesurfer.regions.min.js");
var CursorPlugin = require("wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js");

export const CutExample = () => {
  let [isPlaying, setIsPlaying] = useState(false)
  let [waveSurfer, setWaveSurfer] = useState(null)
  const [rows, setRows] = useState([])

  const addRow = (newRegion) => {
    setRows([...rows, { 
		start: Math.floor(newRegion.start/60)+':'+('0'+ Math.floor(newRegion.start%60)).slice(-2), 
		end: Math.floor(newRegion.end/60)+':'+('0'+ Math.floor(newRegion.end%60)).slice(-2),
		region: newRegion.id}]);
  };
    
  useEffect(() => {
    setWaveSurfer(WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
      plugins: [
        RegionsPlugin.create({
            dragSelection: {
                slop: 3
            }
        }),
        CursorPlugin.create({
            showTime: true,
                opacity: 1,
                customShowTimeStyle: {
                    'background-color': '#004',
                    color: '#ffa',
                    padding: '2px',
                    'font-size': '12px'
                }
        })
    ]
    }))
  }, [])

    if (waveSurfer) {
        waveSurfer.on("ready", function() {
            var totalAudioDuration = waveSurfer.getDuration();
            document.getElementById('time-total').innerText = Math.floor(totalAudioDuration/60)+':'+('0'+ Math.floor(totalAudioDuration%60)).slice(-2);
        });
        waveSurfer.on('audioprocess', function() {
            if(waveSurfer.isPlaying()) {
                var currentTime = waveSurfer.getCurrentTime();
                document.getElementById('time-current').innerText = Math.floor(currentTime/60)+':'+('0'+ Math.floor(currentTime%60)).slice(-2);
            }
        });
        waveSurfer.on("region-update-end", function(newRegion) {
			addRow(newRegion);
        });
    }

  function handleChange(event) {
    waveSurfer.load(URL.createObjectURL(event.target.files[0]));
  }

  const togglePlayPause = () => {
    const playBtn = document.getElementById("play-btn");
    const stopBtn = document.getElementById("stop-btn");
    waveSurfer.playPause()
    setIsPlaying(!isPlaying)
    if (waveSurfer.isPlaying()) {
        playBtn.classList.add("playing");
    } else {
        playBtn.classList.remove("playing");
    }
    stopBtn.addEventListener("click", () => {
        waveSurfer.stop();
        playBtn.classList.remove("playing");
    })
  }

function bufferToWave(abuffer, offset, len) {

	var numOfChan = abuffer.numberOfChannels,
		length = len * numOfChan * 2 + 44,
		buffer = new ArrayBuffer(length),
		view = new DataView(buffer),
		channels = [], i, sample,
		pos = 0;
  
	// write WAVE header
	setUint32(0x46464952);                         // "RIFF"
	setUint32(length - 8);                         // file length - 8
	setUint32(0x45564157);                         // "WAVE"
  
	setUint32(0x20746d66);                         // "fmt " chunk
	setUint32(16);                                 // length = 16
	setUint16(1);                                  // PCM (uncompressed)
	setUint16(numOfChan);
	setUint32(abuffer.sampleRate);
	setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
	setUint16(numOfChan * 2);                      // block-align
	setUint16(16);                                 // 16-bit (hardcoded in this demo)
  
	setUint32(0x61746164);                         // "data" - chunk
	setUint32(length - pos - 4);                   // chunk length
  
	// write interleaved data
	for(i = 0; i < abuffer.numberOfChannels; i++)
	  channels.push(abuffer.getChannelData(i));
  
	while(pos < length) {
	  for(i = 0; i < numOfChan; i++) {             // interleave channels
		sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
		sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767)|0; // scale to 16-bit signed int
		view.setInt16(pos, sample, true);          // update data chunk
		pos += 2;
	  }
	  offset++                                     // next source sample
	}
  
	// create Blob
	return URL.createObjectURL(new Blob([buffer], {type: "audio/wav"}));
  
	function setUint16(data) {
	  view.setUint16(pos, data, true);
	  pos += 2;
	}
  
	function setUint32(data) {
	  view.setUint32(pos, data, true);
	  pos += 4;
	}
}

function playTrack(regionId) {
	waveSurfer.regions.list[regionId].play();
}

function downloadTrack(regionId) {
	let originalBuffer = bufferToWave(waveSurfer.backend.buffer, 0, waveSurfer.backend.buffer.length);
	saveAs(originalBuffer, `selected-region.mp3`); 
}

const deleteTrack = (regionId) => {
	waveSurfer.regions.list[regionId].remove();
	setRows(prevState => prevState.filter(el => el.region !== regionId))
}

  return (
    <Fragment>
        <input id="audio-input" type="File" accept="audio/*" onChange={handleChange}/>
        <div id="waveform" ></div>
        <div class="buttons">
            <span id="play-btn" class="play-btn btn" onClick={() => togglePlayPause()}>
                <i class="fa-solid fa-play"></i>
                <i class="fa-solid fa-pause"></i>
            </span>
            <span id="stop-btn" class="stop-btn btn">
                <i class="fa-solid fa-stop"></i>
            </span>
            <span class="dur">
                <b id="time-current">0:00</b> / <b id="time-total">0:00</b>
            </span>
        </div>
            <div className="audio-table">
                <table id="audio-tracks">
                <thead>
                <tr>
                    <th style={{color:"black"}}>Начальная позиция</th>
                    <th style={{color:"black"}}>Конечная позиция</th>
                    <th style={{color:"black"}}>Play</th>
                    <th style={{color:"black"}}>Скачать</th>
                    <th style={{color:"black"}}>Удалить</th>
                </tr>
                </thead>
				<tbody>{rows.map((row) => (
            		<tr key={row.region}>  
                		<td>{row.start}</td >
                		<td>{row.end}</td >
                		<td><button onClick={() => playTrack(row.region)}><i className='fa-solid fa-play' /></button></td>
                		<td><button onClick={() => downloadTrack(row.region)}><i className='fa-solid fa-arrow-down' /></button></td>
                		<td><button onClick={() => deleteTrack(row.region)}><i className="fa-solid fa-xmark" /></button></td>
            		</tr>) )}   
          		</tbody>
                <tfoot />
                </table>
            </div>        
    </Fragment>
  )
}