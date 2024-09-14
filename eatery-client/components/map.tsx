// LocationMap.tsx
'use client'
import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Circle } from '@react-google-maps/api';

// Replace with your Google Maps API key
const GOOGLE_MAPS_API_KEY = 'YOUR_GOOGLE_MAPS_API_KEY';

const containerStyle = {
  height: '75vh',
  width: '100%',
};

const center = {
  lat: 51.505,
  lng: -0.09,
};

const LocationMap = () => {
  const [position, setPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [radius, setRadius] = useState<number>(500);

  const handleRadiusChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setRadius(parseFloat(event.target.value));
  }, []);

  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setPosition({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),
      });
    }
  };

  return (
    <div>
      <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={13}
          onClick={onMapClick}
        >
          {position && (
            <>
              <Marker position={position} />
              <Circle
                center={position}
                radius={radius}
                options={{
                  strokeColor: '#0000FF',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#0000FF',
                  fillOpacity: 0.35,
                }}
              />
            </>
          )}
        </GoogleMap>
      </LoadScript>
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

export default React.memo(LocationMap);

