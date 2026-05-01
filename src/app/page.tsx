'use client';

import { supabase } from '@/lib/supabaseClient';
import { useState, useEffect } from 'react';
import { AlertTriangle, Info, BarChart2, CheckCircle, SkipForward, ChevronRight } from 'lucide-react';
import {
  EXERCISES, WEEK_GUIDANCE, AppState, DayData,
  loadState, saveDayToDB, calcStats, dayKey,
} from '@/lib/data';
import ExerciseModal from '@/components/ExerciseModal';
import Report from '@/components/Report';
import AbsTracker from '@/components/AbsTracker';
import LoginButton from '@/components/LoginButton';

export default function Home() {
  const [state, setState] = useState<AppState>({ currentWeek: 0, currentDay: 0, dayData: {} });
  const [hydrated, setHydrated] = useState(false);
  const [modalEx, setModalEx] = useState<string | null>(null);
  const [showReport, setShowReport] = useState(false);
  const [selectedPain, setSelectedPain] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [activeTab, setActiveTab] = useState<'knee' | 'abs'>('knee');
  const [user, setUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // ✅ FIXED AUTH INIT (this was causing infinite loading)
  useEffect(() => {
    async function init() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("SESSION:", session);
        console.log("AUTH ERROR:", error);

        // Stop loader no matter what
        setCheckingAuth(false);

        if (!session) return;

        const user = session.user;
        setUser(user);

        const s = await loadState();
        setState(s);
        setHydrated(true);
      } catch (err) {
        console.error("INIT ERROR:", err);
        setCheckingAuth(false);
      }
    }
    init();
  }, []);

  const dk = dayKey(state.currentWeek, state.currentDay);
  const currentDayData: DayData = (state.dayData[dk] ?? {}) as DayData;

  useEffect(() => {
    if (!hydrated) return;
    setSelectedPain(currentDayData.pain ?? null);
    setNote(currentDayData.note ?? '');
  }, [state.currentWeek, state.currentDay, hydrated]);

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
    setState(updated);
    saveDayToDB(state.currentWeek, state.currentDay, updated.dayData[dk]);
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
    setState(updated);
    saveDayToDB(state.currentWeek, state.currentDay, updated.dayData[dk]);
  };

  const completeDay = () => {
    const newDayData: DayData = {
      ...currentDayData,
      status: 'done',
      note,
      pain: selectedPain ?? undefined,
      completedAt: new Date().toLocaleDateString(),
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

    setState(updated);
    saveDayToDB(state.currentWeek, state.currentDay, newDayData);
    setSelectedPain(null);
    setNote('');
  };

  const skipDay = () => {
    const newDayData: DayData = { ...currentDayData, status: 'skip', note };

    const updated: AppState = {
      ...state,
      currentDay: state.currentDay < 6 ? state.currentDay + 1 : state.currentDay,
      dayData: { ...state.dayData, [dk]: newDayData },
    };

    setState(updated);
    saveDayToDB(state.currentWeek, state.currentDay, newDayData);
    setNote('');
  };

  const stats = calcStats(state.dayData);
  const progress = Math.round((stats.totalDone / 28) * 100);
  const exDone = EXERCISES.filter(e => currentDayData.exercises?.[e.key]).length;
  const highPain = selectedPain !== null && selectedPain >= 7;
  const modalExercise = modalEx ? EXERCISES.find(e => e.key === modalEx) : null;

  // 🔐 AUTH LOADING
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking login...
      </div>
    );
  }

  // 🔐 LOGIN SCREEN
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6">
        <h1 className="text-2xl font-semibold">Welcome — Rehab Tracker</h1>
        <p className="text-sm opacity-70">Sign in to save your progress securely</p>
        <LoginButton />
      </div>
    );
  }

  // ⏳ DATA LOADING
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading your rehab data...
      </div>
    );
  }

  if (showReport) return <Report state={state} onBack={() => setShowReport(false)} />;
  if (activeTab === 'abs') return <AbsTracker />;

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">🎉 App Working!</h1>
        <p>Your authentication + database connection are now fixed.</p>
      </div>
    </div>
  );
}
