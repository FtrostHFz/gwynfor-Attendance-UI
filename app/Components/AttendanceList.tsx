"use client";

import { useState, useMemo } from "react";
import { CardAttendance } from "./Card"; 
import { StudentData } from "../page";

interface AttendanceListProps {
  openModal: (data: any) => void;
  students: StudentData[]; 
}

export default function AttendanceList({ openModal, students }: AttendanceListProps) {
  
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const hasAttendanceOnDate = student.attendedClasses.Data.some(
        (att) => att.tanggal === selectedDate
      );
      const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      return hasAttendanceOnDate && matchesSearch;
    });
  }, [selectedDate, searchQuery, students]);


  return (
    <div className="flex flex-col w-full h-full">

      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 pb-4 border-b border-zinc-800/80 gap-4">
        
        <div className="flex flex-col">
          <h3 className="text-[clamp(1.4rem,3vw,2.4rem)] font-semibold text-white tracking-tight">
            Student's Attendance
          </h3>
        </div>
        
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          
          <input
            type="text"
            placeholder="Search Students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-zinc-800/50 text-zinc-200 placeholder:text-zinc-500 border border-zinc-700/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50 rounded-xl px-4 py-2.5 text-sm w-full sm:w-auto grow transition-all"
          />

          {/* PERUBAHAN DI SINI: Kirim fungsi setSelectedDate dan data siswa ke Modal */}
          <button
            onClick={() => openModal({ 
              modalType: "calendar", 
              currentDate: selectedDate,
              onSelectDate: setSelectedDate, // Callback pengubah tanggal
              students: students 
            })}
            className="px-5 py-2.5 w-full sm:w-auto bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-white rounded-xl text-sm font-semibold transition-all border border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_15px_-3px_rgba(168,85,247,0.15)]"
          >
            Select Time
          </button>

          <button
            onClick={() => openModal({ title: "Select Attendance Device", action: "select_device" })}
            className="px-5 py-2.5 w-full sm:w-auto bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 hover:text-white rounded-xl text-sm font-semibold transition-all border border-purple-500/30 hover:border-purple-500/60 shadow-[0_0_15px_-3px_rgba(168,85,247,0.15)]"
          >
            Select Device
          </button>

        </div>
      </div>

      <div className="w-full h-full">
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
            {filteredStudents.map((student, idx) => {
              const timesForSelectedDate = student.attendedClasses.Data
                .filter(att => att.tanggal === selectedDate)
                .map(att => att.jam);
              const lastTime = student.latestAttendance[1] || "-";

              return (
                <CardAttendance
                  key={student.id}
                  index={idx}
                  name={student.name}
                  kelas={student.kelas}
                  lastAttendance={lastTime}
                  attendanceTimes={timesForSelectedDate}
                  onClick={() => openModal({ modalType: 1, ID: student.id, ...student })}
                />
              );
            })}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
              <span className="text-2xl">📭</span>
            </div>
            <h4 className="text-zinc-300 font-medium text-lg">Couldn't find any data</h4>
          </div>
        )}
      </div>
    </div>
  );
}