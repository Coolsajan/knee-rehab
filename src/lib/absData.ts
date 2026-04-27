export interface AbsExercise {
  key: string;
  name: string;
  sets: string;
  detail: string;
  gifUrl: string;
  gifCredit: string;
  safeForHemo: boolean;
}

export interface AbsDayData {
  status?: 'done' | 'skip';
  exercises?: Record<string, boolean>;
  reps?: Record<string, number>;
  note?: string;
  completedAt?: string;
}

export interface AbsState {
  currentWeek: number;
  currentDay: number;
  dayData: Record<string, AbsDayData>;
}

// 4 months = ~16 weeks. Split into 4 phases of 4 weeks each.
export const ABS_PHASES = [
  {
    phase: 1,
    weeks: [0, 1, 2, 3],
    title: 'Foundation',
    focus: 'Activate deep core. Zero spinal flexion load.',
    detail: 'Your transverse abdominis (the deep stabiliser) is almost certainly inactive. These exercises rebuild it without compressing the spine or stressing your knee at all.',
  },
  {
    phase: 2,
    weeks: [4, 5, 6, 7],
    title: 'Anti-rotation',
    focus: 'Resist movement. Build functional stability.',
    detail: 'The strongest abs are the ones that resist movement, not just crunch. Planks, dead bugs, and Pallof work build real core stiffness — the kind that makes your waist look tight.',
  },
  {
    phase: 3,
    weeks: [8, 9, 10, 11],
    title: 'Flexion',
    focus: 'Add controlled spinal flexion under load.',
    detail: 'Now that your deep core is solid, we add controlled crunching movements. Still no sit-ups — these compress the lumbar spine. Reverse crunches and cable crunches only.',
  },
  {
    phase: 4,
    weeks: [12, 13, 14, 15],
    title: 'Integration',
    focus: 'Compound core. Aesthetic definition.',
    detail: 'Combining all movement patterns. By this phase your core should be visibly stronger and your waist significantly tighter — visible definition depends on body fat but the muscle will be there.',
  },
];

