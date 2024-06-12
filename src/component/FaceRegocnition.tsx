import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";

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

const FaceDetection: React.FC = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

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
    }, 150);

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
      <div className="h-[350px] sm:h-[400px] w-[400px]">
        <div className="relative">
          <Webcam
            ref={webcamRef}
            muted={true}
            className="absolute"
             
          videoConstraints={{
            width: 400, 
            height: 400, 
            aspectRatio: 1 / 1, 
          }}
          />

          <canvas ref={canvasRef} className="absolute" />
        </div>
      </div>
    </>
  );
};

export default FaceDetection;
