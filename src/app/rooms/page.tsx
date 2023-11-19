'use client';
import { getAllActiveRooms } from '@/utils/4_DatabaseActions';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const CreatorPage = () => {
  const [activeRooms, setActiveRooms] = useState<Array<any>>([]);
  useEffect(() => {
    const run = async () => setActiveRooms(await getAllActiveRooms());
    run();
  }, []);
  return (
    <div className="pageBody">
      {activeRooms.map((val: any, idx: number) => (
        <div className='pageSection' key={idx}>
          {val._id}
          <br />
          <Link href={`/rooms/${val._id}#~${val.title}`}>Join Room</Link>
        </div>
      ))}
    </div>
  );
};

export default CreatorPage;
