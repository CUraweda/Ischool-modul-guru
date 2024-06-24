import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";
import { FaCheckCircle } from "react-icons/fa";

interface Box {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Detection {
  detection: {
    box: Box;
  };
  expressions: faceapi.FaceExpressions;
}

const FaceDetectionFull: React.FC = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [triger, setTriger] = useState<boolean>(false);

  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);
    };

    loadModels().catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (
        webcamRef.current &&
        webcamRef.current.video &&
        webcamRef.current.video.readyState === 4
      ) {
        handleVideoFrame();
      }
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [webcamRef]);

  const handleVideoFrame = async () => {
    if (webcamRef.current && webcamRef.current.video && canvasRef.current) {
      const video = webcamRef.current.video;
      const context = canvasRef.current.getContext("2d");

      if (video && context) {
        const detections: Detection[] = await faceapi
          .detectAllFaces(
            video,
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
          )
          .withFaceLandmarks()
          .withFaceExpressions();

        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        const resizedDetections = faceapi.resizeResults(
          detections,
          displaySize
        );

        canvasRef.current.width = video.videoWidth;
        canvasRef.current.height = video.videoHeight;
        context.clearRect(
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        context.font = "16px Arial";
        context.fillStyle = "yellow";
        context.strokeStyle = "yellow";
        resizedDetections.forEach((detection) => {
          const { x, y, width, height } = detection.detection.box;
          context.strokeRect(x, y, width, height);
          const maxExpression = detection.expressions.asSortedArray()[0];
          context.fillText(maxExpression.expression, x, y > 10 ? y - 5 : 10);
        });
      }
    }
  };

  return (
    <>
      <div className="h-screen w-screen">
        <div className="relative h-full w-full">
          <Webcam
            ref={webcamRef}
            muted={true}
            className="absolute h-full w-full"
            videoConstraints={{
              aspectRatio: 9 / 16,
            }}
          />

          <canvas ref={canvasRef} className="absolute" />

          <div className={`${triger ? '' : 'hidden'} absolute h-full w-full bg-black bg-opacity-50 flex items-center justify-center`}>
            <div className="flex w-full justify-center items-center flex-col">
              <span className="text-green-500 text-[300px]">
                <FaCheckCircle />
              </span>
              <span className="text-2xl font-bold text-white ">
                Berhasil Absensi
              </span>
              <div className="mt-5 w-full px-6 flex justify-center item-center flex-col gap-3">
               
                <div className="w-full h-14 bg-white p-3 justify-center flex text-black font-bold text-xl shadow-md rounded-md">Nama</div>
                <div className="w-full h-14 bg-white p-3 justify-center flex flex-col items-center text-black font-bold text-xl shadow-md rounded-md">
                  <p>08.00 WIB</p> <div className="badge badge-accent badge-outline">Tepat Waktu</div>
                </div>
              </div>
              <button className="btn bg-green-500 text-white w-1/2 mt-5">Oke</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FaceDetectionFull;
