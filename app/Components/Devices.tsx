"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Hover3DCard } from "./Card";
import { CARD_TEMPLATES } from "./Variables";

// data dummy hardware lokal
const DUMMY_HARDWARE = [
  { id: "HW-NFC-001", name: "Basic Card Reader", type: "WiFi", ip: "192.168.1.104", active: true },
  { id: "HW-NFC-002", name: "Basic Card Reader", type: "WiFi", ip: "192.168.1.105", active: false }
];

// data dummy kartu terdaftar lokal
const DUMMY_CARDS = [
  { id: "04:A1:B2:C3:D4:E5", templateId: 1 },
  { id: "1A:2B:3C:4D:5E:6F", templateId: 2 },
  { id: "F9:E8:D7:C6:B5:A4", templateId: 5 }
];

// komponen modal opsi koneksi firebase
function ModalOptions({ closeModal }: { closeModal: () => void }) {
  const [dbUrl, setDbUrl] = useState("");
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    alert("Firebase config saved! (Dummy)");
    closeModal();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.95 }} 
      transition={{ duration: 0.3 }} 
      onClick={(e) => e.stopPropagation()} 
      className="w-full max-w-lg p-[clamp(1.5rem,3vw,2.5rem)] bg-zinc-950/80 backdrop-blur-2xl rounded-4xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col gap-6"
    >
      
      {/* header modal opsi */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4">
        <h2 className="text-2xl font-extrabold text-white tracking-tight">

          Firebase RTDB Connection
        </h2>
        <button 
          onClick={closeModal} 
          className="text-zinc-500 hover:text-white transition-colors text-xl font-bold"
        >

          ✕
        </button>
      </div>

      {/* form input config */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">

            Database URL
          </label>
          <input 
            type="text" 
            placeholder="https://your-project.firebaseio.com" 
            value={dbUrl} 
            onChange={(e) => setDbUrl(e.target.value)} 
            className="w-full bg-zinc-900/60 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold uppercase tracking-widest text-zinc-400">

            API Key
          </label>
          <input 
            type="password" 
            placeholder="AIzaSyA..." 
            value={apiKey} 
            onChange={(e) => setApiKey(e.target.value)} 
            className="w-full bg-zinc-900/60 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500 transition-colors" 
          />
        </div>
      </div>

      {/* action buttons */}
      <div className="flex gap-3 justify-end mt-4">
        <button 
          onClick={closeModal} 
          className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all"
        >

          Cancel
        </button>
        <button 
          onClick={handleSave} 
          className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
        >

          Save Config
        </button>
      </div>
    </motion.div>
  );
}

