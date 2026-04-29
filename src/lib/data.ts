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

export const EXERCISES: Exercise[] = [
  {
    key: 'slr',
    name: 'Straight leg raises',
    sets: '3 × 15 each leg',
    detail: 'Lie flat on your back. Bend the left knee, keep right leg straight. Raise it to 45°, hold 2 seconds, lower slowly over 3 seconds. Switch legs.',
    gifUrl: 'https://pin.it/6UJvXnrn0',
    gifCredit: 'Straight Leg Raise — quad activation without knee bend',
    warning: undefined,
  },
  {
    key: 'tke',
    name: 'Terminal knee extensions',
    sets: '3 × 15 reps',
    detail: 'Loop a resistance band around a fixed point at knee height. Stand facing the anchor, place the band behind your right knee. Bend the knee slightly, then fully straighten it against the band resistance. Hold 1 second at full extension.',
    gifUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/11/standing-terminal-knee-extension.gif',
    gifCredit: 'Terminal Knee Extension — VMO activation',
    warning: undefined,
  },
  {
    key: 'scr',
    name: 'Seated calf raises',
    sets: '3 × 20 reps',
    detail: 'Sit in a chair with feet flat. Raise both heels as high as possible, pause 1 second, lower slowly over 3 seconds.',
    gifUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/09/seated-calf-raise.gif',
    gifCredit: 'Seated Calf Raise — zero knee stress',
    warning: undefined,
  },
  {
    key: 'phe',
    name: 'Prone hip extensions',
    sets: '3 × 15 each leg',
    detail: 'Lie face down on a mat, legs straight. Squeeze the right glute and raise the right leg 20–30cm off the floor. Hold 2 seconds, lower slowly. Keep hip bones pressed into the mat throughout.',
    gifUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/09/prone-hip-extension.gif',
    gifCredit: 'Prone Hip Extension — glute activation',
    warning: undefined,
  },
  {
    key: 'apr',
    name: 'Ankle pumps + knee ROM',
    sets: '2 minutes continuous',
    detail: 'Sit or lie with legs extended. Slowly flex and point ankles (30 reps). Then gently bend and straighten the knee through pain-free range only — never force past discomfort.',
    gifUrl: 'https://www.inspireusafoundation.org/wp-content/uploads/2022/09/ankle-circles.gif',
    gifCredit: 'Ankle Pumps — circulation & joint mobility',
    warning: 'STOP if any pain above 3/10. Never force range of motion.',
  },
];
export const WEEK_GUIDANCE = [
  {
    title: 'Week 1 — Activation',
    focus: 'Wake up the quad. Zero pain tolerance.',
    detail: 'Your quad has been inhibited from the knee bleed. These exercises re-establish the neural connection between your brain and the VMO (inner quad). Do not push range. Do not push load.',
  },
  {
    title: 'Week 2 — Endurance',
    focus: 'Same exercises, add 1 set where comfortable.',
    detail: 'The goal this week is time under tension. Add one extra set to exercises that feel too easy. Pain should stay at 0–2 throughout.',
  },
  {
    title: 'Week 3 — Control',
    focus: 'Slow the eccentric phase to 3 seconds.',
    detail: 'Count 3 seconds on every lowering movement. This is where actual strength is built. If you can hold a 3-second lower without trembling, the muscle is genuinely working.',
  },
  {
    title: 'Week 4 — Integration',
    focus: 'Smooth, deliberate. Prep for gym transition.',
    detail: 'You should notice real difference from Week 1. Reps feel controlled, not shaky. Pain stays 0–1. This week you prepare your nervous system for progressive resistance training at the gym.',
  },
];

export function dayKey(w: number, d: number) { return `w${w}d${d}`; }

export function loadState(): AppState {
  if (typeof window === 'undefined') return { currentWeek: 0, currentDay: 0, dayData: {} };
  try {
    const saved = localStorage.getItem('kneeRehab_v2');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { currentWeek: 0, currentDay: 0, dayData: {} };
}

export function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('kneeRehab_v2', JSON.stringify(state)); } catch {}
}

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

  // Streak: count consecutive done days backwards from today
  let checking = true;
  for (let w = 3; w >= 0 && checking; w--) {
    for (let d = 6; d >= 0 && checking; d--) {
      const dk = dayKey(w, d);
      if (dayData[dk]?.status === 'done') streak++;
      else checking = false;
    }
  }

  const allPain = Object.values(dayData).filter(d => d?.pain !== undefined).map(d => d!.pain!);
  const avgPain = allPain.length ? +(allPain.reduce((a, b) => a + b, 0) / allPain.length).toFixed(1) : null;

  const chartData = [0, 1, 2, 3].map(w => ({
    week: `W${w + 1}`,
    done: completionByWeek[w],
    avgPain: painByWeek[w].length
      ? +(painByWeek[w].reduce((a, b) => a + b, 0) / painByWeek[w].length).toFixed(1)
      : 0,
  }));

  return { totalDone, streak, avgPain, chartData, completionByWeek, painByWeek };
}
