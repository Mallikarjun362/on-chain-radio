import Link from 'next/link';
import { CiMusicNote1 } from 'react-icons/ci';

function PublicRoomChip({ roomObj, key }: any) {
  return (
    <div
      style={{
        justifyContent: 'space-between',
        backgroundColor: '#fff2',
        borderRadius: '10px',
        alignItems: 'center',
        padding: '10px',
        paddingRight: '30px',
        display: 'flex',
        gap: '20px',
      }}
    >
      <table style={{ fontSize: '20px', width: '70%' }}>
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
        </tbody>
      </table>
      <Link
        style={{
          backgroundColor: '#0F05',
          padding: '5px 15px',
          borderRadius: '100px',
          fontSize: '17px',
        }}
        href={`/join-rooms/${roomObj._id}`}
      >
        Join Room
      </Link>
      <CiMusicNote1 style={{ fontSize: '40px' }} />
    </div>
  );
}

export default PublicRoomChip;
