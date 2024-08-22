  import React, { useRef, useEffect, useState } from "react";
  import Webcam from "react-webcam";
  import { employeeStore, Store } from "../store/Store";
  import { Auth } from "../midleware/api";
  import * as faceapi from "face-api.js";
  import axios from "axios";
  import { BASE_URL_FACE } from '../config/config';

  interface FaceDetectionProps {
    onSuccess: () => void;
  }

  const FaceDetection: React.FC<FaceDetectionProps> = ({ onSuccess }) => {
    const webcamRef = useRef<Webcam | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [cameraPermission, setCameraPermission] = useState(true);
    const MODEL_URL = "/models";

    const { token } = Store();
    const {
      setEmployee,
      setHeadmaster,
      setFormTeachers,
      setFormSubjects,
      setFormXtras,
    } = employeeStore();

    const [dataUser, setDataUser] = useState<any>(null);
    const [, setUpdatedName] = useState<string>("");
    const [, setIdEmployee] = useState();

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

    useEffect(() => {
      const loadModels = async () => {
        await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
        await faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL);
      };

      loadModels().catch(console.error);
      initCamera();
    }, [dataUser]);

    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
        if (webcamRef.current) {
          webcamRef.current.video!.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing camera:", error);
        setCameraPermission(false);
      }
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
      }, 500);

      return () => {
        clearInterval(interval);
      };
    }, [webcamRef, dataUser]);

    const handleVideoFrame = async () => {
      if (!dataUser) {
        console.log("Data user belum tersedia.");
        return;
      }

      if (webcamRef.current && webcamRef.current.video && canvasRef.current) {
        const video = webcamRef.current.video;
        const canvas = canvasRef.current;

        const displaySize = { width: video.width, height: video.height };
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceDescriptors();

        if (detections.length > 0) {
          const faceDescriptor = detections[0].descriptor;
          sendToBackend(dataUser, faceDescriptor);
        }

        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        canvas.getContext('2d')!.clearRect(0, 0, canvas.width, canvas.height);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
      }
    };

    const sendToBackend = async (dataUser: any, faceDescriptor: Float32Array) => {
      try {
        const response = await axios.post(`${BASE_URL_FACE}/stg-server1/api/face/detect`, {
          teacher: dataUser?.full_name,
          descriptor: Array.from(faceDescriptor)
        });
        if (response.status === 200) {
          console.log("Wajah Cocok");
          onSuccess(); // Call the callback function
        } else {
          console.log("Wajah Tidak Cocok");
        }
        console.log('Backend response:', response.data);
      } catch (error) {
        console.error('Error sending data to backend:', error);
      }
    };

    return (
      <div className="h-[350px] sm:h-[400px] w-[400px]">
        <div className="relative">
          {cameraPermission ? (
            <>
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
            </>
          ) : (
            <div className="camera-blocked-message">
              <p>Izin kamera diblokir. Silakan izinkan akses kamera di pengaturan browser Anda.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  export default FaceDetection;