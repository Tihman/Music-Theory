import React, { Component } from 'react';
import { Spectrogram, FileList, GridSystem } from './components';
import { AudioStream } from './AudioStream';
const { Grid, GridItem } = GridSystem;

class Spectr extends Component {
  constructor() {
    super();
    this.state = {
      files: [],
      isPlaying: false,
    }
    this.AudioStream = new AudioStream();
    this.play = this.play.bind(this);
    this.stop = this.stop.bind(this);
    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    this.handlePlayback = this.handlePlayback.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.handleStreamData = this.handleStreamData.bind(this);
    this.handleDownload = this.handleDownload.bind(this);
  }
  handleDownload() {
    let canvas = document.getElementsByTagName('canvas')[0];
    let link = document.createElement('a');
    link.download = `spectrogram-${Date.now()}.png`;
    link.href = canvas.toDataURL()
    link.click();
  }
  onUploadSuccess(file) {
    let incoming = { ...file, index: this.state.files.length };
    let files = this.state.files.concat({ ...incoming });
    let selectedFile = this.state.selectedFile ? this.state.selectedFile : incoming;
    this.setState({ files, selectedFile }, () => {
      this.AudioStream.fromFile(file);
      this.handleSelect(incoming);
    });
  }
  handleSelect(file) {
    if (this.state.isPlaying) this.stop();
    this.setState({ selectedFile: file, isPlaying: false });
  }
  handlePlayback() {
    const { play, stop, state: { isPlaying } } = this;
    this.setState({ isPlaying: !isPlaying }, () => {
      if (isPlaying) {
        stop();
      } else {
        play();
      }
    });
  }
  play() {
    const { AudioStream, handleStreamData, state: { selectedFile } } = this;
    handleStreamData(selectedFile.index);
    AudioStream.play(selectedFile.index)
  }
  stop() {
    const { AudioStream, state: { selectedFile }, analyserLoop } = this;
    cancelAnimationFrame(analyserLoop);
    AudioStream.stop(selectedFile.index);
    this.setState({ streamData: [] })
  }
  handleStreamData(index) {
    const { AudioStream, handleStreamData } = this;
    this.setState({ streamData: AudioStream.getStreamData(index) });
    this.analyserLoop = requestAnimationFrame(() => handleStreamData(index));
  }
  render() {
    return (
      <Grid cols={8} rows={3}>
        <GridItem style={{ width: '95vw', margin: '0 auto', marginTop: '6vh', padding: '1% 1%' }}>
          <div style={{ textAlign: 'center', marginTop: '1%' }}>
            <p> Spectrogram </p>
          </div>
        </GridItem>
        <GridItem style={{backgroundColor: 'black', position: 'relative' }}>
          <Spectrogram 
            style={{ position: 'absolute', bottom: 0 }} 
            streamData={this.state.streamData} 
            isPlaying={this.state.isPlaying} 
            />
        </GridItem>
        <GridItem>
          <FileList
            handleDownload={this.handleDownload}
            selectedFile={this.state.selectedFile}
            onUploadSuccess={this.onUploadSuccess}
            handlePlayback={this.handlePlayback}
            handleSelect={this.handleSelect}
            isPlaying={this.state.isPlaying}
            dataSource={this.state.files}
          />
        </GridItem>

      </Grid>
    );
  }
}

export default Spectr;

