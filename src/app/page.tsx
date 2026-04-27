'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, BarChart2, CheckCircle, SkipForward } from 'lucide-react';
import {
  EXERCISES, AppState, DayData,
  loadState, saveState, calcStats, dayKey,
} from '@/lib/data';
import ExerciseModal from '@/components/ExerciseModal';
import Report from '@/components/Report';
import AbsTracker from '@/components/AbsTracker';

export default function Home() {
  const [state, setState] = useState<AppState>({ currentWeek: 0, currentDay: 0, dayData: {} });
  const [hydrated, setHydrated] = useState(false);
  const [modalEx, setModalEx] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [selectedPain, setSelectedPain] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'knee' | 'abs'>('knee');

  useEffect(() => {
    const s = loadState();
    setState(s);
    setHydrated(true);
  }, []);

  const dk = dayKey(state.currentWeek, state.currentDay);
  const currentDayData: DayData = state.dayData[dk] || {};

  useEffect(() => {
    if (!hydrated) return;
    setSelectedPain(currentDayData.pain ?? null);
    setNote(currentDayData.note ?? '');
  }, [state.currentWeek, state.currentDay, hydrated]);

  const update = (newState: AppState) => {
    setState(newState);
    saveState(newState);
  };

  const toggleEx = (key: string) => {
    const updated = {
      ...state,
      dayData: {
        ...state.dayData,
        [dk]: {
          ...currentDayData,
          exercises: {
            ...(currentDayData.exercises || {}),
            [key]: !(currentDayData.exercises?.[key]),
          },
        },
      },
    };
    update(updated);
  };

  const completeDay = () => {
    const newDayData: DayData = { ...currentDayData, status: 'done', note, pain: selectedPain ?? undefined };
    const updated: AppState = {
      ...state,
      currentDay: state.currentDay + 1,
      dayData: { ...state.dayData, [dk]: newDayData },
    };
    update(updated);
    setSelectedPain(null);
    setNote('');
  };

  const skipDay = () => {
    const updated: AppState = {
      ...state,
      currentDay: state.currentDay + 1,
      dayData: { ...state.dayData, [dk]: { ...currentDayData, status: 'skip' } },
    };
    update(updated);
  };

  const stats = calcStats(state.dayData);
  const progress = Math.round((stats.totalDone / 28) * 100);
  const modalExercise = modalEx ? EXERCISES.find(e => e.key === modalEx) : null;

  if (!hydrated) return null;
  if (showReport) return <Report state={state} onBack={() => setShowReport(false)} />;

  // ABS TAB
  if (activeTab === 'abs') return (
    <div className="min-h-screen p-6">
      <div className="flex gap-2 mb-6">
        <button onClick={() => setActiveTab('knee')}>🦵 Knee Rehab</button>
        <button>💪 Abs</button>
      </div>
      <AbsTracker />
    </div>
  );

  // MAIN UI
  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">

      {modalExercise && <ExerciseModal exercise={modalExercise} onClose={() => setModalEx(null)} />}

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Rehab Tracker</h1>
          <p>Week {state.currentWeek + 1} • Day {state.currentDay + 1}</p>
        </div>
        <button onClick={() => setShowReport(true)} className="flex gap-2 items-center">
          <BarChart2 size={16}/> Report
        </button>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6">
        <button>🦵 Knee Rehab</button>
        <button onClick={() => setActiveTab('abs')}>💪 Abs</button>
      </div>

      {/* PROGRESS */}
      <div className="mb-6">
        <p className="mb-2">Progress {progress}%</p>
        <div className="w-full bg-gray-200 h-3 rounded">
          <div className="bg-green-500 h-3 rounded" style={{ width: `${progress}%` }}/>
        </div>
      </div>

      {/* EXERCISES */}
      <div className="space-y-3 mb-6">
        {EXERCISES.map(ex => (
          <div key={ex.key} className="flex justify-between border p-3 rounded">
            <span>{ex.name}</span>
            <button onClick={() => toggleEx(ex.key)}>
              <CheckCircle/>
            </button>
          </div>
        ))}
      </div>

      {/* PAIN SELECT */}
      <div className="mb-6">
        <p className="mb-2">Pain Level</p>
        <div className="flex gap-2">
          {[0,1,2,3,4,5,6,7,8,9,10].map(n => (
            <button key={n} onClick={() => setSelectedPain(n)} className="border px-2">
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* NOTES */}
      <textarea
        placeholder="Notes..."
        value={note}
        onChange={(e)=>setNote(e.target.value)}
        className="w-full border p-2 mb-6"
      />

      {/* ACTION BUTTONS */}
      <div className="flex gap-4">
        <button onClick={completeDay} className="flex gap-2 items-center border px-4 py-2">
          <CheckCircle size={16}/> Complete Day
        </button>
        <button onClick={skipDay} className="flex gap-2 items-center border px-4 py-2">
          <SkipForward size={16}/> Skip
        </button>
      </div>

    </div>
  );
}
