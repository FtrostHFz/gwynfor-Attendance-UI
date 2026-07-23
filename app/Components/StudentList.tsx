"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CardSiswa, { Hover3DCard } from "./Card";
import { useStore, StudentData } from "./Variables";

// ==========================================
// MODAL: ADD STUDENT (ISLAND DESIGN)
// ==========================================
export function ModalAddStudent({ closeModal }: { closeModal: () => void }) {
  const { classesConfig, addStudent } = useStore();
  const [scannedCard, setScannedCard] = useState<string | null>(null);
  const [studentName, setStudentName] = useState("");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [notifications, setNotifications] = useState<{id: string, text: string}[]>([]);

  const handleAdd = () => {
    if (!scannedCard) return;
    if (!studentName.trim()) return alert("Please enter the student's name!");

    const newStudent: StudentData = {
      id: scannedCard,
      name: studentName,
      kelas: selectedClass,
      attendedClasses: { Data: [] },
      latestAttendance: []
    };

    addStudent(newStudent);
    setNotifications(prev => [{ id: Date.now().toString(), text: `✅ Added ${studentName} (${scannedCard}) to ${selectedClass || "Unassigned"}` }, ...prev]);

    // Reset Form & Kembalikan ke State Waiting (Kelas tetap tersimpan)
    setScannedCard(null);
    setStudentName("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-6xl h-[95vh] sm:h-[85vh] flex flex-col md:flex-row gap-[clamp(1rem,3vw,2rem)] p-[clamp(1rem,3vw,1.5rem)] rounded-[clamp(1.5rem,4vw,2.5rem)] bg-zinc-950/80 backdrop-blur-2xl border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.8)] overflow-hidden relative"
    >
      {/* 1. KIRI / ATAS: ISLAND GLASSMORPH (WAITING CARD / CARD DETECTED) */}
      <div className="w-full md:w-1/2 lg:w-[55%] h-[35vh] md:h-full flex items-center justify-center relative rounded-[clamp(1rem,4vw,2rem)] overflow-hidden bg-zinc-900/40 border border-white/5 shadow-inner shrink-0">
        <AnimatePresence mode="wait">
          {!scannedCard ? (
            <motion.div
              key="waiting-island"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }} transition={{ duration: 0.5 }}
              className="relative flex flex-col items-center justify-center w-[clamp(15rem,40vw,25rem)] aspect-square rounded-full bg-linear-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-3xl border border-white/10"
            >
              {/* Efek Denyut Nyala (Pulsing Island Glow) */}
              <motion.div 
                animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.7, 0.3], boxShadow: ["0 0 20px rgba(52,211,153,0.2)", "0 0 60px rgba(52,211,153,0.6)", "0 0 20px rgba(52,211,153,0.2)"] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full border border-emerald-400/30"
              />
              
              <div className="z-10 flex flex-col items-center gap-4 text-center">
                <div className="w-[clamp(3rem,6vw,4rem)] aspect-square bg-emerald-500/20 rounded-full flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(52,211,153,0.5)]">
                  <span className="text-emerald-400 text-[clamp(1.5rem,3vw,2rem)] animate-pulse">📡</span>
                </div>
                <h3 className="text-white font-extrabold tracking-widest text-[clamp(1rem,2vw,1.5rem)] drop-shadow-md">WAITING FOR CARD</h3>
                <p className="text-zinc-400 text-[clamp(0.75rem,1.5vw,0.875rem)] px-4">Please tap the NFC card on the scanner to register a new student.</p>
              </div>

              {/* DEMO BUTTON (Aman dihapus) */}
              <div className="absolute bottom-[10%] z-20 demo-button-wrapper">
                <button onClick={() => setScannedCard(`FA:${Math.floor(Math.random()*90+10)}:B${Math.floor(Math.random()*9)}:11:A9:0${Math.floor(Math.random()*9)}`)} className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-500 hover:text-zinc-300 text-xs font-mono transition-colors">
                   Simulate Scan
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="detected-card"
              initial={{ opacity: 0, scale: 0.8, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8 }} transition={{ duration: 0.5, type: "spring" }}
              className="w-full max-w-[clamp(15rem,35vw,22rem)]"
            >
              <Hover3DCard maxTilt={15} className="w-full aspect-3/4 rounded-3xl bg-zinc-900/80 backdrop-blur-2xl border-2 border-emerald-500/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] flex flex-col p-[clamp(1rem,3vw,2rem)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10" />
                <h4 className="text-emerald-400 font-bold tracking-widest text-[clamp(0.75rem,1.5vw,1rem)] uppercase mb-2">Card Detected</h4>
                
                {/* Image Placeholder */}
                <div className="flex-1 w-full bg-zinc-950/80 border-2 border-dashed border-zinc-700/50 rounded-2xl flex items-center justify-center mb-[clamp(1rem,2vw,1.5rem)] overflow-hidden shadow-inner relative">
                   <span className="text-zinc-600 font-bold tracking-widest text-[clamp(0.7rem,1.5vw,0.875rem)] z-10 text-center px-4">IMG PLACEHOLDER</span>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 text-[clamp(0.65rem,1.2vw,0.75rem)] uppercase font-bold tracking-widest">NFC UUID</span>
                  <span className="text-white font-mono text-[clamp(1rem,2.5vw,1.5rem)] font-extrabold tracking-wider">{scannedCard}</span>
                </div>
              </Hover3DCard>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 2. KANAN / BAWAH: INPUT, TAB KELAS, TOMBOL, NOTIFIKASI */}
      <div className="flex-1 h-full flex flex-col min-h-0">
        <div className="flex justify-between items-center mb-[clamp(1rem,2vw,1.5rem)] shrink-0">
           <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-extrabold text-white tracking-tight">Register Student</h2>
        </div>

        <div className="flex flex-col gap-[clamp(1rem,2vw,1.5rem)] flex-1 min-h-0">
          {/* Input Nama */}
          <div className="flex flex-col gap-2 shrink-0">
            <label className="text-zinc-400 text-[clamp(0.75rem,1.5vw,0.875rem)] font-bold uppercase tracking-widest pl-1">Student Name</label>
            <input 
              type="text" placeholder="e.g. John Doe" value={studentName} onChange={(e) => setStudentName(e.target.value)} 
              className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/10 text-white placeholder:text-zinc-600 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)] rounded-xl focus:outline-none focus:border-emerald-500 focus:shadow-[0_0_15px_rgba(52,211,153,0.2)] transition-all font-medium text-[clamp(1rem,2vw,1.125rem)]" 
            />
          </div>

          {/* List Kelas (Scrollable 3D Cards) */}
          <div className="flex flex-col gap-2 flex-1 min-h-0">
            <label className="text-zinc-400 text-[clamp(0.75rem,1.5vw,0.875rem)] font-bold uppercase tracking-widest pl-1">Assign Class (Optional)</label>
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2 rounded-xl border border-transparent flex flex-col gap-3 min-h-30">
               {classesConfig.length > 0 ? classesConfig.map((cls) => {
                 const isSelected = selectedClass === cls.className;
                 return (
                   <Hover3DCard key={cls.className} maxTilt={5} onClick={() => setSelectedClass(isSelected ? "" : cls.className)} className={`w-full rounded-2xl cursor-pointer border transition-colors duration-300 ${isSelected ? 'bg-emerald-500/10 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-zinc-900/60 border-white/10 hover:border-white/30'}`}>
                      <div className="px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.75rem,2vw,1rem)] flex justify-between items-center relative z-10">
                        <span className={`font-extrabold text-[clamp(1rem,2vw,1.25rem)] ${isSelected ? 'text-emerald-400 drop-shadow-md' : 'text-white'}`}>{cls.className}</span>
                        <div className={`w-[clamp(1.5rem,3vw,2rem)] h-[clamp(1.5rem,3vw,2rem)] rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-600 bg-transparent'}`}>
                           {isSelected && <svg className="w-[clamp(0.75rem,1.5vw,1rem)] h-[clamp(0.75rem,1.5vw,1rem)] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                        </div>
                      </div>
                   </Hover3DCard>
                 )
               }) : (
                 <div className="p-4 text-center text-zinc-500 italic bg-zinc-900/50 rounded-xl border border-zinc-800">No classes available</div>
               )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-[clamp(0.5rem,1.5vw,1rem)] pt-4 border-t border-white/10 shrink-0">
             <button onClick={closeModal} className="flex-1 py-[clamp(0.75rem,2vw,1rem)] rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all text-[clamp(0.875rem,1.5vw,1rem)]">Close</button>
             <button 
                onClick={handleAdd} 
                disabled={!scannedCard} 
                className={`flex-2 py-[clamp(0.75rem,2vw,1rem)] rounded-xl font-extrabold tracking-widest uppercase transition-all duration-300 text-[clamp(0.875rem,1.5vw,1rem)] ${scannedCard ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'bg-zinc-900 border border-zinc-800 text-zinc-600 cursor-not-allowed'}`}
             >
                {scannedCard ? "Save Student" : "Awaiting Card..."}
             </button>
          </div>

          {/* Notification Area */}
          <div className="h-[clamp(3rem,8vw,5rem)] overflow-y-auto custom-scrollbar flex flex-col gap-2 shrink-0 px-2 rounded-lg bg-black/20 p-2 border border-white/5 shadow-inner">
             <AnimatePresence>
                {notifications.map((notif) => (
                   <motion.div key={notif.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="text-[clamp(0.7rem,1.5vw,0.85rem)] text-emerald-400 font-medium">
                     {notif.text}
                   </motion.div>
                ))}
                {notifications.length === 0 && (
                   <div className="text-[clamp(0.7rem,1.5vw,0.85rem)] text-zinc-600 italic">No recent additions.</div>
                )}
             </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// MODAL: PROFIL SISWA
// ==========================================
export function ModalProfilSiswa({ data, closeModal }: { data: any; closeModal: () => void }) {
  const { students, classesConfig, updateStudentName, resetStudentData, deleteStudent } = useStore();
  
  const student = students.find((s) => s.id === data.id) || (data as StudentData);
  const classConfig = classesConfig.find(c => c.className === student.kelas);
  const classSchedules = classConfig?.schedules || [];
  const attendedData = student.attendedClasses?.Data || [];
  
  const [confirmAction, setConfirmAction] = useState<"edit" | "delete" | "reset" | null>(null);
  const [editName, setEditName] = useState(student.name);

  const matchedAttendancesOnTime = classSchedules.filter(sched => 
    attendedData.some(a => a.tanggal === sched.date && a.jam === sched.time && a.status !== "terlambat")
  ).length;
  const totalSchedules = classSchedules.length;
  const percentage = totalSchedules > 0 ? Math.round((matchedAttendancesOnTime / totalSchedules) * 100) : 0;

  const groupedSchedules = classSchedules.reduce((acc, sched) => {
    if (!acc[sched.date]) acc[sched.date] = [];
    acc[sched.date].push(sched.time);
    return acc;
  }, {} as Record<string, string[]>);

  const handleConfirm = () => {
    if (confirmAction === "edit") updateStudentName(student.id, editName);
    else if (confirmAction === "reset") resetStudentData(student.id);
    else if (confirmAction === "delete") {
      deleteStudent(student.id);
      closeModal();
    }
    setConfirmAction(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 30 }} transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={(e) => e.stopPropagation()}
      className="w-full max-w-5xl h-[90vh] flex flex-col items-center justify-between p-4 overflow-y-auto custom-scrollbar relative"
    >
      <button onClick={closeModal} className="absolute top-0 right-0 text-zinc-400 hover:text-white font-bold transition-colors z-50 w-10 h-10 flex items-center justify-center rounded-full bg-zinc-800/80 backdrop-blur-md hover:bg-zinc-700 shadow-lg">✕</button>

      <div className="w-full flex justify-between items-start gap-8 mt-4">
        <Hover3DCard maxTilt={10} className="rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-[0_15px_30px_rgba(0,0,0,0.5)] p-8 min-w-75">
          <div className="flex flex-col gap-2 relative z-10">
            <h2 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">{student.name}</h2>
            <div className="flex items-center gap-3 mt-2">
              <span className="px-3 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 font-bold tracking-widest">{student.kelas || "No Class"}</span>
              <span className="text-zinc-400 font-mono text-sm tracking-widest">ID: {student.id}</span>
            </div>
          </div>
        </Hover3DCard>

        <Hover3DCard maxTilt={10} className="rounded-[2.5rem] bg-zinc-900/60 backdrop-blur-xl border border-white/20 shadow-[0_15px_30px_rgba(0,0,0,0.5)] w-112.5 h-70 flex items-center justify-center">
          <div className="relative z-10 text-zinc-600 font-bold tracking-widest uppercase border-2 border-dashed border-zinc-700/50 p-6 rounded-2xl">
            Insert Physical ID Image
          </div>
        </Hover3DCard>
      </div>

      <div className="w-full flex flex-wrap justify-center gap-4 my-8 px-4">
        {Object.keys(groupedSchedules).length > 0 ? (
          Object.entries(groupedSchedules).map(([date, times], idx) => {
            let onTimeCount = 0;
            let lateCount = 0;

            const timeNodes = times.map((time, i) => {
              const att = attendedData.find(a => a.tanggal === date && a.jam === time);
              let boxState = 'empty';
              
              if (att) {
                if (att.status === "terlambat") { boxState = 'late'; lateCount++; } 
                else { boxState = 'onTime'; onTimeCount++; }
              }

              const style = boxState === 'onTime'
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[inset_0_0_8px_rgba(16,185,129,0.4),0_0_10px_rgba(16,185,129,0.2)]'
                : boxState === 'late'
                ? 'bg-red-500/20 border-red-500/50 text-red-300 shadow-[inset_0_0_8px_rgba(239,68,68,0.4),0_0_10px_rgba(239,68,68,0.2)]'
                : 'bg-zinc-900/50 border-zinc-700/50 text-zinc-500';

              return (
                <div key={i} className={`w-full py-1.5 px-3 rounded-lg backdrop-blur-md border text-center text-xs font-bold transition-all ${style}`}>
                  {time}
                </div>
              );
            });

            let cardState = 'empty';
            if (lateCount > 0) cardState = (lateCount === times.length) ? 'red' : 'yellow';
            else if (onTimeCount > 0) cardState = (onTimeCount === times.length) ? 'green' : 'yellow';

            const cardStyle = cardState === 'green'
              ? 'bg-emerald-500/10 border-emerald-500/40 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
              : cardState === 'yellow'
              ? 'bg-yellow-500/10 border-yellow-500/40 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
              : cardState === 'red'
              ? 'bg-red-500/10 border-red-500/40 shadow-[0_0_15px_rgba(239,68,68,0.2)]'
              : 'bg-zinc-800/40 border-zinc-700/50 shadow-inner';

            const titleStyle = cardState === 'green' ? 'text-emerald-400' : cardState === 'yellow' ? 'text-yellow-400' : cardState === 'red' ? 'text-red-400' : 'text-zinc-500';

            return (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} key={idx} 
                className={`flex flex-col items-center justify-start p-4 min-w-30 rounded-2xl border transition-all ${cardStyle}`}
              >
                <span className={`text-sm font-bold tracking-wider mb-3 ${titleStyle}`}>{date}</span>
                <div className="flex flex-col gap-2 w-full">
                  {timeNodes}
                </div>
              </motion.div>
            )
          })
        ) : (
          <div className="text-zinc-500 italic font-medium py-10 px-6 border-2 border-dashed border-zinc-800 rounded-2xl bg-zinc-900/40">
            No class schedule available to track.
          </div>
        )}
      </div>

      <div className="w-full max-w-2xl flex flex-col gap-3 mb-8">
        <div className="relative w-full h-8 bg-zinc-900/60 rounded-full overflow-hidden border border-white/10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.6)] backdrop-blur-md">
          <div className="absolute top-0 left-0 h-full transition-all duration-1000 ease-out" style={{ width: `${percentage}%` }}>
            <div className="absolute inset-0 bg-emerald-600 rounded-r-full overflow-hidden shadow-[inset_0_0_15px_rgba(16,185,129,0.8)]">
              <svg className="absolute top-0 left-0 w-[200%] h-full opacity-40 mix-blend-overlay" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,30 Q12.5,0 25,30 T50,30 T75,30 T100,30 L100,100 L0,100 Z" fill="#ffffff"><animateTransform attributeName="transform" type="translate" from="0 0" to="-50 0" dur="2s" repeatCount="indefinite" /></path>
              </svg>
              <svg className="absolute top-0 left-0 w-[200%] h-full opacity-30 mix-blend-overlay" preserveAspectRatio="none" viewBox="0 0 100 100">
                <path d="M0,50 Q12.5,20 25,50 T50,50 T75,50 T100,50 L100,100 L0,100 Z" fill="#ffffff"><animateTransform attributeName="transform" type="translate" from="-50 0" to="0 0" dur="3s" repeatCount="indefinite" /></path>
              </svg>
            </div>
          </div>
        </div>
        <div className="text-center font-extrabold text-emerald-400 tracking-widest text-lg drop-shadow-[0_0_10px_rgba(52,211,153,0.5)]">{percentage}% ON-TIME ATTENDANCE</div>
      </div>

      <div className="relative w-full flex justify-center gap-6 mt-auto pb-4">
        <AnimatePresence>
          {confirmAction && (
            <motion.div initial={{ opacity: 0, y: 20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.9 }} className="absolute bottom-[110%] w-80 p-5 rounded-2xl bg-zinc-900/90 backdrop-blur-2xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex flex-col items-center gap-4 z-50">
              <h3 className="text-white font-bold capitalize">Confirm {confirmAction}</h3>
              {confirmAction === "edit" && <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="w-full bg-zinc-800 border border-zinc-600 rounded-lg px-4 py-2 text-white outline-none focus:border-emerald-500 transition-colors" />}
              {confirmAction === "delete" && <p className="text-sm text-red-400 text-center">Are you sure you want to delete this student permanently?</p>}
              {confirmAction === "reset" && <p className="text-sm text-amber-400 text-center">Are you sure you want to wipe all attendance data?</p>}
              <div className="flex gap-3 w-full">
                <button onClick={() => setConfirmAction(null)} className="flex-1 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-all">Cancel</button>
                <button onClick={handleConfirm} className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]">Confirm</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setConfirmAction("edit")} className="px-8 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 font-bold backdrop-blur-md hover:bg-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all">Edit Name</motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setConfirmAction("reset")} className="px-8 py-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold backdrop-blur-md hover:bg-amber-500/20 hover:border-amber-500/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all">Reset Data</motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setConfirmAction("delete")} className="px-8 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 font-bold backdrop-blur-md hover:bg-red-500/20 hover:border-red-500/50 hover:shadow-[0_0_20px_rgba(239,68,68,0.3)] transition-all">Delete Student</motion.button>
      </div>
    </motion.div>
  );
}

// ==========================================
// STUDENT LIST MAIN COMPONENT
// ==========================================
interface StudentListProps {
  openModal: (data: any) => void;
}

export default function StudentList({ openModal }: StudentListProps) {
  const students = useStore((state) => state.students);
  const classesConfig = useStore((state) => state.classesConfig); 
  const [searchQuery, setSearchQuery] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, students]);

  const groupedStudents = useMemo(() => {
    const groups: Record<string, StudentData[]> = {};
    const unassigned: StudentData[] = [];

    filteredStudents.forEach(student => {
      if (!student.kelas || student.kelas.trim() === "") {
        unassigned.push(student);
      } else {
        if (!groups[student.kelas]) groups[student.kelas] = [];
        groups[student.kelas].push(student);
      }
    });

    return { groups, unassigned };
  }, [filteredStudents]);

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-zinc-800/80 gap-4">
        <h3 className="text-[clamp(1.4rem,5vw,2.4rem)] font-semibold text-white">Student Roster</h3>
        
        <input 
          type="text" placeholder="Search name or ID..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-zinc-800 text-zinc-400 placeholder:text-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl px-4 py-2 text-sm w-full sm:w-auto grow max-w-md transition-all" 
        />

        <div className="flex gap-2 w-full sm:w-auto">
          {/* Tombol Add Student diarahkan untuk membuka modal add_student */}
          <button onClick={() => openModal({ modalType: "add_student" })} className="px-5 py-2 w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/5">+ Add Student</button>
        </div>
      </div>

      <div className="w-full h-full flex flex-col gap-8">
        {Object.keys(groupedStudents.groups).length > 0 || groupedStudents.unassigned.length > 0 ? (
          <>
            {Object.entries(groupedStudents.groups).sort(([a], [b]) => a.localeCompare(b)).map(([kelas, studentGroup]) => {
              const classConfig = classesConfig.find(c => c.className === kelas);
              const classSchedules = classConfig?.schedules || [];

              return (
                <div key={kelas} className="w-full p-6 rounded-4xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex flex-col gap-6">
                  <div className="w-max px-5 py-2 rounded-xl bg-zinc-800/80 backdrop-blur-md border border-zinc-700/80 shadow-inner">
                    <h4 className="text-zinc-300 font-bold tracking-widest text-sm uppercase">Class: <span className="text-emerald-400 ml-1">{kelas}</span></h4>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-max">
                    {studentGroup.map((siswa) => (
                      <CardSiswa 
                        key={siswa.id} 
                        name={siswa.name} 
                        id={siswa.id} 
                        kelas={siswa.kelas} 
                        classSchedules={classSchedules}
                        attendedData={siswa.attendedClasses.Data}
                        onClick={() => openModal({ modalType: 1, ...siswa })} 
                      />
                    ))}
                  </div>
                </div>
              );
            })}
            
            {groupedStudents.unassigned.length > 0 && (
              <div className="w-full p-6 rounded-4xl bg-zinc-900/40 backdrop-blur-xl border border-red-500/20 shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex flex-col gap-6">
                 <div className="w-max px-5 py-2 rounded-xl bg-red-950/40 backdrop-blur-md border border-red-900/50 shadow-inner">
                    <h4 className="text-red-400 font-bold tracking-widest text-sm uppercase">Unassigned (No Class)</h4>
                 </div>
                 
                 <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-max">
                    {groupedStudents.unassigned.map((siswa) => (
                      <CardSiswa 
                        key={siswa.id} 
                        name={siswa.name} 
                        id={siswa.id} 
                        kelas={siswa.kelas} 
                        classSchedules={[]} 
                        attendedData={siswa.attendedClasses.Data} 
                        onClick={() => openModal({ modalType: 1, ...siswa })} 
                      />
                    ))}
                  </div>
              </div>
            )}
          </>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50"><span className="text-2xl">🔍</span></div>
            <h4 className="text-zinc-300 font-medium text-lg">Couldn't find any students</h4>
          </div>
        )}
      </div>
    </div>
  );
}