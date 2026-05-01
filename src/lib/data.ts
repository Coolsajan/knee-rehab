import { supabase } from './supabaseClient'

export interface Exercise {
  key: string;
  name: string;
  sets: string;
  detail: string;
  gifUrl: string;
  gifCredit: string;
  warning?: string;
}

export interface DayData {
  status?: 'done' | 'skip';
  exercises?: Record<string, boolean>;
  pain?: number;
  note?: string;
  completedAt?: string;
  durationMin?: number;
}

export interface AppState {
  currentWeek: number;
  currentDay: number;
  dayData: Record<string, DayData>;
}

export function dayKey(w: number, d: number) {
  return `w${w}d${d}`;
}

//////////////////////////////////////////////////////
// LOAD STATE FROM SUPABASE
//////////////////////////////////////////////////////

export async function loadState(): Promise<AppState> {
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    console.log("No user found");
    return { currentWeek: 0, currentDay: 0, dayData: {} }
  }

  console.log("Loading sessions for user:", user.id)

  const { data, error } = await supabase
    .from('knee_sessions')
    .select('*')
    .eq('user_id', user.id)

  if (error) {
    console.error("DB LOAD ERROR:", error)
    return { currentWeek: 0, currentDay: 0, dayData: {} }
  }

  const dayData: Record<string, DayData> = {}

  data.forEach((row: any) => {
    // ⭐ CRITICAL FIX — SAME KEY FORMAT AS FRONTEND
    const key = `w${row.week}d${row.day}`

    dayData[key] = {
      status: row.status,
      exercises: row.exercises,
      pain: row.pain,
      note: row.note,
      completedAt: row.completed_at,
    }
  })

  return {
    currentWeek: 0,
    currentDay: 0,
    dayData,
  }
}

//////////////////////////////////////////////////////
// SAVE DAY TO SUPABASE
//////////////////////////////////////////////////////

export async function saveDayToDB(
  week: number,
  day: number,
  dayData: DayData
) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { error } = await supabase
    .from('knee_sessions')
    .upsert({
      user_id: user.id,
      week,
      day,
      status: dayData.status,
      exercises: dayData.exercises,
      pain: dayData.pain,
      note: dayData.note,
      completed_at: dayData.completedAt,
      updated_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,week,day' // ⭐ CRITICAL FIX
    })

  if (error) console.error("DB SAVE ERROR:", error)
}

//////////////////////////////////////////////////////
// STATS CALCULATION
//////////////////////////////////////////////////////

export function calcStats(dayData: Record<string, DayData>) {
  let totalDone = 0;
  let streak = 0;
  const painByWeek: number[][] = [[], [], [], []];
  const completionByWeek: number[] = [0, 0, 0, 0];

  for (let w = 0; w < 4; w++) {
    for (let d = 0; d < 7; d++) {
      const dk = dayKey(w, d);
      const data = dayData[dk];
      if (data?.status === 'done') {
        totalDone++;
        completionByWeek[w]++;
      }
      if (data?.pain !== undefined) painByWeek[w].push(data.pain);
    }
  }

  return { totalDone, streak, completionByWeek, painByWeek };
}
