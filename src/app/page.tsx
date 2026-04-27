'use client';
import { useState, useEffect } from 'react';
import { AlertTriangle, Info, BarChart2, CheckCircle, SkipForward, ChevronRight } from 'lucide-react';
import {
  EXERCISES, WEEK_GUIDANCE, AppState, DayData,
  loadState, saveState, calcStats, dayKey,
} from '@/lib/data';
import ExerciseModal from '@/components/ExerciseModal';
import Report from '@/components/Report';

export default function Home() {
  const [state, setState] = useState<AppState>({ currentWeek: 0, currentDay: 0, dayData: {} });
  const [hydrated, setHydrated] = useState(false);
  const [modalEx, setModalEx] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [selectedPain, setSelectedPain] = useState<number | null>(null);
  const [note, setNote] = useState('');

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
    const updated: AppState = {
      currentWeek: nextWeek,
      currentDay: nextDay,
      dayData: { ...state.dayData, [dk]: newDayData },
    };
    update(updated);
    setSelectedPain(null);
    setNote('');
  };

  const skipDay = () => {
    const newDayData: DayData = { ...currentDayData, status: 'skip', note };
    let nextDay = state.currentDay < 6 ? state.currentDay + 1 : state.currentDay;
    const updated: AppState = {
      ...state,
      currentDay: nextDay,
      dayData: { ...state.dayData, [dk]: newDayData },
    };
    update(updated);
    setNote('');
  };

  const stats = calcStats(state.dayData);
  const progress = Math.round((stats.totalDone / 28) * 100);
  const exDone = EXERCISES.filter(e => currentDayData.exercises?.[e.key]).length;
  const highPain = selectedPain !== null && selectedPain >= 7;
  const modalExercise = modalEx ? EXERCISES.find(e => e.key === modalEx) : null;

  if (!hydrated) return null;
  if (showReport) return <Report state={state} onBack={() => setShowReport(false)} />;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* Modal */}
      {modalExercise && <ExerciseModal exercise={modalExercise} onClose={() => setModalEx(null)} />}

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="mono text-xs" style={{ color: 'var(--teal)', letterSpacing: '0.1em' }}>HEMOPHILIA A — RIGHT KNEE PROTOCOL</p>
            <h1 className="text-2xl font-medium mt-1" style={{ color: 'var(--text)' }}>Rehab Tracker</h1>
          </div>
          <button
            className="btn-ghost flex items-center gap-2 text-sm"
            onClick={() => setShowReport(true)}
          >
            <BarChart2 size={15} />
            Report
          </button>
        </div>

        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{stats.totalDone} of 28 sessions done</span>
            <span className="mono text-sm font-medium" style={{ color: 'var(--teal)' }}>{progress}%</span>
          </div>
          <div className="h-1.5 rounded-full" style={{ background: 'var(--bg3)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--teal), #5DCAA5)' }}
            />
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {[
            { label: 'streak', value: stats.streak, unit: 'days' },
            { label: 'avg pain', value: stats.avgPain ?? '—', unit: '/10' },
            { label: "today's ex", value: `${exDone}/${EXERCISES.length}`, unit: 'done' },
          ].map((s, i) => (
            <div key={i} className="card p-3 text-center">
              <div className="mono text-xs mb-1" style={{ color: 'var(--text-dim)', letterSpacing: '0.05em' }}>{s.label.toUpperCase()}</div>
              <div className="text-xl font-medium" style={{ color: 'var(--text)' }}>
                {s.value}<span className="text-sm ml-0.5" style={{ color: 'var(--text-dim)' }}>{s.unit}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Week tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {[0, 1, 2, 3].map(w => {
            const weekDone = [0,1,2,3,4,5,6].every(d => state.dayData[dayKey(w,d)]?.status === 'done');
            const isActive = w === state.currentWeek;
            return (
              <button
                key={w}
                onClick={() => update({ ...state, currentWeek: w, currentDay: 0 })}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: isActive ? 'rgba(29,158,117,0.15)' : 'var(--bg2)',
                  border: `1px solid ${isActive ? 'var(--teal)' : weekDone ? 'rgba(29,158,117,0.4)' : 'var(--border)'}`,
                  color: isActive ? 'var(--teal)' : weekDone ? '#5DCAA5' : 'var(--text-muted)',
                }}
              >
                W{w + 1} {weekDone && '✓'}
              </button>
            );
          })}
        </div>

        {/* Week guidance */}
        <div className="p-3 rounded-lg mb-5 flex gap-3 items-start" style={{ background: 'rgba(29,158,117,0.06)', border: '1px solid var(--border)' }}>
          <Info size={14} style={{ color: 'var(--teal)', flexShrink: 0, marginTop: 1 }} />
          <div>
            <p className="text-sm font-medium mb-0.5" style={{ color: 'var(--teal)' }}>{WEEK_GUIDANCE[state.currentWeek].focus}</p>
            <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{WEEK_GUIDANCE[state.currentWeek].detail}</p>
          </div>
        </div>

        {/* Day selector */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[0, 1, 2, 3, 4, 5, 6].map(d => {
            const dk2 = dayKey(state.currentWeek, d);
            const data = state.dayData[dk2];
            const isActive = d === state.currentDay;
            return (
              <button
                key={d}
                onClick={() => update({ ...state, currentDay: d })}
                className="w-10 h-10 rounded-lg text-xs font-medium mono transition-all"
                style={{
                  background: isActive ? 'var(--teal)' : data?.status === 'done' ? 'rgba(29,158,117,0.15)' : data?.status === 'skip' ? 'var(--bg3)' : 'var(--bg2)',
                  border: `1px solid ${isActive ? 'var(--teal)' : data?.status === 'done' ? 'rgba(29,158,117,0.4)' : 'var(--border)'}`,
                  color: isActive ? '#fff' : data?.status === 'done' ? '#5DCAA5' : data?.status === 'skip' ? 'var(--text-dim)' : 'var(--text-muted)',
                  textDecoration: data?.status === 'skip' ? 'line-through' : 'none',
                }}
              >
                D{d + 1}
              </button>
            );
          })}
        </div>

        {/* High pain warning */}
        {highPain && (
          <div className="p-3 rounded-lg mb-5 flex gap-3 items-start animate-in" style={{ background: '#FCEBEB15', border: '1px solid rgba(226,75,74,0.4)' }}>
            <AlertTriangle size={14} style={{ color: '#E24B4A', flexShrink: 0, marginTop: 1 }} />
            <p className="text-sm leading-relaxed" style={{ color: '#E24B4A' }}>
              Pain ≥7 detected. <strong>Stop immediately.</strong> Rest, monitor for swelling. If the joint swells, contact your hematologist — this may indicate a hemarthrosis bleed.
            </p>
          </div>
        )}

        {/* Exercises */}
        <p className="mono text-xs mb-3" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>TODAY&apos;S EXERCISES</p>
        <div className="flex flex-col gap-3 mb-6">
          {EXERCISES.map(ex => {
            const done = currentDayData.exercises?.[ex.key] ?? false;
            return (
              <div
                key={ex.key}
                className="card-glow p-4 flex items-center gap-4 cursor-pointer transition-all"
                style={{
                  borderColor: done ? 'rgba(29,158,117,0.5)' : 'var(--border)',
                  background: done ? 'rgba(29,158,117,0.05)' : 'var(--bg2)',
                }}
                onClick={() => toggleEx(ex.key)}
              >
                {/* Checkbox */}
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                  style={{
                    background: done ? 'var(--teal)' : 'transparent',
                    border: `1.5px solid ${done ? 'var(--teal)' : 'var(--border-strong)'}`,
                  }}
                >
                  {done && <CheckCircle size={14} color="#fff" />}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: done ? '#5DCAA5' : 'var(--text)' }}>{ex.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{ex.sets}</p>
                </div>

                {/* Tutorial button */}
                <button
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all flex-shrink-0"
                  style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: 'var(--teal)' }}
                  onClick={e => { e.stopPropagation(); setModalEx(ex.key); }}
                >
                  How to <ChevronRight size={11} />
                </button>
              </div>
            );
          })}
        </div>

        {/* Pain scale */}
        <p className="mono text-xs mb-3" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>PAIN LEVEL AFTER SESSION</p>
        <div className="flex gap-1.5 flex-wrap mb-6">
          {Array.from({ length: 11 }, (_, i) => {
            const isSelected = selectedPain === i;
            const color = i <= 2 ? '#1D9E75' : i <= 5 ? '#EF9F27' : '#E24B4A';
            return (
              <button
                key={i}
                onClick={() => setPain(i)}
                className="w-9 h-9 rounded-lg mono text-sm font-medium transition-all"
                style={{
                  background: isSelected ? color + '30' : 'var(--bg2)',
                  border: `1px solid ${isSelected ? color : 'var(--border)'}`,
                  color: isSelected ? color : 'var(--text-muted)',
                }}
              >
                {i}
              </button>
            );
          })}
        </div>

        {/* Notes */}
        <p className="mono text-xs mb-2" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>SESSION NOTES</p>
        <textarea
          className="w-full rounded-xl p-3 text-sm mb-6 resize-none"
          style={{
            background: 'var(--bg2)',
            border: '1px solid var(--border)',
            color: 'var(--text)',
            fontFamily: 'DM Sans, sans-serif',
            minHeight: 80,
            outline: 'none',
          }}
          placeholder="Any swelling, tightness, clicking, or how it felt..."
          value={note}
          onChange={e => setNote(e.target.value)}
        />

        {/* Actions */}
        <div className="flex gap-3">
          <button
            className="btn-primary flex-1 flex items-center justify-center gap-2"
            onClick={completeDay}
            disabled={currentDayData.status === 'done'}
            style={{ opacity: currentDayData.status === 'done' ? 0.5 : 1 }}
          >
            <CheckCircle size={16} />
            {currentDayData.status === 'done' ? 'Day completed' : 'Mark complete'}
          </button>
          <button
            className="btn-ghost flex items-center gap-2"
            onClick={skipDay}
            disabled={currentDayData.status === 'done'}
          >
            <SkipForward size={15} />
            Skip
          </button>
        </div>

        <p className="text-center text-xs mt-8" style={{ color: 'var(--text-dim)' }}>
          Data saved locally in your browser. Clear cache = reset tracker.
        </p>
      </div>
    </div>
  );
}