// komponen modal edit visual kartu nfc
function ModalManageCard({ data, closeModal }: { data: any; closeModal: () => void }) {
  const [selectedTemplate, setSelectedTemplate] = useState(data.card.templateId);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSave = () => {
    alert(`Template updated to ID: ${selectedTemplate} (Dummy)`);
    closeModal();
  };

  const handleDelete = () => {
    alert("Card deleted from Firebase (Dummy)");
    closeModal();
  };

  return (

    <motion.div 
      initial={{ opacity: 0, scale: 0.95, y: 20 }} 
      animate={{ opacity: 1, scale: 1, y: 0 }} 
      exit={{ opacity: 0, scale: 0.95, y: 20 }} 
      onClick={(e) => e.stopPropagation()} 
      className="w-full max-w-4xl h-[85vh] bg-zinc-950/80 backdrop-blur-2xl rounded-4xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col p-[clamp(1.5rem,3vw,2rem)] relative"
    >
      
      {/* header modal manage kartu */}
      <div className="flex justify-between items-center border-b border-white/10 pb-4 shrink-0">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">

            Manage Card Design
          </h2>
          <span className="text-sm font-mono text-zinc-400 mt-1 block">

            UID: {data.card.id}
          </span>
        </div>
        <button 
          onClick={closeModal} 
          className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
        >

          ✕
        </button>
      </div>

      {/* grid opsi template kartu */}
      <div className="flex-1 overflow-y-auto custom-scrollbar py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
          {Object.entries(CARD_TEMPLATES).map(([idStr, urls]) => {
            const id = Number(idStr);
            const isSelected = selectedTemplate === id;
            
            return (
              <Hover3DCard 
                key={id} 
                maxTilt={15} 
                onClick={() => setSelectedTemplate(id)} 
                className={`aspect-173/110 rounded-2xl cursor-pointer transition-all border-2 overflow-hidden flex items-center justify-center relative ${isSelected ? 'border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)] scale-105' : 'border-transparent shadow-lg hover:border-white/20'}`}
              >
                <div 
                  className="absolute inset-0 bg-cover bg-center" 
                  style={{ backgroundImage: `url(${urls.H})` }} 
                />
                
                {/* indikator centang pas template dipilih */}
                {isSelected && (
                  <div className="absolute inset-0 bg-emerald-500/20 z-10 flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                  </div>
                )}
              </Hover3DCard>
            );
          })}
        </div>
      </div>

      {/* footer action & logic hapus kartu */}
      <div className="pt-4 border-t border-white/10 shrink-0 flex justify-between items-center relative">
        <AnimatePresence>
          {confirmDelete && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 10, scale: 0.95 }} 
              className="absolute bottom-full left-0 mb-4 p-4 rounded-2xl bg-zinc-900 border border-white/20 shadow-2xl flex flex-col gap-3 z-50"
            >
              <span className="text-sm font-bold text-red-400">

                Delete this card permanently?
              </span>
              <div className="flex gap-2">
                <button 
                  onClick={() => setConfirmDelete(false)} 
                  className="px-4 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-bold"
                >

                  Cancel
                </button>
                <button 
                  onClick={handleDelete} 
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold"
                >

                  Confirm Delete
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <button 
          onClick={() => setConfirmDelete(true)} 
          className="px-6 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold transition-all border border-red-500/30"
        >

          Delete Card
        </button>

        <div className="flex gap-3">
          <button 
            onClick={closeModal} 
            className="px-6 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold transition-all"
          >

            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(16,185,129,0.4)]"
          >

            Save Design
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// komponen utama halaman devices
export default function Devices() {
  const [activeSubTab, setActiveSubTab] = useState(1);
  const [modalData, setModalData] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // dummy state biar UI responsif pas di toggle hardwarenya
  const [hwList, setHwList] = useState(DUMMY_HARDWARE);

  const openModal = (data: any) => setModalData(data);
  const closeModal = () => setModalData(null);

  const SUB_TABS = [
    { id: 1, label: "Hardware" },
    { id: 2, label: "Cards" }
  ];

  const toggleHardware = (id: string) => {
    setHwList(prev => prev.map(hw => hw.id === id ? { ...hw, active: !hw.active } : hw));
  };

  const filteredHardware = hwList.filter(hw => 
    hw.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    hw.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCards = DUMMY_CARDS.filter(card => 
    card.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (

    <div className="flex flex-col w-full h-full relative">
      
      {/* manajer modal overlay untuk devices */}
      <AnimatePresence>
        {modalData && (
          <motion.div 
            initial={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }} 
            animate={{ backdropFilter: "blur(8px)", backgroundColor: "rgba(0,0,0,0.5)" }} 
            exit={{ backdropFilter: "blur(0px)", backgroundColor: "rgba(0,0,0,0)" }} 
            onClick={closeModal} 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {modalData.type === "options" && <ModalOptions closeModal={closeModal} />}
            {modalData.type === "manage_card" && <ModalManageCard data={modalData} closeModal={closeModal} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* navigasi selector sub-tab */}
      <div className="flex justify-center mb-8 relative z-10 w-full px-4">
        <div className="flex flex-wrap items-center justify-center p-1.5 gap-2 rounded-full bg-linear-350 from-fuchsia-1000 to-fuchsia-900 backdrop-blur-xl border border-white/15 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative">
          {SUB_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id)}
              className={`relative px-[clamp(1rem,2vw,2.5rem)] py-2 rounded-full text-[clamp(0.75rem,1.2vw,1rem)] font-medium transition-colors z-20 ${
                activeSubTab === tab.id ? "text-white" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {activeSubTab === tab.id && (
                <motion.div
                  layoutId="active-device-subtab"
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
      </div>

      {/* header atas dan kotak pencarian */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-zinc-800/80 gap-4">
        <h3 className="text-[clamp(1.4rem,5vw,2.4rem)] font-semibold text-white">

          {activeSubTab === 1 ? "Device Management" : "Registered Cards"}
        </h3>
        
        <input 
          type="text" 
          placeholder={activeSubTab === 1 ? "Search hardware..." : "Search card UID..."} 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-fuchsia-900/20 text-zinc-400 placeholder:text-zinc-500 border border-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-2xl px-4 py-2 text-sm w-full sm:w-auto grow max-w-md transition-all shadow-[inset_4px_8px_25px_5px_rgba(30,5,30,1)]" 
        />

        <div className="flex gap-3 w-full sm:w-auto items-center">
          
          {/* conditional rendering header aksi */}
          {activeSubTab === 1 ? (
            <>
              {/* indikator koneksi */}
              <div className="px-4 py-2 rounded-2xl bg-zinc-900/60 border border-zinc-700 flex items-center gap-2 shadow-inner">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)] animate-pulse" />
                <span className="text-xs font-bold text-zinc-300">

                  Server Connected
                </span>
              </div>
              <button 
                onClick={() => openModal({ type: "options" })} 
                className="px-5 py-2 w-full sm:w-auto bg-linear-to-br from-fuchsia-800 to-black/30 hover:bg-white/10 text-white rounded-2xl text-sm font-medium transition-colors border-[0.5px] border-zinc-200/10 active:scale-95 flex gap-2 items-center justify-center"
              >
                <span>

                  ⚙️
                </span>
                <span>

                  Options
                </span>
              </button>
            </>
          ) : (

            <button 
              onClick={() => alert("Add Card via Scan Dummy Triggered")} 
              className="px-5 py-2 w-full sm:w-auto bg-linear-to-br from-emerald-600 to-emerald-900 hover:bg-emerald-500 text-white rounded-2xl text-sm font-bold transition-colors border-[0.5px] border-emerald-400/30 active:scale-95 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >

              + Add Card
            </button>
          )}

        </div>
      </div>

      {/* area body konten subtab */}
      <div className="w-full h-full pb-10">
        <AnimatePresence mode="wait">
          
          {/* konten spesifik tab hardware */}
          {activeSubTab === 1 && (
            <motion.div 
              key="tab-hardware" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max"
            >
              {filteredHardware.map((hw, idx) => (
                <Hover3DCard 
                  key={hw.id} 
                  maxTilt={8} 
                  className="p-6 rounded-[2rem] from-fuchsia-950/60 to-black/40 bg-linear-to-br backdrop-blur-xl border border-zinc-200/10 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex flex-col gap-5 relative overflow-hidden"
                >
                  <div className="flex justify-between items-start z-10 relative">
                    <div className="flex flex-col gap-2">
                      <h4 className="text-[clamp(1.2rem,2vw,1.5rem)] font-extrabold text-white drop-shadow-md leading-tight">

                        {hw.name}
                      </h4>
                      <div className="flex gap-2 items-center">
                        <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-xs font-bold text-blue-300 tracking-wider uppercase">

                          {hw.type}
                        </span>
                      </div>
                      <span className="text-sm font-mono text-zinc-400 mt-2 tracking-wider">

                        ID: {hw.id}
                      </span>
                      {hw.type === 'WiFi' && (
                        <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 w-max px-2 py-0.5 rounded border border-emerald-500/20">

                          IP: {hw.ip}
                        </span>
                      )}
                    </div>
                    
                    {/* mockup random hardware nfc */}
                    <div className="w-[clamp(4.5rem,12vw,6.5rem)] aspect-square rounded-2xl bg-zinc-900/80 border border-white/10 shrink-0 flex items-center justify-center p-3 shadow-inner ml-4">
                      <div className="w-full h-full bg-zinc-800/50 rounded-xl flex items-center justify-center text-[10px] text-zinc-500 font-mono text-center border border-dashed border-zinc-600">

                        HW<br/>Mockup
                      </div>
                    </div>
                  </div>

                  {/* toggle deteksi presensi aktif atau tidak */}
                  <div className="mt-2 pt-5 border-t border-white/10 flex justify-between items-center z-10 relative">
                    <span className="text-sm font-bold text-zinc-300 tracking-wide">

                      Presence Detection
                    </span>
                    
                    <button 
                      onClick={() => toggleHardware(hw.id)} 
                      className={`w-14 h-7 rounded-full p-1 transition-colors duration-300 flex items-center shadow-inner ${hw.active ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                    >
                      <motion.div 
                        layout 
                        transition={{ type: "spring", stiffness: 500, damping: 30 }} 
                        className="w-5 h-5 rounded-full bg-white shadow-md" 
                        animate={{ x: hw.active ? 28 : 0 }} 
                      />
                    </button>
                  </div>
                </Hover3DCard>
              ))}
              {filteredHardware.length === 0 && (
                <div className="col-span-full py-20 text-center text-zinc-500 font-medium italic bg-zinc-900/20 rounded-3xl border-2 border-dashed border-zinc-800">

                  No hardware found.
                </div>
              )}
            </motion.div>
          )}

          {/* konten spesifik tab kartu tercatat */}
          {activeSubTab === 2 && (
            <motion.div 
              key="tab-cards" 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }} 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-max"
            >
              {filteredCards.map((card, idx) => {
                const bgImage = CARD_TEMPLATES[card.templateId]?.H || "/London1H.png";

                return (
                  <Hover3DCard 
                    key={card.id} 
                    maxTilt={15} 
                    onClick={() => openModal({ type: 'manage_card', card })} 
                    className="aspect-173/110 rounded-3xl border border-white/20 cursor-pointer shadow-[0_10px_30px_rgba(0,0,0,0.4)] overflow-hidden relative group p-5 flex flex-col justify-end"
                  >
                    {/* backgorund custom image kartu per template id */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                      style={{ backgroundImage: `url(${bgImage})` }} 
                    />
                    
                    <h4 className="relative z-10 text-[clamp(1rem,2vw,1.5rem)] font-extrabold text-white tracking-widest drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]">

                      {card.id}
                    </h4>
                  </Hover3DCard>
                );
              })}
              {filteredCards.length === 0 && (
                <div className="col-span-full py-20 text-center text-zinc-500 font-medium italic bg-zinc-900/20 rounded-3xl border-2 border-dashed border-zinc-800">

                  No cards found.
                </div>
              )}
            </motion.div>
          )}
          
        </AnimatePresence>
      </div>
    </div>
  );
}