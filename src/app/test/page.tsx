'use client';
import { WebVoiceProcessor } from '@picovoice/web-voice-processor';
import { useEffect, useState } from 'react';
import { useRef } from 'react';

class AudioPlayer {
  private audioContext: AudioContext;

  constructor() {
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();
  }

  int16ArrayToFloat32Array(int16Array: Int16Array): Float32Array {
    const float32Array = new Float32Array(int16Array.length);
    for (let i = 0; i < int16Array.length; i++) {
      float32Array[i] = int16Array[i] / 32767; // Normalize to the range [-1, 1]
    }
    return float32Array;
  }

  playInt16Arrays(int16Arrays: Int16Array[]) {
    const mergedArray = int16Arrays.reduce((acc, arr) => [...acc, ...arr], []);

    // Convert Int16Array to Float32Array
    const float32Array = this.int16ArrayToFloat32Array(
      new Int16Array(mergedArray)
    );

    const audioBuffer = this.audioContext.createBuffer(
      1,
      float32Array.length,
      16000
    );
    audioBuffer.copyToChannel(float32Array, 0);
    function bufferToBlob(buffer: AudioBuffer): Blob {
      const channelData = buffer.getChannelData(0);
      const bufferLength = channelData.length;

      const audioBlob = new Blob([float32Array.buffer], { type: 'audio/wav' });

      return audioBlob;
    }
    // console.log(audioBuffer);
    const audioBlob = bufferToBlob(audioBuffer);

    const audioElement = document.getElementById('audio-1');
    const audioBlobUrl = window.URL.createObjectURL(audioBlob);
    (audioElement as any).src = audioBlobUrl;

    // const source = this.audioContext.createBufferSource();
    // source.buffer = audioBuffer;
    // source.connect(this.audioContext.destination);
    // source.start();
  }
}

let options = {
  frameLength: 512,
  outputSampleRate: 16000,
  deviceId: null,
  filterOrder: 50,
};

function TestingPage() {
  // ----------------------------------------------------------------------- CODE 1 : Good Audio Quality
  // let data: any = [];
  // let media_recorder: MediaRecorder;
  // let stream_obj: any;
  // const [audioEle, setAudioEle] = useState(null);
  // const start = (e: any) => {
  //   const constraints = {
  //     audio: true,
  //   };
  //   navigator.mediaDevices.getUserMedia(constraints).then((mediaStreamObj) => {
  //     const audioContext = new (window.AudioContext ||
  //       window.webkitAudioContext)();

  //     // Create a media stream source from the microphone stream
  //     const source = audioContext.createMediaStreamSource(mediaStreamObj);

  //     // Connect the source to the audio context's destination (e.g., speakers)
  //     // source.connect(audioContext.destination);

  //     // Create an AudioBuffer to store the microphone data
  //     const bufferSize = 2048; // You can adjust this buffer size
  //     const audioBuffer = audioContext.createBuffer(
  //       1,
  //       bufferSize,
  //       audioContext.sampleRate
  //     );
  //     const inputData = audioBuffer.getChannelData(0); // Mono audio input
  //     console.log('Source:', source);

  //     // Log a sample of the microphone data
  //     source.onAudioProcess = (event) => {
  //       const buffer = event.inputBuffer;
  //       inputData.set(buffer.getChannelData(0), 0);

  //       // Log the first 10 values of the audio data
  //       console.log(inputData.slice(0, 10));

  //       // Uncomment the line below if you want to log the entire audio data
  //       // console.log(inputData);
  //     };

  //     // ------------------------------------
  //     media_recorder = new MediaRecorder(mediaStreamObj);
  //     stream_obj = mediaStreamObj;
  //     media_recorder.ondataavailable = (e: any) => {
  //       data.push(e.data);
  //     };
  //     media_recorder.onstop = (e: any) => {
  //       const ele = document.getElementById('audio-1');
  //       let blob = new Blob(data, { type: 'audio/mp3' });
  //       let audioUrl = window.URL.createObjectURL(blob);
  //       (ele as any).src = audioUrl;
  //     };
  //     media_recorder.start();
  //   });
  // };
  // const stop = (e: any) => {
  //   media_recorder.stop();
  //   stream_obj.getTracks().forEach(function (track: any) {
  //     track.stop();
  //   });
  //   console.log(media_recorder.state);
  //   data = [];
  // };
  //   ------------------------------------------------------------------------- CODE 2
  let data: any = [];
  const engine = {
    onmessage: function (e: any) {
      data.push(e.data.inputFrame);
      // console.log(e.data.inputFrame);
    },
  };
  useEffect(() => {});
  const start = () => {
    WebVoiceProcessor.subscribe([engine]);
  };
  const stop = async () => {
    WebVoiceProcessor.unsubscribe([engine]);
    WebVoiceProcessor.reset();
    const audioPlayer = new AudioPlayer();
    audioPlayer.playInt16Arrays(data);

    data = [];
  };

  return (
    <div>
      <button onClick={start}>Start</button>
      <br />
      <button onClick={stop}>Stop</button>
      <br />
      <audio id="audio-1" controls />
    </div>
  );
}

export default TestingPage;
