"use client";
import { useGlobalContext } from "@/app/_context/store";
import { SOCKET_SERVER_URL } from "@/utils/Constants";
import { getRoomDetailsById } from "@/utils/DatabaseActions";
import { useState, CSSProperties, useEffect } from "react";
import { useParams } from "next/navigation";
import { Socket, io } from "socket.io-client";
import { support } from "@/utils/AptosBlockchain";
import { GiMusicalScore, GiMusicalNotes } from "react-icons/gi";
import { PiMusicNotesPlusLight } from "react-icons/pi";

function ListenerRoom() {
  const { roomId } = useParams();
  const { wallet_address, wallet_object } = useGlobalContext();
  const [roomObj, setRoomObj] = useState<any>(null);
  const [is_connected, setIsConnected] = useState<Boolean>(false);
  const [clientSocket, setClientSocket] = useState<Socket | null>(null);
  useEffect(() => {
    async function run() {
      const result = await getRoomDetailsById(roomId as string);
      setRoomObj(result);
      console.log(result);
    }
    if (!roomObj) {
      run();
    }
  }, []);

  const handleListen = () => {
    // SOCKET
    const cs = io(SOCKET_SERVER_URL);
    cs.on("connect", () => {
      console.log(`Connected Socket Server (ID: ${cs.id})`);
      setIsConnected(true);
    });
    cs.on("receive-data", (data) => {
      console.log(data);
      // playBuffer(data);
      var blob = new Blob([data], { type: "application/octet-stream" });
      var audio = new Audio();
      audio.src = URL.createObjectURL(blob);
      audio.play();
    });
    cs.emit("join-room", roomId);
    setClientSocket(cs);
  };

  const handleStopListen = () => {
    clientSocket?.disconnect();
    setClientSocket(null);
  };
  const buttonStyle: CSSProperties = {
    backgroundColor: "#fff3",
    borderRadius: "100px",
    padding: "5px 15px",
    fontSize: "18px",
  };

  return (
    <main
      className="pageBody"
      style={{
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        height: "80vh",
        width: "100%",
      }}
    >
      <div
        style={{
          backdropFilter: "blur(15px)",
          backgroundColor: "#fff3",
          flexDirection: "column",
          borderRadius: "20px",
          alignItems: "center",
          padding: "20px",
          display: "flex",
          gap: "20px",
        }}
      >
        <GiMusicalScore style={{ fontSize: "250px" }} />
        <table style={{ fontSize: "20px", width: "70%" }}>
          <style>
            {`
              td {
                padding: 0px 5px;
                white-space: nowrap;
              }
              td:first-child {
                font-weight: bold;
              }
            `}
          </style>
          <tbody>
            <tr>
              <td>Room ID</td>
              <td>:</td>
              <td>{roomId}</td>
            </tr>
            <tr>
              <td>Title</td>
              <td>:</td>
              <td>{roomObj?.title}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>:</td>
              <td>{roomObj?.description}</td>
            </tr>
          </tbody>
        </table>
        <br />
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            gap: "30px",
          }}
        >
          {clientSocket && is_connected ? (
            <button style={{ ...buttonStyle }} onClick={handleStopListen}>
              Stop Listen
            </button>
          ) : (
            <button style={{ ...buttonStyle }} onClick={handleListen}>
              Listen
            </button>
          )}
          <button
            style={{ ...buttonStyle, backgroundColor: "#0F09" }}
            onClick={() =>
              support({
                artist_address: roomObj?.main_author_wallet_address,
                aptos_wallet: wallet_object,
                amount: 0.5e8,
              })
            }
          >
            Support
          </button>
        </div>
      </div>
    </main>
  );
}

export default ListenerRoom;
