'use client';
import { useParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Socket, io } from 'socket.io-client';

function ListenerRoom() {
  const { roomId } = useParams();
  const [clientSocket, setClientSocket] = useState<Socket | null>(null);

  const Adata = useRef<any>([]);
  const idx = useRef<any>(0);
  useEffect(() => {
    function sourceOpen(e) {
      console.log("Source Open");
      
      const audioEle = document.getElementById("a1");
      URL.revokeObjectURL(audioEle.src);
      var mime = '/webm; codecs="opus"';
      var mediaSource = e.target;
      var sourceBuffer = mediaSource.addSourceBuffer(mime);
      let arrayBuffer;
      if(idx.current < Adata.current.length){
        arrayBuffer = Adata.current[idx.current];
        idx.current += 1;
      }else{
        return
      }
      sourceBuffer.addEventListener('updateend', function (e) {
        if (!sourceBuffer.updating && mediaSource.readyState === 'open') {
          mediaSource.endOfStream();
        }
      });
      sourceBuffer.appendBuffer(arrayBuffer);
    }
    
    if (window.MediaSource) {
      const audioEle = document.getElementById("a1");
      var mediaSource = new MediaSource();
      audioEle.src = URL.createObjectURL(mediaSource);
      mediaSource.addEventListener('sourceopen', sourceOpen);
    } else {
      console.log('The Media Source Extensions API is not supported.');
    }
  }, []);
  

  const handleListen = () => {
    // SOCKET
    const cs = io('http://localhost:3001');
    cs.on('connect', () => {
      console.log(`Connected Socket Server (ID: ${cs.id})`);
    });
    cs.on('receive-data', (data) => {
      console.log(data);
      Adata.current.push(data)

      // playBuffer(data);
      // var blob = new Blob([data], { type: 'application/octet-stream' });
      // var blobUrl = URL.createObjectURL(blob);
      // var audio = new Audio();
      // audio.addEventListener('ended', () => {
      //   console.log('Ended');
      // });
      // audio.src = URL.createObjectURL(blob);
      // audio.play();
    });
    setClientSocket(cs);
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
      <audio id='a1' controls></audio>
    </div>
  );
}

export default ListenerRoom;
