'use client';

import { useState, useEffect } from 'react';
import { BarChart2, CheckCircle, SkipForward } from 'lucide-react';
import {
  EXERCISES,
  AppState,
  DayData,
  loadState,
  saveState,
  calcStats,
  dayKey,
} from '@/lib/data';
import ExerciseModal from '@/components/ExerciseModal';
import Report from '@/components/Report';
import AbsTracker from '@/components/AbsTracker';

export default function Home() {
  const [state, setState] = useState<AppState>({
    currentWeek: 0,
    currentDay: 0,
    dayData: {},
  });

  const [hydrated, setHydrated] = useState(false);
  const [modalEx, setModalEx] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [selectedPain, setSelectedPain] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'knee' | 'abs'>('knee');

  useEffect(() => {
    const saved = loadState();
    setState(saved);
    setHydrated(true);
  }, []);

  const dk = dayKey(state.currentWeek, state.currentDay);
  const today: DayData = state.dayData[dk] || {};

  const update = (newState: AppState) => {
    setState(newState);
    saveState(newState);
  };

  const toggleExercise = (key: string) => {
    const updated = {
      ...state,
      dayData: {
        ...state.dayData,
        [dk]: {
          ...today,
          exercises: {
            ...(today.exercises || {}),
            [key]: !(today.exercises?.[key]),
          },
        },
      },
    };
    update(updated);
  };

  const completeDay = () => {
    const updated: AppState = {
      ...state,
      currentDay: state.currentDay + 1,
      dayData: {
        ...state.dayData,
        [dk]: { ...today, status: 'done', pain: selectedPain ?? undefined, note },
      },
    };
    update(updated);
    setSelectedPain(null);
    setNote('');
  };

  const skipDay = () => {
    const updated: AppState = {
      ...state,
      currentDay: state.currentDay + 1,
      dayData: { ...state.dayData, [dk]: { ...today, status: 'skip' } },
    };
    update(updated);
  };

  const stats = calcStats(state.dayData);
  const progress = Math.round((stats.totalDone / 28) * 100);
  const modalExercise = modalEx ? EXERCISES.find(e => e.key === modalEx) : null;

  if (!hydrated) return null;
  if (showReport) return <Report state={state} onBack={() => setShowReport(false)} />;

  // ABS TAB
  if (activeTab === 'abs') {
    return (
      <div className="min-h-screen p-6 max-w-2xl mx-auto">
        <div className="flex gap-2 mb-6">
          <button onClick={() => setActiveTab('knee')}>🦵 Knee Rehab</button>
          <button>💪 Abs</button>
        </div>
        <AbsTracker />
      </div>
    );
  }

  // KNEE TAB
  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto">
      {modalExercise && (
        <ExerciseModal exercise={modalExercise} onClose={() => setModalEx(null)} />
      )}

      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Rehab Tracker</h1>
          <p>
            Week {state.currentWeek + 1} • Day {state.currentDay + 1}
          </p>
        </div>
        <button onClick={() => setShowReport(true)} className="flex gap-2 items-center">
          <BarChart2 size={16} /> Report
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        <button>🦵 Knee Rehab</button>
        <button onClick={() => setActiveTab('abs')}>💪 Abs</button>
      </div>

      <p className="mb-2">Progress {progress}%</p>
      <div className="w-full bg-gray-200 h-3 rounded mb-6">
        <div className="bg-green-500 h-3 rounded" style={{ width: `${progress}%` }} />
      </div>

      <div className="space-y-3 mb-6">
        {EXERCISES.map(ex => (
          <div key={ex.key} className="flex justify-between border p-3 rounded">
            <span>{ex.name}</span>
            <button onClick={() => toggleExercise(ex.key)}>
              <CheckCircle />
            </button>
          </div>
        ))}
      </div>

      <textarea
        placeholder="Notes..."
        value={note}
        onChange={e => setNote(e.target.value)}
        className="w-full border p-2 mb-6"
      />

      <div className="flex gap-4">
        <button onClick={completeDay} className="flex gap-2 items-center border px-4 py-2">
          <CheckCircle size={16} /> Complete
        </button>
        <button onClick={skipDay} className="flex gap-2 items-center border px-4 py-2">
          <SkipForward size={16} /> Skip
        </button>
      </div>
    </div>
  );
}
