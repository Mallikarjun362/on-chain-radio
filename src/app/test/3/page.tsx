'use client';
import {
  WebVoiceProcessor,
  WvpMessageEvent,
} from '@picovoice/web-voice-processor';
import { useEffect, useRef, useState } from 'react';
import MPEGMode from 'lamejs/src/js/MPEGMode';
import Lame from 'lamejs/src/js/Lame';
import BitStream from 'lamejs/src/js/BitStream';

var lamejs = require('lamejs');

function int16ArrayToFloat32Array(int16Array: Int16Array): Float32Array {
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32767;
  }
  return float32Array;
}
function encodeToMp3(int16Arrays) {
  // Create a new instance of the Lame library
  var mp3encoder = new lamejs.Mp3Encoder(1, 44100, 128); // Mono, 44.1kHz, 128kbps

  // Convert each Int16Array to MP3
  var mp3Data = [];
  for (var i = 0; i < int16Arrays.length; i++) {
    var samples = int16Arrays[i];
    var sampleBlockSize = samples.length;
    var left = new Int16Array(sampleBlockSize);

    // Convert the Int16Array to an array of 8-bit samples
    for (var j = 0; j < sampleBlockSize; j++) {
      left[j] = samples[j];
    }

    // Encode the samples to MP3
    var mp3buf = mp3encoder.encodeBuffer(left);

    // If there's MP3 data, add it to the array
    if (mp3buf.length > 0) {
      mp3Data.push(new Int8Array(mp3buf));
    }
  }

  // Finalize the MP3 encoding
  var mp3buf = mp3encoder.flush();
  if (mp3buf.length > 0) {
    mp3Data.push(new Int8Array(mp3buf));
  }

  // Concatenate the MP3 data into a single Int8Array
  var concatenated = new Int8Array(
    mp3Data.reduce((acc, curr) => acc.concat(Array.from(curr)), [])
  );

  // Create a Blob from the concatenated Int8Array
  var blob = new Blob([concatenated], { type: 'audio/mp3' });

  return blob;
}

// ------------------------------------------------------------------------------------------------------------ PAGE
function TestingPage() {
  useEffect(() => {
    window.MPEGMode = MPEGMode;
    window.Lame = Lame;
    window.BitStream = BitStream;
  }, []);
  const [mysrc, setMysrc] = useState(null);
  const audioElement = useRef();
  let audioDataChunks: Array<any> = [];
  let options = {
    frameLength: 512,
    outputSampleRate: 44100,
    deviceId: null,
    filterOrder: 50,
  };
  const engine = {
    onmessage: function (event: MessageEvent<WvpMessageEvent>) {
      audioDataChunks.push(event.data.inputFrame);
      console.log(event.data.inputFrame);
    },
  };
  WebVoiceProcessor.setOptions(options);

  const startRecording = () => {
    WebVoiceProcessor.subscribe([engine]);
  };

  useEffect(() => {
    if (mysrc) {
      (audioElement.current as any).src = mysrc;
    }
  }, [mysrc]);
  const stopRecording = async () => {
    WebVoiceProcessor.unsubscribe([engine]);
    WebVoiceProcessor.reset();
    document.getElementById('abc').src = window.URL.createObjectURL(
      encodeToMp3(audioDataChunks, options)
    );
    audioDataChunks = [];
    // const audioContext = new (window.AudioContext ||
    //   (window as any).webkitAudioContext)();
    // const mergedArray = audioDataChunks.reduce(
    //   (acc: any, arr: any) => [...acc, ...arr],
    //   []
    // );
    // const float32Array = int16ArrayToFloat32Array(new Int16Array(mergedArray));
    // const audioBuffer = audioContext.createBuffer(
    //   1,
    //   float32Array.length,
    //   44100
    // );
    // audioEncoder(audioBuffer, 128, null, function onComplete(mblob) {
    //   console.log(mblob);
    //   // document.getElementById('abc').src = window.URL.createObjectURL(mblob);
    //   // (audioElement.current as any).src = window.URL.createObjectURL(mblob);
    //   setMysrc(window.URL.createObjectURL(mblob) as any);
    // });
  };

  return (
    <div>
      <button onClick={startRecording}>Start</button>
      <br />
      <button onClick={stopRecording}>Stop</button>
      <br />
      ABC
      <audio id="abc" ref={audioElement as any} controls />
    </div>
  );
}

export default TestingPage;
