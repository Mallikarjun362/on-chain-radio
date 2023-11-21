'use client';
import { fetchAllPostStreamingData } from '@/utils/4_DatabaseActions';
import { useEffect, useState } from 'react';
import StreamedAudioChip from '../_components/AudioChipStreamed';

function UpcomingAudioPage() {
  const [audio_list, setAudioList] = useState<Array<any>>([]);
  useEffect(() => {
    const run = async () => {
      setAudioList(await fetchAllPostStreamingData());
    };
    run();
  }, []);
  return (
    <main
      style={{
        padding: '20px 20%',
        display: 'flex',
        gap: '20px',
        flexDirection: 'column',
      }}
    >
      {audio_list.map((val, idx) => (
        <StreamedAudioChip key={idx} audio_obj={val} />
      ))}
    </main>
  );
}

export default UpcomingAudioPage;
