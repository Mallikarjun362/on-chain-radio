import Link from 'next/link';

function PublicRoomChip({ roomObj }: any) {
  return (
    <div
      className="flex-col | lg:flex-row | md:flex-row"
      style={{
        justifyContent: 'space-between',
        backgroundColor: '#fff2',
        borderRadius: '10px',
        alignItems: 'center',
        paddingRight: '30px',
        overflow: 'hidden',
        padding: '10px',
        display: 'flex',
        width: '100%',
        gap: '30px',
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
          whiteSpace: 'nowrap',
          fontSize: '17px',
        }}
        href={`/join-rooms/${roomObj._id}`}
      >
        Join Room
      </Link>
    </div>
  );
}

export default PublicRoomChip;