export const ABS_EXERCISES: Record<number, AbsExercise[]> = {
  // Phase 1 — weeks 0-3
  0: [
    {
      key: 'dead_bug',
      name: 'Dead bug',
      sets: '3 × 8 each side',
      detail: 'Lie on your back. Arms straight up, knees bent 90° in the air. Slowly lower opposite arm and leg toward the floor, exhale fully, return. Keep your lower back GLUED to the floor the entire time. If your back lifts — stop the range there.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzlpcThzdnFrcTgzZTl4bjZ6NmlwZHR4aW9kNnplcjhvbGE2bjVmNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPavRPgJYaNI97O/giphy.gif',
      gifCredit: 'Dead Bug — deep core activation',
      safeForHemo: true,
    },
    {
      key: 'ab_vacuum',
      name: 'Abdominal vacuum',
      sets: '5 × 20 second holds',
      detail: 'Stand or sit tall. Exhale ALL air from your lungs. Draw your navel as far toward your spine as possible. Hold for 20 seconds while breathing shallowly. This directly targets the transverse abdominis — the muscle that actually pulls your waist in.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3R6NWYwdTJiNXZlaTl5MXdieXF4ZHJwc3IwaGp3eGN2NW9vb3JhZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gscSULUcfKU7dHq/giphy.gif',
      gifCredit: 'Ab Vacuum — transverse abdominis',
      safeForHemo: true,
    },
    {
      key: 'bird_dog',
      name: 'Bird dog',
      sets: '3 × 10 each side',
      detail: 'On all fours, hands under shoulders, knees under hips. Extend opposite arm and leg simultaneously until both are parallel to the floor. Hold 2 seconds. Do not rotate your hips — keep them perfectly level.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzY5dHhicHY2OGw1cTg4M3JuaW5tNHBhaTlhYng5MWdndHZxNTBtMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif',
      gifCredit: 'Bird Dog — lumbar stability',
      safeForHemo: true,
    },
    {
      key: 'glute_bridge_hold',
      name: 'Glute bridge hold',
      sets: '3 × 30 second holds',
      detail: 'Lie on your back, knees bent, feet flat. Drive hips up until your body is a straight line from knee to shoulder. Squeeze glutes hard. Hold. This also indirectly works the lower ab stabilisers. Safe for the right knee — do not push off unevenly.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHBkaTVsb2Rwd3ZuOXhkZXBhYzh1aW93aWpxbnNlM3N3bXBwMjZlZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9IgymvMsX9c2XKJW/giphy.gif',
      gifCredit: 'Glute Bridge — posterior chain + core',
      safeForHemo: true,
    },
  ],
  // Phase 2 — weeks 4-7
  4: [
    {
      key: 'plank',
      name: 'Forearm plank',
      sets: '3 × 30–45 seconds',
      detail: 'Forearms on floor, elbows under shoulders. Body straight from head to heel. Squeeze everything — glutes, quads, abs. Do not let hips sag or pike. Breathe normally. Add 5 seconds per week.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGRjaXhvOXQ3amhiaDVoYzF4Nmh4OW9iNWNqMDRxdm53eTFiOXA3eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4FGuhL4U2Yroidae/giphy.gif',
      gifCredit: 'Forearm Plank — full core brace',
      safeForHemo: true,
    },
    {
      key: 'side_plank',
      name: 'Side plank',
      sets: '3 × 20 seconds each side',
      detail: 'Lie on your side, forearm on floor, elbow under shoulder. Stack your feet or stagger them. Lift hips off the floor until your body forms a straight line. This targets the obliques — the muscles that create the V-shape waist.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzlpcThzdnFrcTgzZTl4bjZ6NmlwZHR4aW9kNnplcjhvbGE2bjVmNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPavRPgJYaNI97O/giphy.gif',
      gifCredit: 'Side Plank — oblique stability',
      safeForHemo: true,
    },
    {
      key: 'dead_bug_adv',
      name: 'Dead bug (advanced)',
      sets: '3 × 10 each side',
      detail: 'Same as Phase 1 dead bug but add a 3-second lower and 1-second pause at the bottom. The slower you go, the harder it is. Your lower back must stay flat — no exceptions.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3R6NWYwdTJiNXZlaTl5MXdieXF4ZHJwc3IwaGp3eGN2NW9vb3JhZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gscSULUcfKU7dHq/giphy.gif',
      gifCredit: 'Dead Bug Advanced — slow eccentric',
      safeForHemo: true,
    },
    {
      key: 'hollow_hold',
      name: 'Hollow body hold',
      sets: '3 × 20 seconds',
      detail: 'Lie on your back. Press your lower back into the floor. Raise shoulders and legs off the floor — legs straight, arms overhead or by your sides. Your body should look like a shallow bowl. This is brutally effective for the entire anterior core.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzY5dHhicHY2OGw1cTg4M3JuaW5tNHBhaTlhYng5MWdndHZxNTBtMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif',
      gifCredit: 'Hollow Body Hold — full anterior core',
      safeForHemo: true,
    },
  ],
  // Phase 3 — weeks 8-11
  8: [
    {
      key: 'reverse_crunch',
      name: 'Reverse crunch',
      sets: '3 × 15 reps',
      detail: 'Lie on your back, hands under your tailbone for support. Bring knees to chest, then curl your hips UP off the floor — not just pulling knees to chest, but lifting the pelvis. Lower slowly. This targets lower abs without spinal compression.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHBkaTVsb2Rwd3ZuOXhkZXBhYzh1aW93aWpxbnNlM3N3bXBwMjZlZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9IgymvMsX9c2XKJW/giphy.gif',
      gifCredit: 'Reverse Crunch — lower ab focus',
      safeForHemo: true,
    },
    {
      key: 'crunch',
      name: 'Controlled crunch',
      sets: '3 × 20 reps',
      detail: 'Lie on your back, knees bent, hands lightly behind head (not pulling). Curl shoulders off the floor — only about 30 degrees. Hold 1 second at top, lower 3 seconds. No sit-ups. Ever. Sit-ups compress your lumbar discs.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGRjaXhvOXQ3amhiaDVoYzF4Nmh4OW9iNWNqMDRxdm53eTFiOXA3eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4FGuhL4U2Yroidae/giphy.gif',
      gifCredit: 'Controlled Crunch — upper ab isolation',
      safeForHemo: true,
    },
    {
      key: 'plank_adv',
      name: 'Plank with shoulder tap',
      sets: '3 × 10 taps each side',
      detail: 'High plank position (hands, not forearms). Lift one hand, tap the opposite shoulder, return. The challenge is keeping your hips perfectly still — zero rotation. This is anti-rotation work under load.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzlpcThzdnFrcTgzZTl4bjZ6NmlwZHR4aW9kNnplcjhvbGE2bjVmNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPavRPgJYaNI97O/giphy.gif',
      gifCredit: 'Plank Shoulder Tap — anti-rotation',
      safeForHemo: true,
    },
    {
      key: 'leg_raise',
      name: 'Lying leg raise',
      sets: '3 × 12 reps',
      detail: 'Lie flat, hands under tailbone, legs straight. Raise both legs to 90 degrees, then lower slowly — stop 2 inches above the floor (never touch down). The lower you go, the harder. If your lower back arches, raise the bottom point.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExd3R6NWYwdTJiNXZlaTl5MXdieXF4ZHJwc3IwaGp3eGN2NW9vb3JhZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26gscSULUcfKU7dHq/giphy.gif',
      gifCredit: 'Leg Raise — lower ab + hip flexor',
      safeForHemo: true,
    },
  ],
  // Phase 4 — weeks 12-15
  12: [
    {
      key: 'dragon_flag_neg',
      name: 'Dragon flag (negative only)',
      sets: '3 × 5 slow reps',
      detail: 'Lie on a bench or floor, grip something behind your head. Lift your whole body up (you can use your feet to assist), then SLOWLY lower your entire body as one rigid unit over 5 seconds. Only the shoulders stay on the surface. This is elite core work.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzY5dHhicHY2OGw1cTg4M3JuaW5tNHBhaTlhYng5MWdndHZxNTBtMiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif',
      gifCredit: 'Dragon Flag Negative — full core',
      safeForHemo: true,
    },
    {
      key: 'ab_wheel',
      name: 'Ab wheel rollout (kneeling)',
      sets: '3 × 8 reps',
      detail: 'Kneel on a mat, hold the ab wheel under your shoulders. Roll forward slowly — as far as you can while keeping your lower back flat (not sagging). Roll back by contracting your abs, not your hip flexors. Start with a small range and extend weekly.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHBkaTVsb2Rwd3ZuOXhkZXBhYzh1aW93aWpxbnNlM3N3bXBwMjZlZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xT9IgymvMsX9c2XKJW/giphy.gif',
      gifCredit: 'Ab Wheel — peak anterior core strength',
      safeForHemo: true,
    },
    {
      key: 'bicycle_crunch',
      name: 'Bicycle crunch',
      sets: '3 × 20 reps (slow)',
      detail: 'Lie on back, hands behind head. Bring right elbow to left knee while extending the right leg — then switch. KEY: do this SLOWLY. 2 seconds each side. Fast bicycle crunches are useless momentum. Slow ones are brutal.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGRjaXhvOXQ3amhiaDVoYzF4Nmh4OW9iNWNqMDRxdm53eTFiOXA3eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l4FGuhL4U2Yroidae/giphy.gif',
      gifCredit: 'Slow Bicycle Crunch — oblique + rectus',
      safeForHemo: true,
    },
    {
      key: 'hollow_rock',
      name: 'Hollow body rock',
      sets: '3 × 15 rocks',
      detail: 'Get into hollow body hold position. Rock forward and backward like a rocking chair — keeping the hollow position perfectly rigid. Your body should move as one piece. If you lose the position, stop and reset.',
      gifUrl: 'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbzlpcThzdnFrcTgzZTl4bjZ6NmlwZHR4aW9kNnplcjhvbGE2bjVmNiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPavRPgJYaNI97O/giphy.gif',
      gifCredit: 'Hollow Rock — full core integration',
      safeForHemo: true,
    },
  ],
};

