'use client';
import { AppState, calcStats, WEEK_GUIDANCE, dayKey } from '@/lib/data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid } from 'recharts';
import { TrendingDown, TrendingUp, CheckCircle, Calendar, Activity } from 'lucide-react';

interface Props {
  state: AppState;
  onBack: () => void;
}

export default function Report({ state, onBack }: Props) {
  const stats = calcStats(state.dayData);
  const totalDays = 28;
  const pct = Math.round((stats.totalDone / totalDays) * 100);

  // Build daily pain trend
  const dailyData: { label: string; pain: number | null; done: boolean }[] = [];
  for (let w = 0; w < 4; w++) {
    for (let d = 0; d < 7; d++) {
      const dk = dayKey(w, d);
      const entry = state.dayData[dk];
      dailyData.push({
        label: `W${w + 1}D${d + 1}`,
        pain: entry?.pain ?? null,
        done: entry?.status === 'done',
      });
    }
  }

  const painTrend = dailyData.filter(d => d.pain !== null) as { label: string; pain: number; done: boolean }[];

  // Notes log
  const notesLog: { label: string; note: string; pain?: number; date: string }[] = [];
  for (let w = 0; w < 4; w++) {
    for (let d = 0; d < 7; d++) {
      const dk = dayKey(w, d);
      const entry = state.dayData[dk];
      if (entry?.note || entry?.status === 'done') {
        notesLog.push({
          label: `W${w + 1} D${d + 1}`,
          note: entry?.note || 'Session completed',
          pain: entry?.pain,
          date: entry?.completedAt || '',
        });
      }
    }
  }

  const painColor = (p?: number) => {
    if (p === undefined) return 'var(--text-dim)';
    if (p <= 2) return '#1D9E75';
    if (p <= 5) return '#EF9F27';
    return '#E24B4A';
  };

  const painTag = (p?: number) => {
    if (p === undefined) return null;
    const cls = p <= 2 ? 'tag-teal' : p <= 5 ? 'tag-amber' : 'tag-red';
    return <span className={cls}>pain {p}/10</span>;
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button className="btn-ghost text-sm" onClick={onBack}>← Back</button>
          <div>
            <p className="mono text-xs" style={{ color: 'var(--teal)', letterSpacing: '0.08em' }}>4-WEEK REPORT</p>
            <h1 className="text-xl font-medium mt-0.5">Knee rehab progress</h1>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 mb-6 sm:grid-cols-4">
          {[
            { label: 'Days completed', value: stats.totalDone, sub: `of ${totalDays}`, icon: <CheckCircle size={14} /> },
            { label: 'Completion', value: `${pct}%`, sub: 'overall rate', icon: <Calendar size={14} /> },
            { label: 'Current streak', value: stats.streak, sub: 'days in a row', icon: <Activity size={14} /> },
            { label: 'Avg pain', value: stats.avgPain ?? '—', sub: 'across sessions', icon: stats.avgPain && stats.avgPain <= 3 ? <TrendingDown size={14} /> : <TrendingUp size={14} /> },
          ].map((s, i) => (
            <div key={i} className="card p-4">
              <div className="flex items-center gap-1.5 mb-2" style={{ color: 'var(--teal)' }}>
                {s.icon}
                <span className="mono text-xs" style={{ letterSpacing: '0.05em', color: 'var(--text-dim)' }}>{s.label.toUpperCase()}</span>
              </div>
              <div className="text-2xl font-medium mono" style={{ color: 'var(--text)' }}>{s.value}</div>
              <div className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Weekly completion bar chart */}
        <div className="card p-5 mb-5">
          <p className="mono text-xs mb-4" style={{ color: 'var(--teal)', letterSpacing: '0.08em' }}>SESSIONS COMPLETED PER WEEK</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={stats.chartData} barSize={28}>
              <XAxis dataKey="week" tick={{ fill: 'rgba(232,245,240,0.4)', fontSize: 12, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 7]} tick={{ fill: 'rgba(232,245,240,0.4)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border-strong)', borderRadius: 8, color: 'var(--text)' }}
                formatter={(v: number) => [`${v} sessions`, 'Completed']}
              />
              <Bar dataKey="done" fill="#1D9E75" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pain trend line chart */}
        {painTrend.length > 1 && (
          <div className="card p-5 mb-5">
            <p className="mono text-xs mb-1" style={{ color: 'var(--teal)', letterSpacing: '0.08em' }}>PAIN LEVEL TREND</p>
            <p className="text-xs mb-4" style={{ color: 'var(--text-muted)' }}>Lower is better. Should trend down over 4 weeks.</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={painTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(29,158,117,0.1)" />
                <XAxis dataKey="label" tick={{ fill: 'rgba(232,245,240,0.3)', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} interval={3} />
                <YAxis domain={[0, 10]} tick={{ fill: 'rgba(232,245,240,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg2)', border: '1px solid var(--border-strong)', borderRadius: 8, color: 'var(--text)' }}
                  formatter={(v: number) => [`${v}/10`, 'Pain']}
                />
                <Line type="monotone" dataKey="pain" stroke="#1D9E75" strokeWidth={2} dot={{ fill: '#1D9E75', r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Weekly breakdown */}
        <div className="card p-5 mb-5">
          <p className="mono text-xs mb-4" style={{ color: 'var(--teal)', letterSpacing: '0.08em' }}>WEEKLY BREAKDOWN</p>
          <div className="flex flex-col gap-4">
            {WEEK_GUIDANCE.map((wg, w) => {
              const done = stats.completionByWeek[w];
              const painArr = stats.painByWeek[w];
              const avg = painArr.length ? +(painArr.reduce((a, b) => a + b, 0) / painArr.length).toFixed(1) : null;
              return (
                <div key={w} className="flex gap-4 items-start">
                  <div className="mono text-xs pt-0.5 w-6 text-center" style={{ color: 'var(--text-dim)' }}>W{w + 1}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium" style={{ color: done === 7 ? '#1D9E75' : 'var(--text)' }}>{wg.title.replace(`Week ${w + 1} — `, '')}</span>
                      <span className="mono text-xs" style={{ color: done === 7 ? '#1D9E75' : 'var(--text-muted)' }}>{done}/7 days</span>
                    </div>
                    <div className="flex gap-1 mb-1.5">
                      {[0,1,2,3,4,5,6].map(d => {
                        const dk = dayKey(w, d);
                        const entry = state.dayData[dk];
                        return (
                          <div key={d} className="h-1.5 flex-1 rounded-full" style={{
                            background: entry?.status === 'done' ? '#1D9E75' : entry?.status === 'skip' ? 'rgba(239,159,39,0.4)' : 'var(--border)'
                          }} />
                        );
                      })}
                    </div>
                    {avg !== null && (
                      <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Avg pain: <span style={{ color: painColor(avg) }}>{avg}/10</span></p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Session log */}
        {notesLog.length > 0 && (
          <div className="card p-5 mb-5">
            <p className="mono text-xs mb-4" style={{ color: 'var(--teal)', letterSpacing: '0.08em' }}>SESSION LOG</p>
            <div className="flex flex-col gap-3">
              {notesLog.slice().reverse().map((entry, i) => (
                <div key={i} className="flex gap-3 items-start pb-3" style={{ borderBottom: i < notesLog.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <span className="mono text-xs pt-0.5 w-10 flex-shrink-0" style={{ color: 'var(--text-dim)' }}>{entry.label}</span>
                  <div className="flex-1">
                    <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{entry.note}</p>
                    {entry.pain !== undefined && <div className="mt-1">{painTag(entry.pain)}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clinical recommendation */}
        <div className="p-4 rounded-xl mb-8" style={{ background: 'rgba(29,158,117,0.08)', border: '1px solid rgba(29,158,117,0.2)' }}>
          <p className="mono text-xs mb-2" style={{ color: 'var(--teal)', letterSpacing: '0.08em' }}>NEXT STEPS</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {pct >= 80
              ? 'Strong completion rate. You are ready to begin Phase 2 gym training — start with leg press (shallow range), leg extensions, and seated leg curl. Inform your hematologist before starting loaded resistance training.'
              : pct >= 50
              ? 'Decent progress, but missed sessions will slow recovery. Consistency is the single most important variable. Complete the remaining days before moving to gym work.'
              : 'You need to prioritize consistency. Missing rehab days means the quad stays inhibited and the knee stays vulnerable. Every skipped day delays your ability to train properly.'}
          </p>
        </div>

        <button className="btn-ghost w-full" onClick={onBack}>← Back to tracker</button>
      </div>
    </div>
  );
}
