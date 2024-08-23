import React, { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Player } from '@lottiefiles/react-lottie-player';

interface Step {
    text: string;
    gif: string;
}

interface InstructionProps {
    onShowForm: () => void;
}

const InstructionFaceGuru: React.FC<InstructionProps> = ({ onShowForm }) => {
    const [instructionStep, setInstructionStep] = useState(0);
    const [, setActiveCardIndex] = useState(-1);
    const cardIntervalRef = useRef<NodeJS.Timeout | null>(null);

    const steps: Step[] = [
        { text: "Memilih kelas", gif: "https://lottie.host/7cc85312-0364-4b40-89cc-93005ba44833/ifo9WKgn8S.json" },
        { text: "Memilih nama", gif: "https://lottie.host/7cc85312-0364-4b40-89cc-93005ba44833/ifo9WKgn8S.json" },
        { text: "Praktek latih wajah", gif: "https://lottie.host/84f02daf-04ce-4704-bc4d-afc71704a74d/iRZqcBjoKs.json" },
    ];

    useEffect(() => {
        if (instructionStep === 2) {
            setTimeout(() => {
                animateCards();
                setTimeout(() => {
                    cardIntervalRef.current = setInterval(() => {
                        setActiveCardIndex((prev) => (prev + 1) % steps.length);
                    }, 1000);
                }, 500);
            }, 1000);
        }

        return () => {
            if (cardIntervalRef.current) {
                clearInterval(cardIntervalRef.current);
            }
        };
    }, [instructionStep]);

    const animateCards = () => {
        gsap.to(".card", {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.2,
            ease: "back.out(1.7)",
        });
    };

    const nextInstruction = () => {
        if (instructionStep < 2) {
            setInstructionStep((prev) => prev + 1);
        }
    };

    const prevInstruction = () => {
        if (instructionStep > 0) {
            setInstructionStep((prev) => prev - 1);
        }
    };


    return (
        <div id="instructionContainer" className="instruction-container relative w-full h-[100vh] m-0 px-[20px] py-[40px] text-center font-serif bg-[#f9f9f9] flex flex-col justify-between overflow-y-auto maxw768:py-[20px] maxw768:px-[10px]">
            <div className="instruction-content flex-grow-[1] flex flex-col justify-center">
                {instructionStep === 0 && (
                                <div className="instruction-content flex-grow-[1] flex flex-col justify-center">
                                <div className="instruction-text translate-y-5">
                                    <h2 className='text-[#2196f3] mb-[20px] text-[32px] maxw768:text-[28px]'>Selamat Datang</h2>
                                    <p className='text-[18px] text-[#333] mb-[10px] maxw768:text-[16px]'>di Program Latih Wajah Face Recognition</p>
                                    <Player
                                        src="https://assets10.lottiefiles.com/packages/lf20_jcikwtux.json"
                                        background="transparent"
                                        speed={1}
                                        style={{ width: '300px', height: '300px', margin: '0 auto' }}
                                        loop
                                        autoplay
                                    />
                                </div>
                                </div>
                )}
                {instructionStep === 1 && (
                     <div className="instruction-text translate-y-5">
                     <h2 className='text-[#2196f3] mb-[20px] text-[32px] maxw768:text-[28px]'>Persiapan</h2>
                     <p className='text-[18px] text-[#333] mb-[10px] maxw768:text-[16px]'>Apakah Anda menggunakan kacamata?</p>
                     <p className='text-[18px] text-[#333] mb-[10px] maxw768:text-[16px]'>Jika ya, mohon lepaskan kacamata Anda.</p>
                     <Player
                         src="https://lottie.host/409baa0a-5363-4ec4-9dd3-8c2861014048/po7qd854sv.json"
                         background="transparent"
                         speed={1}
                         className='xl:w-[280px] md:w-[280px] sm:w-[180px] w-[180px]'
                         loop
                         autoplay
                     />
                    </div>
                )}
                {instructionStep === 2 && (
                     <div className="instruction-text translate-y-5">
                     <h2 className='text-[#2196f3] text-[32px] maxw768:text-[28px]'>Persiapan</h2>
                     <p className='text-[18px] text-[#333] mb-[20px] maxw768:text-[16px]'>Persiapkan diri Anda.</p>
                     <Player
                         src="https://lottie.host/2a2b2948-c79d-43b1-b05d-f1b00b6418e4/UsEBTNxNJl.json"
                         background="transparent"
                         speed={1}
                         className='xl:w-[230px] md:w-[230px] sm:w-[180px] w-[180px]'
                         loop
                         autoplay
                     />
                 </div> 
                )}
            </div>
            <div className="navigation mt-[40px] flex justify-between">
                {instructionStep === 0 ? (
                    <a
                        href="/profile"
                        className="btn bg-blue-500 hover:bg-blue-500 btn-ghost w-32 text-white"
                    >
                        Sebelumnya
                    </a>
                ) : (
                    <button
                        onClick={prevInstruction}
                        className="btn bg-blue-500 hover:bg-blue-500 btn-ghost w-32 text-white"
                    >
                        Sebelumnya
                    </button>
                )}
                {instructionStep < 2 ? (
                    <button onClick={nextInstruction} className="btn bg-blue-500 hover:bg-blue-500 btn-ghost w-32 text-white">
                        Selanjutnya
                    </button>
                ) : (
                    <button onClick={onShowForm} className="btn bg-green-500 hover:bg-green-500 btn-ghost w-32 text-white">
                        Mulai
                    </button>
                )}
            </div>
        </div>
    );
};

export default InstructionFaceGuru;