"use client";

import { useState, useMemo, useRef, MouseEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StudentData } from "../page";

// ----------------------------------------
// CONSTANTS & UTILS
// ----------------------------------------
const MONTHS_LIST = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_LIST = Array.from({ length: 21 }, (_, i) => CURRENT_YEAR - 10 + i);

interface ModalProfilProps {
  data: StudentData;
  closeModal: () => void;
}

// ----------------------------------------
// REUSABLE 3D ISLAND COMPONENT
// ----------------------------------------
function Hover3DIsland({ children, className = "" }: { children: React.ReactNode; className?: string }) {
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

  const centerX = cardSize.w / 2;
  const centerY = cardSize.h / 2;
  const maxTilt = 10;

  const rotateX = isHovering ? -((mousePos.y - centerY) / centerY) * maxTilt : 0;
  const rotateY = isHovering ? ((mousePos.x - centerX) / centerX) * maxTilt : 0;
  const glareX = cardSize.w === 0 ? 50 : (mousePos.x / cardSize.w) * 100;

  const transformStyle = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${isHovering ? 1.02 : 1}, ${isHovering ? 1.02 : 1}, 1)`;
  const glareStyle = `linear-gradient(115deg, transparent ${glareX - 20}%, rgba(255, 255, 255, 0.05) ${glareX - 20}%, rgba(255, 255, 255, 0.1) ${glareX - 8}%, rgba(255, 255, 255, 0.25) ${glareX - 8}%, rgba(255, 255, 255, 0.25) ${glareX + 8}%, rgba(255, 255, 255, 0.1) ${glareX + 8}%, rgba(255, 255, 255, 0.05) ${glareX + 20}%, transparent ${glareX + 20}%)`;

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      style={{ transform: transformStyle }}
      className={`relative overflow-hidden bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.5)] transition-all ${isHovering ? "duration-75 ease-out" : "duration-500 ease-out"} ${className}`}
    >
      <div className="relative z-10 w-full h-full">{children}</div>
      <div
        className={`pointer-events-none absolute inset-0 z-20 transition-opacity ${isHovering ? "opacity-100 duration-75" : "opacity-0 duration-500"}`}
        style={{ background: glareStyle }}
      />
    </div>
  );
}

// ----------------------------------------
// 1. STUDENT PROFILE MODAL (ISLAND DESIGN)
// ----------------------------------------
export default function ModalProfilSiswa({ data, closeModal }: ModalProfilProps) {
  const [student, setStudent] = useState<StudentData>(data);
  const [confirmAction, setConfirmAction] = useState<"edit" | "delete" | "reset" | null>(null);
  const [editName, setEditName] = useState(data.name);

  // Group attendance data
  const groupedAttendance = useMemo(() => {
    const map = new Map<string, string[]>();
    student.attendedClasses?.Data?.forEach((att) => {
      if (!map.has(att.tanggal)) map.set(att.tanggal, []);
      map.get(att.tanggal)!.push(att.jam);
    });
    return Array.from(map.entries()).map(([date, times]) => ({ date, times }));
  }, [student]);

  // Calc percentage (assuming 14 sessions as baseline for calculation)
  const totalPresences = student.attendedClasses?.Data?.length || 0;
  const percentage = Math.min(100, Math.round((totalPresences / 14) * 100));

  // Action Handlers
  const handleConfirm = () => {
    if (confirmAction === "edit") {
      setStudent({ ...student, name: editName });
      data.name = editName; // Mutate direct original data
    } else if (confirmAction === "reset") {
      setStudent({ ...student, attendedClasses: { Data: [] }, latestAttendance: [] });
      data.attendedClasses.Data = []; // Mutate direct original data
      data.latestAttendance = [];
    } else if (confirmAction === "delete") {
      alert(`Student ${student.id} logic deletion executed.`);
      closeModal();
    }
    setConfirmAction(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-5xl h-[90vh] flex flex-col items-center justify-between p-4 overflow-y-auto custom-scrollbar relative"
    >
      <button onClick={closeModal} className="absolute top-0 right-0 text-zinc-400 hover:text-white font-bold transition-colors z-50 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md hover:bg-zinc-700 shadow-lg">✕</button>

      {/* TOP ISLANDS: PROFILE & MOCKUP */}
      <div className="w-full flex justify-between items-start gap-8 mt-4">
        {/* Profile Card */}
        <Hover3DIsland className="rounded-3xl p-8 min-w-75">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">{student.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold tracking-widest">{student.kelas}</span>
              <span className="text-zinc-400 font-mono text-sm tracking-widest">ID: {student.id}</span>
            </div>
          </div>
        </Hover3DIsland>

        {/* Physical ID Mockup */}
        <Hover3DIsland className="rounded-[2.5rem] w-112.5 h-70 items-center justify-center border-white/20">
          <div className="text-zinc-600 font-bold tracking-widest uppercase border-2 border-dashed border-zinc-700/50 p-6 rounded-2xl">
            Insert Physical ID Image
          </div>
        </Hover3DIsland>
      </div>

      {/* MIDDLE ISLAND: ATTENDANCE POINTS (NO BG CONTAINER) */}
      <div className="w-full flex flex-wrap justify-center gap-8 my-8 px-4">
        {groupedAttendance.map((item, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.1 }}
            key={idx} className="flex flex-col items-center gap-3"
          >
            {/* Main Date Node */}
            <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400/50 backdrop-blur-xl flex items-center justify-center shadow-[0_0_20px_rgba(52,211,153,0.3)]">
              <span className="text-white font-bold text-sm tracking-wider">{item.date.split("-").slice(1).join("/")}</span>
            </div>
            
            {/* Sub Node (Count & Time) */}
            <div className="px-4 py-2 rounded-full bg-zinc-900/80 border border-emerald-500/30 backdrop-blur-xl flex flex-col items-center shadow-lg">
              <span className="text-emerald-400 font-extrabold text-sm">{item.times.length}x</span>
              <span className="text-xs text-zinc-400 font-mono mt-0.5">{item.times.join(", ")}</span>
            </div>
          </motion.div>
        ))}

        {groupedAttendance.length === 0 && (
          <div className="text-zinc-500 italic font-medium">No attendance records found.</div>
        )}
      </div>

      {/* BOTTOM-MIDDLE ISLAND: PROGRESS BAR */}
      <div className="w-full max-w-2xl flex flex-col gap-3 mb-8">
        <div className="relative w-full h-8 bg-zinc-900/60 rounded-full overflow-hidden border border-white/10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}>
            <div className="absolute inset-0 bg-emerald-600 rounded-r-full overflow-hidden shadow-[inset_0_0_15px_rgba(16,185,129,0.8)]">
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
            {percentage > 0 && (
              <div className="absolute top-0 -right-4 w-8 h-full z-10 pointer-events-none">
                <svg className="absolute top-0 left-1 w-full h-full text-emerald-400 drop-shadow-[2px_0_8px_rgba(16,185,129,0.9)]" preserveAspectRatio="none" viewBox="0 0 20 100">
                  <path fill="currentColor">
                    <animate attributeName="d" dur="1s" repeatCount="indefinite" values="M0,0 L10,0 Q20,25 10,50 T10,100 L0,100 Z; M0,0 L10,0 Q0,25 10,50 T10,100 L0,100 Z; M0,0 L10,0 Q20,25 10,50 T10,100 L0,100 Z" />
                  </path>
                </svg>
              </div>
            )}
          </div>
        </div>
        <div className="text-center font-extrabold text-emerald-400 tracking-widest text-lg drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">
          {percentage}% ATTENDANCE
        </div>
      </div>

      {/* BOTTOM ISLAND: ACTION BUTTONS & POPUP */}
      <div className="relative w-full flex justify-center gap-6 mt-auto pb-4">
        <AnimatePresence>
          {confirmAction && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-[110%] w-80 p-5 rounded-2xl bg-zinc-900/90 backdrop-blur-2xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex flex-col items-center gap-4 z-50"
            >
              <h3 className="text-white font-bold capitalize">Confirm {confirmAction}</h3>
              {confirmAction === "edit" && (
                <input 
                  type="text" value={editName} onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                />
              )}
              {confirmAction === "delete" && <p className="text-sm text-red-400 text-center">Are you sure you want to delete this student permanently?</p>}
              {confirmAction === "reset" && <p className="text-sm text-amber-400 text-center">Are you sure you want to wipe all attendance data?</p>}
              
              <div className="flex gap-3 w-full">
                <button onClick={() => setConfirmAction(null)} className="flex-1 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-all">Cancel</button>
                <button onClick={handleConfirm} className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]">Confirm</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setConfirmAction("edit")} className="px-8 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold backdrop-blur-md hover:bg-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">
          Edit Name
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setConfirmAction("reset")} className="px-8 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold backdrop-blur-md hover:bg-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all">
          Reset Data
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setConfirmAction("delete")} className="px-8 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold backdrop-blur-md hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all">
          Delete Student
        </motion.button>
      </div>
    </motion.div>
  );
}

// ----------------------------------------
// 2. MODAL KALENDER (PEMILIHAN ABSENSI)
// ----------------------------------------
export function ModalCalendarPicker({ data, closeModal }: { data: any; closeModal: () => void }) {
  const [activeTab, setActiveTab] = useState<"tahun" | "bulan" | "hari">("hari");
  
  const initialDateStr = data.currentDate || new Date().toISOString().split("T")[0]; 
  const initialDate = new Date(initialDateStr);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const allAttendanceData = useMemo(() => {
    const years = new Set<string>();
    const months = new Set<string>();
    const days = new Set<string>();

    if (data.students) {
      data.students.forEach((student: StudentData) => {
        student.attendedClasses?.Data?.forEach((att) => {
          if (att.tanggal) {
            days.add(att.tanggal); 
            months.add(att.tanggal.substring(0, 7)); 
            years.add(att.tanggal.substring(0, 4)); 
          }
        });
      });
    }
    return { years, months, days };
  }, [data.students]);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysList = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3, ease: "easeOut" }} 
      onClick={(e) => e.stopPropagation()} 
      className="w-full max-w-2xl max-h-[90vh] p-[1.5px] rounded-3xl bg-linear-to-br from-cyan-600/50 via-zinc-900/40 to-blue-500/50 shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] flex flex-col"
    >
      <div className="w-full h-full rounded-[calc(1.5rem-1.5px)] bg-[#09090b]/80 backdrop-blur-2xl p-6 relative flex flex-col overflow-hidden">
        
        <button onClick={closeModal} className="absolute top-5 right-5 text-zinc-400 hover:text-white font-bold transition-colors z-10 w-8 h-8 flex items-center justify-center rounded-full bg-zinc-800/50 hover:bg-zinc-700">✕</button>

        <div className="flex flex-col items-center mb-6 mt-2">
          <h2 className="text-2xl font-extrabold text-white text-center tracking-tight">Select Attendance Date</h2>
          <p className="text-cyan-400 font-medium text-sm mt-1">Filter your data accurately</p>
        </div>

        <div className="w-full flex p-1.5 rounded-full bg-zinc-800/40 backdrop-blur-xl border border-white/10 mb-6 shadow-inner relative z-10">
          {(["tahun", "bulan", "hari"] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className="relative flex-1 py-2 text-sm font-semibold capitalize rounded-full transition-colors z-10 text-white">
              {activeTab === tab && <motion.div layoutId="calendarTab" className="absolute inset-0 bg-white/20 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.1)] border border-white/20" transition={{ type: "spring", stiffness: 300, damping: 30 }} />}
              <span className="relative z-20 text-zinc-200 drop-shadow-sm">{tab}</span>
            </button>
          ))}
        </div>

        <div className="flex-1 w-full overflow-y-auto pr-2 custom-scrollbar relative z-0">
          <AnimatePresence mode="wait">
            {activeTab === "tahun" && (
              <motion.div key="view-tahun" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2 pb-4">
                {YEARS_LIST.map((year) => <CalendarItem key={year} label={year.toString()} isActive={allAttendanceData.years.has(year.toString())} isSelected={viewYear === year} onClick={() => { setViewYear(year); setActiveTab("bulan"); }} />)}
              </motion.div>
            )}
            
            {activeTab === "bulan" && (
              <motion.div key="view-bulan" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="grid grid-cols-3 sm:grid-cols-4 gap-4 p-2 pb-4">
                {MONTHS_LIST.map((m, idx) => {
                  const targetStr = `${viewYear}-${(idx + 1).toString().padStart(2, '0')}`;
                  return <CalendarItem key={m} label={m} isActive={allAttendanceData.months.has(targetStr)} isSelected={viewMonth === idx} onClick={() => { setViewMonth(idx); setActiveTab("hari"); }} />;
                })}
              </motion.div>
            )}

            {activeTab === "hari" && (
              <motion.div key="view-hari" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.2 }} className="p-2">
                <div className="flex justify-between items-center mb-4 px-2 text-zinc-400 font-medium"><span className="text-sm">Month: <span className="text-white">{MONTHS_LIST[viewMonth]} {viewYear}</span></span></div>
                <div className="grid grid-cols-5 sm:grid-cols-7 gap-3 pb-4">
                  {daysList.map((day) => {
                    const monthStr = (viewMonth + 1).toString().padStart(2, '0');
                    const dayStr = day.toString().padStart(2, '0');
                    const targetStr = `${viewYear}-${monthStr}-${dayStr}`;
                    
                    return (
                      <CalendarItem 
                        key={day} label={day.toString()} isActive={allAttendanceData.days.has(targetStr)} isSelected={data.currentDate === targetStr} isCircle={true} 
                        onClick={() => { if (data.onSelectDate) data.onSelectDate(targetStr); closeModal(); }} 
                      />
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ----------------------------------------
// 3. REUSABLE CALENDAR ITEM
// ----------------------------------------
interface CalendarItemProps {
  label: string;
  isActive: boolean;
  isSelected?: boolean;
  isCircle?: boolean; 
  onClick: () => void;
}

function CalendarItem({ label, isActive, isSelected, isCircle, onClick }: CalendarItemProps) {
  const baseStyle = "flex items-center justify-center font-bold transition-all cursor-pointer select-none backdrop-blur-md";
  const shapeStyle = isCircle ? "aspect-square rounded-full w-full max-w-[3.5rem] mx-auto text-lg" : "py-3 rounded-2xl text-base";
  const bgStyle = isActive ? "bg-emerald-500/20 text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.3)]" : "bg-zinc-800/30 text-zinc-400";
  const outlineStyle = isSelected ? "border-[3px] border-white/80 ring-2 ring-white/10 z-10 scale-105" : "border border-white/5 hover:border-white/20";

  return (
    <motion.button onClick={onClick} whileHover={{ scale: isSelected ? 1.15 : 1.1 }} whileTap={{ scale: 0.9 }} className={`${baseStyle} ${shapeStyle} ${bgStyle} ${outlineStyle}`}>
      {label}
    </motion.button>
  );
}


// ----------------------------------------
// 4. ADD CLASS MODAL (ISLAND DESIGN & SCHEDULE)
// ----------------------------------------

function InlineCalendarTimePicker({ onSave, onCancel }: { onSave: (date: string, time: string) => void, onCancel: () => void }) {
  const [activeTab, setActiveTab] = useState<"tahun" | "bulan" | "hari">("hari");
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("07:00");

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysList = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const handleConfirm = () => {
    if (!selectedDate) return alert("Pilih tanggal terlebih dahulu!");
    if (!selectedTime) return alert("Masukkan jam terlebih dahulu!");
    onSave(selectedDate, selectedTime);
  };

  return (
    <div className="w-full h-full flex flex-col rounded-3xl bg-zinc-900/60 backdrop-blur-2xl border border-emerald-500/30 p-[clamp(1rem,3vw,1.5rem)] shadow-2xl relative overflow-hidden">
      
      <div className="flex flex-col sm:flex-row justify-between items-center mb-[clamp(0.75rem,2vw,1.5rem)] gap-[clamp(0.5rem,2vw,1rem)] shrink-0">
        <h3 className="text-[clamp(1.25rem,4vw,1.5rem)] font-extrabold text-white">Select Date & Time</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <label className="text-emerald-400 font-bold text-[clamp(0.875rem,2vw,1rem)]">Time:</label>
          <input 
            type="time" 
            value={selectedTime} 
            onChange={(e) => setSelectedTime(e.target.value)}
            className="flex-1 sm:flex-none bg-zinc-800 border border-zinc-600 rounded-lg px-3 py-2 text-white outline-none focus:border-emerald-500 text-[clamp(0.875rem,2vw,1rem)]"
          />
        </div>
      </div>

      <div className="w-full flex p-1 rounded-full bg-zinc-800/40 border border-white/10 mb-4 shrink-0">
        {(["tahun", "bulan", "hari"] as const).map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-1 py-[clamp(0.4rem,2vw,0.6rem)] text-[clamp(0.75rem,2vw,0.875rem)] font-semibold capitalize rounded-full transition-all ${activeTab === tab ? "bg-white/20 text-white shadow-md" : "text-zinc-400"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative min-h-0 pb-2">
        <AnimatePresence mode="wait">
          {/* ... (Isi Tahun dan Bulan persis seperti kode sebelumnya) ... */}
          {activeTab === "tahun" && (
            <motion.div key="tahun" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-3 sm:grid-cols-4 gap-[clamp(0.25rem,1.5vw,0.75rem)] p-1">
              {YEARS_LIST.map((year) => (
                <button key={year} onClick={() => { setViewYear(year); setActiveTab("bulan"); }} className={`py-[clamp(0.5rem,2vw,0.75rem)] rounded-xl font-bold text-[clamp(0.875rem,2.5vw,1rem)] ${viewYear === year ? "bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500" : "bg-zinc-800/50 text-zinc-400 hover:border-white/20 border border-transparent"}`}>{year}</button>
              ))}
            </motion.div>
          )}
          {activeTab === "bulan" && (
            <motion.div key="bulan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-3 sm:grid-cols-4 gap-[clamp(0.25rem,1.5vw,0.75rem)] p-1">
              {MONTHS_LIST.map((m, idx) => (
                <button key={m} onClick={() => { setViewMonth(idx); setActiveTab("hari"); }} className={`py-[clamp(0.5rem,2vw,0.75rem)] rounded-xl font-bold text-[clamp(0.875rem,2.5vw,1rem)] ${viewMonth === idx ? "bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500" : "bg-zinc-800/50 text-zinc-400 hover:border-white/20 border border-transparent"}`}>{m}</button>
              ))}
            </motion.div>
          )}
          {activeTab === "hari" && (
            <motion.div key="hari" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-1">
              <div className="text-center text-zinc-400 font-medium mb-[clamp(0.5rem,2vw,0.75rem)] text-[clamp(0.875rem,2vw,1rem)]">Month: <span className="text-white">{MONTHS_LIST[viewMonth]} {viewYear}</span></div>
              <div className="grid grid-cols-7 gap-[clamp(0.2rem,1vw,0.5rem)]">
                {daysList.map((day) => {
                  const targetStr = `${viewYear}-${(viewMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                  return (
                    <button 
                      key={day} 
                      onClick={() => setSelectedDate(targetStr)} 
                      className={`aspect-square w-full max-w-[3.5rem] flex mx-auto items-center justify-center rounded-full font-bold text-[clamp(0.875rem,2.5vw,1rem)] transition-all ${selectedDate === targetStr ? "bg-emerald-500 text-white scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)]" : "bg-zinc-800/50 text-zinc-400 hover:bg-zinc-700 hover:text-white"}`}>
                      {day}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-[clamp(0.5rem,2vw,0.75rem)] mt-4 pt-4 border-t border-white/10 shrink-0">
        <button onClick={onCancel} className="w-full sm:w-auto px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.5rem,2vw,0.75rem)] rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all text-[clamp(0.875rem,2vw,1rem)]">Cancel</button>
        <button onClick={handleConfirm} className="w-full sm:w-auto px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.5rem,2vw,0.75rem)] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] text-[clamp(0.875rem,2vw,1rem)]">Confirm</button>
      </div>
    </div>
  );
}

export function ModalAddClass({ data, closeModal }: { data: any; closeModal: () => void }) {
  const isEdit = data.isEdit || false;

  const [className, setClassName] = useState(data.oldClassName || "");
  
  // Jika mode edit, populate students yang terdaftar di kelas ini
  const initialSelected = data.students.filter((s: StudentData) => 
    isEdit && s.kelas === data.oldClassName
  );
  // Siswa lainnya berada di list Available
  const initialAvailable = data.students.filter((s: StudentData) => 
    !initialSelected.some(sel => sel.id === s.id)
  );

  const [availableStudents, setAvailableStudents] = useState<StudentData[]>(initialAvailable);
  const [selectedStudents, setSelectedStudents] = useState<StudentData[]>(initialSelected);
  
  const [activeTab, setActiveTab] = useState<"roster" | "schedule">("roster");
  // Set default schedule dengan data dari parent jika ada
  const [schedules, setSchedules] = useState<{date: string, time: string}[]>(data.initialSchedules || []);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);

  const handleDragStart = (e: React.DragEvent, studentId: string, source: "available" | "selected") => {
    e.dataTransfer.setData("studentId", studentId);
    e.dataTransfer.setData("source", source);
  };

  const handleDrop = (e: React.DragEvent, target: "available" | "selected") => {
    e.preventDefault();
    const studentId = e.dataTransfer.getData("studentId");
    const source = e.dataTransfer.getData("source");
    if (source === target) return;
    if (target === "selected") {
      const student = availableStudents.find((s) => s.id === studentId);
      if (student) {
        setAvailableStudents((prev) => prev.filter((s) => s.id !== studentId));
        setSelectedStudents((prev) => [...prev, student]);
      }
    } else {
      const student = selectedStudents.find((s) => s.id === studentId);
      if (student) {
        setSelectedStudents((prev) => prev.filter((s) => s.id !== studentId));
        setAvailableStudents((prev) => [...prev, student]);
      }
    }
  };

  const addSchedule = (date: string, time: string) => {
    const newSchedules = [...schedules, { date, time }];
    newSchedules.sort((a, b) => new Date(`${a.date}T${a.time}`).getTime() - new Date(`${b.date}T${b.time}`).getTime());
    setSchedules(newSchedules);
    setIsAddingSchedule(false);
  };
  const removeSchedule = (idxToRemove: number) => {
    setSchedules(schedules.filter((_, idx) => idx !== idxToRemove));
  };

  const handleSave = () => {
    if (!className.trim()) return alert("Class name cannot be empty!");
    const selectedIds = selectedStudents.map((s) => s.id);
    
    // Kirim informasi `oldClassName` agar fungsi tau harus update kelas yang lama atau buat baru
    if (data.onSave) data.onSave(data.oldClassName, className, selectedIds, schedules); 
    closeModal();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col gap-[clamp(0.5rem,2vw,1.5rem)] relative p-[clamp(0.5rem,2vw,1rem)] bg-zinc-950/40 rounded-[2rem] border border-white/5"
    >
      
      {/* 1. HEADER ISLAND */}
      <div className="w-full shrink-0 rounded-[clamp(1rem,3vw,1.5rem)] bg-zinc-900/60 backdrop-blur-2xl border border-white/10 p-[clamp(1rem,3vw,1.5rem)] shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-[clamp(0.5rem,2vw,1rem)]">
        <h2 className="text-[clamp(1.25rem,4vw,2rem)] font-extrabold text-white tracking-tight drop-shadow-md text-center">
          {isEdit ? "Edit Class Info" : "Create New Class"}
        </h2>
        <input
          type="text" placeholder="Class Name (e.g. 10A)"
          value={className} onChange={(e) => setClassName(e.target.value)}
          className="w-full sm:w-auto sm:min-w-[250px] bg-zinc-950/80 border-2 border-emerald-500/30 text-emerald-300 placeholder:text-zinc-600 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.5rem,2vw,0.75rem)] rounded-xl focus:outline-none focus:border-emerald-500 transition-colors shadow-inner text-center font-bold text-[clamp(0.875rem,2.5vw,1.125rem)]"
        />
      </div>

      {/* 2. BODY ISLAND(S) */}
      <div className="flex-1 min-h-0 w-full flex flex-col">
        {activeTab === "roster" ? (
          <div className="flex-1 flex flex-col sm:flex-row gap-[clamp(0.75rem,2vw,1.5rem)] min-h-0">
            {/* LEFT ISLAND */}
            <div 
              className="flex-1 flex flex-col rounded-[clamp(1rem,3vw,1.5rem)] bg-zinc-900/60 backdrop-blur-2xl border border-emerald-500/30 overflow-hidden shadow-2xl min-h-0"
              onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "selected")}
            >
              <div className="bg-emerald-500/10 p-[clamp(0.75rem,2vw,1rem)] border-b border-emerald-500/30 text-center shrink-0">
                <h3 className="text-emerald-400 font-bold tracking-widest text-[clamp(0.75rem,1.5vw,0.875rem)]">
                  {isEdit ? "EDIT ROSTER" : "CLASS ROSTER"} ({selectedStudents.length})
                </h3>
                <p className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-zinc-400 mt-1">Drag students here to add</p>
              </div>
              <div className="flex-1 p-[clamp(0.5rem,2vw,1rem)] overflow-y-auto custom-scrollbar flex flex-col gap-2 relative min-h-0">
                {selectedStudents.map(student => (
                  <div key={student.id} draggable onDragStart={(e) => handleDragStart(e, student.id, "selected")} className="p-[clamp(0.75rem,2vw,1rem)] rounded-xl bg-zinc-800/80 border border-zinc-600 cursor-grab active:cursor-grabbing hover:bg-zinc-700 transition-colors flex justify-between items-center shadow-lg">
                    <span className="font-bold text-white text-[clamp(0.875rem,2vw,1rem)]">{student.name}</span>
                    <span className="text-[clamp(0.65rem,1.5vw,0.75rem)] text-zinc-400 font-mono">{student.id}</span>
                  </div>
                ))}
                {selectedStudents.length === 0 && <div className="absolute inset-0 flex items-center justify-center text-zinc-500 italic text-[clamp(0.875rem,2vw,1rem)]">Empty Roster</div>}
              </div>
            </div>

            {/* RIGHT ISLAND */}
            <div 
              className="flex-1 flex flex-col rounded-[clamp(1rem,3vw,1.5rem)] bg-zinc-900/60 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl min-h-0"
              onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, "available")}
            >
              <div className="bg-zinc-800/50 p-[clamp(0.75rem,2vw,1rem)] border-b border-white/10 text-center shrink-0">
                <h3 className="text-zinc-300 font-bold tracking-widest text-[clamp(0.75rem,1.5vw,0.875rem)]">AVAILABLE STUDENTS</h3>
                <p className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-zinc-500 mt-1">Drag students left to assign</p>
              </div>
              <div className="flex-1 p-[clamp(0.5rem,2vw,1rem)] overflow-y-auto custom-scrollbar flex flex-col gap-2 min-h-0">
                {availableStudents.map(student => (
                  <div key={student.id} draggable onDragStart={(e) => handleDragStart(e, student.id, "available")} className="p-[clamp(0.75rem,2vw,1rem)] rounded-xl bg-zinc-800/40 border border-zinc-700/50 cursor-grab active:cursor-grabbing hover:bg-zinc-700 transition-colors flex justify-between items-center shadow-md">
                    <div>
                      <span className="font-bold text-zinc-200 block text-[clamp(0.875rem,2vw,1rem)]">{student.name}</span>
                      <span className="text-[clamp(0.65rem,1.5vw,0.75rem)] text-zinc-500 block">Current Class: {student.kelas || "None"}</span>
                    </div>
                    <span className="text-[clamp(0.65rem,1.5vw,0.75rem)] text-zinc-600 font-mono">{student.id}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center min-h-0">
             {isAddingSchedule ? (
               <InlineCalendarTimePicker onSave={addSchedule} onCancel={() => setIsAddingSchedule(false)} />
             ) : (
               <div className="w-full h-full flex flex-col rounded-[clamp(1rem,3vw,1.5rem)] bg-zinc-900/60 backdrop-blur-2xl border border-blue-500/30 p-[clamp(1rem,3vw,1.5rem)] shadow-2xl overflow-hidden min-h-0">
                 <div className="flex flex-col sm:flex-row justify-between items-center mb-[clamp(0.75rem,2vw,1.5rem)] gap-[clamp(0.5rem,2vw,1rem)] shrink-0">
                    <h3 className="text-[clamp(1.125rem,3vw,1.5rem)] font-extrabold text-blue-400">Class Schedule</h3>
                    <button onClick={() => setIsAddingSchedule(true)} className="w-full sm:w-auto px-[clamp(1rem,3vw,1.25rem)] py-[clamp(0.5rem,2vw,0.75rem)] rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-bold border border-blue-500/50 transition-all text-[clamp(0.875rem,2vw,1rem)]">
                      + ADD SCHEDULE
                    </button>
                 </div>
                 
                 <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-[clamp(0.5rem,1.5vw,1rem)] min-h-0">
                   {schedules.map((sched, idx) => (
                     <div key={idx} className="flex justify-between items-center p-[clamp(0.75rem,2vw,1.25rem)] rounded-2xl bg-zinc-800/80 border border-zinc-700 shadow-md">
                       <div className="flex flex-col">
                         <span className="text-white font-extrabold text-[clamp(1rem,2.5vw,1.125rem)]">{sched.time}</span>
                         <span className="text-zinc-400 font-medium text-[clamp(0.75rem,2vw,0.875rem)]">{sched.date}</span>
                       </div>
                       <button onClick={() => removeSchedule(idx)} className="w-[clamp(2rem,6vw,2.5rem)] aspect-square rounded-full flex items-center justify-center text-zinc-500 hover:bg-red-500/20 hover:text-red-400 transition-all font-bold text-[clamp(1rem,3vw,1.25rem)]">
                         ✕
                       </button>
                     </div>
                   ))}
                   {schedules.length === 0 && (
                     <div className="m-auto flex flex-col items-center gap-2 text-zinc-500 italic text-[clamp(0.875rem,2vw,1rem)]">
                        <span className="text-[clamp(2rem,6vw,3rem)]">📅</span>
                        Belum ada jadwal.
                     </div>
                   )}
                 </div>
               </div>
             )}
          </div>
        )}
      </div>

      {/* 3. BOTTOM ACTION ISLAND */}
      <div className="shrink-0 w-full rounded-[clamp(1rem,3vw,1.5rem)] bg-zinc-900/60 backdrop-blur-2xl border border-white/10 p-[clamp(0.75rem,3vw,1.25rem)] shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-[clamp(0.75rem,2vw,1rem)]">
        <button onClick={closeModal} className="w-full sm:w-auto px-[clamp(1rem,4vw,2rem)] py-[clamp(0.75rem,2vw,1rem)] rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 font-bold transition-all text-[clamp(0.875rem,2.5vw,1rem)] border border-transparent hover:border-zinc-700">
          Cancel
        </button>
        
        <div className="flex flex-col sm:flex-row gap-[clamp(0.5rem,2vw,1rem)] w-full sm:w-auto">
          <button onClick={() => setActiveTab(activeTab === "roster" ? "schedule" : "roster")} className="w-full sm:w-auto px-[clamp(1rem,3vw,2rem)] py-[clamp(0.75rem,2vw,1rem)] rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold transition-all border border-blue-500/30 text-[clamp(0.875rem,2.5vw,1rem)]">
            {activeTab === "roster" ? "Insert Schedule" : "Back to Roster"}
          </button>
          
          <button onClick={handleSave} className="w-full sm:w-auto px-[clamp(1.25rem,4vw,2.5rem)] py-[clamp(0.75rem,2vw,1rem)] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] tracking-widest text-[clamp(0.875rem,2.5vw,1rem)]">
            {isEdit ? "SAVE CHANGES" : "CREATE CLASS"}
          </button>
        </div>
      </div>

    </motion.div>
  );
}