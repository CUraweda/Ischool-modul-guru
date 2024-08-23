import React, { useState, useEffect } from "react";
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
import data from '../data/location.json';

interface Location {
  id: number;
  nama: string;
  lat: number;
  lng: number;
  radius: number;
}

interface MapWithPinAndRadiusProps {
  onSave: (location: Location) => void;
  onDelete: (locationId: number) => void;
}

const MapWithPinAndRadius: React.FC<MapWithPinAndRadiusProps> = ({ onSave }) => {
  const [locations, setLocations] = useState<Location[]>(data);
  const [selectedLocationId, setSelectedLocationId] = useState<number>(data[0].id);
  const [currentLocation, setCurrentLocation] = useState<Location>(data[0]);

  useEffect(() => {
    const selected = locations.find(loc => loc.id === selectedLocationId);
    if (selected) {
      setCurrentLocation(selected);
    }
  }, [selectedLocationId, locations]);

  const handleLocationChange = (changes: Partial<Location>) => {
    setCurrentLocation(prev => ({ ...prev, ...changes }));
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handleLocationChange({ lat, lng });
      },
    });
    return null;
  };

  const handleSave = () => {
    const updatedLocations = locations.map(loc => 
      loc.id === currentLocation.id ? currentLocation : loc
    );
    setLocations(updatedLocations);
    onSave(currentLocation);
  };

  return (
    <div className="z-0">
      <select
        value={selectedLocationId}
        onChange={(e) => setSelectedLocationId(parseInt(e.target.value, 10))}
        className="select select-bordered w-full mb-4"
      >
        {locations.map((location) => (
          <option value={location.id} key={location.id}>
            {`Lokasi ${location.nama}`}
          </option>
        ))}
      </select>
      
      <MapContainer
        center={[currentLocation.lat, currentLocation.lng]}
        zoom={13}
        style={{ height: "40vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapEvents />
        <Marker
          position={[currentLocation.lat, currentLocation.lng]}
          icon={
            new L.Icon({
              iconUrl: marker1,
              iconSize: [50, 50],
              iconAnchor: [25, 48],
            })
          }
        />
        <Circle center={[currentLocation.lat, currentLocation.lng]} radius={currentLocation.radius} />
      </MapContainer>

      <input
        type="text"
        placeholder="Nama Lokasi"
        className="input input-bordered w-full mt-4"
        value={currentLocation.nama}
        onChange={(e) => handleLocationChange({ nama: e.target.value })}
      />
      <input
        type="number"
        placeholder="Radius"
        className="input input-bordered w-full mt-4"
        value={currentLocation.radius}
        onChange={(e) => handleLocationChange({ radius: parseInt(e.target.value) })}
      />
      <div className="mt-4">
        <p>Latitude: {currentLocation.lat.toFixed(6)}</p>
        <p>Longitude: {currentLocation.lng.toFixed(6)}</p>
      </div>
      <button 
        className="btn bg-green-500 mt-4"
        onClick={handleSave}
      >
        Simpan Perubahan
      </button>
    </div>
  );
};

export default MapWithPinAndRadius;

// export default MapWithPinAndRadius;

// import React, { useState } from "react";
// import {
//   MapContainer,
//   TileLayer,
//   Marker,
//   Circle,
//   useMapEvents,
// } from "react-leaflet";
// import "leaflet/dist/leaflet.css";
// import marker1 from "../assets/marker1.png";
// import L from "leaflet";

// // Definisikan tipe untuk props
// interface MapWithPinAndRadiusProps {
//   defaultRadius: number;
// }

// const MapWithPinAndRadius: React.FC<MapWithPinAndRadiusProps> = ({
//   defaultRadius,
// }) => {
//   const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
//     { lat: -6.4108728, lng: 106.7717037 }
//   );

//   const MapEvents = () => {
//     useMapEvents({
//       click(e) {
//         // Mengatur posisi pin ke lokasi yang diklik
//         setPosition(e.latlng);
//       },
//       // Tambahkan event lain jika diperlukan
//     });
//     return null;
//   };

//   return (
//     <div className="z-0">

//     <MapContainer
//       center={{ lat: -6.4108728, lng: 106.7717037 }}
//       zoom={13}
//       style={{ height: "40vh", width: "100%" }}
//     >
//       <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//       {position && (
//         <>
//           <Marker
//             position={position}
//             eventHandlers={{
//               click: () => {
//                 alert('Marker clicked!');
//               }
//             }}
//             icon={
//               new L.Icon({
//                 iconUrl: marker1,
//                 iconSize: [50, 50],
//                 iconAnchor: [25, 48],
//               })
//             }
//           >
           
//           </Marker>
//           <Circle center={position} radius={defaultRadius} />
//         </>
//       )}
//       <MapEvents />
//     </MapContainer>
//     </div>
//   );
// };

// export default MapWithPinAndRadius;

