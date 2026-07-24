"use client";

import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StudentList, { ModalProfilSiswa } from "./Components/StudentList";
import AttendanceList from "./Components/AttendanceList";
import ClassGroup, { ModalAddClass } from "./Components/Class"; 
import { ModalAddStudent } from "./Components/StudentList";
import { useStore } from "./Components/Variables";
import Devices from "./Components/Devices";

export default function Home() {
  const [tabID, setTabID] = useState(1); 
  const [modalData, setModalData] = useState<any | null>(null);
  
  // hook pemanggil global alert
  const alertData = useStore((state) => state.alertData);
  const hideAlert = useStore((state) => state.hideAlert);

  const openModal = (data: any) => setModalData(data);
  const closeModal = () => setModalData(null);

  // array tab navigasi
  const NAV_TABS = [
    { id: 1, label: "Student List" },
    { id: 2, label: "Class" },
    { id: 3, label: "Attendance" },
    { id: 4, label: "Devices" }
  ];

  return (
    <div className="min-h-screen bg-linear-to-tl from-[hsl(277,87%,3%)] to-[rgb(32,1,32)] text-zinc-200 p-3 font-sans relative">
      
      {/* layer popup alert custom ditaruh di paling atas */}
      <AnimatePresence>
        {alertData && (
          <motion.div
            initial={{ opacity: 0, y: -50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -50, x: "-50%" }}
            className="fixed top-8 left-1/2 z-[100] min-w-[300px] px-5 py-3 rounded-2xl bg-red-950/80 backdrop-blur-xl border border-red-500/50 shadow-[0_10px_40px_rgba(239,68,68,0.4)] flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">

                ⚠️
              </span>
              <span className="text-red-200 font-medium text-sm">

                {alertData.message}
              </span>
            </div>
            <button
              onClick={() => hideAlert(alertData.id)}
              className="text-red-400 hover:text-white transition-colors"
            >

              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* modal area */}
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
            {modalData.modalType === 1 && <ModalProfilSiswa data={modalData} closeModal={closeModal} />}
            {modalData.modalType === "add_class" && (<ModalAddClass data={modalData} closeModal={closeModal} />)}
            {modalData.modalType === "add_student" && <ModalAddStudent closeModal={closeModal} />}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="hidden sm:block absolute ml-[clamp(1rem,5vw,4rem)] mt-[clamp(1rem,1.5vw,2rem)] min-h-[3vh] min-w-[6vw] max-h-[10vw] max-w-[15vw] h-full w-[15vw]">
        <div className="w-full h-full flex items-center justify-center">
          <Image 
            src="/GF_Logo.png" 
            alt="GF Logo" 
            width={200} 
            height={200} 
            className="w-full h-full object-contain origin-center"
          />
        </div>
      </div>

      <header className="flex flex-row justify-center items-center w-full h-full mb-8 gap-[clamp(1rem,7vw,6.5rem)]">
        <div className="flex flex-col items-center -space-y-[clamp(1rem,2.5vw,2rem)]">
          <h1 className="text-[clamp(3rem,7vw,6rem)] font-extrabold tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-500 drop-shadow-sm">

            GWYNFOR
          </h1>
          <h2 className="text-[clamp(0.85rem,3vw,1.55rem)] font-medium text-zinc-400 tracking-tight uppercase">

            Attendance V1
          </h2>
        </div>
      </header>

      <nav className="flex justify-center mb-8 relative z-10 w-full px-4">
        <div className="flex flex-wrap items-center justify-center p-1.5 gap-2 rounded-full bg-linear-350 from-fuchsia-1000 to-fuchsia-900 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
          {NAV_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTabID(tab.id)}
              className={`relative px-[clamp(1.25rem,3vw,3.5rem)] py-2.5 rounded-full text-[clamp(0.875rem,1.5vw,1.125rem)] font-medium transition-colors z-20 ${
                tabID === tab.id ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {tabID === tab.id && (
                <motion.div
                  layoutId="active-nav-tab"
                  className="absolute inset-0 bg-linear-350 from-fuchsia-1000 to-fuchsia-600 rounded-full border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_15px_rgba(168,85,247,0.15)] -z-10"
                  initial={false}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 drop-shadow-sm">

                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </nav>

      <main className="w-full mx-auto">
        <div className="relative rounded-4xl p-px bg-linear-to-tl from-violet-800/40 via-fuchsia-500/30 to-cyan-500/30 shadow-[0_0_40px_-10px_rgba(168,85,247,0.25)]">
          <div className="bg-linear-350 from-[hsl(277,87%,3%)] to-[rgb(29,0,29)] rounded-[calc(2rem-2px)] p-6 sm:p-10 min-h-[60vh]">
            {tabID === 1 && <StudentList openModal={openModal} />}
            {tabID === 2 && <ClassGroup openModal={openModal} />}
            {tabID === 3 && <AttendanceList openModal={openModal} />}
            {tabID === 4 && <Devices />}
          </div>
        </div>
      </main>
    </div>
  );
}