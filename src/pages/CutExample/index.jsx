import { ConstructionOutlined } from '@mui/icons-material';
import React, { Fragment, useState, useEffect, useRef } from 'react'
// import "./style1.css"
import WaveSurfer from 'wavesurfer.js';
// import ffmpeg from 'fluent-ffmpeg';
var RegionsPlugin = require("wavesurfer.js/dist/plugin/wavesurfer.regions.min.js");
var CursorPlugin = require("wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js");
var audioFile, audioBuffer, totalAudioDuration, processedAudio, arrBuffer

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
			// readAndDecodeAudio();
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

  async function readAndDecodeAudio() {
	arrBuffer = null;
	audioBuffer = null;

	await readAudio(audioFile)
			.then((results) => {
				arrBuffer = results.result;
			})
			.catch((error) => {
				window.alert("Some Error occured");
				console.log(error)
				return;
			}); 

	await new AudioContext().decodeAudioData(arrBuffer)
				.then((res) => {
					audioBuffer = res;
				})
				.catch((err) => {
					window.alert("Can't decode Audio");
					console.log(err)
					return;
				});
}

async function trimAudio(region) {
	console.log(region)
	var startPoint = Math.floor((region.start*audioBuffer.length)/totalAudioDuration);
	var endPoint = Math.ceil((region.end*audioBuffer.length)/totalAudioDuration);
	var audioLength = endPoint - startPoint;

	var trimmedAudio = new AudioContext().createBuffer(
		audioBuffer.numberOfChannels,
		audioLength,
		audioBuffer.sampleRate
	);

	for(var i=0;i<audioBuffer.numberOfChannels;i++){
		trimmedAudio.copyToChannel(audioBuffer.getChannelData(i).slice(startPoint,endPoint),i);
	}

	var audioData = {
		channels: Array.apply(null,{length: trimmedAudio.numberOfChannels})
					.map(function(currentElement, index) {
						return trimmedAudio.getChannelData(index);
					}),
		sampleRate: trimmedAudio.sampleRate,
    	length: trimmedAudio.length,
	}
	
	var temp = null;
	await encodeAudioBufferLame(audioData)
		.then((res) => {
			console.log(res);
			downloadAudio();
		})
		.catch((c) => {
			console.log(c);
		});
	console.log(audioData);
}

function encodeAudioBufferLame( audioData ) {
	return new Promise( (resolve, reject) => {
		var worker = new Worker('./worker/worker.js');
		
		worker.onmessage = (event) => {
			if(event.data != null){
				resolve(event.data);
			}
			else{
				reject("Error");
			}
			var blob = new Blob(event.data.res, {type: 'audio/mp3'});
      		processedAudio = new window.Audio();
      		processedAudio.src = URL.createObjectURL(blob);
		};

		worker.postMessage({'audioData': audioData});
	});		
}

function readAudio(file) {	
	return new Promise((resolve, reject) => {
					var reader = new FileReader();	
					reader.readAsArrayBuffer(file);
					console.log(reader)

					reader.onload = function() {
						console.log("Audio Loaded");
						resolve(reader);
					}

					reader.onerror = function(error){
						console.log("Error while reading audio");
						reject(error);
					}

					reader.onabort = function(abort){
						console.log("Aborted");
						console.log(abort);
						reject(abort);
					}

				})
}


function playTrack(regionId) {
	waveSurfer.regions.list[regionId].play();
}

function downloadTrack(regionStart, regionEnd) {
	// trimAudio(waveSurfer.regions.list[regionId]);
	// console.log(regionStart,regionEnd)
	// const command = ffmpeg(regionStart, regionEnd);
	// command.outputOptions([`-f mp3`]).save(`./selected_region.mp3`);
	// command.run();
}

const deleteTrack = (regionId) => {
	waveSurfer.regions.list[regionId].remove();
	setRows(prevState => prevState.filter(el => el.region !== regionId))
}

function downloadAudio() {
	var anchorAudio = document.createElement("a");
    anchorAudio.href = processedAudio.src;
	anchorAudio.download = "output.mp3";
	anchorAudio.click();
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
                		<td><button onClick={() => downloadTrack(row.start, row.end)}><i className='fa-solid fa-arrow-down' /></button></td>
                		<td><button onClick={() => deleteTrack(row.region)}><i className="fa-solid fa-xmark" /></button></td>
            		</tr>) )}   
          		</tbody>
                <tfoot />
                </table>
            </div>        
    </Fragment>
  )
}