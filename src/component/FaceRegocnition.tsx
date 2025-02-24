import * as faceapi from "face-api.js";
import React, { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Auth } from "../middleware/api";
import { instance } from "../middleware/api-hrd";
import { employeeStore } from "../store/Store";
import Swal from "sweetalert2";
import { closeModal } from "../component/modal";

interface FaceDetectionProps {
  onSuccess: (attendanceData: AttendanceData) => void;
  reAbsen: () => void;
}

interface AttendanceData {
  id: number;
  worktime_id: number;
  description: string;
  status: string;
  uid: string;
  employee_id: number;
  is_outstation: boolean;
  updatedAt: string;
  createdAt: string;
}

const FaceDetection: React.FC<FaceDetectionProps> = ({
  onSuccess,
  reAbsen,
}) => {
  const webcamRef = useRef<Webcam | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [cameraPermission, setCameraPermission] = useState(true);
  const MODEL_URL = "/models";

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
      const res = await Auth.MeData();

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

  let isSending = false;
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
        await sendToBackend(dataUser, faceDescriptor);
      }

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d")!.clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
      faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
    }
  };

  const sendToBackend = async (dataUser: any, faceDescriptor: Float32Array) => {
    if (isSending) return; // prevent multiple requests
    isSending = true;
    closeModal("modal-absen");

    try {
      const response = await instance.post("/face/detect", {
        teacher: dataUser?.full_name,
        descriptor: Array.from(faceDescriptor),
      });

      if (response.status === 200 || response.status === 201) {
        let message = "Wajah Cocok.";
        try {
          const attendanceResponse = await instance.post(
            "/employee-attendance/attend"
          );

          if (attendanceResponse.status === 201) {
            message = `${message} Kehadiran berhasil dicatat`;
            onSuccess(attendanceResponse.data.data);
            Swal.fire({
              title: "Berhasil!",
              text: message,
              icon: "success",
              timer: 2000,
              showConfirmButton: false,
            });
            window.location.reload();
          } else if (attendanceResponse.status === 200) {
            message = `${message} Anda Sudah Melakukan Absen Hari Ini`;
            Swal.fire({
              title: "Gagal!",
              text: message,
              icon: "warning",
              timer: 2000,
              showConfirmButton: false,
            });
            reAbsen();
          } else {
            message = `${message} Gagal mencatat kehadiran`;
            Swal.fire({
              title: "Gagal!",
              text: message,
              icon: "warning",
              timer: 2000,
              showConfirmButton: false,
            });
            isSending = false; // retry
          }
        } catch (attendanceError) {
          console.error("Error sending attendance data:", attendanceError);
          isSending = false; // retry
        }
      } else {
        Swal.fire({
          title: "Gagal!",
          text: "Wajah Tidak Cocok",
          icon: "warning",
          timer: 2000,
          showConfirmButton: false,
        });
        isSending = false; // retry
      }
    } catch (error) {
      console.error("Error sending data to backend:", error);
      isSending = false; // retry
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
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, [webcamRef, dataUser]);

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
                height: 200,
                aspectRatio: 3 / 4,
              }}
            />
            <canvas ref={canvasRef} className="absolute" />
          </>
        ) : (
          <div className="camera-blocked-message">
            <p>
              Izin kamera diblokir. Silakan izinkan akses kamera di pengaturan
              browser Anda.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaceDetection;
