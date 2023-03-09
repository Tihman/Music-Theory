import "./style1.css";
import { loadAudio } from "./cut";
// import WaveSurfer from 'wavesurfer.js';
// import {WaveSurfer} from 'react-wavesurfer'
// export var wavesurfer = WaveSurfer.create({
// 	container: '.audio',
// 	waveColor: 'violet',
// 	progressColor: 'purple',
// 	plugins: [
// 		WaveSurfer.regions.create({
// 			dragSelection: {
// 				slop: 3
// 			}
// 		}),
// 		WaveSurfer.cursor.create({
// 			showTime: true,
// 			opacity: 1,
// 			customShowTimeStyle: {
// 				'background-color': '#004',
// 				color: '#ffa',
// 				padding: '2px',
// 				'font-size': '12px'
// 			}
// 		})
// 	]
// });
export const Cut = () => {
    return (
        <div>
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.0/css/all.min.css" integrity="sha512-xh6O/CkQoPOWDdYTDqeRdPCVd1SpvCA9XXcUnZS2FmJNp1coAFzvtCN9BmamE+4aHK8yyUHUSCcJHgXloTyT2A==" crossOrigin="anonymous" referrerPolicy="no-referrer" /> 
            <input id="audio-input" type="File" accept="audio/*" onChange={()=>loadAudio()}/>
            <div class="player-container">
                <div class="audio"></div>
                <div class="buttons">
                    <span class="play-btn btn">
                        <i class="fa-solid fa-play"></i>
                        <i class="fa-solid fa-pause"></i>
                    </span>
                    <span class="stop-btn btn">
                        <i class="fa-solid fa-stop"></i>
                    </span>
                    <span class="mute-btn btn">
                        <i class="fa-solid fa-volume-high"></i>
                        <i class="fa-solid fa-volume-xmark"></i>
                    </span>
                    <input type="range" min="0" max="1" step="0.1" value="0.5" class="volume-slider"/>
                    <span class="dur">
                        <b id="time-current">0:00</b> / <b id="time-total">0:00</b>
                    </span>
                    <b>Zoom:</b>
                    <input id="slider" type="range" min="1" max="200" value="0" class="zoom"/>
                   </div> 
            </div>
            <div class="audio-table">
                <table id="audio-tracks">
                    <thead>
                        <tr>
                            <th>№</th>
                            <th>Начальная позиция</th>
                            <th>Конечная позиция</th>
                            <th>Play</th>
                            <th>Скачать</th>
                            <th>Удалить</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                    <tfoot></tfoot>
                </table>
            </div> 
        </div>   
    )};       