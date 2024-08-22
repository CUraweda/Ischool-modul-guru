import React, { useState, useEffect, useRef } from 'react';
import * as faceapi from 'face-api.js';

interface TrainFaceProps {
    isVideo: boolean;
    isNone: boolean;
    updateCapturedImages: (images: string[]) => void;
    updateIsVideo: (isVideo: boolean) => void;
    updateIsNone: (isNone: boolean) => void;
    InstructionChange: () => void;
    handleSubmit: () => void;
    CropImage: () => void;
}

const TrainFace: React.FC<TrainFaceProps> = ({
    isVideo: initialIsVideo,
    isNone: initialIsNone,
    updateCapturedImages,
    updateIsVideo,
    updateIsNone,
    InstructionChange,
    handleSubmit,
    CropImage,
}) => {
    const [captureFinished, setCaptureFinished] = useState(false);
    const [borderProgress, setBorderProgress] = useState(0);
    const [cameraAccessStatus, setCameraAccessStatus] = useState<'default' | 'granted' | 'denied' | 'notAvailable'>('default');

    const captureStageRef = useRef(0);
    const correctMovementRef = useRef<boolean>(false);

    const [lastFrame, setLastFrame] = useState<ImageData | null>(null);
    const [isCheckingCameraMovement, setIsCheckingCameraMovement] = useState(false);
    const [movementCheckStartTime, setMovementCheckStartTime] = useState<number | null>(null);
    const [cameraMovementDetected, setCameraMovementDetected] = useState(false);

    const [detectionInterval, setDetectionInterval] = useState<NodeJS.Timeout | null>(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [faceDetected, setFaceDetected] = useState(false);
    const [faceCloseEnough, setFaceCloseEnough] = useState(false);
    const [detectedFaceWidth, setDetectedFaceWidth] = useState(0);
    const [captureStage, setCaptureStage] = useState(0);
    const [correctMovement, setCorrectMovement] = useState(false);

    const [localIsVideo, setLocalIsVideo] = useState(initialIsVideo);
    const [localIsNone, setLocalIsNone] = useState(initialIsNone);
    const [lightingCondition, setLightingCondition] = useState("good");
    const [capturedImages, setCapturedImages] = useState<string[]>([]);
    const [targetBorderProgress, setTargetBorderProgress] = useState(0);

    const lightSensitivity = 0.25;
    const rotationInstructions = [
        "Hadap ke kamera dan hadap kanan sedikit",
        "Hadap ke kamera dan hadap kiri sedikit",
        "Hadap ke kamera dan angkat dagu sedikit",
        "Hadap ke kamera dan turunkan dagu sedikit",
    ];

    const lastPitchRef = useRef(0);
    const lastYawRef = useRef(0);
    const lastCaptureTimeRef = useRef(0);
    const movementCooldown = 500; // in milliseconds
    const yawSensitivity = 0.8;
    const pitchSensitivity = 0.8;
    const [stream, setStream] = useState<MediaStream | null>(null);

    const minFaceSize = 250;
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const faceDetectionOptions = new faceapi.TinyFaceDetectorOptions();

    useEffect(() => {
        captureStageRef.current = captureStage;
        correctMovementRef.current = correctMovement;
    }, [captureStage, correctMovement]);

    useEffect(() => {
        setLocalIsNone(initialIsNone);
    }, [initialIsNone]);

    useEffect(() => {
        setLocalIsVideo(initialIsVideo);
    }, [initialIsVideo]);

    useEffect(() => {
        const loadModels = async () => {
            await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
            await faceapi.nets.faceLandmark68Net.loadFromUri("/models");
        };

        loadModels();
        startCamera();
    }, []);

    const startCamera = async () => {
        if (captureFinished) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {},
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraAccessStatus('granted');
                videoRef.current.onloadedmetadata = () => {
                    startCameraMovementCheck();
                };
            }
        } catch (error) {
            console.error("Error accessing camera:", error);
            if (error instanceof Error) {
                if (error.name === "NotAllowedError") {
                    setCameraAccessStatus('denied');
                } else {
                    setCameraAccessStatus('notAvailable');
                }
            }
        }
    };

    const ensureVideoReady = (): Promise<void> => {
        return new Promise((resolve) => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
                resolve();
            } else if (videoRef.current) {
                videoRef.current.onloadeddata = () => {
                    resolve();
                };
            }
        });
    };

    const startCameraMovementCheck = async () => {
        await ensureVideoReady();
        setIsCheckingCameraMovement(true);
        setMovementCheckStartTime(Date.now());
        checkCameraMovement();
    };

    const checkCameraMovement = () => {
        if (
            !isCheckingCameraMovement ||
            (movementCheckStartTime && Date.now() - movementCheckStartTime > 3000)
        ) {
            finishCameraMovementCheck();
            return;
        }

        if (!videoRef.current || videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
            setTimeout(() => checkCameraMovement(), 100);
            return;
        }

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) return;

        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const currentFrame = context.getImageData(0, 0, canvas.width, canvas.height);

        if (lastFrame) {
            const diff = compareFrames(lastFrame, currentFrame);
            if (diff > 0.01) {
                setCameraMovementDetected(true);
                finishCameraMovementCheck();
                return;
            }
        }

        setLastFrame(currentFrame);
        requestAnimationFrame(checkCameraMovement);
    };

    const finishCameraMovementCheck = () => {
        setIsCheckingCameraMovement(false);
        if (cameraMovementDetected) {
            console.log("Kamera aktif dan bergerak");
            startFaceDetection();
        } else {
            console.log("Tidak ada pergerakan kamera terdeteksi");
            startFaceDetection();
            // setCameraAccessStatus("notAvailable");
        }
    };

    const compareFrames = (frame1: ImageData, frame2: ImageData): number => {
        let diff = 0;
        const l = frame1.data.length;
        for (let i = 0; i < l; i += 4) {
            diff += Math.abs(frame1.data[i] - frame2.data[i]);
        }
        return diff / (l / 4) / 255;
    };

    const startFaceDetection = () => {
        const interval = setInterval(async () => {
            if (!videoRef.current || !videoRef.current.videoWidth) {
                console.log("Video element not ready yet");
                return;
            }

            const detections = await faceapi
                .detectAllFaces(
                    videoRef.current,
                    new faceapi.TinyFaceDetectorOptions()
                )
                .withFaceLandmarks();

            if (detections.length > 1) {
                showError(
                    "Lebih dari satu wajah terdeteksi. Pastikan hanya ada satu wajah dalam frame."
                );
                setFaceDetected(false);
                setFaceCloseEnough(false);
                return;
            }

            if (detections.length === 1) {
                clearError();
                const detection = detections[0];
                const face = detection.detection;
                setDetectedFaceWidth(face.box.width);

                if (face.box.width >= minFaceSize) {
                    setFaceDetected(true);
                    setFaceCloseEnough(true);
                    if (captureStageRef.current === 0) {
                        captureImage();
                    } else if (captureStageRef.current > 0 && captureStageRef.current <= 10) {
                        checkRotation(detection.landmarks);
                        if (correctMovementRef) {
                            captureImage();
                        }
                    }
                } else {
                    setFaceDetected(true);
                    setFaceCloseEnough(false);
                }
            } else {
                setFaceDetected(false);
                setFaceCloseEnough(false);
            }
        }, 2500);

        setDetectionInterval(interval);
    };


    const showError = (message: string) => {
        setErrorMessage(message);
        console.log(message);
        console.error(message);
    };

    const clearError = () => {
        setErrorMessage("");
    };
    const captureImage = async () => {
        if (errorMessage) {
            console.log("Tidak mengambil gambar karena ada error.");
            return;
        }
        if (!localIsVideo) {
            console.log("ets keluar");
            return;
        }
        const canvas = canvasRef.current;
        const video = videoRef.current;
        if (canvas && video) {
            const ctx = canvas.getContext("2d");
            if (ctx) {
                ctx.save();
                ctx.scale(-1, 1);
                ctx.drawImage(video, -canvas.width, 0, canvas.width, canvas.height);
                ctx.restore();
                const capturedImage = canvas.toDataURL("image/jpeg");

                const newLightingCondition = await analyzeBrightness(capturedImage);
                setLightingCondition(newLightingCondition);

                if (newLightingCondition !== "good" && captureStageRef.current === 0) {
                    showLightingNotification();
                    console.log("masuk cahaya");
                    return;
                }

                const processedImage = capturedImage;

                setCapturedImages((prevImages) => {
                    const newImages = [...prevImages, processedImage];
                    updateCapturedImages(newImages);  // Panggil ini di dalam callback
                    return newImages;
                });

                saveToFileInput(processedImage);

                if (captureStageRef.current === 0) {
                    setCaptureStage(captureStageRef.current + 1);
                    console.log(captureStageRef.current)
                    showNextInstruction();
                } else {
                    // if (captureStageRef.current === 4) {
                    //     setRotationInstruction("");
                    //     setCurrentInstructionIndex(0);
                    //     setLocalIsVideo(false);
                    //     updateIsVideo(false);
                    //     setLocalIsNone(true);
                    //     updateIsNone(true);
                    //     InstructionChange();
                    // }
                    if (captureStageRef.current === 5) {
                        setRotationInstruction("");
                        setCurrentInstructionIndex(0);
                    }
                    setCaptureStage(captureStageRef.current + 1);
                    console.log(captureStageRef.current)
                    setCorrectMovement(false);
                    if (captureStageRef.current % 1 === 0) {
                        showNextInstruction();
                    }

                    if (captureStageRef.current === 9) {
                        setCorrectMovement(false);
                        setCaptureFinished(true);
                        finishCapture();
                    }
                }

                if (captureStageRef.current <= 10) {
                    setTargetBorderProgress((captureStageRef.current + 1) / 10);
                    animateBorderProgress();
                }

                setTimeout(() => {
                    setCorrectMovement(false);
                }, 1000);
            } else {
                console.error("Tidak dapat mendapatkan context dari canvas");
            }
        } else {
            console.error("Canvas atau video tidak tersedia");
        }
    };
    const checkRotation = async (landmarks: faceapi.FaceLandmarks68) => {
        if (!landmarks) {
            console.error("Landmarks not detected");
            return;
        }

        const nose = landmarks.getNose()[0];
        const leftEye = landmarks.getLeftEye()[0];
        const rightEye = landmarks.getRightEye()[0];
        const mouth = landmarks.getMouth()[0];

        if (!nose || !leftEye || !rightEye || !mouth) {
            console.error("One of the facial landmarks not detected");
            return;
        }

        const yaw = rightEye.x - leftEye.x;
        const pitch = nose.y - mouth.y;

        const yawDiff = Math.abs(yaw - lastYawRef.current);
        const pitchDiff = Math.abs(pitch - lastPitchRef.current);

        const currentTime = Date.now();
        const timeSinceLastCapture = currentTime - lastCaptureTimeRef.current;

        let newCorrectMovement = false;

        if (timeSinceLastCapture >= movementCooldown) {
            switch (currentInstructionIndex) {
                case 0: // Turn your face to the right
                    newCorrectMovement = yaw > lastYawRef.current && yawDiff > yawSensitivity;
                    break;
                case 1: // Turn your face to the left
                    newCorrectMovement = yaw < lastYawRef.current && yawDiff > yawSensitivity;
                    break;
                case 2: // Lift your chin slightly
                    newCorrectMovement = pitch < lastPitchRef.current && pitchDiff > pitchSensitivity;
                    break;
                case 3: // Lower your chin slightly
                    newCorrectMovement = pitch > lastPitchRef.current && pitchDiff > pitchSensitivity;
                    break;
            }

            if (newCorrectMovement) {
                lastCaptureTimeRef.current = currentTime;
            }
        }

        lastYawRef.current = yaw;
        lastPitchRef.current = pitch;
        setCorrectMovement(newCorrectMovement);
    };
    const analyzeBrightness = async (imageData: string) => {
        const img = await faceapi.fetchImage(imageData);
        const detections = await faceapi
            .detectSingleFace(img, faceDetectionOptions)
            .withFaceLandmarks();

        if (!detections) {
            return "no_face";
        }

        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return "no_face";

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const faceBox = detections.detection.box;
        const faceImageData = ctx.getImageData(
            faceBox.x,
            faceBox.y,
            faceBox.width,
            faceBox.height
        );
        const data = faceImageData.data;

        let brightness = 0;
        for (let i = 0; i < data.length; i += 4) {
            brightness +=
                (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
        }

        const avgBrightness = brightness / (faceBox.width * faceBox.height);

        return avgBrightness < lightSensitivity ? "low" : "good";
    };

    const showLightingNotification = () => {
        if (lightingCondition === "low") {
            setErrorMessage("Pencahayaan pada wajah kurang. Tingkatkan pencahayaan ke wajah Anda.");
        }
    };

    const [currentInstructionIndex, setCurrentInstructionIndex] = useState(0);
    const [rotationInstruction, setRotationInstruction] = useState(rotationInstructions[0]);

    const showNextInstruction = () => {
        setCurrentInstructionIndex((prevIndex) => (prevIndex + 1) % rotationInstructions.length);
    };

    useEffect(() => {
        setRotationInstruction(rotationInstructions[currentInstructionIndex]);
    }, [currentInstructionIndex, rotationInstructions]);

    console.log(currentInstructionIndex); // will increment correctly
    console.log(rotationInstruction); // will update correctly

    const saveToFileInput = (dataUrl: string) => {
        fetch(dataUrl)
            .then((res) => res.blob())
            .then((blob) => {
                const file = new File([blob], "face.jpg", { type: "image/jpeg" });
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                if (fileInputRef.current) {
                    fileInputRef.current.files = dataTransfer.files;
                }
            });
    };
    const animateBorderProgress = () => {
        const animate = () => {
            setBorderProgress((prev) => {
                if (prev < targetBorderProgress) {
                    const newProgress = prev + 0.01; // Animation speed
                    return newProgress > targetBorderProgress ? targetBorderProgress : newProgress;
                }
                return prev;
            });

            if (borderProgress < targetBorderProgress) {
                requestAnimationFrame(animate);
            }
        };
        requestAnimationFrame(animate);
    };
    const finishCapture = async () => {
        CropImage();
        if (detectionInterval) {
            clearInterval(detectionInterval);
        }
        setRotationInstruction("Pengambilan gambar selesai!");
        setTimeout(() => {
            setCaptureFinished(true);
            handleSubmit();
        }, 300);
    };
    const handleReload = () => {
        window.location.reload();
    };

    return (
        <div>
            <div>
                <div>
                    <div className="absolute top-14 left-0 m-4">
                        <button className="btn bg-red-500 hover:bg-red-500 btn-ghost w-32 text-white rounded-full maxw768:w-10" onClick={handleReload}>
                            X
                        </button>
                    </div>
                    <div className="container-camera2 w-full max-w-[400px] max-h-[500px] mx-auto maxw768:max-w-[300px] p-4">
                        <div
                            className="relative w-full pb-[100%] rounded-full overflow-hidden transition-shadow duration-300 ease-in-outt"
                            style={{
                                '--progress': captureFinished ? '360deg' : `${borderProgress * 360}deg`,
                            } as React.CSSProperties}
                        >
                            <div
                                className="absolute inset-[-12px] rounded-full z-10 transition-all duration-[2s] linear"
                                style={{
                                    background: `conic-gradient(#3752fe var(--progress), transparent var(--progress))`,
                                } as React.CSSProperties}
                            />
                            {!captureFinished && (
                                <video ref={videoRef} autoPlay className="absolute top-1/2 left-1/2 h-full max-w-[600px] max-h-[600px] object-cover transform -translate-x-1/2 -translate-y-1/2 scale-x-[-1] rounded-full z-50 maxw768:max-w-[400px] maxw768:max-h-[400px]" />
                            )}
                        </div>
                        <canvas ref={canvasRef} style={{ display: 'none' }} />
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                        />

                        <div>
                            {captureStageRef.current > 0 && captureStageRef.current <= 10 && captureStageRef.current !== 5 && (
                                <div className="message-photo font-semibold text-black text-center">
                                    {rotationInstruction}
                                </div>
                            )}
                            {captureStageRef.current === 5 && (
                                <div className="message-photo font-semibold text-black text-center">
                                    Hadap ke Kamera
                                </div>
                            )}
                            {captureStageRef.current === 10 && (
                                <div className="message-photo font-semibold text-black text-center">
                                    Pengambilan gambar selesai!
                                </div>
                            )}
                            {isCheckingCameraMovement && (
                                <div className="error-message text-red-500 font-bold mt-[10px] text-center">
                                    Memeriksa aktivitas kamera. Harap tunggu...
                                </div>
                            )}
                            {(!isCheckingCameraMovement && (!faceDetected || (!faceCloseEnough && captureStageRef.current < 5))) && (
                                <div className="error-message text-red-500 font-bold mt-[10px] text-center">
                                    Posisikan wajah anda ke arah kamera dan dekatkan wajah Anda
                                </div>
                            )}
                            {(!isCheckingCameraMovement && lightingCondition !== 'good' && captureStageRef.current === 0) && (
                                <div className="error-message text-red-500 font-bold mt-[10px] text-center">
                                    Pencahayaan pada wajah kurang. Tingkatkan pencahayaan ke wajah Anda.
                                </div>
                            )}
                            {(!isCheckingCameraMovement && !errorMessage) && (
                                <div className="error-message text-red-500 text-center font-bold mt-[10px] opacity-0" style={{ opacity: 0 }}>ff</div>
                            )}
                        </div>
                        <div>
                            <div className="face-size-indicator w-full h-[10px] bg-gray-300">
                                <div
                                    className="face-size-bar h-full bg-blue-500 transition-all duration-300 ease-linear"
                                    style={{
                                        width: `${Math.min((detectedFaceWidth / minFaceSize) * 100, 100)}%`,
                                    }}
                                ></div>
                                <div className="progress mt-[20px] h-[10px] p-3 italic flex items-center">Gambar {captureStageRef.current} dari 10</div>
                            </div>
                        </div>
                        {/* <div className='w-full'>
                            <div className="captured-images flex justify-center mt-[50px] w-full">
                                {capturedImages.map((image, index) => (
                                    <img key={index} src={image} alt="Captured Image" className='h-[100px] m-[5px] rounded-[5px]' />
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TrainFace;