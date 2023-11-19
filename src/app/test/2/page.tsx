'use client';
import {
  WebVoiceProcessor,
  WvpMessageEvent,
} from '@picovoice/web-voice-processor';
import { useRef } from 'react';
const audioEncoder = require('audio-encoder');
import MPEGMode from 'lamejs/src/js/MPEGMode';
import Lame from 'lamejs/src/js/Lame';
import BitStream from 'lamejs/src/js/BitStream';

// var lamejs = require('lamejs');
// -------------------------------------------------------------------------------------------------------------FUNCTIONS
function wavToMp3(channels, sampleRate, samples) {
  var buffer = [];
  var mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128);
  var remaining = samples.length;
  var samplesPerFrame = 1152;
  for (var i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
    var mono = samples.subarray(i, i + samplesPerFrame);
    var mp3buf = mp3enc.encodeBuffer(mono);
    if (mp3buf.length > 0) {
      buffer.push(new Int8Array(mp3buf));
    }
    remaining -= samplesPerFrame;
  }
  var d = mp3enc.flush();
  if (d.length > 0) {
    buffer.push(new Int8Array(d));
  }

  var mp3Blob = new Blob(buffer, { type: 'audio/mp3' });
  var bUrl = window.URL.createObjectURL(mp3Blob);

  // send the download link to the console
  console.log('mp3 download:', bUrl);
}

function audioBufferToWav(aBuffer) {
  let numOfChan = aBuffer.numberOfChannels,
    btwLength = aBuffer.length * numOfChan * 2 + 44,
    btwArrBuff = new ArrayBuffer(btwLength),
    btwView = new DataView(btwArrBuff),
    btwChnls = [],
    btwIndex,
    btwSample,
    btwOffset = 0,
    btwPos = 0;
  setUint32(0x46464952); // "RIFF"
  setUint32(btwLength - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(aBuffer.sampleRate);
  setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit
  setUint32(0x61746164); // "data" - chunk
  setUint32(btwLength - btwPos - 4); // chunk length

  for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++)
    btwChnls.push(aBuffer.getChannelData(btwIndex));

  while (btwPos < btwLength) {
    for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
      // interleave btwChnls
      btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
      btwSample =
        (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
      btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
      btwPos += 2;
    }
    btwOffset++; // next source sample
  }

  let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));
  let wavSamples = new Int16Array(
    btwArrBuff,
    wavHdr.dataOffset,
    wavHdr.dataLen / 2
  );

  wavToMp3(wavHdr.channels, wavHdr.sampleRate, wavSamples);

  function setUint16(data) {
    btwView.setUint16(btwPos, data, true);
    btwPos += 2;
  }

  function setUint32(data) {
    btwView.setUint32(btwPos, data, true);
    btwPos += 4;
  }
}

function int16ArrayToFloat32Array(int16Array: Int16Array): Float32Array {
  const float32Array = new Float32Array(int16Array.length);
  for (let i = 0; i < int16Array.length; i++) {
    float32Array[i] = int16Array[i] / 32767;
  }
  return float32Array;
}

function playInt16Arrays(int16Arrays: Int16Array[], audioElement: any) {
  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();
  const mergedArray = int16Arrays.reduce(
    (acc: any, arr: any) => [...acc, ...arr],
    []
  );
  const float32Array = int16ArrayToFloat32Array(new Int16Array(mergedArray));
  const audioBuffer = audioContext.createBuffer(1, float32Array.length, 16000);
  audioBuffer.copyToChannel(float32Array, 0);
  const blob = new Blob([audioBuffer], { type: 'audio/webm;codecs=opus' });
  let ablob;

  //   ----------------------------------------------------------------------------
  // audioElement.srcObject = blob;
  //   console.log(blob);

  //   console.log(audioBuffer);
  audioEncoder(audioBuffer, 128, null, function onComplete(blob: any) {
    ablob = blob;
    console.log(ablob);

    audioElement.src = window.URL.createObjectURL(ablob);
  });

  // function bufferToBlob(buffer: AudioBuffer): Blob {
  //   const channelData = buffer.getChannelData(0);
  //   const bufferLength = channelData.length;
  //   const audioBlob = new Blob([float32Array.buffer], { type: 'audio/wav' });
  //   return audioBlob;
  // }
  // console.log(audioBuffer);
  // const audioBlob = bufferToBlob(audioBuffer);

  // const audioBlobUrl = window.URL.createObjectURL(audioBlob);
  // (audioElement as any).src = audioBlobUrl;

  //   const source = audioContext.createBufferSource();
  //   source.buffer = audioBuffer;
  //   source.connect(audioContext.destination);
  //   source.start();
}
function encodeAudioBufferToBlob(audioBuffer: AudioBuffer): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const numberOfChannels = audioBuffer.numberOfChannels;
    const sampleRate = audioBuffer.sampleRate;
    const interleaved = new Float32Array(audioBuffer.length * numberOfChannels);

    for (let channel = 0; channel < numberOfChannels; channel++) {
      const channelData = audioBuffer.getChannelData(channel);
      for (let i = 0; i < audioBuffer.length; i++) {
        interleaved[i * numberOfChannels + channel] = channelData[i];
      }
    }

    const audioBlob = new Blob([interleaved], { type: 'audio/wav' }); // Adjust the MIME type accordingly

    resolve(audioBlob);
  });
}
// ------------------------------------------------------------------------------------------------------------ PAGE
function TestingPage() {
  window.MPEGMode = MPEGMode;
  window.Lame = Lame;
  window.BitStream = BitStream;
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

  const stopRecording = async () => {
    WebVoiceProcessor.unsubscribe([engine]);
    WebVoiceProcessor.reset();

    // playInt16Arrays(audioDataChunks, audioElement);
    const audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
    const mergedArray = audioDataChunks.reduce(
      (acc: any, arr: any) => [...acc, ...arr],
      []
    );
    const float32Array = int16ArrayToFloat32Array(new Int16Array(mergedArray));
    const audioBuffer = audioContext.createBuffer(
      1,
      float32Array.length,
      44100
    );

    audioEncoder(audioBuffer, 128, null, function onComplete(mblob) {
      console.log(mblob);
      document.getElementById('abc').src = window.URL.createObjectURL(mblob);
    });
  };

  return (
    <div>
      <button onClick={startRecording}>Start</button>
      <br />
      <button onClick={stopRecording}>Stop</button>
      <br />
      ABC
      <audio id="abc" controls />
    </div>
  );
}

export default TestingPage;
