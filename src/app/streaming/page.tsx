'use client';
import {
  fetchAllCurrentStreamingData,
  fetchAllStreamedData,
} from '@/utils/4_DatabaseActions';
import { support } from '../../utils/1_AptosBlockchain';
import { useGlobalContext } from '../_context/store';
import { useEffect, useRef, useState } from 'react';
import { IAudio } from '@/mongodb_models/2_Audio';
import { FaRegPlayCircle } from 'react-icons/fa';
import { FiPauseCircle } from 'react-icons/fi';
import 'react-h5-audio-player/lib/styles.css';
import Lottie from 'react-lottie';
import animationData from '@/../../public/animations/MusicDance.lottie.json';
function CurrentStreamingAudioPage() {
  // COMPONENT STATE VARIABLES
  const audioPlayer = useRef<any>(null);
  const [audioList, setAudioList] = useState<Array<any>>([]);
  const { wallet_address, wallet_object } = useGlobalContext();
  const [isAudioPlaying, setAudioPlaying] = useState<boolean>(false);
  const [currentSongObject, setCurrentSongObject] = useState<null | IAudio>(
    null
  );

  useEffect(() => {
    const run = async () => {
      const results = await fetchAllCurrentStreamingData(); // FETCH AUDIOS FROM BACKEND THAT ARE CURRENTLY STREAMING
      setAudioList(results); // SET THE AUDIOS RECEIVED FROM BACKEND
      console.log(results);
    };
    document.addEventListener('keypress', (event: Event) => {
      event.preventDefault();
      const k = (event as any).key;
      if (k === ' ' && audioPlayer.current) {
        if (audioPlayer.current?.paused) {
          resumeAudio();
        } else {
          pauseAudio();
        }
      }
    });
    audioPlayer.current = new Audio();
    audioPlayer.current.addEventListener('loadedmetadata', () => {
      // console.log(
      //   'Current audio duration :',
      //   audioPlayer.current.duration,
      //   'seconds'
      // );
    });
    if (audioList.length == 0) {
      run();
    }
  }, []);

  const getTotalDuration = (songObject: any) =>
    Math.abs(
      Math.floor(
        (new Date(songObject.end_streaming_time).getTime() -
          new Date(songObject.streaming_time).getTime()) /
          1000
      )
    );
  const getStartDuration = (songObject: any) =>
    Math.floor(
      (Date.now() - new Date(songObject.streaming_time).getTime()) / 1000
    );

  const playAudio = (songObject: any) => {
    // console.log('PLAY AUDIO');
    try {
      if (songObject.ipfs_hash !== currentSongObject?.ipfs_hash) {
        (
          audioPlayer.current as any
        ).src = `https://gateway.pinata.cloud/ipfs/${songObject?.ipfs_hash}`;
        (audioPlayer.current as any).onEnded = () => setAudioPlaying(false);
      }
      const totalDuration = getTotalDuration(songObject);
      const startDuration = getStartDuration(songObject);
      if (startDuration < totalDuration) {
        (audioPlayer.current as any).currentTime = startDuration;
      }
      (audioPlayer.current as any).play();
      setCurrentSongObject(songObject);
      setAudioPlaying(true);
    } catch (err) {
      console.log('Invalid audio src', err);
    }
  };

  const pauseAudio = () => {
    // console.log('PAUSE AUDIO');
    if (!(audioPlayer.current as any).paused) {
      (audioPlayer.current as any).pause();
      setAudioPlaying(false);
    }
  };

  const resumeAudio = () => {
    // console.log('RESUME AUDIO');
    if ((audioPlayer.current as any).paused) {
      (audioPlayer.current as any).play();
      setAudioPlaying(true);
    }
  };

  const lottie = (
    <Lottie
      options={{
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: 'xMidYMid slice',
        },
      }}
      speed={0.5}
      height={50}
      width={100}
      isPaused={!isAudioPlaying}
    />
  );

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        flexDirection: 'column',
        alignItems: 'center',
        display: 'flex',
      }}
    >
      {/* == DISPLAY OF STREAMED SONGS ==== DISPLAY OF STREAMED SONGS ==== DISPLAY OF STREAMED SONGS ==== DISPLAY OF STREAMED SONGS == */}
      <div
        className="w-[80%] lg:w-[60%]"
        style={{ padding: '20px', marginBottom: '200px' }}
      >
        <h1 style={{ fontSize: '2em' }}>Current streaming songs</h1>
        <br />
        {audioList.length == 0 ? (
          <div
            style={{
              textAlign: 'center',
              userSelect: 'none',
              marginTop: '30vh',
              fontSize: '50px',
              color: '#fff6',
            }}
          >
            Empty 😔
          </div>
        ) : null}
        <ul
          style={{
            flexDirection: 'column',
            listStyle: 'none',
            display: 'flex',
            gap: '20px',
          }}
        >
          {/* STREAMED AUDIO LIST ITEM */}
          {audioList.map(
            (val, idx) =>
              val.ipfs_hash && (
                <li
                  className="flex-col  | md:flex-row md:items-center md:justify-between | lg:flex-row lg:items-center lg:justify-between"
                  key={idx}
                  style={{
                    background:
                      currentSongObject?.ipfs_hash === val.ipfs_hash
                        ? '#1db954'
                        : '#fff1',
                    color:
                      currentSongObject?.ipfs_hash === val.ipfs_hash
                        ? '#fff'
                        : '#fff',
                    borderRadius: '5px',
                    padding: '10px 30px',
                    display: 'flex',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '22px' }}>{val.title}</span>
                    <br />
                    <span style={{ color: '#fff6' }}>{val.description}</span>
                  </div>
                  <div
                    className="justify-between | md:flex-row md:justify-center | lg:flex-row lg:justify-center md:gap-20"
                    style={{
                      alignItems: 'center',
                      display: 'flex',
                    }}
                  >
                    {currentSongObject?.ipfs_hash === val.ipfs_hash ? (
                      <div style={{ width: '25%', position: 'relative' }}>
                        {lottie}
                      </div>
                    ) : null}
                    <p style={{ fontSize: '20px', textAlign: 'center' }}>
                      {Math.floor(getTotalDuration(val) / 60)}:
                      {Math.floor(getTotalDuration(val) % 60)
                        .toString()
                        .padStart(2, '0')}
                    </p>
                    {currentSongObject?.ipfs_hash === val.ipfs_hash &&
                    isAudioPlaying ? (
                      <button
                        onClick={(e: any) => {
                          e.target.blur();
                          pauseAudio();
                        }}
                        className="text-[#fff]"
                        style={{
                          borderRadius: '100%',
                          fontSize: '35px',
                          padding: '0px',
                        }}
                      >
                        <FiPauseCircle />
                      </button>
                    ) : (
                      <button
                        onClick={(e: any) => {
                          e.target.blur();
                          playAudio(val);
                        }}
                        className="text-[#fff7] hover:text-[#fff]"
                        style={{
                          borderRadius: '100%',
                          fontSize: '35px',
                          padding: '0px',
                        }}
                      >
                        <FaRegPlayCircle />
                      </button>
                    )}

                    <button
                      style={{
                        background: '#1db954',
                        padding: '8px 12px',
                        borderRadius: '10%',
                        cursor: 'pointer',
                        border: 'none',
                        color: '#fff',
                        userSelect: 'none',
                      }}
                      onClick={() =>
                        support({
                          artist_address: wallet_address,
                          aptos_wallet: wallet_object,
                          song_ipfs: val.ipfs_hash,
                          amount: 0.5e8,
                        })
                      }
                    >
                      Support
                    </button>
                  </div>
                </li>
              )
          )}
        </ul>
      </div>
    </div>
  );
}

export default CurrentStreamingAudioPage;
