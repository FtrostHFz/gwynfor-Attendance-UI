"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudentList from "./Components/StudentList";
import AttendanceList from "./Components/AttendanceList";
import ClassGroup from "./Components/Class"; 
import ModalProfilSiswa, { ModalCalendarPicker, ModalAddClass } from "./Components/Modals"; 

// INTERFACE
interface attendedClassesArrayITF {
  tanggal: string;
  jam: string;
  attended: boolean; 
}

export interface StudentData {
  id: string; 
  name: string; 
  kelas: string; 
  attendedClasses: { Data: attendedClassesArrayITF[] }; 
  latestAttendance: string[];
}

export interface ClassScheduleData {
  className: string;
  schedules: { date: string; time: string }[];
}

const today = new Date().toISOString().split("T")[0];

// DUMMY DATA SISWA
const initialDummyStudents: StudentData[] = [
  { 
    id: "ID-001", name: "Abyan Hafizh Cahyo", kelas: "10A", 
    attendedClasses: { 
      Data: [
        { tanggal: today, jam: "07:15", attended: true }, 
        { tanggal: today, jam: "15:30", attended: false }, 
        { tanggal: "2026-07-21", jam: "07:00", attended: false }
      ] 
    },
    latestAttendance: [today, "15:30"]
  },
  { 
    id: "ID-002", name: "Alwan", kelas: "10A", 
    attendedClasses: { 
      Data: [
        { tanggal: today, jam: "07:10", attended: true }
      ] 
    },
    latestAttendance: [today, "07:10"]
  },
  { 
    id: "ID-003", name: "Budi Santoso", kelas: "10B", 
    attendedClasses: { 
      Data: [
        { tanggal: "2026-07-21", jam: "06:55", attended: true }, 
        { tanggal: "2026-07-21", jam: "14:00", attended: true }
      ] 
    },
    latestAttendance: ["2026-07-21", "14:00"]
  }
];

// DUMMY DATA KELAS (Memungkinkan kelas kosong seperti 10C)
const initialClasses: ClassScheduleData[] = [
  { className: "10A", schedules: [{ date: today, time: "07:15" }] },
  { className: "10B", schedules: [{ date: "2026-07-21", time: "06:55" }] },
  { className: "10C (Kosong)", schedules: [] }
];

