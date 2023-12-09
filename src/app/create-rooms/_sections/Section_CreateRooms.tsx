'use client';
import { useGlobalContext } from '@/app/_context/store';
import styles from '../styles.module.css';
import { createRoom, getRoomsOfAnUser } from '@/utils/4_DatabaseActions';
import { useEffect, useRef, useState } from 'react';
import RoomChip from '../_components/RoomChip';

function Section_CreateRooms() {
  const { wallet_address, userCreatedRooms, setUserCreatedRooms } =
    useGlobalContext();
  const myForm = useRef<HTMLFormElement>(null);
  const refreshRooms = () => {
    getRoomsOfAnUser(wallet_address).then((results: Array<any>) => {
      setUserCreatedRooms(results);
    });
  };
  useEffect(() => {
    if (wallet_address && userCreatedRooms.length === 0) {
      refreshRooms();
    }
  }, [wallet_address]);
  return (
    <div className={`${styles.pageSection}`}>
      <h1>Create rooms</h1>
      <form
        ref={myForm}
        action={async (formdata: FormData) => {
          const room_title = formdata.get('title')?.toString().trim();
          if (!wallet_address) {
            return alert('Connect Wallet !!');
          }
          if (room_title === '') {
            return alert('Provide a valid Room Name');
          } else {
            const roomID = await createRoom(
              room_title as string,
              wallet_address
            );
            setUserCreatedRooms((prev) => [
              ...prev,
              {
                _id: roomID,
                main_author_wallet_address: wallet_address,
                title: room_title,
              },
            ]);
            // alert(`Room Created of ${room_title} ${roomID}`);
            myForm.current?.reset();
          }
        }}
        style={{
          display: 'flex',
          gap: '50px',
          padding: '0px 100px',
          fontSize: '20px',
        }}
      >
        <input
          type="text"
          name="title"
          id="title"
          placeholder="title"
          style={{
            flexGrow: 1,
            flexBasis: 'auto',
            padding: '10px 20px',
            backgroundColor: '#0000',
            borderBottom: '1px solid #fff9',
            outline: 'none',
          }}
        />
        <button
          type="submit"
          style={{
            fontWeight: 'bold',
            backgroundColor: '#fff4',
            borderRadius: '100px',
            padding: '5px 20px',
            flexBasis: 'min-content',
            whiteSpace: 'nowrap',
          }}
        >
          Create Room
        </button>
      </form>
      <br />
      <br />
      {userCreatedRooms.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {userCreatedRooms.map((val, idx) => (
            <RoomChip roomObj={val} key={idx} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

export default Section_CreateRooms;
