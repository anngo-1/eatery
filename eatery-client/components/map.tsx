'use client'
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMapEvents } from 'react-leaflet';
import { LatLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';

const containerStyle = {
  height: '75vh',
  width: '100%',
};

const center = {
  lat: 51.505,
  lng: -0.09,
};

const LocationMap = () => {
  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(500);

  const handleRadiusChange = useCallback((event) => {
    setRadius(parseFloat(event.target.value));
  }, []);

  function MapEvents() {
    useMapEvents({
      click(e) {
        setPosition(e.latlng);
      },
    });
    return null;
  }

  return (
    <div>
      <MapContainer style={containerStyle} center={center} zoom={13}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap contributors'
        />
        <MapEvents />
        {position && (
          <>
            <Marker position={position}>
              <Popup>
                A marker at {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
              </Popup>
            </Marker>
            <Circle
              center={position}
              radius={radius}
              pathOptions={{
                color: '#0000FF',
                fillColor: '#0000FF',
                fillOpacity: 0.35,
                weight: 2,
              }}
            />
          </>
        )}
      </MapContainer>
      <div style={{ marginTop: '10px' }}>
        <label>Radius (meters):</label>
        <input
          type="number"
          value={radius}
          onChange={handleRadiusChange}
          style={{ marginLeft: '10px' }}
        />
      </div>
    </div>
  );
};

export default LocationMap;
