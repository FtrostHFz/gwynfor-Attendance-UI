import { create } from 'zustand';

// tipe interface data
export interface attendedClassesArrayITF {
  tanggal: string;
  jam: string;
  status?: "hadir" | "terlambat"; 
  [key: string]: any; 
}

export interface StudentData {
  id: string; 
  name: string; 
  kelas: string; 
  attendedClasses: { Data: attendedClassesArrayITF[] }; 
  latestAttendance: string[];
  alamat?: string;
  telepon?: string;
  [key: string]: any; 
}

export interface ClassScheduleData {
  className: string;
  schedules: { date: string; time: string; tolerance: string }[]; 
  [key: string]: any; 
}

// data dummy awal
const today = new Date().toISOString().split("T")[0];

const initialDummyStudents: StudentData[] = [
  { id: "04:A1:B2:C3:D4:E5", name: "Abyan Hafizh Cahyo", kelas: "10A", attendedClasses: { Data: [{ tanggal: today, jam: "07:15", status: "hadir" }] }, latestAttendance: [today, "07:15"] },
  { id: "1A:2B:3C:4D:5E:6F", name: "Alwan", kelas: "10A", attendedClasses: { Data: [{ tanggal: today, jam: "07:10", status: "terlambat" }] }, latestAttendance: [today, "07:10"] }, 
  { id: "F9:E8:D7:C6:B5:A4", name: "Budi Santoso", kelas: "10B", attendedClasses: { Data: [{ tanggal: "2026-07-21", jam: "06:55", status: "hadir" }, { tanggal: "2026-07-21", jam: "14:00", status: "terlambat" }] }, latestAttendance: ["2026-07-21", "14:00"] },
  { id: "88:77:66:55:44:33", name: "Citra Kirana", kelas: "10B", attendedClasses: { Data: [] }, latestAttendance: [] },
  { id: "AA:BB:CC:DD:EE:FF", name: "Dewi Lestari", kelas: "10A", attendedClasses: { Data: [] }, latestAttendance: [] },
  { id: "11:22:33:44:55:66", name: "Eka Putra", kelas: "10C", attendedClasses: { Data: [] }, latestAttendance: [] },
  { id: "99:88:77:66:55:44", name: "Fajar Nugraha", kelas: "", attendedClasses: { Data: [] }, latestAttendance: [] }, 
  { id: "22:44:66:88:AA:CC", name: "Gita Gutawa", kelas: "", attendedClasses: { Data: [] }, latestAttendance: [] }  
];

const initialClasses: ClassScheduleData[] = [
  { className: "10A", schedules: [ { date: today, time: "07:15", tolerance: "00:15" }, { date: today, time: "15:30", tolerance: "00:15" }, { date: "2026-07-21", time: "07:00", tolerance: "00:15" } ] },
  { className: "10B", schedules: [ { date: "2026-07-21", time: "06:55", tolerance: "00:10" }, { date: "2026-07-21", time: "14:00", tolerance: "00:10" } ] },
  { className: "10C", schedules: [] }
];

// zustand store state
interface StoreState {
  students: StudentData[];
  classesConfig: ClassScheduleData[];
  deleteStudent: (id: string) => void;
  updateStudentName: (id: string, newName: string) => void;
  resetStudentData: (id: string) => void;
  addStudent: (newStudent: StudentData) => void;
  saveNewClass: (oldClassName: string | undefined, newClassName: string, assignedStudentIds: string[], schedules: { date: string, time: string, tolerance: string }[]) => void;
  deleteClass: (classNameToDelete: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  students: initialDummyStudents,
  classesConfig: initialClasses,

  deleteStudent: (studentId) => set((state) => ({ students: state.students.filter((student) => student.id !== studentId) })),
  updateStudentName: (id, newName) => set((state) => ({ students: state.students.map((student) => student.id === id ? { ...student, name: newName } : student) })),
  resetStudentData: (id) => set((state) => ({ students: state.students.map((student) => student.id === id ? { ...student, attendedClasses: { Data: [] }, latestAttendance: [] } : student) })),
  
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