import { IAudio } from '@/mongodb_models/2_Audio';

function AudioChipStreamed({ audio_obj }: { audio_obj: IAudio }) {
  return (
    <div
      style={{
        backgroundColor: '#fff6',
        padding: '50px',
        borderRadius: '0px',
      }}
    >
      <div>{audio_obj.title}</div>
      <div>{audio_obj.author_wallet_address}</div>
      <div>{audio_obj.collection_type}</div>
    </div>
  );
}

export default AudioChipStreamed;
