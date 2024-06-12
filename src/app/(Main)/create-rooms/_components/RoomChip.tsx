"use client";
import {
  deleteRoomById,
  setRoomActive,
  setRoomInactive,
} from "@/utils/DatabaseActions";
import Link from "next/link";
import { useState } from "react";

export default function RoomChip({ roomObj }: any) {
  const [room_status, setRoomStatus] = useState(roomObj.is_active);
  const toggle_status = (e: any) => {
    if (roomObj.is_active) {
      setRoomInactive(roomObj._id).then((the_room_obj) =>
        setRoomStatus((prev: boolean) => !prev)
      );
    } else {
      setRoomActive(roomObj._id).then((val) =>
        setRoomStatus((prev: boolean) => !prev)
      );
    }
  };
  return (
    <div
      className="lg:flex-row flex-col"
      style={{
        justifyContent: "space-between",
        backgroundColor: "#fff1",
        borderRadius: "10px",
        alignItems: "center",
        overflow: "hidden",
        padding: "10px",
        display: "flex",
        width: "100%",
      }}
    >
      {/* == TABLE ==== TABLE ==== TABLE ==== TABLE ==== TABLE ==== TABLE ==== TABLE ==== TABLE ==== TABLE ==== TABLE == */}
      <div style={{ width: "100%", overflowX: "auto" }}>
        <table style={{ fontSize: "20px", width: "100%", overflowX: "hidden" }}>
          <style>
            {`
              td {
                padding: 0px 5px;
              }
              td:first-child {
                font-weight: bold;
                width: 40%;
                min-width: fit-content;
              }
            `}
          </style>
          <tbody>
            <tr style={{ width: "100%" }}>
              <td>Room ID</td>
              <td>:</td>
              <td style={{ textOverflow: "ellipsis", overflow: "hidden" }}>
                {roomObj._id}
              </td>
            </tr>
            <tr>
              <td>Title</td>
              <td>:</td>
              <td>{roomObj.title}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>:</td>
              <td>{roomObj.description}</td>
            </tr>
            <tr>
              <td>Status</td>
              <td>:</td>
              <td>
                {room_status ? (
                  <span style={{ color: "#5BDE26" }}>Active</span>
                ) : (
                  <span style={{ color: "red" }}>Inactive</span>
                )}
              </td>
            </tr>
          </tbody>
        </table>
        <br />
      </div>
      {/* DIV RIGHT */}
      <div
        style={{
          flexWrap: "wrap",
          alignItems: "end",
          display: "flex",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        {room_status ? (
          <>
            <Link
              style={{
                backgroundColor: "#0F09",
                borderRadius: "100px",
                textAlign: "center",
                padding: "5px 20px",
                fontSize: "18px",
              }}
              href={`/stream/${roomObj._id}`}
            >
              Start Room
            </Link>
            <button
              style={{
                backgroundColor: "#0003",
                borderRadius: "100px",
                padding: "5px 20px",
                fontSize: "18px",
              }}
              onClick={toggle_status}
            >
              {"Set room Inactive"}
            </button>
          </>
        ) : null}

        {!room_status ? (
          <button
            style={{
              backgroundColor: "#0003",
              borderRadius: "100px",
              padding: "5px 20px",
              fontSize: "18px",
            }}
            onClick={toggle_status}
          >
            {" Set room Active "}
          </button>
        ) : null}
        <button
          style={{
            backgroundColor: "#F008",
            borderRadius: "100px",
            width: "fit-content",
            padding: "5px 20px",
            fontSize: "14px",
          }}
          onClick={async () =>
            deleteRoomById(roomObj._id).then(() =>
              alert("Room deleted Successfully")
            )
          }
        >
          {" Delete"}
        </button>
      </div>
    </div>
  );
}
