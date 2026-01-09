import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Calendar, Home, Play, Pause, RotateCcw, X, BellOff, List, Plus, CheckCircle2, Circle, ArrowLeft, Zap, ShieldAlert, Smile, Trash2, Pencil, Linkedin, Github, MessageCircle } from 'lucide-react';

// --- HELPER FUNCTIONS ---

const toMins = (h, m) => parseInt(h) * 60 + parseInt(m);

const fromMins = (totalMins) => {
  const h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  return { h, m };
};

const formatTime = (totalMins) => {
  let h = Math.floor(totalMins / 60);
  const m = totalMins % 60;
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const pickRandomPastel = (id) => {
  const allPastels = [
    'bg-red-100/90 border-red-200 text-red-800',
    'bg-orange-100/90 border-orange-200 text-orange-800',
    'bg-amber-100/90 border-amber-200 text-amber-800',
    'bg-yellow-100/90 border-yellow-200 text-yellow-800',
    'bg-green-100/90 border-green-200 text-green-800',
    'bg-emerald-100/90 border-emerald-200 text-emerald-800',
    'bg-teal-100/90 border-teal-200 text-teal-800',
    'bg-sky-100/90 border-sky-200 text-sky-800',
    'bg-blue-100/90 border-blue-200 text-blue-800',
    'bg-indigo-100/90 border-indigo-200 text-indigo-800',
    'bg-purple-100/90 border-purple-200 text-purple-800',
    'bg-pink-100/90 border-pink-200 text-pink-800',
    'bg-rose-100/90 border-rose-200 text-rose-800',
  ];
  return allPastels[id % allPastels.length];
};

// --- SUB-COMPONENTS ---

const HomePage = ({ setShowCalendar }) => (
  <motion.div key="home-content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="h-[60vh] flex flex-col items-center justify-center text-center px-4 relative">
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="mb-4"
    >
      <h1 className="text-6xl md:text-8xl font-medium text-black leading-[1.4]" style={{ fontFamily: "'Dancing Script', cursive" }}>
        Let’s make the best use of today.
      </h1>
    </motion.div>
    
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8">
      <button onClick={() => setShowCalendar(true)} className="group flex items-center gap-2 bg-white/70 backdrop-blur-md border border-black/10 px-8 py-3 rounded-full text-xs tracking-[0.2em] uppercase text-slate-600 hover:text-black hover:bg-white transition-all shadow-md">
        <List size={14} /> Today's Schedule
      </button>
    </motion.div>
  </motion.div>
);

const TimerPage = () => {
  const [seconds, setSeconds] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false);
  const [alarmCount, setAlarmCount] = useState(0);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customH, setCustomH] = useState('');
  const [customM, setCustomM] = useState('');
  const audioRef = useRef(new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg'));

  const stopAlarm = () => { setIsAlarmPlaying(false); setAlarmCount(0); };
  const resetTimer = () => { setIsActive(false); setSeconds(25 * 60); stopAlarm(); };
  const quitTimer = () => { setIsActive(false); setSeconds(0); stopAlarm(); };

  useEffect(() => {
    let alarmInterval = null;
    if (isAlarmPlaying && alarmCount < 20) {
      audioRef.current.play().catch(() => {});
      alarmInterval = setInterval(() => {
        setAlarmCount(prev => prev + 1);
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }, 1500);
    } else if (alarmCount >= 20) { stopAlarm(); }
    return () => clearInterval(alarmInterval);
  }, [isAlarmPlaying, alarmCount]);

  useEffect(() => {
    let interval = null;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0 && isActive) {
      setIsActive(false);
      setIsAlarmPlaying(true);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const startCustomTimer = () => {
    const totalSecs = (Math.max(0, parseInt(customH || 0)) * 3600) + (Math.max(0, parseInt(customM || 0)) * 60);
    if (totalSecs > 0) { setSeconds(totalSecs); setIsActive(false); stopAlarm(); setShowCustomInput(false); setCustomH(''); setCustomM(''); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 text-center">
      <h2 className="text-xl font-bold tracking-[0.3em] text-orange-400/80 uppercase">Focus Timer</h2>
      <div className={`text-8xl md:text-9xl font-extralight tabular-nums py-4 transition-colors duration-500 ${isAlarmPlaying ? 'text-red-600 animate-pulse' : 'text-slate-800'}`}>
        {Math.floor(seconds / 3600) > 0 && <span>{Math.floor(seconds / 3600)}h </span>}
        {Math.floor((seconds % 3600) / 60)}m {seconds % 60}s
      </div>
      <div className="space-y-8">
        <div className="flex justify-center items-center gap-6">
          <button onClick={resetTimer} className="bg-white border border-slate-200 p-5 rounded-full text-slate-400 hover:text-slate-600 shadow-sm transition"><RotateCcw size={28}/></button>
          {isAlarmPlaying ? (
            <button onClick={stopAlarm} className="bg-red-600 text-white p-7 rounded-full shadow-lg animate-bounce"><BellOff size={36}/></button>
          ) : (
            <button onClick={() => setIsActive(!isActive)} className="bg-black text-white p-7 rounded-full shadow-lg hover:scale-105 transition">{isActive ? <Pause size={36}/> : <Play size={36}/>}</button>
          )}
          <button onClick={quitTimer} className="bg-white border border-red-100 p-5 rounded-full text-red-400 hover:text-red-600 shadow-sm transition"><X size={28}/></button>
        </div>
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-3 justify-center">
            <button onClick={() => { setSeconds(25*60); setIsActive(false); }} className="px-5 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition shadow-sm">25 Min</button>
            <button onClick={() => { setSeconds(60*60); setIsActive(false); }} className="px-5 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white transition shadow-sm">1 Hour</button>
            <button onClick={() => setShowCustomInput(!showCustomInput)} className="px-5 py-2.5 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition shadow-md">Custom</button>
          </div>
          <AnimatePresence>
            {showCustomInput && (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xl mb-4">
                <input type="number" placeholder="HH" className="w-12 px-1 py-1 border-b-2 outline-none text-center font-bold" value={customH} onChange={(e) => setCustomH(e.target.value)} />
                <input type="number" placeholder="MM" className="w-12 px-1 py-1 border-b-2 outline-none text-center font-bold" value={customM} onChange={(e) => setCustomM(e.target.value)} />
                <button onClick={startCustomTimer} className="bg-orange-500 text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase">Set</button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

const PlannerPage = ({ tasks, addTaskRange, editTaskRange, deleteTask, toggleComplete, setShowCalendar }) => {
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(null);
  const [modalTitle, setModalTitle] = useState('');
  const [startH, setStartH] = useState(0);
  const [startM, setStartM] = useState(0);
  const [endH, setEndH] = useState(8);
  const [endM, setEndM] = useState(30);

  const hourHeight = 90; 
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const openEdit = (task) => {
    const start = fromMins(task.start);
    const end = fromMins(task.end);
    setEditMode(task.id);
    setModalTitle(task.text);
    setStartH(start.h); setStartM(start.m);
    setEndH(end.h); setEndM(end.m);
    setShowModal(true);
  };

  const handleRangeSubmit = (priority) => {
    const startTime = toMins(startH, startM);
    const endTime = toMins(endH, endM);
    if (modalTitle && endTime > startTime) {
      if (editMode) editTaskRange(editMode, modalTitle, startTime, endTime, priority);
      else addTaskRange(modalTitle, startTime, endTime, priority);
      closeModal();
    }
  };

  const closeModal = () => { setShowModal(false); setModalTitle(''); setEditMode(null); setStartH(0); setStartM(0); setEndH(8); setEndM(30); };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pb-24 relative">
      <div className="flex justify-between items-center mb-10 px-4">
        <div>
          <h2 className="text-xl font-bold tracking-[0.3em] text-blue-400/80 uppercase">Day Planner</h2>
          <p className="text-[9px] text-slate-400 uppercase tracking-[0.2em] mt-1">Single-click to Set Schedule</p>
        </div>
        <button onClick={() => setShowCalendar(true)} className="bg-slate-900 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-black transition shadow-lg">Timeline</button>
      </div>

      <div className="relative bg-white/80 backdrop-blur-md rounded-[2.5rem] shadow-xl border border-white/50 overflow-hidden min-h-[2160px]">
        {/* GRID LAYER */}
        <div className="absolute inset-0 z-0">
          {hours.map(h => {
            const taskInHour = tasks.find(t => Math.floor(t.start / 60) === h);
            const p = taskInHour?.priority;
            return (
              <div key={h} className="border-b border-slate-300 flex items-start" style={{ height: `${hourHeight}px` }}>
                <div className="w-20 pr-4 flex flex-col items-end pt-2">
                   <span className="text-[10px] font-mono font-black text-slate-500 uppercase">{h === 0 ? '12 AM' : h < 12 ? `${h} AM` : h === 12 ? '12 PM' : `${h-12} PM`}</span>
                   <div className="flex gap-1 mt-1">
                      <div className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${p === 'low' ? 'bg-green-500' : 'bg-slate-500 opacity-30'}`} />
                      <div className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${p === 'medium' ? 'bg-yellow-500' : 'bg-slate-500 opacity-30'}`} />
                      <div className={`w-1.5 h-1.5 rounded-full shadow-sm transition-colors ${p === 'high' ? 'bg-red-500' : 'bg-slate-500 opacity-30'}`} />
                   </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* TASK LAYER */}
        <div className="absolute inset-0 z-10 left-20 right-4" onClick={() => setShowModal(true)}>
          {tasks.map(task => {
            const top = (task.start / 60) * hourHeight;
            const height = ((task.end - task.start) / 60) * hourHeight;
            return (
              <motion.div key={task.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ top: `${top}px`, height: `${height}px`, position: 'absolute', width: '100%', zIndex: 20 }} className={`rounded-2xl border-l-[8px] p-5 flex flex-col justify-between shadow-md group transition-all ${pickRandomPastel(task.id)} ${task.completed ? 'opacity-40' : ''}`}>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <button onClick={(e) => { e.stopPropagation(); toggleComplete(task.id); }} className="text-slate-400 hover:text-green-600 transition-colors shrink-0">
                      {task.completed ? <CheckCircle2 className="text-green-600" size={24} /> : <Circle size={24} />}
                    </button>
                    <div className="overflow-hidden text-left">
                      <p className="text-[9px] font-black uppercase tracking-widest opacity-60 font-mono">{formatTime(task.start)} — {formatTime(task.end)}</p>
                      <p className={`text-lg font-bold tracking-tight truncate ${task.completed ? 'line-through' : ''}`}>{task.text}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={(e) => { e.stopPropagation(); openEdit(task); }} className="p-2 hover:bg-black/10 rounded-full transition-all text-slate-600"><Pencil size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="p-2 hover:bg-black/10 rounded-full transition-all text-slate-600"><Trash2 size={16} /></button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <button onClick={() => setShowModal(true)} className="fixed bottom-12 right-12 bg-black text-white p-6 rounded-full shadow-2xl z-40 hover:scale-110 transition-transform"><Plus size={32} /></button>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[80] flex items-center justify-center p-6">
            <motion.div initial={{ y: 50 }} animate={{ y: 0 }} className="bg-white p-10 rounded-[3.5rem] w-full max-w-md shadow-2xl relative">
              <button onClick={closeModal} className="absolute top-8 right-8 text-slate-400 hover:text-black"><X/></button>
              <h3 className="text-2xl font-bold mb-8 text-slate-800">{editMode ? 'Edit Task' : 'Set Schedule'}</h3>
              <div className="space-y-6">
                <input type="text" placeholder="Task name..." value={modalTitle} onChange={(e) => setModalTitle(e.target.value)} className="w-full p-5 bg-slate-50 rounded-2xl outline-none border border-slate-100 font-medium" />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1">Start</label>
                    <div className="flex gap-1">
                      <select value={startH} onChange={(e) => setStartH(e.target.value)} className="bg-slate-50 p-3 rounded-xl text-sm font-bold flex-1 outline-none">{hours.map(i => <option key={i} value={i}>{i === 0 ? '12' : i > 12 ? i-12 : i} {i >= 12 ? 'PM' : 'AM'}</option>)}</select>
                      <select value={startM} onChange={(e) => setStartM(e.target.value)} className="bg-slate-50 p-3 rounded-xl text-sm font-bold flex-1 outline-none"><option value="0">00</option><option value="15">15</option><option value="30">30</option><option value="45">45</option></select>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 block mb-2 px-1">End</label>
                    <div className="flex gap-1">
                      <select value={endH} onChange={(e) => setEndH(e.target.value)} className="bg-slate-50 p-3 rounded-xl text-sm font-bold flex-1 outline-none">{hours.map(i => <option key={i} value={i}>{i === 0 ? '12' : i > 12 ? i-12 : i} {i >= 12 ? 'PM' : 'AM'}</option>)}</select>
                      <select value={endM} onChange={(e) => setEndM(e.target.value)} className="bg-slate-50 p-3 rounded-xl text-sm font-bold flex-1 outline-none">{[0, 15, 30, 45].map(m => <option key={m} value={m}>{m === 0 ? '00' : m}</option>)}</select>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    {[{id:'low', l:'Easy', c:'bg-green-500'}, {id:'medium', l:'Med', c:'bg-yellow-500'}, {id:'high', l:'Hard', c:'bg-red-500'}].map(p => (
                      <button key={p.id} onClick={() => handleRangeSubmit(p.id)} className="flex-1 py-5 rounded-2xl bg-slate-50 flex flex-col items-center gap-2 hover:bg-slate-100 transition border border-slate-100 shadow-sm group">
                        <div className={`w-4 h-4 rounded-full shadow-sm group-hover:scale-110 transition ${p.c}`} />
                        <span className="text-[10px] font-black uppercase text-slate-500">{p.l}</span>
                      </button>
                    ))}
                  </div>
                  <button onClick={() => handleRangeSubmit(null)} disabled={!modalTitle} className={`w-full py-5 rounded-2xl text-white text-[10px] font-black uppercase tracking-widest transition-all shadow-lg ${modalTitle ? 'bg-green-500 hover:bg-green-600 scale-[1.02]' : 'bg-slate-300'}`}>{editMode ? 'Save Changes' : 'Add Task'}</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const CalendarOverlay = ({ tasks, onClose }) => {
  const sortedTasks = [...tasks].sort((a,b) => a.start - b.start);
  const groups = { high: sortedTasks.filter(t => t.priority === 'high'), medium: sortedTasks.filter(t => t.priority === 'medium'), low: sortedTasks.filter(t => t.priority === 'low') };

  return (
    <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 30 }} className="fixed inset-0 z-[60] bg-white/98 backdrop-blur-3xl overflow-y-auto">
      <div className="max-w-7xl mx-auto p-6 md:p-12 pb-32">
        <div className="flex items-center gap-4 mb-16">
          <button onClick={onClose} className="p-4 bg-slate-100 rounded-full text-slate-600 hover:bg-slate-200 transition shadow-sm"><ArrowLeft size={24}/></button>
          <h2 className="text-5xl font-light text-slate-900">Schedule Overview</h2>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 text-left">
          <div className="lg:col-span-7 space-y-6">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 border-b pb-4">Daily Timeline</h3>
            {sortedTasks.map((task) => (
              <div key={task.id} className={`p-8 rounded-[2.5rem] shadow-sm border-l-[12px] flex flex-col gap-2 ${pickRandomPastel(task.id)} ${task.completed ? 'opacity-40 grayscale' : ''}`}>
                <span className="text-[10px] font-black uppercase opacity-60 font-mono tracking-widest">{formatTime(task.start)} — {formatTime(task.end)}</span>
                <p className={`text-3xl font-bold tracking-tight ${task.completed ? 'line-through' : ''}`}>{task.text}</p>
              </div>
            ))}
          </div>
          <div className="lg:col-span-5 space-y-12">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-8 border-b pb-4">Priority Breakdown</h3>
            {['high', 'medium', 'low'].map(p => (
              <div key={p} className="space-y-4">
                <div className={`flex items-center gap-2 ${p === 'high' ? 'text-red-600' : p === 'medium' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {p === 'high' ? <ShieldAlert size={18} /> : p === 'medium' ? <Zap size={18} /> : <Smile size={18} />}
                  <h4 className="text-xs font-black uppercase tracking-widest">{p} Tasks</h4>
                </div>
                <div className="space-y-2">
                  {groups[p].map(t => <div key={t.id} className={`p-4 rounded-2xl border font-bold text-sm transition-all ${t.completed ? 'bg-slate-50 text-slate-300 line-through' : 'bg-white shadow-sm border-slate-100 text-slate-700'}`}>{t.text}</div>)}
                  {groups[p].length === 0 && <p className="text-[10px] text-slate-300 italic">None assigned.</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const App = () => {
  const [page, setPage] = useState('home');
  const [tasks, setTasks] = useState(() => JSON.parse(localStorage.getItem('minTasks')) || []);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showSocials, setShowSocials] = useState(false);

  useEffect(() => { localStorage.setItem('minTasks', JSON.stringify(tasks)); }, [tasks]);

  const addTaskRange = (text, start, end, priority) => { setTasks(prev => [...prev, { id: Date.now(), text, start, end, priority, completed: false }]); };
  const editTaskRange = (id, text, start, end, priority) => { setTasks(prev => prev.map(t => t.id === id ? { ...t, text, start, end, priority } : t)); };
  const deleteTask = (id) => setTasks(prev => prev.filter(t => t.id !== id));
  const toggleComplete = (id) => { setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)); };

  const getThemeColors = () => {
    switch(page) {
      case 'timer': return { b1: 'bg-orange-300/60', b2: 'bg-rose-300/50', b3: 'bg-orange-200/50' };
      case 'planner': return { b1: 'bg-sky-200/50', b2: 'bg-blue-100/50', b3: 'bg-indigo-100/30' };
      default: return { b1: 'bg-yellow-200/40', b2: 'bg-pink-100/40', b3: 'bg-orange-100/30' };
    }
  };

  const colors = getThemeColors();

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-orange-100 overflow-x-hidden">
      <div className="fixed inset-0 -z-10 bg-[#fafafa]">
        <motion.div animate={{ x: [0, 100, 0], y: [0, 50, 0] }} transition={{ duration: 20, repeat: Infinity }} className={`absolute -top-10 -left-10 w-[600px] h-[600px] rounded-full blur-[100px] ${colors.b1} transition-colors duration-1000`} />
        <motion.div animate={{ x: [0, -80, 0], y: [0, 150, 0] }} transition={{ duration: 25, repeat: Infinity }} className={`absolute top-1/4 right-0 w-[500px] h-[500px] rounded-full blur-[120px] ${colors.b2} transition-colors duration-1000`} />
        <motion.div animate={{ x: [0, 50, 0], y: [0, -80, 0] }} transition={{ duration: 18, repeat: Infinity }} className={`absolute bottom-0 left-1/4 w-[650px] h-[650px] rounded-full blur-[110px] ${colors.b3} transition-colors duration-1000`} />
      </div>

      <header className="fixed top-8 left-0 w-full px-8 flex justify-between items-center z-50 pointer-events-none">
        <div className="w-12 pointer-events-auto">{page !== 'home' && <button onClick={() => setPage('home')} className="p-4 bg-white/80 backdrop-blur-md rounded-full text-slate-400 hover:text-black transition shadow-sm border border-white"><ArrowLeft size={20} /></button>}</div>
        
        <div className="flex flex-col items-center pointer-events-auto">
          <span className="text-sm font-bold tracking-[0.5em] text-slate-400 uppercase font-mono">Chikita v1</span>
          <span className="text-[10px] font-medium tracking-[0.3em] text-slate-300 uppercase mt-1">Plan, focus, and thrive</span>
        </div>
        
        <div className="w-12 pointer-events-auto relative flex justify-end">
          <button onClick={() => setShowSocials(!showSocials)} className="p-4 bg-white/50 backdrop-blur-md rounded-full border border-white/50 shadow-lg text-slate-600 hover:text-black transition-all">
            {showSocials ? <X size={20} /> : <MessageCircle size={20} />}
          </button>
          <AnimatePresence>
            {showSocials && (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 10 }} className="absolute top-16 right-0 w-64 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 space-y-4 text-left">
                <div className="px-2">
                  <h3 className="text-sm font-black text-slate-800">Created by J Bahulika</h3>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Reach Me</h4>
                </div>
                <a href="https://www.linkedin.com/in/j-bahulika-8b8237207/" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-blue-50 rounded-2xl text-blue-700 hover:bg-blue-100 transition-colors"><Linkedin size={18} /><span className="text-sm font-bold">LinkedIn</span></a>
                <a href="https://github.com/JBahulika" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl text-slate-700 hover:bg-slate-200 transition-colors"><Github size={18} /><span className="text-sm font-bold">GitHub</span></a>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <nav className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white/60 backdrop-blur-2xl border border-white/50 shadow-2xl px-12 py-6 rounded-full flex gap-14 z-50">
        <button onClick={() => setPage('home')} className={`transition-all duration-300 ${page === 'home' ? 'text-yellow-600 scale-125' : 'text-slate-400'}`}><Home size={26}/></button>
        <button onClick={() => setPage('timer')} className={`transition-all duration-300 ${page === 'timer' ? 'text-orange-500 scale-125' : 'text-slate-400'}`}><Clock size={26}/></button>
        <button onClick={() => setPage('planner')} className={`transition-all duration-300 ${page === 'planner' ? 'text-blue-500 scale-125' : 'text-slate-400'}`}><Calendar size={26}/></button>
      </nav>

      <main className="p-6 max-w-4xl mx-auto pt-36 pb-40">
        <AnimatePresence mode="wait">
          {page === 'home' && <HomePage key="home" setShowCalendar={setShowCalendar} />}
          {page === 'timer' && <TimerPage key="timer" />}
          {page === 'planner' && <PlannerPage key="planner" tasks={tasks} addTaskRange={addTaskRange} editTaskRange={editTaskRange} deleteTask={deleteTask} toggleComplete={toggleComplete} setShowCalendar={setShowCalendar} />}
        </AnimatePresence>
      </main>

      <AnimatePresence>{showCalendar && <CalendarOverlay tasks={tasks} onClose={() => setShowCalendar(false)} />}</AnimatePresence>
    </div>
  );
};

export default App;