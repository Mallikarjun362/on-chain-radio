'use client';
import { getAllActiveRooms } from '@/utils/4_DatabaseActions';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import PublicRoomChip from './_components/PublicRoomChip';

const CreatorPage = () => {
  const [activeRooms, setActiveRooms] = useState<Array<any>>([]);
  useEffect(() => {
    const run = async () => setActiveRooms(await getAllActiveRooms());
    run();
  }, []);
  return (
    <div className="pageBody">
      {activeRooms.map((val: any, idx: number) => (
        <PublicRoomChip key={idx} roomObj={val} />
      ))}
    </div>
  );
};

export default CreatorPage;