export function getPhaseForWeek(week: number) {
  return ABS_PHASES.find(p => p.weeks.includes(week)) ?? ABS_PHASES[0];
}

export function getExercisesForWeek(week: number): AbsExercise[] {
  // Find the phase start week
  const phase = getPhaseForWeek(week);
  const phaseStartWeek = phase.weeks[0];
  return ABS_EXERCISES[phaseStartWeek] ?? ABS_EXERCISES[0];
}

export function absKey(w: number, d: number) { return `abs_w${w}d${d}`; }

export function loadAbsState(): AbsState {
  if (typeof window === 'undefined') return { currentWeek: 0, currentDay: 0, dayData: {} };
  try {
    const saved = localStorage.getItem('absTracker_v1');
    if (saved) return JSON.parse(saved);
  } catch {}
  return { currentWeek: 0, currentDay: 0, dayData: {} };
}

export function saveAbsState(state: AbsState) {
  if (typeof window === 'undefined') return;
  try { localStorage.setItem('absTracker_v1', JSON.stringify(state)); } catch {}
}

export function calcAbsStats(dayData: Record<string, AbsDayData>) {
  let totalDone = 0;
  const totalDays = 16 * 7; // 16 weeks

  for (let w = 0; w < 16; w++)
    for (let d = 0; d < 7; d++)
      if (dayData[absKey(w, d)]?.status === 'done') totalDone++;

  const completionByPhase = [0, 0, 0, 0];
  ABS_PHASES.forEach((phase, i) => {
    phase.weeks.forEach(w => {
      for (let d = 0; d < 7; d++)
        if (dayData[absKey(w, d)]?.status === 'done') completionByPhase[i]++;
    });
  });

  return { totalDone, totalDays, completionByPhase };
}
