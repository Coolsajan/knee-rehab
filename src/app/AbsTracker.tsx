'use client';
import { useState, useEffect } from 'react';
import { CheckCircle, SkipForward, ChevronRight, Info } from 'lucide-react';
import {
  AbsState, AbsDayData, loadAbsState, saveAbsState,
  getExercisesForWeek, getPhaseForWeek, absKey, calcAbsStats,
  ABS_PHASES,
} from '@/lib/absData';
import ExerciseModal from '@/components/ExerciseModal';
import { AbsExercise } from '@/lib/absData';

// Adapter: AbsExercise → Exercise shape ExerciseModal expects
function toModalExercise(ex: AbsExercise) {
  return { ...ex, warning: undefined, gifCredit: ex.gifCredit };
}

export default function AbsTracker() {
  const [state, setState] = useState<AbsState>({ currentWeek: 0, currentDay: 0, dayData: {} });
  const [hydrated, setHydrated] = useState(false);
  const [modalEx, setModalEx] = useState<AbsExercise | null>(null);
  const [note, setNote] = useState('');

  useEffect(() => {
    setState(loadAbsState());
    setHydrated(true);
  }, []);

  const dk = absKey(state.currentWeek, state.currentDay);
  const currentDayData: AbsDayData = state.dayData[dk] || {};
  const exercises = getExercisesForWeek(state.currentWeek);
  const phase = getPhaseForWeek(state.currentWeek);

  useEffect(() => {
    if (!hydrated) return;
    setNote(currentDayData.note ?? '');
  }, [state.currentWeek, state.currentDay, hydrated]);

  const update = (s: AbsState) => { setState(s); saveAbsState(s); };

  const toggleEx = (key: string) => {
    update({
      ...state,
      dayData: {
        ...state.dayData,
        [dk]: {
          ...currentDayData,
          exercises: { ...(currentDayData.exercises || {}), [key]: !(currentDayData.exercises?.[key]) },
        },
      },
    });
  };

  const completeDay = () => {
    const newData: AbsDayData = {
      ...currentDayData,
      status: 'done',
      note,
      completedAt: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    };
    let nw = state.currentWeek, nd = state.currentDay;
    if (nd < 6) nd++; else if (nw < 15) { nw++; nd = 0; }
    update({ currentWeek: nw, currentDay: nd, dayData: { ...state.dayData, [dk]: newData } });
    setNote('');
  };

  const skipDay = () => {
    const nd = state.currentDay < 6 ? state.currentDay + 1 : state.currentDay;
    update({ ...state, currentDay: nd, dayData: { ...state.dayData, [dk]: { ...currentDayData, status: 'skip', note } } });
    setNote('');
  };

  const stats = calcAbsStats(state.dayData);
  const progress = Math.round((stats.totalDone / stats.totalDays) * 100);
  const exDone = exercises.filter(e => currentDayData.exercises?.[e.key]).length;

  if (!hydrated) return null;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {modalEx && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
          onClick={() => setModalEx(null)}
        >
          <div className="card-glow w-full max-w-lg animate-in" style={{ maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between p-5 pb-3">
              <div>
                <p className="mono text-xs mb-1" style={{ color: 'var(--teal)', letterSpacing: '0.08em' }}>AB EXERCISE GUIDE</p>
                <h2 className="text-lg font-medium">{modalEx.name}</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{modalEx.sets}</p>
              </div>
              <button onClick={() => setModalEx(null)} className="p-1.5 rounded-lg" style={{ border: '1px solid var(--border)', color: 'var(--text-muted)' }}>✕</button>
            </div>
            <div className="mx-5 mb-4 rounded-lg overflow-hidden" style={{ background: 'var(--bg3)', aspectRatio: '16/9' }}>
              <img src={modalEx.gifUrl} alt={modalEx.name} className="w-full h-full object-cover" />
            </div>
            <p className="text-center text-xs mx-5 mb-4" style={{ color: 'var(--text-dim)' }}>{modalEx.gifCredit}</p>
            <div className="mx-5 mb-5 p-4 rounded-lg" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
              <p className="text-xs font-medium mb-2 mono" style={{ color: 'var(--teal)', letterSpacing: '0.06em' }}>HOW TO DO IT</p>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{modalEx.detail}</p>
            </div>
            <div className="px-5 pb-5">
              <button className="btn-primary w-full" onClick={() => setModalEx(null)}>Got it, let&apos;s go</button>
            </div>
          </div>
        </div>
      )}

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{stats.totalDone} of {stats.totalDays} sessions done</span>
          <span className="mono text-sm font-medium" style={{ color: 'var(--teal)' }}>{progress}%</span>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: 'var(--bg3)' }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #6366f1, #8b5cf6)' }} />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: 'Week', value: `${state.currentWeek + 1}`, unit: 'of 16' },
          { label: 'Phase', value: phase.phase, unit: phase.title },
          { label: "Today's ex", value: `${exDone}/${exercises.length}`, unit: 'done' },
        ].map((s, i) => (
          <div key={i} className="card p-3 text-center">
            <div className="mono text-xs mb-1" style={{ color: 'var(--text-dim)', letterSpacing: '0.05em' }}>{s.label.toUpperCase()}</div>
            <div className="text-xl font-medium">{s.value}<span className="text-sm ml-0.5" style={{ color: 'var(--text-dim)' }}> {s.unit}</span></div>
          </div>
        ))}
      </div>

      {/* Phase tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {ABS_PHASES.map((p, i) => {
          const isActive = p.weeks.includes(state.currentWeek);
          const phaseDone = p.weeks.every(w => [0,1,2,3,4,5,6].every(d => state.dayData[absKey(w,d)]?.status === 'done'));
          return (
            <button key={i} onClick={() => update({ ...state, currentWeek: p.weeks[0], currentDay: 0 })}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: isActive ? 'rgba(99,102,241,0.15)' : 'var(--bg2)',
                border: `1px solid ${isActive ? '#6366f1' : phaseDone ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                color: isActive ? '#818cf8' : phaseDone ? '#a5b4fc' : 'var(--text-muted)',
              }}>
              P{p.phase} {phaseDone && '✓'}
            </button>
          );
        })}
      </div>

      {/* Week selector within phase */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {phase.weeks.map(w => {
          const isActive = w === state.currentWeek;
          const weekDone = [0,1,2,3,4,5,6].every(d => state.dayData[absKey(w,d)]?.status === 'done');
          return (
            <button key={w} onClick={() => update({ ...state, currentWeek: w, currentDay: 0 })}
              className="px-3 py-1.5 rounded-lg text-xs font-medium mono transition-all"
              style={{
                background: isActive ? 'rgba(99,102,241,0.15)' : 'var(--bg2)',
                border: `1px solid ${isActive ? '#6366f1' : weekDone ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
                color: isActive ? '#818cf8' : weekDone ? '#a5b4fc' : 'var(--text-muted)',
              }}>
              W{w + 1} {weekDone && '✓'}
            </button>
          );
        })}
      </div>

      {/* Phase guidance */}
      <div className="p-3 rounded-lg mb-5 flex gap-3 items-start" style={{ background: 'rgba(99,102,241,0.06)', border: '1px solid rgba(99,102,241,0.2)' }}>
        <Info size={14} style={{ color: '#818cf8', flexShrink: 0, marginTop: 1 }} />
        <div>
          <p className="text-sm font-medium mb-0.5" style={{ color: '#818cf8' }}>{phase.focus}</p>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>{phase.detail}</p>
        </div>
      </div>

      {/* Day selector */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[0,1,2,3,4,5,6].map(d => {
          const dk2 = absKey(state.currentWeek, d);
          const data = state.dayData[dk2];
          const isActive = d === state.currentDay;
          return (
            <button key={d} onClick={() => update({ ...state, currentDay: d })}
              className="w-10 h-10 rounded-lg text-xs font-medium mono transition-all"
              style={{
                background: isActive ? '#6366f1' : data?.status === 'done' ? 'rgba(99,102,241,0.15)' : 'var(--bg2)',
                border: `1px solid ${isActive ? '#6366f1' : data?.status === 'done' ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
                color: isActive ? '#fff' : data?.status === 'done' ? '#a5b4fc' : data?.status === 'skip' ? 'var(--text-dim)' : 'var(--text-muted)',
                textDecoration: data?.status === 'skip' ? 'line-through' : 'none',
              }}>
              D{d + 1}
            </button>
          );
        })}
      </div>

      {/* Exercises */}
      <p className="mono text-xs mb-3" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>TODAY&apos;S AB EXERCISES</p>
      <div className="flex flex-col gap-3 mb-6">
        {exercises.map(ex => {
          const done = currentDayData.exercises?.[ex.key] ?? false;
          return (
            <div key={ex.key} className="card-glow p-4 flex items-center gap-4 cursor-pointer transition-all"
              style={{ borderColor: done ? 'rgba(99,102,241,0.5)' : 'var(--border)', background: done ? 'rgba(99,102,241,0.05)' : 'var(--bg2)' }}
              onClick={() => toggleEx(ex.key)}>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 transition-all"
                style={{ background: done ? '#6366f1' : 'transparent', border: `1.5px solid ${done ? '#6366f1' : 'var(--border-strong)'}` }}>
                {done && <CheckCircle size={14} color="#fff" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: done ? '#a5b4fc' : 'var(--text)' }}>{ex.name}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{ex.sets}</p>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-all flex-shrink-0"
                style={{ background: 'var(--bg3)', border: '1px solid var(--border)', color: '#818cf8' }}
                onClick={e => { e.stopPropagation(); setModalEx(ex); }}>
                How to <ChevronRight size={11} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Notes */}
      <p className="mono text-xs mb-2" style={{ color: 'var(--text-dim)', letterSpacing: '0.08em' }}>SESSION NOTES</p>
      <textarea className="w-full rounded-xl p-3 text-sm mb-6 resize-none"
        style={{ background: 'var(--bg2)', border: '1px solid var(--border)', color: 'var(--text)', fontFamily: 'DM Sans, sans-serif', minHeight: 72, outline: 'none' }}
        placeholder="How did it feel? Any form issues, new PRs..."
        value={note} onChange={e => setNote(e.target.value)} />

      {/* Actions */}
      <div className="flex gap-3">
        <button className="btn-primary flex-1 flex items-center justify-center gap-2"
          style={{ background: currentDayData.status === 'done' ? 'var(--bg3)' : '#6366f1' }}
          onClick={completeDay} disabled={currentDayData.status === 'done'}>
          <CheckCircle size={16} />
          {currentDayData.status === 'done' ? 'Day completed ✓' : 'Mark complete'}
        </button>
        <button className="btn-ghost flex items-center gap-2" onClick={skipDay} disabled={currentDayData.status === 'done'}>
          <SkipForward size={15} /> Skip
        </button>
      </div>
    </div>
  );
}
