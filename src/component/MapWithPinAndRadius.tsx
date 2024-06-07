import React, { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import marker1 from "../assets/marker1.png";
import L from "leaflet";

// Definisikan tipe untuk props
interface MapWithPinAndRadiusProps {
  defaultRadius: number;
}

const MapWithPinAndRadius: React.FC<MapWithPinAndRadiusProps> = ({
  defaultRadius,
}) => {
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    { lat: -6.4108728, lng: 106.7717037 }
  );

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        // Mengatur posisi pin ke lokasi yang diklik
        setPosition(e.latlng);
      },
      // Tambahkan event lain jika diperlukan
    });
    return null;
  };

  return (
    <div className="z-0">

    <MapContainer
      center={{ lat: -6.4108728, lng: 106.7717037 }}
      zoom={13}
      style={{ height: "40vh", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {position && (
        <>
          <Marker
            position={position}
            eventHandlers={{
              click: () => {
                alert('Marker clicked!');
              }
            }}
            icon={
              new L.Icon({
                iconUrl: marker1,
                iconSize: [50, 50],
                iconAnchor: [25, 48],
              })
            }
          >
           
          </Marker>
          <Circle center={position} radius={defaultRadius} />
        </>
      )}
      <MapEvents />
    </MapContainer>
    </div>
  );
};

export default MapWithPinAndRadius;
