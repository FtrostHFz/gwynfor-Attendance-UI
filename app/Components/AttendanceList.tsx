"use client";

import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Hover3DCard } from "./Card";
import { useStore, StudentData, ClassScheduleData } from "./Variables";

// ubah format jam ke menit buat komparasi
const parseTimeToMinutes = (timeStr: string) => {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
};

// komponen utama attendance harian
export default function AttendanceList({ openModal }: { openModal: (data: any) => void }) {
  const { students, classesConfig } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const todayStr = currentTime.toISOString().split("T")[0];
  const currentMins = currentTime.getHours() * 60 + currentTime.getMinutes();

  // filter murid berdasarkan jadwal hari ini
  const groupedStudents = useMemo(() => {
    const groups: Record<string, { config: ClassScheduleData; students: StudentData[] }> = {};

    classesConfig.forEach(cls => {
      const todaySchedules = cls.schedules.filter(s => s.date === todayStr);
      
      if (todaySchedules.length > 0) {
        const classStudents = students.filter(
          s => s.kelas === cls.className && 
          s.name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        if (classStudents.length > 0) {
          groups[cls.className] = {
            config: { ...cls, schedules: todaySchedules },
            students: classStudents
          };
        }
      }
    });

    return groups;
  }, [students, classesConfig, todayStr, searchQuery]);

  return (
    <div className="flex flex-col w-full h-full">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-zinc-800/80 gap-4">
        <h3 className="text-[clamp(1.4rem,5vw,2.4rem)] font-semibold text-white tracking-tight">

          Today's Attendance
        </h3>
        <div className="flex w-full sm:w-auto">
          <input 
            type="text" 
            placeholder="Search Students..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
            className="bg-zinc-800 text-zinc-200 placeholder:text-zinc-500 border border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 rounded-xl px-4 py-2 text-sm w-full sm:w-auto transition-all" 
          />
        </div>
      </div>

      <div className="w-full h-full flex flex-col gap-8">
        {Object.keys(groupedStudents).length > 0 ? (
          Object.entries(groupedStudents).sort(([a], [b]) => a.localeCompare(b)).map(([className, group]) => (
            <div key={className} className="w-full p-6 rounded-4xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.2)] flex flex-col gap-6">
              
              <div className="w-max px-5 py-2 rounded-xl bg-zinc-800/80 backdrop-blur-md border border-zinc-700/80 shadow-inner">
                <h4 className="text-zinc-300 font-bold tracking-widest text-sm uppercase">

                  Class: <span className="text-emerald-400 ml-1">{className}</span>
                </h4>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-max">
                {group.students.map((student, idx) => (
                  <motion.div key={student.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="w-full">
                    <Hover3DCard maxTilt={8} className="rounded-2xl bg-[#09090b]/80 border border-white/10 p-5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_10px_20px_rgba(0,0,0,0.5)] flex flex-col gap-4">
                      
                      <div className="relative z-10 flex flex-col">
                        <h4 className="text-xl font-extrabold text-zinc-100 tracking-tight drop-shadow-sm">

                          {student.name}
                        </h4>
                        <div className="mt-1.5 flex">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 border border-zinc-700 text-xs text-zinc-300 font-medium">

                            {student.kelas}
                          </span>
                        </div>
                      </div>

                      <div className="relative z-10 flex flex-row flex-wrap gap-2.5 mt-2">
                        {group.config.schedules.map((sched, sIdx) => {
                          const att = student.attendedClasses.Data.find(a => a.tanggal === todayStr && a.jam === sched.time);
                          
                          const limitMins = parseTimeToMinutes(sched.time) + parseTimeToMinutes(sched.tolerance);
                          const isLocked = !att && currentMins > limitMins;

                          const boxStyle = att ? "bg-emerald-500/20 border-emerald-500/50 shadow-[inset_0_0_8px_rgba(16,185,129,0.3)]" 
                            : isLocked 
                            ? "bg-red-500/20 border-red-500/50 shadow-[inset_0_0_8px_rgba(239,68,68,0.3)] opacity-80" 
                            : "bg-zinc-800/40 border-zinc-700/50";
                          
                          const titleColor = att ? "text-emerald-400" : isLocked ? "text-red-400" : "text-zinc-400";
                          const valueColor = att ? "text-emerald-100" : isLocked ? "text-red-200" : "text-zinc-500";

                          return (
                            <div key={sIdx} className={`flex-1 min-w-17.5 flex flex-col items-center justify-center py-2 px-2 rounded-xl border transition-all ${boxStyle}`}>
                              <span className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${titleColor}`}>

                                {sched.time}
                              </span>
                              <span className={`text-sm font-extrabold font-mono ${valueColor}`}>

                                {att ? att.jam : "-"}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                    </Hover3DCard>
                  </motion.div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
              <span className="text-2xl">

                📅
              </span>
            </div>
            <h4 className="text-zinc-300 font-medium text-lg">

              No classes scheduled for today
            </h4>
          </div>
        )}
      </div>
    </div>
  );
}