import React, { useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';
import "./style2.css";
var CursorPlugin = require("wavesurfer.js/dist/plugin/wavesurfer.cursor.min.js");

export const Bpm = () => {
let [isPlaying, setIsPlaying] = useState(false)
let [waveSurfer, setWaveSurfer] = useState(null)
    
useEffect(() => {
    setWaveSurfer(WaveSurfer.create({
      container: '#waveform',
      waveColor: 'violet',
      progressColor: 'purple',
      plugins: [
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
}

function handleChange(event) {
    console.log(event.target.files[0]);
    waveSurfer.load(URL.createObjectURL(event.target.files[0]));
    createBuffers(URL.createObjectURL(event.target.files[0]));
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

function getPeaks(data) {
	var partSize = 22050,
		parts = data[0].length / partSize,
		peaks = [];
	for (var i = 0; i < parts; i++) {
	  var max = 0;
	  for (var j = i * partSize; j < (i + 1) * partSize; j++) {
		var volume = Math.max(Math.abs(data[0][j]), Math.abs(data[1][j]));
		if (!max || (volume > max.volume)) {
		  max = {
			position: j,
			volume: volume
		  };
		}
	  }
	  peaks.push(max);
	}
	peaks.sort(function(a, b) {
	  return b.volume - a.volume;
	});
	peaks = peaks.splice(0, peaks.length * 0.5);
	peaks.sort(function(a, b) {
	  return a.position - b.position;
	});
  
	return peaks;
}
  
function getIntervals(peaks) {
	var groups = [];
	peaks.forEach(function(peak, index) {
	  for (var i = 1; (index + i) < peaks.length && i < 10; i++) {
		var group = {
		  tempo: (60 * 44100) / (peaks[index + i].position - peak.position),
		  count: 1
		};
		while (group.tempo < 90) {
		  group.tempo *= 2;
		}
		while (group.tempo > 180) {
		  group.tempo /= 2;
		}
		group.tempo = Math.round(group.tempo);
		if (!(groups.some(function(interval) {
		  return (interval.tempo === group.tempo ? interval.count++ : 0);
		}))) {
		  groups.push(group);
		}
	  }
	});
	return groups;
}
  
function createBuffers(url) {
		var request = new XMLHttpRequest();
		request.open('GET', url, true);
		request.responseType = 'arraybuffer';
		request.onload = function() {
  
		  		var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
		  		var offlineContext = new OfflineContext(2, 30 * 44100, 44100);
		 	 	offlineContext.decodeAudioData(request.response, function(buffer) {
				var source = offlineContext.createBufferSource();
				source.buffer = buffer;
				var lowpass = offlineContext.createBiquadFilter();
				lowpass.type = "lowpass";
				lowpass.frequency.value = 150;
				lowpass.Q.value = 1;
				source.connect(lowpass);
				var highpass = offlineContext.createBiquadFilter();
				highpass.type = "highpass";
				highpass.frequency.value = 100;
				highpass.Q.value = 1;
				lowpass.connect(highpass);
				highpass.connect(offlineContext.destination);
				source.start(0);
				offlineContext.startRendering();
		  		});
  
		  		offlineContext.oncomplete = function(e) {
				var buffer = e.renderedBuffer;
				var peaks = getPeaks([buffer.getChannelData(0), buffer.getChannelData(1)]);
				var groups = getIntervals(peaks);
  
				var top = groups.sort(function(intA, intB) {
			  	return intB.count - intA.count;
				}).splice(0, 5);

				console.log(Math.round(top[0].tempo));
                document.getElementById('output').innerText=Math.round(top[0].tempo);
  
		  		};
		};
		request.send();
}


  return (
    <div>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>BPM</title>
        <div className="player-container">
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
        </div>
                    <div class="post-item">
                        <div class="item-content">
                            <div class="item-body">
                                <div class="audio-bpm">
                                <p>BPM (темп) аудио: <span id="output"></span> </p>
                                 </div>
                            </div>
                        </div>
                    </div>
                        <div class="post-item">
                            <div class="item-content">
                                <div class="item-body1">
                                    <p>BPM (bpm, англ. beats per minute, удары в минуту) в музыке — показатель, 
                                        определяющий скорость исполнения или воспроизведения композиции. 
                                        BPM — это количество четвертных нот в минуту, например, 120 BPM означает, 
                                        что в минуту играется 120 четвертных нот (следовательно, 2 четверти в секунду), 
                                        или 120 четвертных ударов метронома в минуту. Стиль (или жанр) музыкального 
                                        произведения определяется рядом признаков, таких как темп, использование определённых 
                                        звуков и паттернов. Скорее всего, вы сразу можете определить жанр песни, когда её слышите, 
                                        только на основе вашего слушательского опыта. Ниже приведены «типичные» диапазоны темпов 
                                        для некоторых распространённых жанров:  
                                        <ul>
                                            <li>Рок: 70-95 ударов в минуту</li>
                                            <li>Хип-хоп: 80-130 ударов в минуту</li>
                                            <li>R&B: 70-110 ударов в минуту</li>
                                            <li>Поп: 110-140 ударов в минуту</li>
                                            <li>Хаус: 115-130 ударов в минуту</li>
                                            <li>Техно/транс: 120-140 ударов в минуту</li>
                                            <li>Драм-н-бэйс: 160-180 ударов в минуту</li>
                                          </ul>
                                    </p>
                                </div>
                            </div>
                        </div>
    </div>
  )
}