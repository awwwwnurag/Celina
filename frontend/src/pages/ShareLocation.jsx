import React, { useState } from 'react';
import { MapPin, Navigation, Phone, Search, Building } from 'lucide-react';

export const ShareLocation = () => {
  const [browserLoc, setBrowserLoc] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [nearestStore, setNearestStore] = useState(null);

  const stores = [
    { name: 'Celina flagship Mumbai HQ', address: 'Turner Road, Bandra West, Mumbai, Maharashtra 400050', phone: '+91 22 9876 5432', lat: 19.0560, lon: 72.8368 },
    { name: 'Celina Delhi Boutique', address: 'DLF Promenade, Vasant Kunj, New Delhi, Delhi 110070', phone: '+91 11 8765 4321', lat: 28.5433, lon: 77.1565 },
    { name: 'Celina Bengaluru Outlet', address: 'Indiranagar 100 Feet Rd, Bengaluru, Karnataka 560038', phone: '+91 80 7654 3210', lat: 12.9716, lon: 77.5946 },
    { name: 'Celina Kolkata Hub', address: 'Forum Courtyard, Elgin Road, Kolkata, West Bengal 700020', phone: '+91 33 6543 2109', lat: 22.5726, lon: 88.3639 }
  ];

  // Helper function to calculate distance using Haversine formula
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  };

  const handleShareLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setBrowserLoc({ lat: latitude, lon: longitude });

        // Calculate nearest store
        let minDistance = Infinity;
        let selectedStore = null;

        stores.forEach((store) => {
          const dist = getDistance(latitude, longitude, store.lat, store.lon);
          if (dist < minDistance) {
            minDistance = dist;
            selectedStore = { ...store, distance: dist.toFixed(1) };
          }
        });

        setNearestStore(selectedStore);
        setLocLoading(false);
      },
      (error) => {
        setLocLoading(false);
        // Fallback or alert
        alert('Could not retrieve location. Using Mumbai HQ as nearest.');
        setNearestStore({ ...stores[0], distance: '0.0 (Fallback)' });
      }
    );
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-12">
      <div className="space-y-2 border-b border-brand-border dark:border-zinc-800 pb-4 text-center">
        <h1 className="font-display font-bold text-3xl uppercase tracking-wider text-brand-burgundy dark:text-white">
          Store Locator
        </h1>
        <p className="text-xs uppercase font-bold tracking-widest text-gray-400">
          Find flagships and experience centers near your current location.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side: GPS locator tool */}
        <div className="lg:col-span-1 bg-white dark:bg-zinc-900 border border-brand-border dark:border-zinc-800 p-6 rounded-2xl shadow-sm text-center space-y-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-burgundy/10 text-brand-burgundy animate-pulse">
            <Navigation size={28} />
          </div>
          <div>
            <h3 className="font-bold text-sm uppercase text-brand-dark dark:text-white">Share GPS Location</h3>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Find boutique outlets closest to you instantly.
            </p>
          </div>

          <button
            onClick={handleShareLocation}
            disabled={locLoading}
            className="w-full bg-brand-burgundy text-white hover:opacity-90 disabled:bg-gray-400 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition flex items-center justify-center gap-2"
          >
            {locLoading ? 'Locating...' : (
              <>
                <Navigation size={12} /> Detect My Location
              </>
            )}
          </button>

          {nearestStore && (
            <div className="border border-green-200 dark:border-green-900 bg-green-50/50 dark:bg-green-950/20 p-4 rounded-xl text-left space-y-2 animate-fadeIn">
              <span className="bg-green-600 text-white text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                Nearest Outlet Found
              </span>
              <h4 className="font-bold text-xs uppercase text-gray-800 dark:text-white">{nearestStore.name}</h4>
              <p className="text-[11px] text-gray-500 leading-normal">{nearestStore.address}</p>
              <p className="text-[10px] text-brand-burgundy font-black uppercase tracking-wider">Distance: {nearestStore.distance} km away</p>
            </div>
          )}
        </div>

        {/* Right Side: List of premium stores */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="font-display font-semibold text-lg uppercase tracking-wider text-brand-burgundy dark:text-white">
            Premium Outlets & Boutiques
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stores.map((s, idx) => (
              <div key={idx} className="border border-brand-border dark:border-zinc-800 rounded-xl p-5 bg-brand-light/5 dark:bg-zinc-900/5 hover:border-brand-burgundy transition space-y-4">
                <div className="flex items-center gap-2.5">
                  <Building size={16} className="text-brand-burgundy" />
                  <h4 className="font-bold text-xs uppercase text-gray-800 dark:text-white tracking-wide">{s.name}</h4>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">{s.address}</p>
                <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                  <Phone size={12} /> Contact: {s.phone}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareLocation;
