'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, Info, BarChart2, CheckCircle, SkipForward, ChevronRight } from 'lucide-react';
import {
  EXERCISES, WEEK_GUIDANCE, AppState, DayData,
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

  const setPain = (val: number) => {
    setSelectedPain(val);
    const updated = {
      ...state,
      dayData: {
        ...state.dayData,
        [dk]: { ...currentDayData, pain: val },
      },
    };
    update(updated);
  };

  const completeDay = () => {
    const newDayData: DayData = {
      ...currentDayData,
      status: 'done',
      note,
      pain: selectedPain ?? undefined,
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };

    let nextWeek = state.currentWeek;
    let nextDay = state.currentDay;

    if (state.currentDay < 6) nextDay++;
    else if (state.currentWeek < 3) { nextWeek++; nextDay = 0; }

    update({
      currentWeek: nextWeek,
      currentDay: nextDay,
      dayData: { ...state.dayData, [dk]: newDayData },
    });

    setSelectedPain(null);
    setNote('');
  };

  const skipDay = () => {
    const newDayData: DayData = { ...currentDayData, status: 'skip', note };

    update({
      ...state,
      currentDay: state.currentDay < 6 ? state.currentDay + 1 : state.currentDay,
      dayData: { ...state.dayData, [dk]: newDayData },
    });

    setNote('');
  };

  const stats = calcStats(state.dayData);
  const progress = Math.round((stats.totalDone / 28) * 100);
  const exDone = EXERCISES.filter(e => currentDayData.exercises?.[e.key]).length;
  const highPain = selectedPain !== null && selectedPain >= 7;
  const modalExercise = modalEx ? EXERCISES.find(e => e.key === modalEx) : null;

  if (!hydrated) return null;
  if (showReport) return <Report state={state} onBack={() => setShowReport(false)} />;

  if (activeTab === 'abs') {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <div className="max-w-2xl mx-auto px-4 pt-8">
          <h1 className="text-2xl font-medium">Ab Tracker</h1>
        </div>
        <AbsTracker />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {modalExercise && <ExerciseModal exercise={modalExercise} onClose={() => setModalEx(null)} />}

      <div className="max-w-2xl mx-auto px-4 py-8">

        <div className="flex justify-between mb-6">
          <h1 className="text-2xl font-medium">Rehab Tracker</h1>
          <button onClick={() => setShowReport(true)} className="btn-ghost flex items-center gap-2">
            <BarChart2 size={15}/> Report
          </button>
        </div>

        {/* Progress */}
        <p className="mb-4">{stats.totalDone} of 28 sessions done ({progress}%)</p>

        {/* Exercises */}
        <p className="mono text-xs mb-3">{"TODAY'S EXERCISES"}</p>

        <div className="flex flex-col gap-3 mb-6">
          {EXERCISES.map(ex => {
            const done = currentDayData.exercises?.[ex.key] ?? false;
            return (
              <div key={ex.key} className="card-glow p-4 flex items-center gap-4 cursor-pointer"
                   onClick={() => toggleEx(ex.key)}>

                <div className="w-6 h-6 rounded-full flex items-center justify-center">
                  {done && <CheckCircle size={14} />}
                </div>

                <div className="flex-1">
                  <p className="text-sm font-medium">{ex.name}</p>
                  <p className="text-xs">{ex.sets}</p>
                </div>

                <button onClick={e => { e.stopPropagation(); setModalEx(ex.key); }}
                        className="px-3 py-1 rounded-lg text-xs">
                  How to <ChevronRight size={11}/>
                </button>
              </div>
            );
          })}
        </div>

        {/* Pain scale */}
        <p className="mono text-xs mb-3">PAIN LEVEL AFTER SESSION</p>
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 11 }, (_, i) => (
            <button key={i} onClick={() => setPain(i)} className="w-9 h-9 rounded-lg">
              {i}
            </button>
          ))}
        </div>

        <textarea
          className="w-full rounded-xl p-3 text-sm mb-6"
          placeholder="Any swelling, tightness, clicking, or how it felt..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        <div className="flex gap-3">
          <button className="btn-primary flex-1 flex items-center justify-center gap-2"
                  onClick={completeDay}>
            <CheckCircle size={16}/> Mark complete
          </button>

          <button className="btn-ghost flex items-center gap-2" onClick={skipDay}>
            <SkipForward size={15}/> Skip
          </button>
        </div>

      </div>
    </div>
  );
}
