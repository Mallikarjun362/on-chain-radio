'use client';
import { setRoomActive, setRoomInactive } from '@/utils/4_DatabaseActions';
import Link from 'next/link';
import { useState } from 'react';

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
      style={{
        justifyContent: 'space-between',
        backgroundColor: '#fff1',
        borderRadius: '10px',
        alignItems: 'center',
        padding: '10px',
        display: 'flex',
      }}
    >
      <table style={{ fontSize: '20px' }}>
        <style>
          {`
              td {
                padding: 0px 5px;
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
            <td>{roomObj._id}</td>
          </tr>
          <tr>
            <td>Title</td>
            <td>:</td>
            <td>{roomObj.title}</td>
          </tr>
          <tr>
            <td>Status</td>
            <td>:</td>
            <td>
              {room_status ? (
                <span style={{ color: '#5BDE26' }}>Active</span>
              ) : (
                <span style={{ color: 'red' }}>Inactive</span>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      {room_status ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Link
            style={{
              backgroundColor: '#0F09',
              borderRadius: '100px',
              padding: '5px 20px',
              fontSize: '18px',
              textAlign: 'center',
            }}
            href={`/stream/${roomObj._id}`}
          >
            Start Room
          </Link>
          <button
            style={{
              backgroundColor: '#0003',
              borderRadius: '100px',
              padding: '5px 20px',
              fontSize: '18px',
            }}
            onClick={toggle_status}
          >
            {'Set room Inactive'}
          </button>
        </div>
      ) : null}
      {!room_status ? (
        <button
          style={{
            backgroundColor: '#0003',
            borderRadius: '100px',
            padding: '5px 20px',
            fontSize: '18px',
          }}
          onClick={toggle_status}
        >
          {' Set room Active '}
        </button>
      ) : null}
    </div>
  );
}
