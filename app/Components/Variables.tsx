import { create } from 'zustand';

// struktur data attendance record
export interface attendedClassesArrayITF {
  tanggal: string;
  jam: string;
  // 0 = invalid/belum, 1 = telat, 2 = hadir
  status?: number; 
  [key: string]: any; 
}

// struktur data siswa terbaru
export interface StudentData {
  id: string; 
  Kartu: number;
  name: string; 
  kelas: string; 
  attendedClasses: { Data: attendedClassesArrayITF[] }; 
  [key: string]: any; 
}

// struktur data konfigurasi jadwal
export interface ClassScheduleData {
  className: string;
  schedules: { date: string; timeFrom: string; timeTo: string }[]; 
  [key: string]: any; 
}

const today = new Date().toISOString().split("T")[0];

// inisiasi data dummy siswa
const initialDummyStudents: StudentData[] = [
  { id: "04:A1:B2:C3:D4:E5", Kartu: 123456, name: "Abyan Hafizh Cahyo", kelas: "10A", attendedClasses: { Data: [{ tanggal: today, jam: "07:15", status: 2 }] } },
  { id: "1A:2B:3C:4D:5E:6F", Kartu: 654321, name: "Alwan", kelas: "10A", attendedClasses: { Data: [{ tanggal: today, jam: "08:10", status: 1 }] } }, 
  { id: "F9:E8:D7:C6:B5:A4", Kartu: 112233, name: "Budi Santoso", kelas: "10B", attendedClasses: { Data: [{ tanggal: "2026-07-21", jam: "06:55", status: 2 }, { tanggal: "2026-07-21", jam: "14:10", status: 1 }] } },
  { id: "88:77:66:55:44:33", Kartu: 445566, name: "Citra Kirana", kelas: "10B", attendedClasses: { Data: [] } },
  { id: "AA:BB:CC:DD:EE:FF", Kartu: 998877, name: "Dewi Lestari", kelas: "10A", attendedClasses: { Data: [] } },
  { id: "11:22:33:44:55:66", Kartu: 332211, name: "Eka Putra", kelas: "10C", attendedClasses: { Data: [] } },
  { id: "99:88:77:66:55:44", Kartu: 778899, name: "Fajar Nugraha", kelas: "", attendedClasses: { Data: [] } }, 
  { id: "22:44:66:88:AA:CC", Kartu: 556677, name: "Gita Gutawa", kelas: "", attendedClasses: { Data: [] } }  
];

// inisiasi konfigurasi kelas awal
const initialClasses: ClassScheduleData[] = [
  { className: "10A", schedules: [ { date: today, timeFrom: "07:00", timeTo: "07:30" }, { date: today, timeFrom: "15:00", timeTo: "15:30" }, { date: "2026-07-21", timeFrom: "06:45", timeTo: "07:15" } ] },
  { className: "10B", schedules: [ { date: "2026-07-21", timeFrom: "06:45", timeTo: "07:00" }, { date: "2026-07-21", timeFrom: "13:50", timeTo: "14:00" } ] },
  { className: "10C", schedules: [] }
];

// state management zustand
interface StoreState {
  students: StudentData[];
  classesConfig: ClassScheduleData[];
  deleteStudent: (id: string) => void;
  updateStudentName: (id: string, newName: string) => void;
  resetStudentData: (id: string) => void;
  addStudent: (newStudent: StudentData) => void;
  saveNewClass: (oldClassName: string | undefined, newClassName: string, assignedStudentIds: string[], schedules: { date: string, timeFrom: string, timeTo: string }[]) => void;
  deleteClass: (classNameToDelete: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  students: initialDummyStudents,
  classesConfig: initialClasses,

  deleteStudent: (studentId) => set((state) => ({ students: state.students.filter((student) => student.id !== studentId) })),
  updateStudentName: (id, newName) => set((state) => ({ students: state.students.map((student) => student.id === id ? { ...student, name: newName } : student) })),
  resetStudentData: (id) => set((state) => ({ students: state.students.map((student) => student.id === id ? { ...student, attendedClasses: { Data: [] } } : student) })),
  
  addStudent: (newStudent) => set((state) => ({ students: [...state.students, newStudent] })),

  saveNewClass: (oldClassName, newClassName, assignedStudentIds, schedules) => set((state) => {
    let updatedClasses = [...state.classesConfig];
    if (oldClassName) {
      const idx = updatedClasses.findIndex(c => c.className === oldClassName);
      if (idx !== -1) updatedClasses[idx] = { className: newClassName, schedules };
      else updatedClasses.push({ className: newClassName, schedules });
    } else {
      updatedClasses.push({ className: newClassName, schedules });
    }
    const updatedStudents = state.students.map((student) => {
      if (assignedStudentIds.includes(student.id)) return { ...student, kelas: newClassName };
      if (oldClassName && student.kelas === oldClassName) return { ...student, kelas: "" }; 
      return student;
    });
    return { classesConfig: updatedClasses, students: updatedStudents };
  }),

  deleteClass: (classNameToDelete) => set((state) => ({
    classesConfig: state.classesConfig.filter(c => c.className !== classNameToDelete),
    students: state.students.map((student) => student.kelas === classNameToDelete ? { ...student, kelas: "" } : student)
  })),
}));