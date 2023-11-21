'use client';
import { useEffect, useState } from 'react';
import AudioChipStreamed from '../_components/AudioChipStreamed';
import { fetchAllStreamedData } from '@/utils/4_DatabaseActions';


function StreamedAudiosSection() {
  const [audio_list, setAudioList] = useState<Array<any>>([]);
  useEffect(()=>{
    const run = async ()=>{
      const results = await fetchAllStreamedData()
      setAudioList(results);
      console.log(results);
    }
    run();
  },[])
  return (
    <main style={{ padding: '20px 20%', display: 'flex', gap: '20px',flexDirection:"column" }}>
      {audio_list.map((val, idx) => (
        <AudioChipStreamed key={idx} audio_obj={val} />
      ))}
    </main>
  );
}

export default StreamedAudiosSection;
