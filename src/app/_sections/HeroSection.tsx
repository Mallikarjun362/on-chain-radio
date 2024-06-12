import Image from "next/image";
import LuxuryRadio from "@/../public/Illustrations/LuxuryRadio.png";

function HeroSection() {
  return (
    <div
      className="sm:flex sm:flex-col sm:gap-10 | lg:flex lg:flex-row lg:w-[100%] lg:p-[7%] lg:h-[80vh] | pl-[7%] pr-[7%] gap-10 pt-[30px]"
      style={{
        justifyContent: "space-between",
        fontFamily: "Times Romen",
        alignItems: "center",
        color: "white",
        width: "100%",
      }}
    >
      {/* -------------------- LEFT ------------------- */}
      <div
        className="lg:w-[60vw] | w-[100%] lg:bg-[#0005]"
        style={{
          borderRadius: "20px",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "clamp(70px, 7vw, 115px)" }}>
          Unleash Your Sonic Elegance
        </h1>
        <br />
        <p style={{ color: "#fff9", fontSize: "clamp(20px,6vw + 10px,30px)" }}>
          Elevate Your Melodies, Monetize Your Passion. Welcome to On Chain
          Radio – Where Passion Meets Soundwaves.
        </p>
      </div>
      {/* -------------------- RIGHT ------------------- */}
      <Image
        className="sm:w-[100%] | md:w-[75vw] | lg:w-[40vw] w-[100%]"
        src={LuxuryRadio}
        alt="Luxury Radio"
        style={{
          objectFit: "contain",
          background:
            "radial-gradient(ellipse at center, rgba(0,0,0,1) 10%,rgba(0,0,0,0) 50%,rgba(0,0,0,0) 100%)",
        }}
        priority={true}
      />
    </div>
  );
}

export default HeroSection;
