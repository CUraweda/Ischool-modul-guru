import React, { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  Polyline,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useProps } from "../store/Store";
import marker1 from "../assets/marker1.png";
import marker2 from "../assets/marker2.png";
import Location from "../data/location.json";


type Position = { lat: number; lng: number; radius?: number } | null;

const MapWithTwoRadiusPins: React.FC = () => {
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

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newPos2 = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        let minDistance = Infinity;
        let nearestLoc: Position = null;

        Location?.forEach((item: Position) => {
          const distance = calculateDistance(item, newPos2);

          if (distance !== null && distance < minDistance) {
            minDistance = Math.round(distance);
            nearestLoc = item;
          }
          if (distance !== null && distance > (item?.radius || 0)) {
            setInareaProps(false);
          } else {
            setInareaProps(true);
          }
        });
        setNearestLocation(nearestLoc);
        setDistanceProps(minDistance);
        setPosition2(newPos2);
      },
      (error) => {
        console.error("Error Code = " + error.code + " - " + error.message);
      }
    );
  }, []);

  return (
    <MapContainer
      center={Location[0] || { lat: 0, lng: 0 }}
      zoom={13}
      style={{ height: "30vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {Location &&
        Location.map((item: Position, index: number) => (
          <React.Fragment key={index}>
            <Marker
              position={item || { lat: 0, lng: 0 }}
              icon={
                new L.Icon({
                  iconUrl: marker1,
                  iconSize: [50, 50],
                  iconAnchor: [25, 48],
                })
              }
            />
            <Circle
              center={item || { lat: 0, lng: 0 }}
              radius={item?.radius || 1}
              color="blue"
            />
          </React.Fragment>
        ))}
      {position2 && (
        <>
          <Marker
            position={position2}
            icon={
              new L.Icon({
                iconUrl: marker2,
                iconSize: [50, 50],
                iconAnchor: [25, 48],
              })
            }
          />
          <Circle center={position2} radius={5} color="red" />
        </>
      )}
      {Location && position2 && nearestLocation && (
        <Polyline positions={[nearestLocation, position2]} color="green" />
      )}
    </MapContainer>
  );
};

export default MapWithTwoRadiusPins;
