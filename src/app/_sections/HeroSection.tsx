import Image from 'next/image';
import LuxuryRadio from '@/../public/Illustrations/LuxuryRadio.png';
import { Prata } from 'next/font/google';

const prata = Prata({ subsets: ['latin'], weight: '400' });
function HeroSection() {
  return (
    <div
      className={prata.className}
      style={{
        justifyContent: 'space-between',
        fontFamily: 'Times Romen',
        alignItems: 'center',
        padding: '0px 150px',
        display: 'flex',
        height: '80vh',
        color: 'white',
        gap: '100px',
      }}
    >
      {/* -------------------- LEFT ------------------- */}
      <div style={{ flex: '3 1 auto' }}>
        <h1 style={{ fontSize: '80px' }}>Unleash Your Sonic Elegance</h1>
        <br />
        <p style={{ color: '#fff9', fontSize: '25px' }}>
          Elevate Your Melodies, Monetize Your Passion. Welcome to On Chain
          Radio – Where Passion Meets Soundwaves.
        </p>
      </div>
      {/* -------------------- RIGHT ------------------- */}
      <Image
        src={LuxuryRadio}
        alt="Luxury Radio"
        width={700}
        style={{
          objectFit: 'contain',
        }}
      />
    </div>
  );
}

export default HeroSection;
