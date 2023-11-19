'use client';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

function ListenerRoom() {
  const { roomId } = useParams();
  const [clientSocket, setClientSocket] = useState<Socket | null>(null);
  // const audioref = useRef<any>(null);
  // const srcref = useRef<any>(null);
  // const gnref = useRef<any>(null);
  // useEffect(() => {
  //   var audioContext = new (window.AudioContext ||
  //     (window as any).webkitAudioContext)();
  //   // Create an audio buffer source
  //   var source = audioContext.createBufferSource();

  //   // Create a gain node to control volume (optional)
  //   var gainNode = audioContext.createGain();
  //   gainNode.connect(audioContext.destination);
  //   source.connect(gainNode);
  //   source.onended = function () {
  //     console.log('Audio finished playing');
  //   };
  //   audioref.current = audioContext;
  //   srcref.current = source;
  //   gnref.current = gainNode;
  // }, []);
  // var sourceNodePool = [];
  // var MAX_POOL_SIZE = 10; // Adjust this based on your needs

  // function createSourceNode() {
  //   var sourceNode = audioref.current.createBufferSource();
  //   sourceNode.connect(gnref.current);
  //   return sourceNode;
  // }

  // function getAvailableSourceNode() {
  //   if (sourceNodePool.length < MAX_POOL_SIZE) {
  //     return createSourceNode();
  //   } else {
  //     return sourceNodePool.shift();
  //   }
  // }

  // function returnSourceNodeToPool(node) {
  //   sourceNodePool.push(node);
  // }
  // function playBuffer(arrayBuffer) {
  //   audioref.current.decodeAudioData(
  //     arrayBuffer,
  //     function (buffer) {
  //       var sourceNode = getAvailableSourceNode();

  //       // Set the buffer to the source
  //       sourceNode.buffer = buffer;

  //       // Start playing
  //       sourceNode.start(0);

  //       // Adjust the gain if needed
  //       gnref.current.gain.value = 1; // You can set the volume here (0 to 1)

  //       // When the playback is finished, return the source node to the pool
  //       sourceNode.onended = function () {
  //         returnSourceNodeToPool(sourceNode);
  //       };
  //     },
  //     function (error) {
  //       console.error('Error decoding audio data:', error);
  //     }
  //   );
  // }

  const handleListen = () => {
    // SOCKET
    const cs = io('http://localhost:3001');
    cs.on('connect', () => {
      console.log(`Connected Socket Server (ID: ${cs.id})`);
    });
    cs.on('receive-data', (data) => {
      console.log(data);
      // playBuffer(data);
      var blob = new Blob([data], { type: 'application/octet-stream' });
      var audio = new Audio();
      audio.addEventListener('ended', () => {
        console.log('Ended');
      });
      audio.src = URL.createObjectURL(blob);
      audio.play();
    });
    cs.emit('join-room', roomId);
    setClientSocket(cs);
  };

  const handleStopListen = () => {
    clientSocket?.disconnect();
    setClientSocket(null);
  };

  return (
    <div className="pageBody">
      <div className="pageSection">
        {roomId}
        <br />
        {clientSocket ? (
          <button onClick={handleStopListen}>Stop Listen</button>
        ) : (
          <button onClick={handleListen}>Listen</button>
        )}
      </div>
    </div>
  );
}

export default ListenerRoom;
