import { IAudio } from '@/mongodb_models/2_Audio';

function AudioChipStreamed({ audio_obj }: { audio_obj: IAudio }) {
  return (
    <div
      style={{
        backgroundColor: '#282828', // Spotify background color
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: '#fff', // Text color
      }}
    >
      <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '5px' }}>
        {audio_obj.title}
      </div>
      <div style={{ fontSize: '0.9em', marginBottom: '5px' }}>
        Artist: {audio_obj.author_wallet_address}
      </div>
      {/* Add more details as needed */}
      <button
        style={{
          backgroundColor: '#1DB954', // Spotify green color
          color: '#fff',
          padding: '10px 20px',
          borderRadius: '30px',
          border: 'none',
          cursor: 'pointer',
          marginTop: '10px',
        }}
      >
        Play
      </button>
    </div>
  );
}

export default AudioChipStreamed;
