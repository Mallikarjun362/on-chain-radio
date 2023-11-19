'use client';
import { SOCKET_SERVER_URL } from '@/utils/3_Constants';
import { useParams } from 'next/navigation';
import { useState,useRef } from 'react';
import { Socket, io } from 'socket.io-client';

function ListenerRoom() {
  const { roomId } = useParams();
  const [is_connected,setIsConnected] = useState<Boolean>(false);
  const [clientSocket,setClientSocket] = useState<Socket|null>(null);
  const datachunks = useRef([]);
  const handleListen = () => {
    // SOCKET
    const cs = io(SOCKET_SERVER_URL);
    cs.on('connect', () => {
      console.log(`Connected Socket Server (ID: ${cs.id})`);
      setIsConnected(true);
    });
    cs.on('receive-data', (data) => {
      console.log(data);
      // playBuffer(data);
      var blob = new Blob([data], { type: 'application/octet-stream' });
      var audio = new Audio();
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
        {clientSocket && is_connected ? (
          <button onClick={handleStopListen}>Stop Listen</button>
        ) : (
          <button onClick={handleListen}>Listen</button>
        )}
      </div>
    </div>
  );
}

export default ListenerRoom;
