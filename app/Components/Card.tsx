"use client";

import { useState, useRef, MouseEvent } from "react";
import { motion } from "framer-motion";


// types
interface CardSiswaProps {
  name: string;
  id: string;
  kelas: string;
  attendedClasses: boolean[];
  onClick?: () => void; 
}

interface CardAttendanceProps {
  name: string;
  kelas: string;
  lastAttendance: string;
  attendanceTimes: string[]; 
  index?: number; 
  onClick?: () => void; 
}


// --- CARD SISWA ---
export default function CardSiswa({ name, id, kelas, attendedClasses, onClick }: CardSiswaProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // hover state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardSize, setCardSize] = useState({ w: 0, h: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // calc attd
  const totalClasses = attendedClasses?.length || 1;
  const attendedCount = attendedClasses?.filter(Boolean).length || 0;
  const percentage = Math.round((attendedCount / totalClasses) * 100);

  // 3d handler
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setCardSize({ w: rect.width, h: rect.height });
  };

  const handleMouseLeave = () => setIsHovering(false);

  // 3d math
  const centerX = cardSize.w / 2;
  const centerY = cardSize.h / 2;
  const maxTilt = 12; 

  const rotateX = isHovering ? -((mousePos.y - centerY) / centerY) * maxTilt : 0;
  const rotateY = isHovering ? ((mousePos.x - centerX) / centerX) * maxTilt : 0;
  const glareX = cardSize.w === 0 ? 50 : (mousePos.x / cardSize.w) * 100;

  // styles
  const transformStyle = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)`;
  const glareStyle = `linear-gradient(115deg, transparent ${glareX - 20}%, rgba(255, 255, 255, 0.05) ${glareX - 20}%, rgba(255, 255, 255, 0.05) ${glareX - 8}%, rgba(255, 255, 255, 0.25) ${glareX - 8}%, rgba(255, 255, 255, 0.25) ${glareX + 8}%, rgba(255, 255, 255, 0.05) ${glareX + 8}%, rgba(255, 255, 255, 0.05) ${glareX + 20}%, transparent ${glareX + 20}%)`;


  // render
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full"
    >
        <div
        ref={cardRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={onClick}
        style={{ transform: transformStyle }}
        className={`relative overflow-hidden rounded-2xl bg-[#09090b]/80 border border-white/10 p-5 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] transition-all ${
            isHovering ? "duration-75 ease-out" : "duration-500 ease-out"
        } active:scale-95 active:bg-amber-300/50 duration-100`}
        >
        <div className="relative z-10 flex flex-col gap-2">
            
            {/* info (reordered text) */}
            <div>
            <h4 className="text-xl font-extrabold text-zinc-100 tracking-tight drop-shadow-sm">{name}</h4>
            <div className="flex items-center gap-2 mt-1.5 mb-1">
                <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-medium">
                {kelas}
                </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono tracking-wider">ID: {id}</p>
            </div>
            
            {/* dots */}
            <div className="mt-2 flex gap-1.5">
            {attendedClasses?.map((attended, idx) => (
                <div 
                key={idx} 
                className={`w-2.5 h-2.5 rounded-full ${attended ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-800 border border-zinc-700'}`}
                />
            ))}
            </div>

            {/* progress water effect */}
            <div className="mt-4 flex flex-col gap-2.5">
            <div className="relative w-full h-5 bg-zinc-900/80 rounded-full overflow-hidden border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
                
                <div
                className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out"
                style={{ width: `${percentage}%` }}
                >
                {/* body water (horizontal wave) */}
                <div className="absolute inset-0 bg-emerald-600 rounded-l-full overflow-hidden shadow-[inset_0_0_10px_rgba(16,185,129,0.8)]">
                    <svg className="absolute top-0 left-0 w-[200%] h-full opacity-40 mix-blend-overlay" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,30 Q12.5,0 25,30 T50,30 T75,30 T100,30 L100,100 L0,100 Z" fill="#ffffff">
                        <animateTransform attributeName="transform" type="translate" from="0 0" to="-50 0" dur="2s" repeatCount="indefinite" />
                    </path>
                    </svg>
                    <svg className="absolute top-0 left-0 w-[200%] h-full opacity-30 mix-blend-overlay" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0,50 Q12.5,20 25,50 T50,50 T75,50 T100,50 L100,100 L0,100 Z" fill="#ffffff">
                        <animateTransform attributeName="transform" type="translate" from="-50 0" to="0 0" dur="3s" repeatCount="indefinite" />
                    </path>
                    </svg>
                </div>

                {/* tip water (vertical wavy tip) */}
                {percentage > 0 && (
                    <div className="absolute top-0 -right-3 w-6 h-full z-10 pointer-events-none">
                    {/* tip wave 1 */}
                    <svg className="absolute top-0 left-1 w-full h-full text-emerald-500 drop-shadow-[2px_0_5px_rgba(16,185,129,0.8)]" preserveAspectRatio="none" viewBox="0 0 20 100">
                        <path fill="currentColor">
                        <animate attributeName="d" dur="1s" repeatCount="indefinite" 
                            values="M0,0 L10,0 Q20,25 10,50 T10,100 L0,100 Z; M0,0 L10,0 Q0,25 10,50 T10,100 L0,100 Z; M0,0 L10,0 Q20,25 10,50 T10,100 L0,100 Z"
                        />
                        </path>
                    </svg>
                    </div>
                )}
                </div>

            </div>

            {/* stats */}
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-[0.25em]">
                Attendance Rate
                </span>
                <span className="text-base font-extrabold text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,1)] tracking-widest">
                {percentage}%
                </span>
            </div>
            </div>

        </div>

        {/* glare */}
        <div
            className={`pointer-events-none absolute inset-0 z-20 transition-opacity ${isHovering ? "opacity-100 duration-75" : "opacity-0 duration-500"}`}
            style={{ background: glareStyle }}
        />

        </div>
    </motion.div>
  );
}


