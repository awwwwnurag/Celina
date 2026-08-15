import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const HeavenGateLoader = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Navigate to /home after the loader animation and fade-out transition complete (4.5s)
    const timer = setTimeout(() => {
      navigate('/home');
    }, 4500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 w-full h-full bg-[#FAF7F0] flex items-center justify-center overflow-hidden z-[9999] select-none gate-perspective animate-cameraZoom">
      
      {/* 1. REVEAL LAYER: Soft Cream Background & Brand Logo */}
      <div className="absolute inset-0 bg-[#FAF7F0] flex flex-col items-center justify-center z-0 pointer-events-none">
        
        {/* Soft Radial Gold Light Glow that expands as gates open */}
        <div className="absolute w-[260px] h-[260px] sm:w-[620px] sm:h-[620px] rounded-full radial-light-glow animate-radialGlow z-0" />
        
        {/* Divine light ray streaks (Rotating overlay) */}
        <div className="absolute inset-0 bg-light-rays mix-blend-overlay opacity-30 animate-rayPulse pointer-events-none" />

        {/* 3D Divine Beams of Light shooting through the parting gates */}
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-full h-[500px] flex justify-center pointer-events-none z-0">
          <div className="absolute w-[50px] sm:w-[80px] h-[300px] sm:h-[400px] bg-gradient-to-b from-amber-250/40 via-amber-200/10 to-transparent blur-md origin-top -rotate-[22deg] animate-lightBeam" style={{ animationDelay: '0.4s' }} />
          <div className="absolute w-[80px] sm:w-[120px] h-[350px] sm:h-[450px] bg-gradient-to-b from-amber-200/45 via-amber-200/10 to-transparent blur-md origin-top animate-lightBeam" style={{ animationDelay: '0.2s' }} />
          <div className="absolute w-[50px] sm:w-[80px] h-[300px] sm:h-[400px] bg-gradient-to-b from-amber-250/40 via-amber-200/10 to-transparent blur-md origin-top rotate-[22deg] animate-lightBeam" style={{ animationDelay: '0.6s' }} />
        </div>

        {/* Elegant Brand Logo fading in at the center */}
        <div className="relative z-10 text-center px-4 space-y-3 flex flex-col items-center justify-center animate-brandFade">
          {/* Welcome Text */}
          <span className="text-sm sm:text-base md:text-lg uppercase font-bold tracking-[0.35em] text-[#B08D57]/90 italic pl-[0.35em] animate-subTextDrift">
            Welcome to
          </span>
          {/* Premium Golden Face Icon */}
          <img
            src="/assets/logo_c.png"
            alt="Celina Logo"
            className="w-24 h-24 sm:w-36 sm:h-36 object-contain filter brightness-[1.15] contrast-[1.15] saturate-[1.2] drop-shadow-[0_8px_20px_rgba(77,55,3,0.55)] drop-shadow-[0_0_25px_rgba(201,162,39,0.4)] animate-pulse"
          />
          <div className="space-y-1">
            <h1 className="font-serif italic font-black text-4xl sm:text-6xl md:text-7xl text-[#0D5C63] tracking-[0.25em] uppercase leading-none drop-shadow-[0_2px_4px_rgba(27,94,128,0.15)] animate-textDrift">
              Celina
            </h1>
            <p className="text-xs sm:text-sm md:text-base uppercase font-extrabold tracking-[0.45em] text-[#B08D57] mt-1.5 pl-[0.45em] animate-subTextDrift">
              House of Ethnic Wear
            </p>
          </div>
        </div>
      </div>

      {/* 2. STATIC HEAVEN MARBLE & GOLD SPIRAL PILLARS (Framing viewport sides responsively) */}
      <div className="absolute left-0 sm:left-[6%] md:left-[10%] top-0 bottom-0 w-6 sm:w-12 md:w-16 z-15 pointer-events-none opacity-95 flex flex-col justify-between">
        <svg className="w-full h-full text-[#B08D57]" viewBox="0 0 60 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <defs>
            <linearGradient id="pillar-marble-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C5BEAF" />
              <stop offset="25%" stopColor="#FAF7F0" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#FAF7F0" />
              <stop offset="100%" stopColor="#9C9585" />
            </linearGradient>
            <linearGradient id="base-gold-grad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#785912" />
              <stop offset="30%" stopColor="#B08D57" />
              <stop offset="50%" stopColor="#F5E396" />
              <stop offset="70%" stopColor="#B08D57" />
              <stop offset="100%" stopColor="#4A3504" />
            </linearGradient>
          </defs>

          {/* Top Capital structure */}
          <rect x="0" y="20" width="60" height="15" rx="3" fill="url(#pillar-marble-grad)" stroke="#8E7537" strokeWidth="0.8" />
          <rect x="5" y="35" width="50" height="12" rx="4" fill="url(#base-gold-grad)" stroke="#4A3504" strokeWidth="0.8" />
          <rect x="10" y="47" width="40" height="10" rx="2" fill="url(#pillar-marble-grad)" stroke="#8E7537" strokeWidth="0.8" />

          {/* Column Shaft */}
          <rect x="14" y="57" width="32" height="686" fill="url(#pillar-marble-grad)" stroke="#8E7537" strokeWidth="0.8" />

          {/* Diagonal spiral carving lines overlay */}
          <g opacity="0.85">
            {Array.from({ length: 35 }).map((_, idx) => {
              const yStart = 60 + idx * 20;
              return (
                <g key={idx}>
                  {/* Subtle dark gold shadow under the golden wrap */}
                  <path d={`M14 ${yStart + 1.2} L46 ${yStart + 13.2}`} stroke="#4D3504" strokeWidth="2.8" opacity="0.4" />
                  {/* Gold wrap line */}
                  <path d={`M14 ${yStart} L46 ${yStart + 12}`} stroke="#B08D57" strokeWidth="2.2" />
                  {/* Specular light highlight on the gold wrap */}
                  <path d={`M14 ${yStart - 0.5} L46 ${yStart + 11.5}`} stroke="#FFFEE0" strokeWidth="0.8" opacity="0.85" />
                </g>
              );
            })}
          </g>

          {/* Bottom Base Pedestal */}
          <rect x="10" y="743" width="40" height="10" rx="2" fill="url(#pillar-marble-grad)" stroke="#8E7537" strokeWidth="0.8" />
          <rect x="5" y="753" width="50" height="15" rx="4" fill="url(#base-gold-grad)" stroke="#4A3504" strokeWidth="0.8" />
          <rect x="0" y="768" width="60" height="20" rx="3" fill="url(#pillar-marble-grad)" stroke="#8E7537" strokeWidth="0.8" />
        </svg>
      </div>

      <div className="absolute right-0 sm:right-[6%] md:right-[10%] top-0 bottom-0 w-6 sm:w-12 md:w-16 z-15 pointer-events-none opacity-95 flex flex-col justify-between">
        <svg className="w-full h-full text-[#B08D57]" viewBox="0 0 60 800" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          {/* Top Capital structure */}
          <rect x="0" y="20" width="60" height="15" rx="3" fill="url(#pillar-marble-grad)" stroke="#8E7537" strokeWidth="0.8" />
          <rect x="5" y="35" width="50" height="12" rx="4" fill="url(#base-gold-grad)" stroke="#4A3504" strokeWidth="0.8" />
          <rect x="10" y="47" width="40" height="10" rx="2" fill="url(#pillar-marble-grad)" stroke="#8E7537" strokeWidth="0.8" />

          {/* Column Shaft */}
          <rect x="14" y="57" width="32" height="686" fill="url(#pillar-marble-grad)" stroke="#8E7537" strokeWidth="0.8" />

          {/* Diagonal spiral carving lines overlay */}
          <g opacity="0.85">
            {Array.from({ length: 35 }).map((_, idx) => {
              const yStart = 60 + idx * 20;
              return (
                <g key={idx}>
                  {/* Subtle dark gold shadow under the golden wrap */}
                  <path d={`M46 ${yStart + 1.2} L14 ${yStart + 13.2}`} stroke="#4D3504" strokeWidth="2.8" opacity="0.4" />
                  {/* Gold wrap line */}
                  <path d={`M46 ${yStart} L14 ${yStart + 12}`} stroke="#B08D57" strokeWidth="2.2" />
                  {/* Specular light highlight on the gold wrap */}
                  <path d={`M46 ${yStart - 0.5} L14 ${yStart + 11.5}`} stroke="#FFFEE0" strokeWidth="0.8" opacity="0.85" />
                </g>
              );
            })}
          </g>

          {/* Bottom Base Pedestal */}
          <rect x="10" y="743" width="40" height="10" rx="2" fill="url(#pillar-marble-grad)" stroke="#8E7537" strokeWidth="0.8" />
          <rect x="5" y="753" width="50" height="15" rx="4" fill="url(#base-gold-grad)" stroke="#4A3504" strokeWidth="0.8" />
          <rect x="0" y="768" width="60" height="20" rx="3" fill="url(#pillar-marble-grad)" stroke="#8E7537" strokeWidth="0.8" />
        </svg>
      </div>

      {/* 3. 3D GATE LAYER: Left and Right Swinging Gate Doors */}
      
      {/* Left Gate Panel */}
      <div className="absolute top-0 bottom-0 left-0 w-1/2 h-full bg-gradient-to-r from-[#15465f] to-[#0D5C63] border-r-2 border-[#B08D57] flex items-center justify-end overflow-hidden animate-gateSwingLeft z-10 gate-door-left-depth">
        
        {/* Shimmer Light Reflection overlay on the gate edge */}
        <div className="absolute right-0 top-0 bottom-0 w-2 bg-gradient-to-l from-white/40 via-white/5 to-transparent filter blur-xs animate-edgeShimmer pointer-events-none" />

        {/* Intricate Left Golden SVG Filigree Panel (Responsively scales layout width) */}
        <svg className="absolute h-[75%] sm:h-[85%] w-auto max-w-full text-[#B08D57] pointer-events-none right-0 sm:right-6" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="gate-gold-3d-left">
              <feDropShadow dx="1.5" dy="1.5" stdDeviation="0.6" flood-color="#4d3703" flood-opacity="0.95" />
            </filter>
          </defs>

          <g filter="url(#gate-gold-3d-left)">
            {/* Main borders */}
            <rect x="10" y="10" width="180" height="380" rx="12" stroke="currentColor" strokeWidth="2.8" fill="rgba(201,162,39,0.01)" strokeDasharray="1200" strokeDashoffset="1200" className="draw-path-slow" />
            <rect x="18" y="18" width="164" height="364" rx="8" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Top arch decoration */}
            <path d="M10 60 C50 40, 150 40, 190 60" stroke="currentColor" strokeWidth="1.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />
            <path d="M10 70 C50 50, 150 50, 190 70" stroke="currentColor" strokeWidth="0.8" />
            
            {/* Vertical Bars */}
            <line x1="40" y1="60" x2="40" y2="340" stroke="currentColor" strokeWidth="0.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />
            <line x1="80" y1="52" x2="80" y2="348" stroke="currentColor" strokeWidth="0.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />
            <line x1="120" y1="50" x2="120" y2="350" stroke="currentColor" strokeWidth="0.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />
            <line x1="160" y1="52" x2="160" y2="348" stroke="currentColor" strokeWidth="0.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />

            {/* Center Mandala (Left half) */}
            <path d="M190 140 A60 60 0 0 0 190 260 Z" stroke="currentColor" strokeWidth="2.2" fill="rgba(201,162,39,0.03)" strokeDasharray="400" strokeDashoffset="400" className="draw-path-slow" />
            <path d="M190 160 A40 40 0 0 0 190 240 Z" stroke="currentColor" strokeWidth="1" />
            <path d="M190 180 A20 20 0 0 0 190 220 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" />
            
            {/* Scrollwork and flowers inside Mandala half */}
            <path d="M190 200 C160 190, 140 170, 130 200 C140 230, 160 210, 190 200" stroke="currentColor" strokeWidth="1.2" strokeDasharray="200" strokeDashoffset="200" className="draw-path" />
            <circle cx="160" cy="200" r="3.5" fill="currentColor" />
            <circle cx="130" cy="180" r="2.5" fill="currentColor" />
            <circle cx="130" cy="220" r="2.5" fill="currentColor" />
            
            {/* Lower Panel details */}
            <path d="M10 340 C50 350, 150 350, 190 340" stroke="currentColor" strokeWidth="1.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />
            <circle cx="40" cy="340" r="3.5" fill="currentColor" />
            <circle cx="80" cy="340" r="3.5" fill="currentColor" />
            <circle cx="120" cy="340" r="3.5" fill="currentColor" />
            <circle cx="160" cy="340" r="3.5" fill="currentColor" />

            {/* Corners ornaments */}
            <path d="M10 30 C30 30, 30 10, 30 10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M190 30 C170 30, 170 10, 170 10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 370 C30 370, 30 390, 30 390" stroke="currentColor" strokeWidth="1.5" />
            <path d="M190 370 C170 370, 170 390, 170 390" stroke="currentColor" strokeWidth="1.5" />
          </g>
        </svg>

      </div>

      {/* Right Gate Panel */}
      <div className="absolute top-0 bottom-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#15465f] to-[#0D5C63] border-l-2 border-[#B08D57] flex items-center justify-start overflow-hidden animate-gateSwingRight z-10 gate-door-right-depth">
        
        {/* Shimmer Light Reflection overlay on the gate edge */}
        <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-white/40 via-white/5 to-transparent filter blur-xs animate-edgeShimmer pointer-events-none" />

        {/* Intricate Right Golden SVG Filigree Panel (Responsively scales layout width) */}
        <svg className="absolute h-[75%] sm:h-[85%] w-auto max-w-full text-[#B08D57] pointer-events-none left-0 sm:left-6" viewBox="0 0 200 400" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="gate-gold-3d-right">
              <feDropShadow dx="1.5" dy="1.5" stdDeviation="0.6" flood-color="#4d3703" flood-opacity="0.95" />
            </filter>
          </defs>

          <g filter="url(#gate-gold-3d-right)">
            {/* Main borders (Mirrored) */}
            <rect x="10" y="10" width="180" height="380" rx="12" stroke="currentColor" strokeWidth="2.8" fill="rgba(201,162,39,0.01)" strokeDasharray="1200" strokeDashoffset="1200" className="draw-path-slow" />
            <rect x="18" y="18" width="164" height="364" rx="8" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            
            {/* Top arch decoration */}
            <path d="M190 60 C150 40, 50 40, 10 60" stroke="currentColor" strokeWidth="1.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />
            <path d="M190 70 C150 50, 50 50, 10 70" stroke="currentColor" strokeWidth="0.8" />
            
            {/* Vertical Bars */}
            <line x1="160" y1="60" x2="160" y2="340" stroke="currentColor" strokeWidth="0.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />
            <line x1="120" y1="52" x2="120" y2="348" stroke="currentColor" strokeWidth="0.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />
            <line x1="80" y1="50" x2="80" y2="350" stroke="currentColor" strokeWidth="0.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />
            <line x1="40" y1="52" x2="40" y2="348" stroke="currentColor" strokeWidth="0.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />

            {/* Center Mandala (Right half) */}
            <path d="M10 140 A60 60 0 0 1 10 260 Z" stroke="currentColor" strokeWidth="2.2" fill="rgba(201,162,39,0.03)" strokeDasharray="400" strokeDashoffset="400" className="draw-path-slow" />
            <path d="M10 160 A40 40 0 0 1 10 240 Z" stroke="currentColor" strokeWidth="1" />
            <path d="M10 180 A20 20 0 0 1 10 220 Z" stroke="currentColor" strokeWidth="1" fill="currentColor" />
            
            {/* Scrollwork and flowers inside Mandala half */}
            <path d="M10 200 C40 190, 60 170, 70 200 C60 230, 40 210, 10 200" stroke="currentColor" strokeWidth="1.2" strokeDasharray="200" strokeDashoffset="200" className="draw-path" />
            <circle cx="40" cy="200" r="3.5" fill="currentColor" />
            <circle cx="70" cy="180" r="2.5" fill="currentColor" />
            <circle cx="70" cy="220" r="2.5" fill="currentColor" />
            
            {/* Lower Panel details */}
            <path d="M190 340 C150 350, 50 350, 10 340" stroke="currentColor" strokeWidth="1.8" strokeDasharray="300" strokeDashoffset="300" className="draw-path" />
            <circle cx="160" cy="340" r="3.5" fill="currentColor" />
            <circle cx="120" cy="340" r="3.5" fill="currentColor" />
            <circle cx="80" cy="340" r="3.5" fill="currentColor" />
            <circle cx="40" cy="340" r="3.5" fill="currentColor" />

            {/* Corners ornaments */}
            <path d="M190 30 C170 30, 170 10, 170 10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 30 C30 30, 30 10, 30 10" stroke="currentColor" strokeWidth="1.5" />
            <path d="M190 370 C170 370, 170 390, 170 390" stroke="currentColor" strokeWidth="1.5" />
            <path d="M10 370 C30 370, 30 390, 30 390" stroke="currentColor" strokeWidth="1.5" />
          </g>
        </svg>

      </div>

      {/* 4. CENTER LIGHT BEAM (Seam glow before doors open) */}
      <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[3px] bg-gradient-to-b from-transparent via-amber-300 to-transparent animate-seamGlow z-20 pointer-events-none" />

      {/* 5. DYNAMIC BURST PARTICLES (Golden sparks shooting out from parting gates) */}
      <div className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center">
        <div className="star-sparks absolute w-2.5 h-2.5 bg-[#B08D57] rounded-full animate-shoot1" style={{ '--x': '-150px', '--y': '-180px' }} />
        <div className="star-sparks absolute w-1.5 h-1.5 bg-[#B08D57] rounded-full animate-shoot2" style={{ '--x': '170px', '--y': '-120px' }} />
        <div className="star-sparks absolute w-2.5 h-2.5 bg-amber-350 rounded-full animate-shoot3" style={{ '--x': '-180px', '--y': '90px' }} />
        <div className="star-sparks absolute w-1.5 h-1.5 bg-white rounded-full animate-shoot4" style={{ '--x': '150px', '--y': '160px' }} />
        <div className="star-sparks absolute w-2.5 h-2.5 bg-[#B08D57] rounded-full animate-shoot1" style={{ '--x': '-80px', '--y': '-240px', animationDelay: '0.2s' }} />
        <div className="star-sparks absolute w-1.5 h-1.5 bg-white rounded-full animate-shoot2" style={{ '--x': '100px', '--y': '-210px', animationDelay: '0.2s' }} />
        <div className="star-sparks absolute w-1 h-1 bg-[#B08D57] rounded-full animate-shoot3" style={{ '--x': '-90px', '--y': '220px', animationDelay: '0.3s' }} />
        <div className="star-sparks absolute w-2.5 h-2.5 bg-[#B08D57] rounded-full animate-shoot4" style={{ '--x': '110px', '--y': '190px', animationDelay: '0.3s' }} />
      </div>

      {/* Glistening background sparkles rising everywhere */}
      <div className="absolute inset-0 pointer-events-none z-30">
        <div className="sparkle absolute top-[25%] left-[15%] w-1.5 h-1.5 bg-[#B08D57] rounded-full animate-sparkleGlow" style={{ animationDelay: '0.4s' }} />
        <div className="sparkle absolute top-[60%] left-[22%] w-1 h-1 bg-[#B08D57] rounded-full animate-sparkleGlow" style={{ animationDelay: '0.8s' }} />
        <div className="sparkle absolute top-[40%] left-[30%] w-2 h-2 bg-[#B08D57] rounded-full animate-sparkleGlow" style={{ animationDelay: '0.2s' }} />
        <div className="sparkle absolute top-[70%] left-[12%] w-1 h-1 bg-white rounded-full animate-sparkleGlow" style={{ animationDelay: '0.6s' }} />
        
        <div className="sparkle absolute top-[30%] left-[85%] w-1.5 h-1.5 bg-[#B08D57] rounded-full animate-sparkleGlow" style={{ animationDelay: '0.5s' }} />
        <div className="sparkle absolute top-[65%] left-[78%] w-1 h-1 bg-[#B08D57] rounded-full animate-sparkleGlow" style={{ animationDelay: '0.9s' }} />
        <div className="sparkle absolute top-[45%] left-[70%] w-2 h-2 bg-[#B08D57] rounded-full animate-sparkleGlow" style={{ animationDelay: '0.3s' }} />
        <div className="sparkle absolute top-[75%] left-[88%] w-1 h-1 bg-white rounded-full animate-sparkleGlow" style={{ animationDelay: '0.7s' }} />
      </div>

      {/* 6. HEAVENLY PUFFY CLOUDS (Dense layers wrapping gates responsively) */}
      <div className="absolute inset-0 pointer-events-none z-20">
        {/* Bottom Cloud bank */}
        <div className="absolute bottom-[-30px] sm:bottom-[-50px] left-[-10%] w-[200px] h-[100px] sm:w-[380px] sm:h-[190px] cloud-puff animate-floatCloud1" />
        <div className="absolute bottom-[-40px] sm:bottom-[-60px] left-[10%] w-[240px] h-[120px] sm:w-[420px] sm:h-[210px] cloud-puff animate-floatCloud2" style={{ animationDelay: '0.4s' }} />
        <div className="absolute bottom-[-35px] sm:bottom-[-50px] left-[30%] w-[220px] h-[110px] sm:w-[390px] sm:h-[200px] cloud-puff animate-floatCloud3" style={{ animationDelay: '0.8s' }} />
        <div className="absolute bottom-[-45px] sm:bottom-[-70px] left-[50%] w-[260px] h-[130px] sm:w-[440px] sm:h-[220px] cloud-puff animate-floatCloud1" style={{ animationDelay: '1.2s' }} />
        <div className="absolute bottom-[-35px] sm:bottom-[-55px] left-[70%] w-[220px] h-[110px] sm:w-[380px] sm:h-[180px] cloud-puff animate-floatCloud2" style={{ animationDelay: '1.6s' }} />
        <div className="absolute bottom-[-30px] sm:bottom-[-45px] left-[85%] w-[180px] h-[90px] sm:w-[320px] sm:h-[160px] cloud-puff animate-floatCloud3" style={{ animationDelay: '2.0s' }} />

        {/* Left Cloud bank column */}
        <div className="absolute bottom-[60px] sm:bottom-[80px] left-[-70px] sm:left-[-110px] w-[180px] h-[120px] sm:w-[300px] sm:h-[200px] cloud-puff animate-floatCloud1" />
        <div className="absolute bottom-[160px] sm:bottom-[220px] left-[-80px] sm:left-[-120px] w-[200px] h-[130px] sm:w-[340px] sm:h-[220px] cloud-puff animate-floatCloud2" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-[260px] sm:bottom-[360px] left-[-70px] sm:left-[-100px] w-[160px] h-[110px] sm:w-[280px] sm:h-[180px] cloud-puff animate-floatCloud3" style={{ animationDelay: '1.0s' }} />
        <div className="absolute bottom-[360px] sm:bottom-[500px] left-[-60px] sm:left-[-90px] w-[140px] h-[95px] sm:w-[250px] sm:h-[160px] cloud-puff animate-floatCloud1" style={{ animationDelay: '1.5s' }} />

        {/* Right Cloud bank column */}
        <div className="absolute bottom-[60px] sm:bottom-[80px] right-[-70px] sm:right-[-110px] w-[180px] h-[120px] sm:w-[300px] sm:h-[200px] cloud-puff animate-floatCloud2" />
        <div className="absolute bottom-[160px] sm:bottom-[220px] right-[-80px] sm:right-[-120px] w-[200px] h-[130px] sm:w-[340px] sm:h-[220px] cloud-puff animate-floatCloud3" style={{ animationDelay: '0.6s' }} />
        <div className="absolute bottom-[260px] sm:bottom-[360px] right-[-70px] sm:right-[-100px] w-[160px] h-[110px] sm:w-[280px] sm:h-[180px] cloud-puff animate-floatCloud1" style={{ animationDelay: '1.1s' }} />
        <div className="absolute bottom-[360px] sm:bottom-[500px] right-[-60px] sm:right-[-90px] w-[140px] h-[95px] sm:w-[250px] sm:h-[160px] cloud-puff animate-floatCloud2" style={{ animationDelay: '1.7s' }} />
      </div>

      {/* 7. ROLLING WHITE SMOKE / FOG OVERLAY */}
      <div className="absolute -bottom-8 left-[-10%] w-[60%] h-[180px] bg-radial-smoke animate-mistRoll pointer-events-none z-25" style={{ animationDelay: '0s' }} />
      <div className="absolute -bottom-10 right-[-10%] w-[65%] h-[190px] bg-radial-smoke animate-mistRoll pointer-events-none z-25 animate-reverse" style={{ animationDelay: '0.5s', animationDuration: '9s' }} />
      <div className="absolute -bottom-6 left-[20%] w-[50%] h-[150px] bg-radial-smoke animate-mistRoll pointer-events-none z-25" style={{ animationDelay: '1.2s', animationDuration: '10s' }} />

      {/* Overall Screen Fade out overlay (activates at the very end of loader) */}
      <div className="absolute inset-0 bg-[#FAF7F0] opacity-0 pointer-events-none animate-screenFadeOut z-[99999]" />

      {/* CSS 3D Perspective and Animation Styles */}
      <style>{`
        .gate-perspective {
          perspective: 1400px;
          transform-style: preserve-3d;
        }

        .animate-cameraZoom {
          animation: cameraZoom 4.5s cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
        }

        .gate-door-left-depth {
          transform-origin: left center;
          box-shadow: inset -15px 0 35px rgba(0,0,0,0.65), 10px 0 25px rgba(0,0,0,0.5);
          transform-style: preserve-3d;
        }

        .gate-door-right-depth {
          transform-origin: right center;
          box-shadow: inset 15px 0 35px rgba(0,0,0,0.65), -10px 0 25px rgba(0,0,0,0.5);
          transform-style: preserve-3d;
        }

        .radial-light-glow {
          background: radial-gradient(circle, rgba(201,162,39,0.58) 0%, rgba(201,162,39,0.19) 45%, rgba(0,0,0,0) 70%);
        }

        .bg-light-rays {
          background: repeating-conic-gradient(from 0deg, rgba(251,191,36,0.08) 0deg 15deg, rgba(0,0,0,0) 15deg 30deg);
        }

        /* Cloud puff realistic cumulus shaders */
        .cloud-puff {
          background: radial-gradient(circle at 35% 30%, #ffffff 0%, #fffbe6 45%, #efebd3 85%, #d1c8aa 100%);
          border-radius: 50%;
          filter: blur(12px) opacity(0.92);
          box-shadow: 
            0 15px 35px rgba(0,0,0,0.06), 
            inset -8px -8px 22px rgba(27,94,128,0.05),
            inset 12px 12px 25px rgba(255,255,255,1);
        }

        /* Ethereal rolling white smoke shader */
        .bg-radial-smoke {
          background: radial-gradient(circle, rgba(255,255,255,0.48) 0%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0) 70%);
          filter: blur(8px);
          mix-blend-mode: screen;
        }

        /* Vector lines draw-in style (slowed down to 2.8s) */
        .draw-path {
          animation: svgDrawAnimation 2.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
        
        .draw-path-slow {
          animation: svgDrawAnimation 2.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }

        /* 1. SVG Line Drawing Animation */
        @keyframes svgDrawAnimation {
          to {
            stroke-dashoffset: 0;
          }
        }

        /* 2. Seam pulsing glow line before opening */
        @keyframes seamGlow {
          0%, 25% {
            opacity: 0.85;
            box-shadow: 0 0 10px #fcd34d, 0 0 20px #f59e0b;
          }
          35% {
            opacity: 0.2;
            transform: translate(-50%) scaleX(0.5);
          }
          100% {
            opacity: 0;
            transform: translate(-50%) scaleX(0);
          }
        }

        /* 3. Light beams shooting downward */
        @keyframes lightBeam {
          0% {
            opacity: 0;
            transform: translate(-50%) scaleY(0.1);
          }
          25% {
            opacity: 0;
          }
          100% {
            opacity: 1;
            transform: translate(-50%) scaleY(1);
          }
        }

        /* 4. 3D Gate Swing-Open Animations */
        @keyframes gateSwingLeft {
          0% {
            transform: rotateY(0deg) translateZ(0);
          }
          25% {
            transform: rotateY(0deg) translateZ(0);
          }
          100% {
            transform: rotateY(-98deg) translateZ(-60px) translateX(-5%);
            opacity: 0;
          }
        }

        @keyframes gateSwingRight {
          0% {
            transform: rotateY(0deg) translateZ(0);
          }
          25% {
            transform: rotateY(0deg) translateZ(0);
          }
          100% {
            transform: rotateY(98deg) translateZ(-60px) translateX(5%);
            opacity: 0;
          }
        }

        /* 5. Cinematic Camera Zoom-out */
        @keyframes cameraZoom {
          0% {
            transform: scale(1.08);
          }
          100% {
            transform: scale(0.97);
          }
        }

        /* 6. Gold Light Glow and Ray expansion */
        @keyframes radialGlow {
          0% {
            transform: scale(0.2);
            opacity: 0.05;
          }
          25% {
            transform: scale(0.5);
            opacity: 0.45;
          }
          100% {
            transform: scale(1.7);
            opacity: 0.95;
          }
        }

        @keyframes rayPulse {
          0%, 100% {
            transform: rotate(0deg) scale(1);
          }
          50% {
            transform: rotate(180deg) scale(1.1);
          }
        }

        /* 7. Logo Fades and text drifts */
        @keyframes brandFade {
          0% {
            opacity: 0;
            transform: scale(0.92) translateZ(-40px);
          }
          35% {
            opacity: 0;
          }
          75% {
            opacity: 0.8;
            transform: scale(0.98) translateZ(0);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateZ(0);
          }
        }

        @keyframes textDrift {
          0% {
            letter-spacing: 0.15em;
          }
          100% {
            letter-spacing: 0.28em;
          }
        }

        @keyframes subTextDrift {
          0% {
            letter-spacing: 0.35em;
          }
          100% {
            letter-spacing: 0.45em;
          }
        }

        /* 8. Spark Burst Animations */
        @keyframes shoot1 {
          0%, 25% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--x), var(--y)) scale(1.5);
            opacity: 0;
          }
        }
        @keyframes shoot2 {
          0%, 25% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--x), var(--y)) scale(1.3);
            opacity: 0;
          }
        }
        @keyframes shoot3 {
          0%, 25% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--x), var(--y)) scale(1.4);
            opacity: 0;
          }
        }
        @keyframes shoot4 {
          0%, 25% {
            transform: translate(0, 0) scale(0);
            opacity: 0;
          }
          30% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--x), var(--y)) scale(1.2);
            opacity: 0;
          }
        }

        /* 9. Gate edge shimmer reflection effect */
        @keyframes edgeShimmer {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(100%);
          }
        }

        /* 10. Glistening background sparkles */
        @keyframes sparkleGlow {
          0%, 100% {
            opacity: 0.1;
            transform: translateY(0) scale(0.8);
          }
          50% {
            opacity: 0.85;
            transform: translateY(-8px) scale(1.2);
          }
        }

        /* 11. Rolling White Smoke/Mist animation */
        @keyframes mistRoll {
          0%, 100% {
            transform: translateX(-5%) translateY(0) scale(1) rotate(0deg);
            opacity: 0.25;
          }
          50% {
            transform: translateX(5%) translateY(-6px) scale(1.12) rotate(15deg);
            opacity: 0.6;
          }
        }

        /* 12. Floating Volumetric Cloud Animations */
        @keyframes floatCloud1 {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-6px) translateX(6px);
          }
        }
        @keyframes floatCloud2 {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(8px) translateX(-5px);
          }
        }
        @keyframes floatCloud3 {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          50% {
            transform: translateY(-4px) translateX(-8px);
          }
        }

        /* 13. Page exit fadeout overlay (Slowed to 4.5s) */
        @keyframes screenFadeOut {
          0% {
            opacity: 0;
          }
          82% {
            opacity: 0;
          }
          96% {
            opacity: 1;
          }
          100% {
            opacity: 1;
          }
        }

        /* Animation Class bindings */
        .animate-gateSwingLeft {
          animation: gateSwingLeft 3.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }

        .animate-gateSwingRight {
          animation: gateSwingRight 3.8s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }

        .animate-radialGlow {
          animation: radialGlow 3.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-rayPulse {
          animation: rayPulse 22s linear infinite;
        }

        .animate-lightBeam {
          animation: lightBeam 3.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }

        .animate-brandFade {
          animation: brandFade 3.8s cubic-bezier(0.215, 0.61, 0.355, 1) forwards;
        }

        .animate-textDrift {
          animation: textDrift 4.5s cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
        }

        .animate-subTextDrift {
          animation: subTextDrift 4.5s cubic-bezier(0.1, 0.8, 0.25, 1) forwards;
        }

        .animate-seamGlow {
          animation: seamGlow 3.5s cubic-bezier(0.77, 0, 0.175, 1) forwards;
        }

        .animate-shoot1 {
          animation: shoot1 2.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
        }
        .animate-shoot2 {
          animation: shoot2 2.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
        }
        .animate-shoot3 {
          animation: shoot3 2.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
        }
        .animate-shoot4 {
          animation: shoot4 2.2s cubic-bezier(0.1, 0.8, 0.2, 1) forwards;
        }

        .animate-edgeShimmer {
          animation: edgeShimmer 2.2s ease-in-out infinite;
        }

        .animate-sparkleGlow {
          animation: sparkleGlow 1.8s ease-in-out infinite;
        }

        .animate-floatCloud1 {
          animation: floatCloud1 9s ease-in-out infinite;
        }

        .animate-floatCloud2 {
          animation: floatCloud2 11s ease-in-out infinite;
        }

        .animate-floatCloud3 {
          animation: floatCloud3 13s ease-in-out infinite;
        }

        .animate-mistRoll {
          animation: mistRoll 8s ease-in-out infinite;
        }

        .animate-screenFadeOut {
          animation: screenFadeOut 4.5s cubic-bezier(0.7, 0, 0.3, 1) forwards;
        }

        /* Helper for reversing animations */
        .animate-reverse {
          animation-direction: reverse;
        }
      `}</style>

    </div>
  );
};

export default HeavenGateLoader;
