'use client';

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar } from 'lucide-react';

const customIcon = typeof window !== 'undefined' ? new L.DivIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
    <rect x="1" y="1" width="22" height="22" fill="black" stroke="white" stroke-width="2"/>
    <rect x="9" y="9" width="6" height="6" fill="white"/>
  </svg>`,
  className: '',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
}) : null;

const LOCATIONS = [
  { id: 'saligramam', name: 'SALIGRAMAM_SEC', lat: 13.0577, lng: 80.1982 },
  { id: 'porur',      name: 'PORUR_SEC',      lat: 13.0333, lng: 80.1583 },
  { id: 'madipakkam', name: 'MADIPAKKAM_SEC', lat: 12.9667, lng: 80.1970 },
];

const MOCK_USERS = {
  saligramam: [
    { id: 'u1', name: 'RAHUL_X',   lat: 13.0580, lng: 80.1975 },
    { id: 'u2', name: 'PRIYA_0',   lat: 13.0560, lng: 80.1990 },
  ],
  porur: [
    { id: 'u3', name: 'KARTHIK_9', lat: 13.0340, lng: 80.1570 },
    { id: 'u4', name: 'DIVYA_V',   lat: 13.0320, lng: 80.1590 },
  ],
  madipakkam: [
    { id: 'u5', name: 'SANJAY_M',  lat: 12.9675, lng: 80.1960 },
    { id: 'u6', name: 'ANITHA_Z',  lat: 12.9650, lng: 80.1980 },
  ],
};

function FlyTo({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 0.9 });
  }, [center, zoom, map]);
  return null;
}

const RadarSection = () => {
  const [selectedArea, setSelectedArea] = useState(null);
  const [isScanning, setIsScanning]     = useState(false);
  const [foundUsers, setFoundUsers]     = useState([]);
  const [mapCenter, setMapCenter]       = useState([13.0827, 80.2707]);

  const handleAreaSelect = (loc) => {
    setSelectedArea(loc);
    setMapCenter([loc.lat, loc.lng]);
    setFoundUsers([]);
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setFoundUsers(MOCK_USERS[loc.id] || []);
    }, 2000);
  };

  return (
    <div className="w-full h-full relative flex flex-col p-4">

      {/* ─── Controls ─────────────────────────────────── */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <div className="brutalist-panel p-4 bg-black">
          <h2 className="text-white font-black mb-3 flex items-center gap-2 tracking-widest text-lg font-mono">
            <Radar className={`w-5 h-5 shrink-0 ${isScanning ? 'text-secondary animate-pulse' : 'text-white'}`} />
            <span className="glitch" data-text="SECTOR_SCAN">SECTOR_SCAN</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                onClick={() => handleAreaSelect(loc)}
                className={`brutalist-button text-xs py-2 px-3
                            ${selectedArea?.id === loc.id
                              ? 'bg-white text-black translate-x-[4px] translate-y-[4px] shadow-none'
                              : ''}`}
              >
                {loc.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ─── Map ──────────────────────────────────────── */}
      <div className="flex-1 mt-[148px] mb-24 border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] relative z-10 overflow-hidden">
        <MapContainer
          center={mapCenter}
          zoom={12}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          />
          <FlyTo center={mapCenter} zoom={selectedArea ? 15 : 11} />

          {selectedArea && customIcon && (
            <Marker position={[selectedArea.lat, selectedArea.lng]} icon={customIcon}>
              <Popup>
                <span className="font-mono font-bold uppercase text-white text-xs">
                  {isScanning ? 'SCANNING...' : `DETECTED: ${foundUsers.length}`}
                </span>
              </Popup>
            </Marker>
          )}

          {foundUsers.map((user) => (
            customIcon && (
              <Marker key={user.id} position={[user.lat, user.lng]} icon={customIcon}>
                <Popup>
                  <span className="font-mono font-bold uppercase text-white text-xs">{user.name}</span>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>

        {/* Radar scan overlay */}
        <AnimatePresence>
          {isScanning && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 pointer-events-none z-[1000] flex items-center justify-center"
            >
              {[0, 0.4, 0.8].map((delay) => (
                <motion.div
                  key={delay}
                  className="absolute w-48 h-48 border-4 border-white"
                  animate={{ scale: [0, 2.5], opacity: [1, 0], rotate: [0, 90] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay, ease: 'easeOut' }}
                />
              ))}
              <div className="w-4 h-4 bg-secondary animate-ping" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RadarSection;
