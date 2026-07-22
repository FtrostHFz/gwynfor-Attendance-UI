"use client";

import { motion } from "framer-motion";
import { StudentData, ClassScheduleData } from "../page";

interface ClassGroupProps {
  openModal: (data: any) => void;
  students: StudentData[];
  classesConfig: ClassScheduleData[];
}

export default function ClassGroup({ openModal, students, classesConfig = [] }: ClassGroupProps) {

  return (
    <div className="flex flex-col w-full h-full">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-zinc-800/80 gap-4">
        <h3 className="text-[clamp(1.4rem,5vw,2.4rem)] font-semibold text-white">
          Class Groups
        </h3>
        
        <button
          onClick={() => openModal({ modalType: "add_class", isEdit: false, students })}
          className="px-6 py-2.5 w-full sm:w-auto bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 hover:text-white rounded-xl text-[clamp(0.8rem,1.5vw,1rem)] font-semibold transition-all border border-emerald-500/30 hover:border-emerald-500/60 shadow-[0_0_15px_-3px_rgba(16,185,129,0.15)]"
        >
          + Add New Class
        </button>
      </div>

      {/* Grid Map of Classes (Terikat pada classesConfig, bukan otomatis dari murid) */}
      <div className="w-full h-full">
        {classesConfig.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
            {classesConfig.map((group, idx) => {
              // Cari anggota kelas ini dengan mencocokkan namanya dengan properti "kelas" di tiap siswa
              const members = students.filter(s => s.kelas === group.className);
              const schedulesCount = group.schedules?.length || 0;

              return (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={group.className}
                  className="relative overflow-hidden rounded-3xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 p-[clamp(1rem,3vw,1.5rem)] shadow-xl flex flex-col gap-4 cursor-pointer hover:border-white/20 hover:shadow-2xl transition-all"
                  onClick={() => openModal({ 
                    modalType: "add_class", 
                    isEdit: true, 
                    oldClassName: group.className, 
                    initialSchedules: group.schedules, 
                    students 
                  })}
                >
                  {/* Header Card */}
                  <div className="flex flex-col gap-1 items-start">
                    <h4 className="text-[clamp(1.5rem,4vw,2.25rem)] font-extrabold text-white tracking-tight drop-shadow-md">
                      {group.className}
                    </h4>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex gap-1">
                        {schedulesCount > 0 ? (
                          Array.from({ length: Math.min(schedulesCount, 5) }).map((_, i) => (
                            <div key={i} className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                          ))
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
                        )}
                        {schedulesCount > 5 && <span className="text-xs text-emerald-500 font-bold">+</span>}
                      </div>
                      <span className="text-[clamp(0.6rem,1.5vw,0.75rem)] text-zinc-400 font-mono tracking-widest uppercase">
                        {schedulesCount} Schedule(s)
                      </span>
                    </div>
                  </div>

                  {/* Body (Student Pills) */}
                  <div className="flex-1 min-h-[100px] mt-4 p-4 rounded-2xl bg-zinc-950/50 border border-white/5 shadow-inner flex flex-wrap gap-2 content-start overflow-y-auto max-h-[150px] custom-scrollbar">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="px-3 py-1.5 rounded-lg bg-zinc-800/80 border border-zinc-700/50 text-[clamp(0.7rem,1.5vw,0.8rem)] font-semibold text-zinc-200"
                      >
                        {member.name}
                      </div>
                    ))}
                    {members.length === 0 && (
                      <span className="text-[clamp(0.7rem,1.5vw,0.875rem)] text-zinc-600 italic m-auto">No students enrolled</span>
                    )}
                  </div>

                  <div className="text-right text-[clamp(0.7rem,1.5vw,0.75rem)] text-zinc-500 font-bold mt-2">
                    Total: {members.length} Students
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
              <span className="text-[clamp(1.5rem,4vw,2rem)]">🏫</span>
            </div>
            <h4 className="text-zinc-300 font-medium text-[clamp(1rem,2vw,1.125rem)]">No classes created yet</h4>
          </div>
        )}
      </div>
    </div>
  );
}