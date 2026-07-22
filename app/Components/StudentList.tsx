"use client"

import { useState, useMemo } from "react";
import CardSiswa from "../Components/Card";
import { StudentData } from "../page";

// types
interface StudentListProps {
  openModal: (data: any) => void;
  students: StudentData[]; // Menerima data dari page.tsx
}

// --- MAIN COMPONENT ---
export default function StudentList({ openModal, students }: StudentListProps) {

  // search state
  const [searchQuery, setSearchQuery] = useState("");

  // filter dari prop students
  const filteredStudents = useMemo(() => {
    return students.filter((student) => 
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, students]);


  // render
  return (
    <div className="flex flex-col w-full h-full">

      {/* header & controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-zinc-800/80 gap-4">
        
        <h3 className="text-[clamp(1.4rem,5vw,2.4rem)] font-semibold text-white">
          Student Roster
        </h3>
        
        {/* search */}
        <input 
          type="text" 
          placeholder="Search name or ID..." 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-zinc-800 text-zinc-400 placeholder:text-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl px-4 py-2 text-sm w-full sm:w-auto grow max-w-md transition-all" 
        />

        {/* btns */}
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => openModal({ title: "Add New Student", action: "create" })} 
            className="px-5 py-2 w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium transition-colors border border-white/5"
          >
            + Add Student
          </button>
          <button 
            onClick={() => openModal({ title: "Delete Confirmation", action: "delete_all" })} 
            className="px-5 py-2 w-full sm:w-auto bg-red-600/30 hover:bg-red-500/50 text-white rounded-lg text-sm font-medium transition-colors border border-white/5"
          >
            Delete All
          </button>
        </div>
      </div>


      {/* grid map */}
      <div className="w-full h-full">
        {filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 auto-rows-max">
            {filteredStudents.map((siswa) => {
              
              const booleanAttendance = siswa.attendedClasses.Data.map(() => true); 

              return (
                <CardSiswa 
                  key={siswa.id}
                  name={siswa.name} 
                  id={siswa.id} 
                  kelas={siswa.kelas} 
                  attendedClasses={booleanAttendance} 
                  onClick={() => openModal({ modalType: 1, ...siswa })} 
                />
              );
            })}
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-20 border-2 border-dashed border-zinc-800 rounded-3xl bg-zinc-900/20">
            <div className="w-16 h-16 mb-4 rounded-full bg-zinc-800/50 flex items-center justify-center border border-zinc-700/50">
              <span className="text-2xl">🔍</span>
            </div>
            <h4 className="text-zinc-300 font-medium text-lg">Couldn't find any students</h4>
          </div>
        )}
      </div>

    </div>
  );
};