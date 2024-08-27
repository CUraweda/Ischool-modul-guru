import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Player } from '@lottiefiles/react-lottie-player';

interface InstructionTrainFace2Props {
  initialInstructionStep?: number;
  onShowInput3: () => void;
  onStartVideo: () => void;
}

const InstructionTrainFace2: React.FC<InstructionTrainFace2Props> = ({
  initialInstructionStep = 0,
  onShowInput3,
  onStartVideo,
}) => {
  const [instructionStep] = useState(initialInstructionStep);
  const [, setActiveCardIndex] = useState(0);
  const cardIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const steps = ["Memilih kelas", "Memilih nama", "Praktek latih wajah"];

  useEffect(() => {
    if (instructionStep === 2) {
      animateCards();
      cardIntervalRef.current = setInterval(() => {
        setActiveCardIndex((prevIndex) => (prevIndex + 1) % steps.length);
      }, 2000);
    }

    return () => {
      if (cardIntervalRef.current) {
        clearInterval(cardIntervalRef.current);
      }
    };
  }, [instructionStep]);

  const nextInstruction = () => {
    onShowInput3();
    onStartVideo();
  };

  const animateCards = () => {
    gsap.to(".card", {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      stagger: 0.2,
      ease: "back.out(1.7)",
    });
  };


  return (
    <div className="instruction-container relative w-full h-screen m-0 py-10 px-5 text-center bg-[#f9f9f9] flex flex-col justify-between overflow-y-auto maxw768:py-[20px] maxw768:px-[10px]">
      <div className="instruction-content flex-grow flex flex-col justify-center">
        {instructionStep === 0 && (
          <div className="instruction-text">
            <Player
              src="https://lottie.host/213ba68d-651e-46e6-961a-c36acd03ba77/aYU5PgAU2P.json"
              background="transparent"
              speed={1}
              style={{ width: '300px', height: '300px', margin: '0 auto' }}
              loop
              autoplay
            ></Player>
            <div style={{ fontWeight: 600, marginTop: '-1rem' }}>Ekspresi harus datar</div>
          </div>
        )}
        {instructionStep === 1 && (
          <div className="instruction-text">
            <Player
              src="https://lottie.host/cd3e57e1-879c-4e2f-9899-57aaa8f46fae/DBVQsqyIpg.json"
              background="transparent"
              speed={1}
              style={{ width: '300px', height: '300px', margin: '0 auto' }}
              loop
              autoplay
            ></Player>
            <div style={{ fontWeight: 600, marginTop: '-1rem' }}>Sekarang senyum</div>
          </div>
        )}
      </div>
      <div className="navigation mt-10 flex justify-end">
        {instructionStep === 0 && (
          <button onClick={nextInstruction} className="btn bg-blue-500 hover:bg-blue-500 btn-ghost w-32 text-white">
            Selanjutnya
          </button>
        )}
        {instructionStep === 1 && (
          <button onClick={nextInstruction} className="nav-button bg-blue-500 text-white border-none py-3 px-6 rounded-full cursor-pointer text-base transition-transform duration-200 ease-out focus:outline-none hover:bg-blue-700 hover:translate-y-[-2px] disabled:bg-gray-400 disabled:cursor-not-allowed maxw768:py-[10px] maxw768:px-[20px] maxw768:text-[14px]">
            Selanjutnya
          </button>
        )}
      </div>
    </div>
  );
};

export default InstructionTrainFace2;