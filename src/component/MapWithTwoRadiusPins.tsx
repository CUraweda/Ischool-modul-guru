import React, { useState, useEffect } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Circle,
//   Polyline,
// } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useProps } from "../store/Store";
// import marker1 from "../assets/marker1.png";
// import marker2 from "../assets/marker2.png";
import Location from "../data/location.json";

interface FaceDetectionProps {
  onAreas: () => void;
  notOnAreas: () => void;
}


type Position = { lat: number; lng: number; radius?: number } | null;

const MapWithTwoRadiusPins: React.FC<FaceDetectionProps> = ({ onAreas, notOnAreas }) => {

  const [inArea, setInArea] = useState<boolean>(false);
  const [distance, setDistance] = useState<number | null>(null);

  const { setInareaProps, setDistanceProps } = useProps();
  const [position2, setPosition2] = useState<Position>(null);
  const [nearestLocation, setNearestLocation] = useState<Position>(null);

  const calculateDistance = (pos1: Position, pos2: Position) => {
    if (pos1 && pos2) {
      return L.latLng(pos1.lat, pos1.lng).distanceTo(
        L.latLng(pos2.lat, pos2.lng)
      );
    }
    return null;
  };

  console.log(position2, nearestLocation);

  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition(
  //     (position) => {
  //       const newPos2 = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       };

  //       let minDistance = Infinity;
  //       let nearestLoc: Position = null;

  //       Location?.forEach((item: Position) => {
  //         const distance = calculateDistance(item, newPos2);

  //         if (distance !== null && distance < minDistance) {
  //           minDistance = Math.round(distance);
  //           nearestLoc = item;
  //         }
  //         if (distance !== null && distance > (item?.radius || 0)) {
  //           setInareaProps(false);
  //         } else {
  //           setInareaProps(true);
  //         }
  //       });
  //       setNearestLocation(nearestLoc);
  //       setDistanceProps(minDistance);
  //       setPosition2(newPos2);
  //     },
  //     (error) => {
  //       console.error("Error Code = " + error.code + " - " + error.message);
  //     }
  //   );
  // }, []);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const newPos2 = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        let minDistance = Infinity;
        let nearestLoc: Position = null;
        let isInsideAnyArea = false;
    
        Location?.forEach((item: Position) => {
          const distance = calculateDistance(item, newPos2);
          if (distance !== null) {
            if (distance < minDistance) {
              minDistance = Math.round(distance);
              nearestLoc = item;
            }
            if (distance <= (item?.radius || 0)) {
              isInsideAnyArea = true;
            }
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
  
    // Membersihkan watcher ketika komponen di-unmount
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);
  return (
    <>
      {/* <h2>Lokasi Pengguna Saat Ini:</h2>
      <p>Lat: {position2?.lat}, Lng: {position2?.lng}</p> */}
    {position2 ? (
      <div className="my-3 w-full flex flex-col justify-center items-center">
        {/* <img src="" alt="" /> */}
        <span className="font-semibold">
          {inArea ? "Anda sudah berada di area presensi" : `Jarak anda ke area presensi terdekat adalah ${distance} meter`}
        </span>
        <span className={`${inArea ? "" : "text-red-500"} font-semibold`}>
          {inArea ? "Mengenali Wajah..." : "Anda Berada Diluar Area, Tidak Dapat Melakukan Presensi"}
        </span>
      </div>
    ) : (
      <div className="my-3 w-full flex flex-col justify-center items-center">
        <span className="font-semibold">
          Tidak Dapat Mengakses Lokasi
        </span>
      </div>
    )}

      {/* <div>
        <h2>Informasi Lokasi</h2>
        <ol>
          <li>
            Lokasi Pengguna Saat Ini:
            {position2 ? (
              <span>Lat: {position2.lat}, Lng: {position2.lng}</span>
            ) : (
              "Memuat..."
            )}
          </li>
          <li>
            Lokasi Terdekat:
            {nearestLocation ? (
              <span>Lat: {nearestLocation.lat}, Lng: {nearestLocation.lng}</span>
            ) : (
              "Memuat..."
            )}
          </li>
          <li>Jarak ke Lokasi Terdekat: {distance ? `${distance} meter` : "Memuat..."}</li>
          <li>Pengguna Berada dalam Area: {inArea ? "Ya" : "Tidak"}</li>
          <li>
            Data Lokasi yang Tersedia:
            <ul>
              {Location.map((loc, index) => (
                <li key={index}>
                  Lat: {loc.lat}, Lng: {loc.lng}, Radius: {loc.radius || "N/A"}
                </li>
              ))}
            </ul>
          </li>
        </ol>
      </div> */}
    </>
    // <MapContainer
    //   center={Location[0] || { lat: 0, lng: 0 }}
    //   zoom={13}
    //   style={{ height: "30vh", width: "100%" }}
    // >
    //   <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    //   {Location &&
    //     Location.map((item: Position, index: number) => (
    //       <React.Fragment key={index}>
    //         <Marker
    //           position={item || { lat: 0, lng: 0 }}
    //           icon={
    //             new L.Icon({
    //               iconUrl: marker1,
    //               iconSize: [50, 50],
    //               iconAnchor: [25, 48],
    //             })
    //           }
    //         />
    //         <Circle
    //           center={item || { lat: 0, lng: 0 }}
    //           radius={item?.radius || 1}
    //           color="blue"
    //         />
    //       </React.Fragment>
    //     ))}
    //   {position2 && (
    //     <>
    //       <Marker
    //         position={position2}
    //         icon={
    //           new L.Icon({
    //             iconUrl: marker2,
    //             iconSize: [50, 50],
    //             iconAnchor: [25, 48],
    //           })
    //         }
    //       />
    //       <Circle center={position2} radius={5} color="red" />
    //     </>
    //   )}
    //   {Location && position2 && nearestLocation && (
    //     <Polyline positions={[nearestLocation, position2]} color="green" />
    //   )}
    // </MapContainer>
  );
};

export default MapWithTwoRadiusPins;
