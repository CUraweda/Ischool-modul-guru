import React, { useState, useCallback, useRef, useEffect } from 'react';
import "react-day-picker/dist/style.css";
import Instruction from "../../component/guru/InstructionTrainFace";
import axios from 'axios';
import { DayPicker } from 'react-day-picker';
import * as faceapi from 'face-api.js';
import ChangeExpression from '../../component/guru/InstructionTrainFace2'
import TrainFace from '../../component/guru/TrainFace'
// import UserData from '../../component/guru/userData';
import { employeeStore, Store } from "../../store/Store";
import { Auth } from "../../midleware/api";
import { Player } from '@lottiefiles/react-lottie-player';
import { BASE_URL_TRAINING_FACE } from '../../config/config';

interface Detection {
  box: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

const TrainFaceGuru: React.FC = () => {

  const { token } = Store();
  const {
    setEmployee,
    setHeadmaster,
    setFormTeachers,
    setFormSubjects,
    setFormXtras,
  } = employeeStore();

  const [dataUser, setDataUser] = useState<any>(null);
  const [updatedName, setUpdatedName] = useState<string>("");
  const [idEmployee, setIdEmployee] = useState();

  const getMe = async () => {
    try {
      const res = await Auth.MeData(token);

      setDataUser(res.data.data);
      setUpdatedName(res.data.data.full_name);
      setIdEmployee(res.data.data.employee.id);
      const {
        id,
        full_name,
        headmaster,
        formextras,
        formsubjects,
        formteachers,
      } = res.data.data?.employee ?? {};

      if (id && full_name) setEmployee({ id, full_name });
      if (headmaster) setHeadmaster(headmaster);
      if (formteachers) setFormTeachers(formteachers);
      if (formsubjects) setFormSubjects(formsubjects);
      if (formextras) setFormXtras(formextras);


    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  const [showInstructions, setShowInstructions] = useState(true);
  const [changeExpression, setChangeExpression] = useState(false);
  const [instructionStep, setInstructionStep] = useState(0);
  const [isInput3, setIsInput3] = useState(false);
  const [isVideo, setIsVideo] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const [trainingLoading, setTrainingLoading] = useState(false);
  const [trainingSuccess, setTrainingSuccess] = useState(false);
  const [trainingNotSuccess, setTrainingNotSuccess] = useState(false);
  const [trainingNotSuccess2, setTrainingNotSuccess2] = useState(false);

  const [isCropImage, setIsCropImage] = useState(false);
  const capturedImagesRef = useRef<string[]>([]);

  const updateCapturedImages = (images: string[]) => {
    setCapturedImages(images);
    capturedImagesRef.current = images;
  };

  useEffect(() => {
    capturedImagesRef.current = capturedImages;
  }, [capturedImages]);


  const showForm = () => {
    setShowInstructions(false);
    setChangeExpression(true);
  };
  // const showForm2 = () => {
  //   setIsInput2(false);
  //   setChangeExpression(true);
  // };
  const showInput3 = () => {
    setChangeExpression(false);
    setIsNone(false);
    setIsVideo(true);
    if (instructionStep === 0) {
      setIsInput3(true);
    }
  };
  const startVideo = () => {
    setIsVideo(true);
  };
  const updateIsVideo = (value: boolean) => {
    setIsVideo(value);
    console.log(value);
  };
  const updateIsNone = (value: boolean) => {
    setIsNone(value);
  };
  const InstructionChange2 = () => {
    setInstructionStep(1);
    setChangeExpression(true);
  };

  const loadModels = async () => {
    await Promise.all([
      faceapi.nets.ssdMobilenetv1.loadFromUri('/models'),
      faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
      faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
    ]);
  };
  const handleReload = () => {
    window.location.reload();
  };


  const cropFace = useCallback(async (imageDataUrl: string): Promise<string> => {
    const img = new Image();
    img.src = imageDataUrl;
    await new Promise((resolve) => (img.onload = resolve));
    const detections = await faceapi.detectSingleFace(img) as faceapi.FaceDetection | undefined;
    if (!detections) {
      console.log("Tidak dapat mendeteksi wajah");
      return imageDataUrl;
    }
    const { x, y, width, height } = detections.box;
    const padding = {
      x: Math.round(width * 0.5),
      y: Math.round(height * 0.5),
    };
    const newX = Math.max(0, x - padding.x);
    const newY = Math.max(0, y - padding.y);
    const newWidth = Math.min(img.width - newX, width + padding.x * 2);
    const newHeight = Math.min(img.height - newY, height + padding.y * 2);
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(img, newX, newY, newWidth, newHeight, 0, 0, newWidth, newHeight);
    } else {
      console.error('Failed to get 2D rendering context for the canvas.');
    }
    return canvas.toDataURL("image/jpeg");
  }, []);

  const [isNone, setIsNone] = useState(false);
  const IsNoneRef = useRef<boolean>(false);

  useEffect(() => {
    IsNoneRef.current = isNone;
  }, [isNone]);

  const [croppedImagesDisplay, setCroppedImagesDisplay] = useState<string[]>([]);

  const handleSubmit = useCallback(async () => {
    setIsNone(true);
    console.log("isNone: " + IsNoneRef.current); // This should now log "true"
    setIsCropImage(true);
    await loadModels();
    console.log(capturedImagesRef.current);
    const croppedImages = await Promise.all(
      capturedImagesRef.current.map(image => cropFace(image))
    );
    setCapturedImages(croppedImages);
    setCroppedImagesDisplay(croppedImages);
    setIsCropImage(false);
    setTrainingLoading(true);
    console.log("Semua gambar sudah di crop");

    const images: { [key: string]: string } = {};
    croppedImages.forEach((image, index) => {
      images[`img${index + 1}`] = image;
    });

    const payload = {
      teacher: dataUser?.full_name,
      images: images
    };

    console.log("Payload yang akan dikirim:", payload);

    try {
      const response = await fetch(
        `${BASE_URL_TRAINING_FACE}/stg-server1/api/face/train`,
        {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );
      if (!response.ok) {
        console.error("Error mengirim form");
        setTrainingLoading(false);
        setTrainingNotSuccess(true);
      } else {
        const data = await response.json();
        setTrainingLoading(false);
        setTrainingSuccess(true);
        console.log("Form berhasil dikirim:", data);
      }
    } catch (error) {
      console.error("Error mengirim form:", error);
      setTrainingLoading(false);
      setTrainingNotSuccess2(true)
    }
  }, [capturedImages, cropFace, loadModels]);

  const cropImage = () => {
    setIsVideo(true);
  };

  return (
    <>
      {showInstructions && <Instruction onShowForm={showForm} />}
      {changeExpression && (
        // Add your form or other components here when isInput1 is true
        <ChangeExpression
          initialInstructionStep={instructionStep}
          onShowInput3={showInput3}
          onStartVideo={startVideo}
        />
      )}
      {isInput3 && (
        // Add your form or other components here when isInput1 is true
        <div className={IsNoneRef.current ? 'hidden' : '' || isCropImage ? 'hidden' : ''}>
          <TrainFace
            isVideo={isVideo}
            isNone={isNone}
            updateCapturedImages={updateCapturedImages}
            updateIsVideo={updateIsVideo}
            updateIsNone={updateIsNone}
            InstructionChange={InstructionChange2}
            handleSubmit={handleSubmit}
            CropImage={cropImage} />
        </div>
      )}

      {isCropImage && (
        <div className="content-container-input1 flex flex-row justify-center h-screen items-center">
          <div className="loading-container text-3xl">
            <div className="loading-text">
              <Player
                src="https://lottie.host/b170dd4c-4cbb-4d6c-a08f-722cedb7bfbb/hkrNsHGUzM.json"
                background="transparent"
                speed={1}
                style={{ width: '250px', height: '250px', margin: '0 auto' }}
                loop
                autoplay
              ></Player>
              Foto sedang di crop...
            </div>
          </div>
        </div>
      )}

      {trainingLoading && (
        <div className="content-container-input1 flex flex-row justify-center h-screen items-center">
          <div className="loading-container text-2xl">
            <div
            // className={`loading-text ${fadingOut ? 'fadeOut' : ''} ${fadingIn ? 'fadeIn' : ''}`}
            // style={{ backgroundPosition: `${position}px` }}
            >
              <Player
                src="https://lottie.host/7645ac86-505b-450e-b816-5610f051392f/0SzvWzUY4P.json"
                background="transparent"
                speed={1}
                style={{ width: '250px', height: '250px', margin: '0 auto' }}
                loop
                autoplay
              ></Player>
              Memproses wajah, tunggu sebentar...
            </div>
          </div>
        </div>
      )}

      {trainingSuccess && (
        <div className="content-container-input1 flex justify-center h-screen items-center">
          <div className="absolute top-14 left-0 m-4">
            <button className="btn bg-red-500 hover:bg-red-500 btn-ghost w-32 text-white rounded-full maxw768:w-10" onClick={handleReload}>
              X
            </button>
          </div>
          <div className="loading-container text-2xl">
            <div
            // className={`loading-text ${fadingOut ? 'fadeOut' : ''} ${fadingIn ? 'fadeIn' : ''}`}
            // style={{ backgroundPosition: `${position}px` }}
            >
              <Player
                src="https://lottie.host/6d34585a-de5b-4e67-b441-db3371294ee9/vNX5Pd8CKv.json"
                background="transparent"
                speed={1}
                style={{ width: '250px', height: '250px', margin: '0 auto' }}
                loop
                autoplay
              ></Player>
              Wajah Anda berhasil diproses
            </div>
          </div>
        </div>
      )}

      {trainingNotSuccess && (
        <div className="content-container-input1 flex justify-center h-screen items-center">
          <div className="absolute top-14 left-0 m-4">
            <button className="btn bg-red-500 hover:bg-red-500 btn-ghost w-32 text-white rounded-full maxw768:w-10" onClick={handleReload}>
              X
            </button>
          </div>
          <div className="loading-container text-2xl">
            <div
            // className={`loading-text ${fadingOut ? 'fadeOut' : ''} ${fadingIn ? 'fadeIn' : ''}`}
            // style={{ backgroundPosition: `${position}px` }}
            >
              <Player
                src="https://lottie.host/bedf0c72-b376-47f4-9f23-5f217cd9e230/Gtwe8dWt6f.json"
                background="transparent"
                speed={1}
                style={{ width: '250px', height: '250px', margin: '0 auto' }}
                loop
                autoplay
              ></Player>
              Data gagal diproses, coba lagi
            </div>
          </div>
        </div>
      )}

      {trainingNotSuccess2 && (
        <div className="content-container-input1 flex justify-center h-screen items-center">
          <div className="absolute top-14 left-0 m-4">
            <button className="btn bg-red-500 hover:bg-red-500 btn-ghost w-32 text-white rounded-full maxw768:w-10" onClick={handleReload}>
              X
            </button>
          </div>
          <div className="loading-container text-2xl">
            <div
            // className={`loading-text ${fadingOut ? 'fadeOut' : ''} ${fadingIn ? 'fadeIn' : ''}`}
            // style={{ backgroundPosition: `${position}px` }}
            >
              <Player
                src="https://lottie.host/a8fa0e11-a741-440a-8c39-a2daa8384d34/q2mCs6Oaa7.json"
                background="transparent"
                speed={1}
                style={{ width: '250px', height: '250px', margin: '0 auto' }}
                loop
                autoplay
              ></Player>
              Server sedang mengalami gangguan, coba lagi nanti
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default TrainFaceGuru;
