import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useProps } from "../store/Store";
import axios from "axios";

interface FaceDetectionProps {
  onAreas: () => void;
  notOnAreas: () => void;
}

type Position = { lat: number; lng: number; radius?: number };

interface Location {
  id: number;
  nama: string;
  lat: number;
  lng: number;
  radius: number;
}

function requestLocationAccess() {
  return new Promise((resolve, reject) => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve(position);
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

const MapWithTwoRadiusPins: React.FC<FaceDetectionProps> = ({ onAreas, notOnAreas }) => {
  const [inArea, setInArea] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);
  const { setInareaProps, setDistanceProps } = useProps();
  const [position2, setPosition2] = useState<Position | null>(null);
  const [nearestLocation, setNearestLocation] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationAccessGranted, setLocationAccessGranted] = useState<boolean>(false);

  const calculateDistance = (pos1: Position, pos2: Position) => {
    return L.latLng(pos1.lat, pos1.lng).distanceTo(L.latLng(pos2.lat, pos2.lng));
  };

  console.log(position2, nearestLocation);

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_API_HRD_URL}/api/location/`);
      setLocations(response.data);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  useEffect(() => {
    async function getInitialLocation() {
      try {
        await requestLocationAccess();
        setLocationAccessGranted(true);
        // If successful, proceed with fetching locations
        await fetchLocations();
      } catch (error) {
        console.error("Error accessing location:", error);
        setLocationAccessGranted(false);
        // Handle the error (e.g., show a message to the user)
      }
    }
  
    getInitialLocation();
  }, []);

  useEffect(() => {
    if (!locationAccessGranted || locations.length === 0) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPos2: Position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        let minDistance = Infinity;
        let nearestLoc: Location | null = null;
        let isInsideAnyArea = false;
    
        locations.forEach((item: Location) => {
          const distance = calculateDistance(item, newPos2);
          if (distance < minDistance) {
            minDistance = Math.round(distance);
            nearestLoc = item;
          }
          if (distance <= item.radius) {
            isInsideAnyArea = true;
          }
        });
    
        setInArea(isInsideAnyArea);
        setInareaProps(isInsideAnyArea);
        if (isInsideAnyArea) {
          onAreas();
        } else {
          notOnAreas();
        }
    
        setNearestLocation(nearestLoc);
        setDistance(minDistance);
        setDistanceProps(minDistance);
        setPosition2(newPos2);
      },
      (error) => {
        console.error("Error Code = " + error.code + " - " + error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [locations]); // Hanya dijalankan ulang jika locations berubahyy

  // function requestLocationAccess() {
  //   return new Promise((resolve, reject) => {
  //     if ("geolocation" in navigator) {
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           resolve(position);
  //         },
  //         (error) => {
  //           reject(error);
  //         },
  //         { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
  //       );
  //     } else {
  //       reject(new Error("Geolocation is not supported by this browser."));
  //     }
  //   });
  // }
  // useEffect(() => {
  //   async function getInitialLocation() {
  //     try {
  //       await requestLocationAccess();
  //       // If successful, proceed with fetching locations and setting up watch
  //       fetchLocations();
  //     } catch (error) {
  //       console.error("Error accessing location:", error);
  //       // Handle the error (e.g., show a message to the user)
  //     }
  //   }
  
  //   getInitialLocation();
  // }, []);
  return (
    <>
      {/* <h2>Lokasi Pengguna Saat Ini:</h2> */}
      {locationAccessGranted ? (
        <>
          {/* <p>Lat: {position2?.lat}, Lng: {position2?.lng}</p> */}
          {position2 ? (
            <div className="my-3 w-full flex flex-col justify-center items-center">
              <span className="font-semibold text-center">
                {inArea 
                  ? `Anda sudah berada di area presensi (${nearestLocation?.nama})` 
                  : `Jarak anda ke area presensi (${nearestLocation?.nama}) terdekat adalah ${distance} meter.`
                }
              </span>
              <span className={`${inArea ? "" : "text-red-500 mt-4"} font-semibold`}>
                {inArea ? "Mengenali Wajah..." : "Anda Berada Diluar Area, Tidak Dapat Melakukan Presensi"}
              </span>
            </div>
          ) : (
            <div className="my-3 w-full flex flex-col justify-center items-center">
              <span className="font-semibold">
                Mengambil lokasi...
              </span>
            </div>
          )}
        </>
      ) : (
        <div className="my-3 w-full flex flex-col justify-center items-center">
          <span className="font-semibold text-red-500">
            Tidak Dapat Mengakses Lokasi. Mohon izinkan akses lokasi untuk menggunakan fitur ini.
          </span>
        </div>
      )}
    </>
  );
};

export default MapWithTwoRadiusPins;