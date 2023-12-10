import Image from 'next/image';
import LuxuryRadio from '@/../public/Illustrations/LuxuryRadio.png';

function HeroSection() {
  return (
    <div
      className="sm:flex sm:flex-col sm:gap-10 | lg:flex lg:flex-row lg:w-[100%] lg:p-[10%] lg:h-[80vh] | pl-[10%] pr-[10%] gap-10"
      style={{
        justifyContent: 'space-between',
        fontFamily: 'Times Romen',
        alignItems: 'center',
        color: 'white',
        width: '100%',
      }}
    >
      {/* -------------------- LEFT ------------------- */}
      <div className="lg:w-[60vw] | w-[100%]">
        <h1 style={{ fontSize: 'clamp(50px, 7vw, 120px)' }}>
          Unleash Your Sonic Elegance
        </h1>
        <br />
        <br />
        <p style={{ color: '#fff9', fontSize: 'clamp(20px,6vw + 10px,30px)' }}>
          Elevate Your Melodies, Monetize Your Passion. Welcome to On Chain
          Radio – Where Passion Meets Soundwaves.
        </p>
        <br />
      </div>
      {/* -------------------- RIGHT ------------------- */}
      <Image
        className="sm:w-[100%] | md:w-[75vw] | lg:w-[40vw] w-[100%]"
        src={LuxuryRadio}
        alt="Luxury Radio"
        style={{
          objectFit: 'contain',
        }}
        priority={true}
      />
    </div>
  );
}

export default HeroSection;
