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

  console.log(audio_list)
  return (
    // <main
    //   style={{
    //     padding: '20px 20%',
    //     display: 'flex',
    //     gap: '20px',
    //     flexDirection: 'column',
        
    //   }}
    // >
    //   {audio_list.map((val, idx) => (
    //     <StreamedAudioChip key={idx} audio_obj={val} />
    //   ))}
    // </main>
    <div style={{ padding: '20px', marginBottom:60 }}>
        <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>Upcoming Audios</h1>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {audio_list.map((val, idx) => (
              <li
                key={idx}
                style={{
                  marginBottom: '10px',
                  border: '1px solid #333',
                  padding: '10px',
                  borderRadius: '5px',
                  background: '#222',
                  color:'#fff',
                }}
              >
                {val.ipfs_hash && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ marginRight: '10px' }}>{val.title}</span>
                    <span style={{ marginRight: '10px' }}>{val.description}</span>
                  </div>
                )}
              </li>
            ))}
          </ul>
      </div>
  );
}

export default UpcomingAudioPage;
