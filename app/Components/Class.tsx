"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hover3DCard } from "./Card";
import { useStore, StudentData, ClassScheduleData } from "./Variables";

const MONTHS_LIST = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]; 
const CURRENT_YEAR = new Date().getFullYear();
const YEARS_LIST = Array.from({ length: 21 }, (_, i) => CURRENT_YEAR - 10 + i);

// kalender buat nentuin from - to absensi
function InlineCalendarTimePicker({ onSave, onCancel }: { onSave: (date: string, timeFrom: string, timeTo: string) => void, onCancel: () => void }) {
  const [activeTab, setActiveTab] = useState<"tahun" | "bulan" | "hari">("hari");
  
  const today = new Date(); 
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTimeFrom, setSelectedTimeFrom] = useState<string>("07:00");
  const [selectedTimeTo, setSelectedTimeTo] = useState<string>("07:30");

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysList = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  const emptySlots = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  // fungsi alert custom dari store
  const showAlert = useStore((state) => state.showAlert);

  const handleConfirm = () => {
    if (!selectedDate) return showAlert("Select a date first!");
    if (!selectedTimeFrom) return showAlert("Enter FROM time!");
    if (!selectedTimeTo) return showAlert("Enter TO time!");
    
    // validasi bentrok to > from
    if (selectedTimeFrom > selectedTimeTo) return showAlert("FROM can not be greater than TO!");
    
    onSave(selectedDate, selectedTimeFrom, selectedTimeTo);
  };

  return (
    <div className="w-full h-full flex flex-col rounded-3xl bg-zinc-900/60 backdrop-blur-2xl border border-emerald-500/30 p-[clamp(0.8rem,2vw,1.2rem)] shadow-2xl relative overflow-hidden">
      <div className="flex flex-col xl:flex-row justify-between items-center mb-[clamp(0.35rem,1vw,0.8rem)] gap-[clamp(0.5rem,2.3vw,1.3rem)] shrink-0">
        <h3 className="text-[clamp(1rem,2vw,1.5rem)] font-extrabold text-white">

          Select Date & Time
        </h3>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-emerald-400 font-bold text-[clamp(0.575rem,1.7vw,1rem)]">

              From:
            </label>
            <input 
              type="time" 
              value={selectedTimeFrom} 
              onChange={(e) => setSelectedTimeFrom(e.target.value)} 
              className="flex-1 sm:flex-none bg-zinc-800 border border-zinc-600 rounded-lg px-1 py-0.5 text-white outline-none focus:border-emerald-500 text-[clamp(0.875rem,2vw,1rem)]"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-amber-400 font-bold text-[clamp(0.575rem,1.7vw,1rem)]">

              To:
            </label>
            <input 
              type="time" 
              value={selectedTimeTo} 
              onChange={(e) => setSelectedTimeTo(e.target.value)} 
              className="flex-1 sm:flex-none bg-zinc-800 border border-zinc-600 rounded-lg px-1 py-0.5 text-white outline-none focus:border-amber-500 text-[clamp(0.875rem,2vw,1rem)]" 
            />
          </div>
        </div>
      </div>

      <div className="w-full flex p-1 rounded-full bg-zinc-800/40 border border-white/10 mb-4 shrink-0">
        {(["tahun", "bulan", "hari"] as const).map((tab) => (
          <button 
            key={tab} 
            onClick={() => setActiveTab(tab)} 
            className={`flex-1 py-[clamp(0.4rem,2vw,0.6rem)] text-[clamp(0.75rem,2vw,0.875rem)] font-semibold capitalize rounded-full transition-all ${activeTab === tab ? "bg-white/20 text-white shadow-md" : "text-zinc-400"}`}
          >

            {tab}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar relative min-h-0 pb-2">
        <AnimatePresence mode="wait">
          {activeTab === "tahun" && (
            <motion.div key="tahun" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-3 sm:grid-cols-4 gap-[clamp(0.25rem,1.5vw,0.75rem)] p-1">
              {YEARS_LIST.map((year) => (
                <button 
                  key={year} 
                  onClick={() => { setViewYear(year); setActiveTab("bulan"); }} 
                  className={`py-[clamp(0.5rem,2vw,0.75rem)] rounded-xl font-bold text-[clamp(0.875rem,2.5vw,1rem)] ${viewYear === year ? "bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500" : "bg-zinc-800/50 text-zinc-400 hover:border-white/20 border border-transparent"}`}
                >

                  {year}
                </button>
              ))}
            </motion.div>
          )}
          {activeTab === "bulan" && (
            <motion.div key="bulan" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid grid-cols-3 sm:grid-cols-4 gap-[clamp(0.25rem,1.5vw,0.75rem)] p-1">
              {MONTHS_LIST.map((m, idx) => (
                <button 
                  key={m} 
                  onClick={() => { setViewMonth(idx); setActiveTab("hari"); }} 
                  className={`py-[clamp(0.5rem,2vw,0.75rem)] rounded-xl font-bold text-[clamp(0.875rem,2.5vw,1rem)] ${viewMonth === idx ? "bg-emerald-500/20 text-emerald-300 border-2 border-emerald-500" : "bg-zinc-800/50 text-zinc-400 hover:border-white/20 border border-transparent"}`}
                >

                  {m}
                </button>
              ))}
            </motion.div>
          )}
          {activeTab === "hari" && (
            <motion.div key="hari" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-1">
              <div className="text-center text-zinc-400 font-medium mb-[clamp(0.5rem,2vw,0.75rem)] text-[clamp(0.875rem,2vw,1rem)]">

                Month: <span className="text-white">{MONTHS_LIST[viewMonth]} {viewYear}</span>
              </div>
              
              <div className="grid grid-cols-7 gap-[clamp(0.2rem,1vw,0.5rem)] mb-2">
                {DAY_NAMES.map((d, i) => (
                  <div key={d} className={`text-center text-[clamp(0.5rem,1.2vw,0.65rem)] font-extrabold tracking-widest uppercase ${i === 0 ? "text-red-400/80" : "text-zinc-500"}`}>

                    {d}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-[clamp(0.2rem,1vw,0.5rem)]">
                {emptySlots.map((slot) => (
                  <div key={`empty-${slot}`} className="aspect-square w-full max-w-16 mx-auto" />
                ))}

                {daysList.map((day) => {
                  const dateObj = new Date(viewYear, viewMonth, day);
                  const dayName = DAY_NAMES[dateObj.getDay()];
                  const targetStr = `${viewYear}-${(viewMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                  
                  const isSelected = selectedDate === targetStr;
                  const isToday = today.getDate() === day && today.getMonth() === viewMonth && today.getFullYear() === viewYear;
                  const isSunday = dateObj.getDay() === 0;

                  let buttonClass = "aspect-square w-full max-w-16 flex flex-col mx-auto items-center justify-center rounded-2xl transition-all border ";
                  let textDayClass = "text-[clamp(0.6rem,1.5vw,0.7rem)] font-bold tracking-widest uppercase ";
                  let textNumClass = "font-extrabold text-[clamp(0.875rem,2.5vw,1.1rem)] ";

                  if (isSelected) {
                    buttonClass += "bg-emerald-500 text-white scale-110 shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-400 z-10";
                    textDayClass += "text-emerald-100";
                  } else {
                    if (isSunday) {
                      buttonClass += "bg-red-500/10 hover:bg-red-500/20 text-red-300 ";
                      textDayClass += "text-red-500/70 ";
                      textNumClass += "text-red-400 ";
                    } else {
                      buttonClass += "bg-zinc-800/50 hover:bg-zinc-700 text-zinc-400 hover:text-white ";
                      textDayClass += "text-zinc-500 ";
                    }

                    if (isToday) {
                      buttonClass += "border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.4)] bg-purple-500/5 ";
                      textNumClass += "!text-purple-300 "; 
                    } else {
                      buttonClass += "border-transparent hover:border-zinc-500/30 ";
                    }
                  }

                  return (
                    <button key={day} onClick={() => setSelectedDate(targetStr)} className={buttonClass}>
                      <span className={textDayClass}>

                        {dayName}
                      </span>
                      <span className={textNumClass}>

                        {day}
                      </span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="flex flex-col sm:flex-row justify-end gap-[clamp(0.5rem,2vw,0.75rem)] mt-[clamp(0.4rem,1.3vw,0.65rem)] pt-[clamp(0.4rem,1.3vw,0.65rem)] border-t border-white/10 shrink-0">
        <button 
          onClick={onCancel} 
          className="w-full sm:w-auto px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.5rem,2vw,0.75rem)] rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all text-[clamp(0.575rem,1.6vw,0.8rem)]"
        >

          Cancel
        </button>
        <button 
          onClick={handleConfirm} 
          className="w-full sm:w-auto px-[clamp(1rem,3vw,1.5rem)] py-[clamp(0.5rem,2vw,0.75rem)] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)] text-[clamp(0.575rem,1.6vw,0.8rem)]"
        >

          Confirm
        </button>
      </div>
    </div>
  );
}

// modal kelola kelas dan anggotanya
export function ModalAddClass({ data, closeModal }: { data: any; closeModal: () => void }) {
  const { students, saveNewClass, deleteClass, showAlert } = useStore();
  const isEdit = data.isEdit || false;
  const [className, setClassName] = useState(data.oldClassName || "");
  
  const initialSelected = students.filter((s) => isEdit && s.kelas === data.oldClassName);
  const initialAvailable = students.filter((s) => !initialSelected.some(sel => sel.id === s.id));

  const [availableStudents, setAvailableStudents] = useState<StudentData[]>(initialAvailable);
  const [selectedStudents, setSelectedStudents] = useState<StudentData[]>(initialSelected);
  const [activeTab, setActiveTab] = useState<"roster" | "schedule">("roster");
  const [schedules, setSchedules] = useState<{date: string, timeFrom: string, timeTo: string}[]>(data.initialSchedules || []);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // logic transfer anggota kelas
  const handleTransfer = (studentId: string, source: "available" | "selected", target: "available" | "selected") => {
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

  const addSchedule = (date: string, timeFrom: string, timeTo: string) => {
    const newSchedules = [...schedules, { date, timeFrom, timeTo }];
    newSchedules.sort((a, b) => new Date(`${a.date}T${a.timeFrom}`).getTime() - new Date(`${b.date}T${b.timeFrom}`).getTime());
    setSchedules(newSchedules);
    setIsAddingSchedule(false);
  };
  
  const removeSchedule = (idxToRemove: number) => setSchedules(schedules.filter((_, idx) => idx !== idxToRemove));

  const handleSave = () => {
    // memanggil custom alert saat box nama kosong
    if (!className.trim()) return showAlert("Class name cannot be empty!");
    
    const selectedIds = selectedStudents.map((s) => s.id);
    saveNewClass(data.oldClassName, className, selectedIds, schedules); 
    closeModal();
  };

  const handleDelete = () => {
    deleteClass(data.oldClassName);
    closeModal();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }} 
      transition={{ duration: 0.3 }} 
      onClick={(e) => e.stopPropagation()} 
      className="w-full max-w-5xl h-[95vh] sm:h-[90vh] flex flex-col gap-[clamp(0.5rem,2vw,1.5rem)] relative p-[clamp(0.5rem,2vw,1rem)] bg-zinc-950/40 rounded-4xl border border-white/5"
    >
        <div className="w-full shrink-0 rounded-[clamp(1rem,3vw,1.5rem)] bg-zinc-900/60 backdrop-blur-2xl border border-white/10 p-[clamp(0.6rem,2vw,1.3rem)] shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-[clamp(0.3rem,2vw,1rem)]">
            <h2 className="text-[clamp(0.9rem,3vw,2.1rem)] font-extrabold text-white tracking-tight drop-shadow-md text-center">

              {isEdit ? "EDIT CLASS" : "CREATE NEW CLASS"}
            </h2>
            <input 
              type="text" 
              placeholder="Class Name" 
              value={className} 
              onChange={(e) => setClassName(e.target.value)} 
              className="w-full sm:w-auto sm:min-w-62.5 bg-zinc-950/80 border-2 border-emerald-500/30 text-emerald-300 placeholder:text-zinc-600 px-[clamp(1rem,2vw,1.5rem)] py-[clamp(0.5rem,1.5vw,0.75rem)] rounded-xl focus:outline-none focus:border-emerald-500 transition-colors shadow-inner text-center font-bold text-[clamp(0.675rem,1.5vw,0.8rem)]" 
            />
        </div>

        <div className="flex-1 min-h-0 w-full flex flex-col">
            {activeTab === "roster" ? (
            <div className="flex-1 flex flex-col sm:flex-row gap-[clamp(0.75rem,2vw,1.5rem)] min-h-0">
                
                <div className="flex-1 flex flex-col rounded-[clamp(1rem,3vw,1.5rem)] bg-zinc-900/60 backdrop-blur-2xl border border-emerald-500/30 overflow-hidden shadow-2xl min-h-0">
                  <div className="bg-emerald-500/10 p-[clamp(0.35rem,1vw,0.7rem)] border-b border-emerald-500/30 text-center shrink-0">
                      <h3 className="text-emerald-400 font-bold tracking-widest text-[clamp(0.75rem,1.5vw,0.875rem)]">

                          {isEdit ? "EDIT ROSTER" : "CLASS ROSTER"} ({selectedStudents.length})
                      </h3>
                      <p className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-zinc-400 mt-1">

                          click student to dismiss
                      </p>
                  </div>
                  <div className="flex-1 p-[clamp(0.5rem,2vw,1rem)] overflow-y-auto custom-scrollbar flex flex-col gap-2 relative min-h-0">
                      {selectedStudents.map(student => (
                      <div 
                        key={student.id}
                        onClick={() => {handleTransfer(student.id, "selected", "available");}}
                        className="p-[clamp(0.75rem,2vw,1rem)] rounded-xl bg-zinc-800/80 border border-zinc-600 cursor-pointer hover:bg-zinc-700 transition-colors flex justify-between items-center shadow-lg"
                      >
                          <span className="font-bold text-white text-[clamp(0.875rem,2vw,1rem)]">

                              {student.name}
                          </span>
                          <span className="text-[clamp(0.65rem,1.5vw,0.75rem)] text-zinc-400 font-mono">

                              {student.id}
                          </span>
                      </div>
                      ))}
                  </div>
                </div>

                <div className="flex-1 flex flex-col rounded-[clamp(1rem,3vw,1.5rem)] bg-zinc-900/60 backdrop-blur-2xl border border-white/10 overflow-hidden shadow-2xl min-h-0">
                  <div className="bg-zinc-800/50 p-[clamp(0.35rem,1vw,0.7rem)] border-b border-white/10 text-center shrink-0">
                      <h3 className="text-zinc-300 font-bold tracking-widest text-[clamp(0.75rem,1.5vw,0.875rem)]">

                          AVAILABLE STUDENTS
                      </h3>
                      <p className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-zinc-500 mt-1">

                          click student to assign
                      </p>
                  </div>
                  <div className="flex-1 p-[clamp(0.5rem,2vw,1rem)] overflow-y-auto custom-scrollbar flex flex-col gap-2 min-h-0">
                      {availableStudents.map(student => (
                      <div 
                        key={student.id} 
                        onClick={() => {handleTransfer(student.id, "available", "selected");}}
                        className="p-[clamp(0.75rem,2vw,1rem)] rounded-xl bg-zinc-800/40 border border-zinc-700/50 cursor-pointer hover:bg-zinc-700 transition-colors flex justify-between items-center shadow-md"
                      >
                          <div>
                              <span className="font-bold text-zinc-200 block text-[clamp(0.875rem,2vw,1rem)]">

                                  {student.name}
                              </span>
                              <span className="text-[clamp(0.65rem,1.5vw,0.75rem)] text-zinc-500 block">

                                  Current Class: {student.kelas || "None"}
                              </span>
                          </div>
                          <span className="text-[clamp(0.65rem,1.5vw,0.75rem)] text-zinc-600 font-mono">

                              {student.id}
                          </span>
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
                        <h3 className="text-[clamp(1.125rem,3vw,1.5rem)] font-extrabold text-blue-400">

                          Class Schedule
                        </h3>
                        <button 
                          onClick={() => setIsAddingSchedule(true)} 
                          className="w-full sm:w-auto px-[clamp(1rem,3vw,1.25rem)] py-[clamp(0.5rem,2vw,0.75rem)] rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 font-bold border border-blue-500/50 transition-all text-[clamp(0.875rem,2vw,1rem)]"
                        >

                          + ADD SCHEDULE
                        </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-[clamp(0.5rem,1.5vw,1rem)] min-h-0">
                    {schedules.map((sched, idx) => (
                        <div key={idx} className="flex justify-between items-center p-[clamp(0.75rem,2vw,1.25rem)] rounded-2xl bg-zinc-800/80 border border-zinc-700 shadow-md">
                        <div className="flex flex-col">
                            <span className="text-white font-extrabold text-[clamp(1rem,2.5vw,1.125rem)]">

                              {sched.timeFrom} - {sched.timeTo}
                            </span>
                            <span className="text-zinc-400 font-medium text-[clamp(0.75rem,2vw,0.875rem)]">

                              {sched.date}
                            </span>
                        </div>
                        <button 
                          onClick={() => removeSchedule(idx)} 
                          className="w-[clamp(2rem,6vw,2.5rem)] aspect-square rounded-full flex items-center justify-center text-zinc-500 hover:bg-red-500/20 hover:text-red-400 transition-all font-bold text-[clamp(1rem,3vw,1.25rem)]"
                        >

                          ✕
                        </button>
                        </div>
                    ))}
                    </div>
                </div>
                )}
            </div>
            )}
        </div>

        <div className="relative shrink-0 w-full rounded-[clamp(1rem,3vw,1.5rem)] bg-zinc-900/60 backdrop-blur-2xl border border-white/10 p-[clamp(0.45rem,1.2vh,0.7rem)] shadow-2xl flex flex-col sm:flex-row justify-between items-center gap-[clamp(0.75rem,2vw,1rem)]">
            <AnimatePresence>
            {confirmDelete && (
                <motion.div 
                  initial={{ opacity: 0, y: 20, scale: 0.9 }} 
                  animate={{ opacity: 1, y: 0, scale: 1 }} 
                  exit={{ opacity: 0, y: 20, scale: 0.9 }} 
                  className="absolute bottom-[110%] w-80 p-1.5 rounded-2xl bg-zinc-900/90 backdrop-blur-2xl border border-white/20 shadow-[0_20px_40px_rgba(0,0,0,0.7)] flex flex-col items-center gap-1.5 z-50 sm:left-4"
                >
                    <h3 className="text-white font-bold capitalize">

                      Confirm Delete
                    </h3>
                    <p className="text-sm text-red-400 text-center">

                      Are you sure you want to delete this class?
                    </p>
                    <div className="flex gap-2 w-full">
                        
                        <button 
                          onClick={() => setConfirmDelete(false)} 
                          className="flex-1 py-2 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white font-medium transition-all"
                        >

                            Cancel
                        </button>

                        <button 
                          onClick={handleDelete} 
                          className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                        >

                            Confirm
                        </button>

                    </div>
                </motion.div>
            )}
            </AnimatePresence>

            <div className="flex flex-row gap-2 w-full sm:w-auto">

                <button 
                  onClick={closeModal} 
                  className="w-full sm:w-auto px-[clamp(0.5rem,3vw,2rem)] py-[clamp(0.5rem,1.5vh,1rem)] rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 font-bold transition-all text-[clamp(0.75rem,2.5vw,1rem)] border border-transparent hover:border-zinc-700"
                >

                    Cancel
                </button>

                {isEdit && (
                    <button 
                      onClick={() => setConfirmDelete(true)} 
                      className="w-full sm:w-auto px-[clamp(0.5rem,3vw,2rem)] py-[clamp(0.5rem,1vh,0.8rem)] rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-bold transition-all text-[clamp(0.6575rem,2.5vw,1rem)]"
                    >

                        Delete Class
                    </button>
                )}
            
            </div>

            <div className="flex flex-col sm:flex-row gap-[clamp(0.35rem,1vh,0.7rem)] w-full sm:w-auto">

            <button 
              onClick={() => setActiveTab(activeTab === "roster" ? "schedule" : "roster")} 
              className="w-full sm:w-auto px-[clamp(0.5rem,3vw,2rem)] py-[clamp(0.5rem,1vh,0.8rem)] rounded-xl bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 font-bold transition-all border border-blue-500/30 text-[clamp(0.6575rem,2.5vw,1rem)]"
            >

                {activeTab === "roster" ? "Insert Schedule" : "Back to Roster"}
            </button>
            
            <button 
              onClick={handleSave} 
              className="w-full sm:w-auto px-[clamp(0.5rem,3vw,2rem)] py-[clamp(0.5rem,1vh,0.8rem)] rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] tracking-widest text-[clamp(0.6575rem,2.5vw,1rem)]"
            >

                {isEdit ? "SAVE CHANGES" : "CREATE CLASS"}
            </button>

            </div>
        </div>
    </motion.div>
  );
}

function CardClassGroup({ group, idx, members, schedulesCount, onClick }: { group: ClassScheduleData, idx: number, members: StudentData[], schedulesCount: number, onClick: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: idx * 0.1 }} 
      className="w-full h-full"
    >
      <Hover3DCard 
        maxTilt={8} 
        onClick={onClick} 
        className="rounded-3xl bg-[#09090b]/80 backdrop-blur-xl border border-white/10 p-[clamp(1rem,3vw,1.5rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] flex flex-col gap-4 cursor-pointer hover:border-white/20 hover:shadow-2xl active:scale-95 active:bg-amber-300/10 h-full"
      >
        <div className="relative z-10 flex flex-col gap-1 items-start">
          <h4 className="text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold text-white tracking-tight drop-shadow-md">

            {group.className}
          </h4>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex gap-1">
              {schedulesCount > 0 ? (
                Array.from({ length: Math.min(schedulesCount, 5) }).map((_, i) => <div key={i} className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />)
              ) : <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />}
              {schedulesCount > 5 && (
                <span className="text-xs text-emerald-500 font-bold">

                  +
                </span>
              )}
            </div>
            <span className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-zinc-400 font-mono tracking-widest uppercase">

              {schedulesCount} Schedule(s)
            </span>
          </div>
        </div>

        <div className="relative z-10 flex-1 min-h-25 mt-4 p-4 rounded-2xl bg-zinc-950/50 border border-white/5 shadow-inner flex flex-wrap gap-2 content-start overflow-y-auto max-h-37.5 custom-scrollbar">
          {members.map((member) => (
            <div key={member.id} className="px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-[clamp(0.7rem,1.5vw,0.8rem)] font-semibold text-zinc-200">

              {member.name}
            </div>
          ))}
          {members.length === 0 && (
            <span className="text-[clamp(0.7rem,1.5vw,0.875rem)] text-zinc-600 italic m-auto">

              No students enrolled
            </span>
          )}
        </div>
        <div className="relative z-10 text-right text-[clamp(0.7rem,1.5vw,0.75rem)] text-zinc-500 font-bold mt-2">

          Total: {members.length} Students
        </div>
      </Hover3DCard>
    </motion.div>
  );
}

export default function ClassGroup({ openModal }: { openModal: (data: any) => void }) {
  const { students, classesConfig } = useStore();

  return (
    <div className="flex flex-col w-full h-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-zinc-800/80 gap-4">
        <h3 className="text-[clamp(1.4rem,5vw,2.4rem)] font-semibold text-white">

          Class Groups
        </h3>
        <button 
          onClick={() => openModal({ modalType: "add_class", isEdit: false })} 
          className="px-6 py-2.5 w-full sm:w-auto bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 hover:text-white rounded-xl text-[clamp(0.8rem,1.5vw,1rem)] font-semibold transition-all border border-emerald-500/30 hover:border-emerald-500/60"
        >

          + Add New Class
        </button>
      </div>

      <div className="w-full h-full">
        {classesConfig.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
            {classesConfig.map((group, idx) => {
              const members = students.filter(s => s.kelas === group.className);
              return <CardClassGroup key={group.className} group={group} idx={idx} members={members} schedulesCount={group.schedules?.length || 0} onClick={() => openModal({ modalType: "add_class", isEdit: true, oldClassName: group.className, initialSchedules: group.schedules })} />;
            })}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <h4 className="text-zinc-300 font-medium text-[clamp(1rem,2vw,1.125rem)]">

              No classes created yet
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}