"use client";

import { useState, useRef, MouseEvent } from "react";
import { motion } from "framer-motion";

// base komponen card 3d
export function Hover3DCard({ children, className = "", maxTilt = 12, onClick }: { children: React.ReactNode; className?: string; maxTilt?: number; onClick?: () => void; }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardSize, setCardSize] = useState({ w: 0, h: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setCardSize({ w: rect.width, h: rect.height });
  };

  const handleMouseLeave = () => setIsHovering(false);

  const centerX = cardSize.w / 2;
  const centerY = cardSize.h / 2;

  const rotateX = isHovering ? -((mousePos.y - centerY) / centerY) * maxTilt : 0;
  const rotateY = isHovering ? ((mousePos.x - centerX) / centerX) * maxTilt : 0;
  const glareX = cardSize.w === 0 ? 50 : (mousePos.x / cardSize.w) * 100;

  const transformStyle = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)`;
  const glareStyle = `linear-gradient(115deg, transparent ${glareX - 20}%, rgba(255, 255, 255, 0.05) ${glareX - 20}%, rgba(255, 255, 255, 0.1) ${glareX - 8}%, rgba(255, 255, 255, 0.25) ${glareX - 8}%, rgba(255, 255, 255, 0.25) ${glareX + 8}%, rgba(255, 255, 255, 0.1) ${glareX + 8}%, rgba(255, 255, 255, 0.05) ${glareX + 20}%, transparent ${glareX + 20}%)`;

  return (
    <div 
      ref={cardRef} 
      onMouseEnter={() => setIsHovering(true)} 
      onMouseLeave={handleMouseLeave} 
      onMouseMove={handleMouseMove} 
      onClick={onClick} 
      style={{ transform: transformStyle }} 
      className={`relative overflow-hidden transition-all ${isHovering ? "duration-75 ease-out" : "duration-500 ease-out"} ${className}`}
    >
      {children}
      <div className={`pointer-events-none absolute inset-0 z-20 transition-opacity ${isHovering ? "opacity-100 duration-75" : "opacity-0 duration-500"}`} style={{ background: glareStyle }} />
    </div>
  );
}

export interface CardSiswaProps {
  name: string;
  id: string;
  kelas: string;
  classSchedules: { date: string, time: string, tolerance?: string }[];
  attendedData: { tanggal: string, jam: string, status?: string }[];
  onClick?: () => void;
}

export interface CardAttendanceProps {
  name: string;
  kelas: string;
  lastAttendance: string;
  attendanceTimes: string[];
  index?: number;
  onClick?: () => void;
}

// card siswa list
export default function CardSiswa({ name, id, kelas, classSchedules, attendedData, onClick }: CardSiswaProps) {
  
  // hitung data hari dan presensi
  const uniqueDays = Array.from(new Set(classSchedules?.map(s => s.date) || [])).sort();
  
  const dots = uniqueDays.map(date => {
     const sessionsOnDay = classSchedules.filter(s => s.date === date);
     let onTimeCount = 0;
     let lateCount = 0;
     
     sessionsOnDay.forEach(sched => {
       const match = attendedData.find(a => a.tanggal === sched.date && a.jam === sched.time);
       if (match) {
         if (match.status === "terlambat") lateCount++;
         else onTimeCount++;
       }
     });
     
     if (onTimeCount === 0 && lateCount === 0) return 'empty';
     if (lateCount > 0) {
       if (lateCount === sessionsOnDay.length) return 'red';
       return 'yellow'; 
     }
     if (onTimeCount > 0 && onTimeCount < sessionsOnDay.length) return 'yellow'; 
     return 'green'; 
  });

  // itung rate attendance
  const totalSchedules = classSchedules?.length || 0;
  const matchedAttendancesOnTime = classSchedules?.filter(sched => 
    attendedData.some(a => a.tanggal === sched.date && a.jam === sched.time && a.status !== "terlambat")
  ).length || 0;
  const percentage = totalSchedules > 0 ? Math.round((matchedAttendancesOnTime / totalSchedules) * 100) : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: "-50px" }} transition={{ duration: 0.5, ease: "easeOut" }} className="w-full">
      <Hover3DCard maxTilt={12} onClick={onClick} className="rounded-2xl bg-[#09090b]/80 border border-white/10 p-5 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] active:scale-95 active:bg-amber-300/50 duration-100">
        <div className="relative z-10 flex flex-col gap-2">
          <div>
            <h4 className="text-xl font-extrabold text-zinc-100 tracking-tight drop-shadow-sm">

              {name}
            </h4>
            <div className="flex items-center gap-2 mt-1.5 mb-1">
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-medium">

                {kelas}
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-mono tracking-wider">

              ID: {id}
            </p>
          </div>

          <div className="mt-2 flex gap-1.5 flex-wrap">
            {dots.length > 0 ? dots.map((status, idx) => (
              <div 
                key={idx} 
                className={`w-2.5 h-2.5 rounded-full border transition-colors ${
                  status === 'green' ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' 
                  : status === 'yellow' ? 'bg-yellow-400 border-yellow-300 shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                  : status === 'red' ? 'bg-red-500 border-red-400 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                  : 'bg-zinc-800 border-zinc-700'
                }`} 
              />
            )) : (
              <span className="text-[10px] text-zinc-600 italic">

                No schedules set
              </span>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-2.5">
            <div className="relative w-full h-5 bg-zinc-900/80 rounded-full overflow-hidden border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
              <div className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}>
                <div className="absolute inset-0 bg-emerald-600 rounded-l-full overflow-hidden shadow-[inset_0_0_10px_rgba(16,185,129,0.8)]" />
              </div>
            </div>
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
      </Hover3DCard>
    </motion.div>
  );
}

// card list kelas / grup
export function CardAttendance({ name, kelas, lastAttendance, attendanceTimes, index = 0, onClick }: CardAttendanceProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: false, margin: "-50px" }} transition={{ duration: 0.5, ease: "easeOut", delay: index * 0.1 }} className="w-full">
      <Hover3DCard maxTilt={12} onClick={onClick} className="rounded-2xl bg-[#09090b]/80 border border-white/10 p-5 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] active:scale-95 active:bg-amber-300/50 duration-100">
        <div className="relative z-10 flex flex-col gap-3">
          <div>
            <h4 className="text-2xl font-extrabold text-zinc-100 tracking-tight drop-shadow-sm">

              {name}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-medium">

                {kelas}
              </span>
              <span className="text-xs text-zinc-500 font-mono">

                Latest: {lastAttendance}
              </span>
            </div>
          </div>

          <div className="mt-3 flex gap-4">
            {attendanceTimes.map((time, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(52,211,153,0.9)] animate-pulse border border-emerald-300/50" />
                <span className="text-[10px] text-zinc-400 font-mono font-semibold tracking-wider">

                  {time}
                </span>
              </div>
            ))}
            {attendanceTimes.length === 0 && (
              <span className="text-xs text-zinc-600 italic">

                No Attendance
              </span>
            )}
          </div>
        </div>
      </Hover3DCard>
    </motion.div>
  );
}