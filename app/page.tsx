"use client";

import Image from "next/image";
import CardSiswa from "./Components/Card";
import { useState } from "react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleModal = () => setIsModalOpen((prev) => !prev);

  // Data dummy untuk merapikan pemanggilan komponen CardSiswa
  const dummyStudents = Array(7).fill({
    name: "Abyan Hafizh Cahyo",
    id: "12bg67AS34Bg",
    kelas: "10A",
    attendedClasses: [true, false, true, true, true, false, false, false, false],
  });

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-200 p-3 font-sans">
      
      {/* ========================================= */}
      {/* MODAL OVERLAY */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm w-full h-full overflow-clip px-8 pb-10">
          <div className="rounded-lg w-full h-full flex flex-col items-center gap-3">
            
            <h3 className="w-full mt-[clamp(3rem,8vw,12rem)] text-[clamp(1.4rem,5.3vw,3rem)] font-extrabold text-center bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-800 drop-shadow-sm">
              SELECTION
            </h3>

            <div className="w-full h-full p-[1.5px] rounded-2xl bg-linear-to-br from-purple-600/30 via-zinc-900/15 to-fuchsia-500/15 shadow-[0_0_15px_-3px_rgba(168,85,247,0.2)]">
              <div className="w-full h-full min-h-50 rounded-[15px] bg-[#09090b]/80 backdrop-blur-xl p-6 relative">
                <button 
                  onClick={toggleModal}
                  className="absolute top-4 right-4 text-zinc-400 hover:text-white font-bold transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>

          </div>
        </div>
      )}


      {/* Logo */}
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


      {/* ========================================= */}
      {/* HEADER SECTION */}
      {/* ========================================= */}
      <header className="flex flex-row justify-center items-center w-full h-full mb-10 gap-[clamp(1rem,7vw,6.5rem)]">
        
        {/* Title */}
        <div className="flex flex-col items-center -space-y-[clamp(1rem,2.5vw,2rem)]">
          <h1 className="text-[clamp(3rem,7vw,6rem)] font-extrabold tracking-tighter bg-clip-text text-transparent bg-linear-to-b from-white to-zinc-500 drop-shadow-sm">
            GWYNFOR
          </h1>
          <h2 className="text-[clamp(0.85rem,3vw,1.55rem)] font-medium text-zinc-400 tracking-tight uppercase">
            Attendance V1
          </h2>
        </div>



      </header>

      {/* ========================================= */}
      {/* NAVIGATION MENU */}
      {/* ========================================= */}
      <nav className="flex flex-wrap justify-center gap-[clamp(0.5rem,2vw,3.5rem)] mb-8 text-[clamp(0.875rem,1.5vw,2.025rem)]">
        <button className="px-[clamp(1rem,2vw,3.5rem)] py-2.5 rounded-full bg-zinc-800 text-white border border-zinc-700 shadow-[0_0_15px_-3px_rgba(168,85,247,0.3)] transition-all">
          Student List
        </button>
        <button className="px-[clamp(1rem,2vw,3.5rem)] py-2.5 rounded-full bg-transparent text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-all">
          Attendance List
        </button>
        <button className="px-[clamp(1rem,2vw,3.5rem)] py-2.5 rounded-full bg-transparent text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-all">
          Devices
        </button>
      </nav>

      {/* ========================================= */}
      {/* MAIN CONTENT (STUDENT ROSTER) */}
      {/* ========================================= */}
      <main className="w-full mx-auto">
        <div className="relative rounded-4xl p-0.5 bg-linear-to-br from-violet-500 via-fuchsia-500 to-cyan-500 shadow-[0_0_40px_-10px_rgba(168,85,247,0.25)]">
          <div className="bg-[#09090b] rounded-[calc(2rem-2px)] p-6 sm:p-10 min-h-[60vh]">

            {/* Toolbar (Search & Actions) */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-zinc-800/80 gap-4">
              <h3 className="text-[clamp(1.4rem,5vw,2.4rem)] font-semibold text-white">
                Student Roster
              </h3>
              
              <input 
                type="text" 
                placeholder="Search students..." 
                className="bg-zinc-800 text-zinc-400 placeholder:text-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl px-4 py-2 text-sm w-full sm:w-auto transition-all" 
              />

              <div className="flex gap-2 w-full sm:w-auto">
                <button 
                  onClick={toggleModal} 
                  className="px-5 py-2 w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/5"
                >
                  + Add Student
                </button>
                <button 
                  onClick={toggleModal} 
                  className="px-5 py-2 w-full sm:w-auto bg-red-600/30 hover:bg-red-500/50 text-white rounded-lg text-sm font-medium transition-colors border border-white/5"
                >
                  Delete All
                </button>
              </div>
            </div>

            {/* Grid Kartu Siswa */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
              {dummyStudents.map((siswa, index) => (
                <CardSiswa 
                  key={index}
                  name={siswa.name} 
                  id={siswa.id} 
                  kelas={siswa.kelas} 
                  attendedClasses={siswa.attendedClasses}
                />
              ))}
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}