export default function Home() {
  const [tabID, setTabID] = useState(1); 
  const [modalData, setModalData] = useState<any | null>(null);
  
  const [studentsData, setStudentsData] = useState<StudentData[]>(initialDummyStudents);
  const [classesConfig, setClassesConfig] = useState<ClassScheduleData[]>(initialClasses);

  const openModal = (data: any) => setModalData(data);
  const closeModal = () => setModalData(null);

  // LOGIC UPDATE & CREATE CLASS
  const saveNewClass = (oldClassName: string | undefined, newClassName: string, assignedStudentIds: string[], schedules: { date: string, time: string }[]) => {
    
    // 1. Update/Buat data di classesConfig
    setClassesConfig((prev) => {
      let updated = [...prev];
      if (oldClassName) {
        // Mode Edit: Temukan kelas lama dan update
        const idx = updated.findIndex(c => c.className === oldClassName);
        if (idx !== -1) {
          updated[idx] = { className: newClassName, schedules };
        } else {
          updated.push({ className: newClassName, schedules });
        }
      } else {
        // Mode Create: Tambah kelas baru
        updated.push({ className: newClassName, schedules });
      }
      return updated;
    });

    // 2. Update Siswa (Pindah kelas atau hapus dari kelas)
    setStudentsData((prev) => 
      prev.map((student) => {
        // Jika siswa terpilih masuk ke kelas ini
        if (assignedStudentIds.includes(student.id)) {
          return { ...student, kelas: newClassName };
        }
        // Jika siswa dulunya di kelas ini, tapi sekarang tidak terpilih (di-kick)
        if (oldClassName && student.kelas === oldClassName) {
          return { ...student, kelas: "" }; 
        }
        return student;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 p-3 font-sans">
      
      <AnimatePresence>
        {modalData && (
          <motion.div 
            initial={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
            animate={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.5)" }}
            exit={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            onClick={closeModal}
            className="fixed inset-0 z-50 flex items-center justify-center w-full h-full px-4 sm:px-8 py-10"
          >
            {modalData.modalType === 1 && (
              <ModalProfilSiswa data={modalData} closeModal={closeModal} />
            )}
            {modalData.modalType === "calendar" && (
              <ModalCalendarPicker data={modalData} closeModal={closeModal} />
            )}
            {modalData.modalType === "add_class" && (
              <ModalAddClass 
                data={{ ...modalData, onSave: saveNewClass }} 
                closeModal={closeModal} 
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden sm:block absolute ml-[clamp(1rem,5vw,4rem)] mt-[clamp(1rem,1.5vw,2rem)] min-h-[3vh] min-w-[6vw] max-h-[10vw] max-w-[15vw] h-full w-[15vw]">
        <div className="w-full h-full flex items-center justify-center">
          <Image src="/GF_Logo.png" alt="GF Logo" width={200} height={200} className="w-full h-full object-contain origin-center"/>
        </div>
      </div>

      <header className="flex flex-row justify-center items-center w-full h-full mb-10 gap-[clamp(1rem,7vw,6.5rem)]">
        <div className="flex flex-col items-center -space-y-[clamp(1rem,2.5vw,2rem)]">
          <h1 className="text-[clamp(3rem,7vw,6rem)] font-extrabold tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-500 drop-shadow-sm">GWYNFOR</h1>
          <h2 className="text-[clamp(0.85rem,3vw,1.55rem)] font-medium text-zinc-400 tracking-tight uppercase">Attendance V1</h2>
        </div>
      </header>

      <nav className="flex flex-wrap justify-center gap-[clamp(0.5rem,2vw,3.5rem)] mb-8 text-[clamp(0.875rem,1.5vw,1.25rem)]">
        <button className={`px-[clamp(1rem,2vw,3.5rem)] py-2.5 rounded-full bg-transparent transition-all ${tabID === 1 ? "bg-zinc-800 text-white border border-zinc-700 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]" : " text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200" }`} onClick={() => setTabID(1)}>Student List</button>
        <button className={`px-[clamp(1rem,2vw,3.5rem)] py-2.5 rounded-full bg-transparent transition-all ${tabID === 2 ? "bg-zinc-800 text-white border border-zinc-700 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]" : " text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200" }`} onClick={() => setTabID(2)}>Attendance List</button>
        <button className={`px-[clamp(1rem,2vw,3.5rem)] py-2.5 rounded-full bg-transparent transition-all ${tabID === 3 ? "bg-zinc-800 text-white border border-zinc-700 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)]" : " text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200" }`} onClick={() => setTabID(3)}>Devices</button>
        <button className={`px-[clamp(1rem,2vw,3.5rem)] py-2.5 rounded-full bg-transparent transition-all ${tabID === 4 ? "bg-zinc-800 text-emerald-400 border border-emerald-700 shadow-[0_0_15px_-3px_rgba(16,185,129,0.3)]" : " text-zinc-500 hover:bg-zinc-800 hover:text-emerald-400/70" }`} onClick={() => setTabID(4)}>Classes</button>
      </nav>

      <main className="w-full mx-auto">
        <div className="relative rounded-4xl p-0.5 bg-linear-to-br from-violet-500 via-fuchsia-500 to-cyan-500 shadow-[0_0_40px_-10px_rgba(168,85,247,0.25)]">
          <div className="bg-[#09090b] rounded-[calc(2rem-2px)] p-6 sm:p-10 min-h-[60vh]">
            {tabID === 1 && <StudentList openModal={openModal} students={studentsData} />}
            {tabID === 2 && <AttendanceList openModal={openModal} students={studentsData} />}
            {tabID === 3 && <StudentList openModal={openModal} students={studentsData} />}
            {tabID === 4 && <ClassGroup openModal={openModal} students={studentsData} classesConfig={classesConfig} />}
          </div>
        </div>
      </main>
    </div>
  );
}