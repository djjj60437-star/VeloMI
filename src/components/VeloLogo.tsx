import React from 'react';

interface VeloLogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
}

export const VeloLogo: React.FC<VeloLogoProps> = ({
  className = '',
  size = 36,
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 512 512"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 hover:scale-105 filter drop-shadow-[0_4px_16px_rgba(0,102,255,0.4)]"
      >
        <defs>
          {/* Main Background Squircle Gradient */}
          <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0b1b4f" />
            <stop offset="50%" stopColor="#040b27" />
            <stop offset="100%" stopColor="#010414" />
          </linearGradient>

          {/* Cyan Glow Gradient for Outer Border */}
          <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#2563eb" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.8" />
          </linearGradient>

          {/* Left Ribbon (V) - Neon Blue */}
          <linearGradient id="blueRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="40%" stopColor="#0070f3" />
            <stop offset="100%" stopColor="#004cd8" />
          </linearGradient>

          {/* Right Ribbon (M / N) - Crisp Frost White with Soft Silver Shading */}
          <linearGradient id="whiteRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#e2e8f0" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Ribbon Shadow */}
          <linearGradient id="foldShadow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#000000" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </linearGradient>

          {/* Cloud Outline Glow */}
          <linearGradient id="cloudGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#0055ff" stopOpacity="0.3" />
          </linearGradient>

          {/* Orbital Ring Glow */}
          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00f2fe" />
            <stop offset="50%" stopColor="#4facfe" />
            <stop offset="100%" stopColor="#00c6ff" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Squircle Glass Background */}
        <rect
          x="16"
          y="16"
          width="480"
          height="480"
          rx="110"
          fill="url(#bgGrad)"
          stroke="url(#borderGrad)"
          strokeWidth="6"
        />

        {/* Ambient Glass Glow Behind Logo */}
        <circle cx="256" cy="220" r="140" fill="#0066ff" opacity="0.25" filter="blur(40px)" />
        <circle cx="340" cy="180" r="90" fill="#38bdf8" opacity="0.2" filter="blur(30px)" />

        {/* Cloud Contour behind Lettermark */}
        <path
          d="M170 210 C170 170 195 138 232 135 C246 112 272 95 304 95 C345 95 378 122 387 160 C408 163 425 181 425 203 C425 228 405 248 380 248 L170 248 Z"
          fill="#002b66"
          opacity="0.45"
          stroke="url(#cloudGrad)"
          strokeWidth="6"
          strokeLinejoin="round"
        />

        {/* Outer Orbit Glow Ring (Back) */}
        <ellipse
          cx="256"
          cy="260"
          rx="180"
          ry="65"
          transform="rotate(-22 256 260)"
          fill="none"
          stroke="url(#orbitGrad)"
          strokeWidth="6"
          opacity="0.85"
        />

        {/* 3D Geometric Ribbon - Velo MI 'V' and 'M' */}
        {/* Left 'V' Arm - Vibrant Blue Ribbon */}
        <path
          d="M115 195 L175 195 L256 315 L220 345 L115 195 Z"
          fill="url(#blueRibbon)"
        />
        {/* Left Wing Diagonal High-Fold */}
        <path
          d="M175 195 L256 315 L285 270 L210 160 L150 160 Z"
          fill="#0091ff"
        />

        {/* Central Fold Shadow */}
        <path
          d="M245 270 L285 270 L260 315 Z"
          fill="url(#foldShadow)"
        />

        {/* Right 'M/N' Arm - Frost White Folded Ribbon */}
        <path
          d="M210 160 L280 160 L385 315 L335 340 L245 205 Z"
          fill="url(#whiteRibbon)"
        />
        {/* Right Wing Vertical Leg */}
        <path
          d="M280 160 L345 255 L385 195 L345 160 Z"
          fill="#f8fafc"
        />
        <path
          d="M345 255 L385 315 L385 240 Z"
          fill="#cbd5e1"
        />

        {/* Orbit Ring Foreground Overlay (to create passing-through 3D effect) */}
        <path
          d="M100 295 C140 335 240 350 340 320"
          fill="none"
          stroke="#00ffff"
          strokeWidth="7"
          strokeLinecap="round"
          filter="drop-shadow(0 0 8px #00ffff)"
        />

        {/* Sparkle Star on the Orbit Ring */}
        <path
          d="M405 235 Q415 235 415 225 Q415 235 425 235 Q415 235 415 245 Q415 235 405 235 Z"
          fill="#ffffff"
          filter="drop-shadow(0 0 6px #38bdf8)"
        />

        {/* Bottom Wordmark inside Icon: Velo MI */}
        <text
          x="195"
          y="420"
          fontFamily="'Inter', 'Cairo', sans-serif"
          fontWeight="800"
          fontSize="56"
          letterSpacing="1"
          fill="#ffffff"
        >
          Velo
        </text>
        <text
          x="335"
          y="420"
          fontFamily="'Inter', 'Cairo', sans-serif"
          fontWeight="800"
          fontSize="56"
          letterSpacing="1"
          fill="#0099ff"
        >
          MI
        </text>
      </svg>

      {showText && (
        <div className="flex items-center font-bold tracking-tight text-neutral-900 select-none">
          <span className="text-xl text-neutral-900 font-extrabold tracking-tight">Velo</span>
          <span className="text-xl ml-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 font-black">
            MI
          </span>
          <span className="mr-2 text-[10px] font-mono tracking-widest px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 border border-blue-500/20 font-bold">
            6.1
          </span>
        </div>
      )}
    </div>
  );
};