// --- CARD ATTENDANCE ---
export function CardAttendance({ name, kelas, lastAttendance, attendanceTimes, index = 0, onClick }: CardAttendanceProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // hover state
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardSize, setCardSize] = useState({ w: 0, h: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // 3d handler
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setCardSize({ w: rect.width, h: rect.height });
  };

  const handleMouseLeave = () => setIsHovering(false);

  // 3d math
  const centerX = cardSize.w / 2;
  const centerY = cardSize.h / 2;
  const maxTilt = 12; 

  const rotateX = isHovering ? -((mousePos.y - centerY) / centerY) * maxTilt : 0;
  const rotateY = isHovering ? ((mousePos.x - centerX) / centerX) * maxTilt : 0;
  const glareX = cardSize.w === 0 ? 50 : (mousePos.x / cardSize.w) * 100;

  // styles
  const transformStyle = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)`;
  const glareStyle = `linear-gradient(115deg, transparent ${glareX - 20}%, rgba(255, 255, 255, 0.05) ${glareX - 20}%, rgba(255, 255, 255, 0.05) ${glareX - 8}%, rgba(255, 255, 255, 0.25) ${glareX - 8}%, rgba(255, 255, 255, 0.25) ${glareX + 8}%, rgba(255, 255, 255, 0.05) ${glareX + 8}%, rgba(255, 255, 255, 0.05) ${glareX + 20}%, transparent ${glareX + 20}%)`;

  // render
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, margin: "-50px" }}
      transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }}
      className="w-full"
    >
      <div
        ref={cardRef}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={handleMouseLeave}
        onMouseMove={handleMouseMove}
        onClick={onClick}
        style={{ transform: transformStyle }}
        className={`relative overflow-hidden rounded-2xl bg-[#09090b]/80 border border-white/10 p-5 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] transition-all ${
          isHovering ? "duration-75 ease-out" : "duration-500 ease-out"
        } active:scale-95 active:bg-amber-300/50 duration-100`}
      >
        <div className="relative z-10 flex flex-col gap-3">
          
          {/* info */}
          <div>
            <h4 className="text-2xl font-extrabold text-zinc-100 tracking-tight drop-shadow-sm">{name}</h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-medium">{kelas}</span>
              <span className="text-xs text-zinc-500 font-mono">Latest: {lastAttendance}</span>
            </div>
          </div>
          
          {/* dots dyn */}
          <div className="mt-3 flex gap-4">
            {attendanceTimes.map((time, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse border border-emerald-300/50" />
                <span className="text-[10px] text-zinc-400 font-mono font-semibold tracking-wider">{time}</span>
              </div>
            ))}
            
            {/* empty state dots */}
            {attendanceTimes.length === 0 && (
              <span className="text-xs text-zinc-600 italic">Belum ada presensi</span>
            )}
          </div>

        </div>

        {/* glare */}
        <div
          className={`pointer-events-none absolute inset-0 z-20 transition-opacity ${
            isHovering ? "opacity-100 duration-75" : "opacity-0 duration-500"
          }`}
          style={{ background: glareStyle }}
        />

      </div>
    </motion.div>
  );
}