import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useProps } from "../store/Store";
import axios from "axios";
import { Store } from "../store/Store";

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
  const { token } = Store();

  const [inArea, setInArea] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);
  const { setInareaProps, setDistanceProps } = useProps();
  const [position2, setPosition2] = useState<Position | null>(null);
  const [nearestLocation, setNearestLocation] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [locationAccessGranted, setLocationAccessGranted] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null); // New state for error handling

  const calculateDistance = (pos1: Position, pos2: Position) => {
    return L.latLng(pos1.lat, pos1.lng).distanceTo(L.latLng(pos2.lat, pos2.lng));
  };

  const fetchLocations = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_REACT_API_HRD_URL}/api/location/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLocations(response.data.data.result);
      console.log("Locations fetched:", response.data); // Debug log
    } catch (error) {
      console.error("Error fetching locations:", error);
      setError("Failed to fetch locations. Please try again."); // Set error state
    }
  };

  useEffect(() => {
    async function getInitialLocation() {
      try {
        const position = await requestLocationAccess() as GeolocationPosition;
        setLocationAccessGranted(true);
        setPosition2({ lat: position.coords.latitude, lng: position.coords.longitude });
        console.log("Initial position set:", { lat: position.coords.latitude, lng: position.coords.longitude }); // Debug log
        await fetchLocations();
      } catch (error) {
        console.error("Error accessing location:", error);
        setLocationAccessGranted(false);
        setError("Failed to access location. Please enable location services and refresh the page."); // Set error state
      }
    }
    
    getInitialLocation();
  }, []);

  useEffect(() => {
    if (!locationAccessGranted || !Array.isArray(locations) || locations.length === 0) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPos2: Position = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("New position:", newPos2); // Debug log

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

        console.log("Updated state:", { inArea: isInsideAnyArea, nearestLocation: nearestLoc, distance: minDistance, position2: newPos2 }); // Debug log
      },
      (error) => {
        console.error("Geolocation watch error:", error);
        setError(`Geolocation error: ${error.message}`); // Set error state
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
  }, [locations]);

  console.log("Render state:", { position2, nearestLocation, locations, locationAccessGranted, error }); // Debug log

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <>
    {/* <p>Lat: {position2?.lat}, Lng: {position2?.lng}</p> */}
      {locationAccessGranted ? (
        <>
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