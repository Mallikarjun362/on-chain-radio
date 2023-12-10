'use client';
import { getAllActiveRooms } from '@/utils/4_DatabaseActions';
import { useEffect, useState } from 'react';
import PublicRoomChip from './_components/PublicRoomChip';

const CreatorPage = () => {
  const [activeRooms, setActiveRooms] = useState<Array<any>>([]);
  useEffect(() => {
    const run = async () => setActiveRooms(await getAllActiveRooms());
    run();
  }, []);
  return (
    <main
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '50px 0px',
      }}
    >
      <div className="w-[80%] flex gap-[20px] flex-col | lg:w-[60%] | md:w-[60%]">
        {activeRooms.map((val: any, idx: number) => (
          <PublicRoomChip key={idx} roomObj={val} />
        ))}
      </div>
    </main>
  );
};

export default CreatorPage;
