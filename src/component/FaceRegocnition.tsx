import React, { useRef, useEffect } from "react";
import Webcam from "react-webcam";
import * as faceapi from "face-api.js";


const FaceDetection: React.FC = () => {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const faceMatcher = useRef<faceapi.FaceMatcher | null>(null);
  const MODEL_URL = "/models";

  useEffect(() => {
    const loadModels = async () => {
      await faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL);
      await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
      await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      await faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL);

      // Load labeled face descriptors
      const labeledFaceDescriptors = await loadLabeledImages();
      faceMatcher.current = new faceapi.FaceMatcher(labeledFaceDescriptors);
    };

    loadModels().catch(console.error);
  }, []);

  const loadLabeledImages = async () => {
    const labels = ['Nur'];
  
    return Promise.all(
      labels.map(async (label) => {
        const descriptions = [];
        for (let i = 1; i <= 3; i++) {
          const img = await faceapi.fetchImage(`http://localhost:5173/face_model/${label}/${i}.jpg`);
          const detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          if (detections) {
            descriptions.push(detections.descriptor);
          }
        }
  
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      })
    );
  };

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
        const detections = await faceapi
          .detectAllFaces(
            video,
            new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 })
          )
          .withFaceLandmarks()
          .withFaceExpressions();
  
        // Perform face recognition
        if (faceMatcher.current && detections && detections.length > 0) {
          const faceDescriptor = await faceapi.computeFaceDescriptor(video);
          if (faceDescriptor instanceof Float32Array) {
            const bestMatch = faceMatcher.current.findBestMatch(faceDescriptor);
            console.log(bestMatch.toString());
          }
  
          // Draw the detections on the canvas
          faceapi.draw.drawDetections(canvasRef.current, detections);
          faceapi.draw.drawFaceLandmarks(canvasRef.current, detections);
          faceapi.draw.drawFaceExpressions(canvasRef.current, detections);
        }
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
            mirrored={true}
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
