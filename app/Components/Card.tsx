"use client";

import { useRef, useState, MouseEvent } from "react";

interface CardSiswaProps {
  name: string;
  id: string;
  kelas: string;
  attendedClasses: boolean[];
}

export default function CardSiswa({ name, id, kelas, attendedClasses }: CardSiswaProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  
  // mouse hover var
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [cardSize, setCardSize] = useState({ w: 0, h: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // attendance var
  const totalClasses = attendedClasses?.length || 1;
  const attendedCount = attendedClasses?.filter(Boolean).length || 0;
  const percentage = Math.round((attendedCount / totalClasses) * 100);

  // 3D handler Function
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
    
    setCardSize({
      w: rect.width,
      h: rect.height,
    });
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const centerX = cardSize.w / 2;
  const centerY = cardSize.h / 2;
  const maxTilt = 12; 

  // 3D rotating
  const rotateX = isHovering ? -((mousePos.y - centerY) / centerY) * maxTilt : 0;
  const rotateY = isHovering ? ((mousePos.x - centerX) / centerX) * maxTilt : 0;
  const glareX = cardSize.w === 0 ? 50 : (mousePos.x / cardSize.w) * 100;

  // 3D transform
  const transformStyle = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)`;
  
  const glareStyle = `linear-gradient(115deg, transparent ${glareX - 20}%, rgba(255, 255, 255, 0.05) ${glareX - 20}%, rgba(255, 255, 255, 0.05) ${glareX - 8}%, rgba(255, 255, 255, 0.25) ${glareX - 8}%, rgba(255, 255, 255, 0.25) ${glareX + 8}%, rgba(255, 255, 255, 0.05) ${glareX + 8}%, rgba(255, 255, 255, 0.05) ${glareX + 20}%, transparent ${glareX + 20}%)`;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      style={{ transform: transformStyle }}
      className={`relative overflow-hidden rounded-2xl bg-[#09090b]/80 border border-white/10 p-5 cursor-pointer shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] transition-all ${
        isHovering ? "duration-75 ease-out" : "duration-500 ease-out"
      }`}
    >
      <div className="relative z-10 flex flex-col gap-2">
        <div>
          <h4 className="font-semibold text-zinc-100 text-lg">{name}</h4>
          <p className="text-xs text-zinc-500 font-mono tracking-wider">ID: {id} | Class: {kelas}</p>
        </div>
        
        <div className="mt-2 flex gap-1.5">
          {attendedClasses?.map((attended, idx) => (
            <div 
              key={idx} 
              className={`w-2.5 h-2.5 rounded-full ${attended ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-zinc-800 border border-zinc-700'}`}
            />
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          <div className="relative w-full h-5 bg-zinc-900/80 rounded-full overflow-hidden border border-white/5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.5)]">
            <div
              className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            >
              <div className="absolute inset-0 bg-emerald-500 rounded-l-full overflow-hidden shadow-[inset_0_0_10px_rgba(16,185,129,0.8)]">
                <svg className="absolute top-0 left-0 w-[200%] h-full opacity-20 mix-blend-overlay" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,40 Q12.5,10 25,40 T50,40 T75,40 T100,40 L100,100 L0,100 Z" fill="#ffffff">
                    <animateTransform attributeName="transform" type="translate" from="0 0" to="-50 0" dur="3s" repeatCount="indefinite" />
                  </path>
                </svg>
                <svg className="absolute top-0 left-0 w-[200%] h-full opacity-30 mix-blend-overlay" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path d="M0,60 Q12.5,30 25,60 T50,60 T75,60 T100,60 L100,100 L0,100 Z" fill="#ffffff">
                    <animateTransform attributeName="transform" type="translate" from="-50 0" to="0 0" dur="2s" repeatCount="indefinite" />
                  </path>
                </svg>
              </div>

              {percentage > 0 && (
                <div className="absolute top-0 -right-2.5 w-4 h-full z-10 pointer-events-none">
                  <svg className="absolute top-0 left-0 w-full h-[200%] text-emerald-500 drop-shadow-[2px_0_4px_rgba(16,185,129,0.5)]" preserveAspectRatio="none" viewBox="0 0 10 100">
                    <path d="M0,0 L5,0 Q10,12.5 5,25 T5,50 Q10,62.5 5,75 T5,100 L0,100 Z" fill="currentColor">
                      <animateTransform attributeName="transform" type="translate" from="0 -50" to="0 0" dur="0.8s" repeatCount="indefinite" />
                    </path>
                  </svg>
                </div>
              )}
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

      <div
        className={`pointer-events-none absolute inset-0 z-20 transition-opacity ${isHovering ? "opacity-100 duration-75" : "opacity-0 duration-500"}`}
        style={{ background: glareStyle }}
      />
    </div>
  );
}