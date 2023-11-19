'use client';
import { SOCKET_SERVER_URL } from '@/utils/3_Constants';
import { useParams } from 'next/navigation';
import { CSSProperties, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

function StreamRoomPage(this: any) {

  const timeSlice = 1000;
  const { roomId } = useParams();
  const startButtom = useRef(null);
  const stopButtom = useRef(null);
  const interval = useRef<any>(null);
  const [is_streaming, setIsStreaming] = useState(false);
  const [clientSocket, setClientSocket] = useState<Socket | any>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );

  const commonButtomStyle: CSSProperties = {
    backgroundColor: '#fff3',
    borderRadius: '100px',
    width: 'min-content',
    whiteSpace: 'nowrap',
    padding: '5px 20px',
    fontSize: '22px',
  };
  let audioContext: AudioContext;
  useEffect(() => {
    audioContext = new (window.AudioContext ||
      (window as any).webkitAudioContext)();
  }, []);

  const initiate = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream, {
      audioBitsPerSecond: 15000,
      mimeType: 'audio/webm;codecs=opus',
    });
    let cs = io(SOCKET_SERVER_URL);
    cs.emit('join-room', roomId);
    cs.connect();
    mr.ondataavailable = async (event: any) => {
      if (event.data.size > 0) {
        console.log(event.data);
        cs.emit('send-data-to-room', roomId, event.data);
      }
    };
    return { mr, cs };
  };

  const startRecording = async () => {
    if (!mediaRecorder) {
      initiate().then(({ mr, cs }) => {
        // mr.start(timeSlice);
        interval.current = setInterval(() => {
          mr?.stop();
          mr?.start();
        }, timeSlice);
        console.log('HELLO 123');
        setIsStreaming(true);
        setMediaRecorder(mr);
        setClientSocket(cs);
      });
    }
  };
  const stopRecording = () => {
    mediaRecorder?.stop();
    clearInterval(interval.current);
    clientSocket.disconnect();
    setMediaRecorder(null);
    setClientSocket(null);
    setIsStreaming(false);
  };

  return (
    <main
      className="pageBody"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: 'calc(100vh - 80px)',
      }}
    >
      <div
        className="pageSection"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '30px',
        }}
      >
        <span style={{ fontSize: '20px' }}>{roomId}</span>
        {is_streaming ? (
          <button
            key={1}
            ref={stopButtom}
            style={commonButtomStyle}
            onClick={stopRecording}
          >
            Stop Stream
          </button>
        ) : (
          <button
            ref={startButtom}
            style={commonButtomStyle}
            onClick={startRecording}
          >
            Start Stream
          </button>
        )}
      </div>
    </main>
  );
}

export default StreamRoomPage;
