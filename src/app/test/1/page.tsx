'use client';
// WORKING

import { MouseEventHandler } from 'react';

function TestingPage1() {
  let recorderChunks: Array<Blob> = [];
  let globalMediaRecorder: MediaRecorder | undefined = undefined;

  const handleClickStartRecord: MouseEventHandler<HTMLButtonElement> = (
    _event
  ) => {
    const mediaConstraints = { audio: true };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then((mediaStream: MediaStream) => {
        const mediaRecorderOptions: MediaRecorderOptions = {};
        globalMediaRecorder = new MediaRecorder(
          mediaStream,
          mediaRecorderOptions
        );
        // console.log('HELLO');
        globalMediaRecorder.ondataavailable = (blobEvent: BlobEvent) => {
          if (blobEvent.data.size > 0) {
            recorderChunks.push(blobEvent.data);
            console.log(blobEvent.data);
          }
        };
        globalMediaRecorder.onstop = (event: Event) => {
          mediaStream.getTracks().forEach((track: MediaStreamTrack) => {
            track.stop();
          });
          console.log('Recorded Chunks', recorderChunks);

          (document.getElementById('abc') as any).src =
            window.URL.createObjectURL(new Blob(recorderChunks));
        };
        globalMediaRecorder.start();
      });
  };

  const handleClickStoptRecord: MouseEventHandler<HTMLButtonElement> = (
    _event
  ) => {
    if (globalMediaRecorder) globalMediaRecorder.stop();
  };

  return (
    <div>
      <button onClick={handleClickStartRecord}>Start</button>
      <br />
      <button onClick={handleClickStoptRecord}>Stop</button>
      <br />
      <audio id="abc" controls />
    </div>
  );
}

export default TestingPage1;
