'use client';
import { MouseEventHandler, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export default function CLientPage() {
  const [clientSocket, setClientSocket] = useState<any>(null);
  useEffect(() => {
    if (!clientSocket) {
      const a = io('http://localhost:3001/');
      a.on('connect', () =>
        console.log(`Connected Socket Server (ID: ${a.id})`)
      );
      a.on('receive-msg', (data: any) => {
        console.log(data);
      });
      setClientSocket(a);
      return () => {
        a.disconnect();
      };
    }
  }, []);

  const handleJoinRoom = (e: any) => {
    clientSocket.emit(
      'join-room',
      (document.getElementById('room') as any)?.value
    );
  };
  const exitRoom = (e: any) => {
    clientSocket.emit(
      'exit-room',
      (document.getElementById('room') as any)?.value
    );
  };
  const handleEmitdataToSocketServer: MouseEventHandler<HTMLButtonElement> = (
    event
  ) => {
    const val = (document.getElementById('data') as any)?.value;
    clientSocket.emit(
      'send-data-to-room',
      (document.getElementById('room') as any)?.value,
      (document.getElementById('data') as any)?.value
    );
  };
  return (
    <main>
      <br />
      <br />
      <br />
      <center>
        Room
        <input type="text" name="" id="room" />
        <br />
        <br />
        Data
        <input type="text" name="" id="data" />
        <br />
        <br />
        <button onClick={handleJoinRoom}>Join Room </button>
        <br />
        <br />
        <button onClick={exitRoom}>Exit Room </button>
        <br />
        <br />
        <button onClick={handleEmitdataToSocketServer}> Emit Data </button>
      </center>
    </main>
  );
}
