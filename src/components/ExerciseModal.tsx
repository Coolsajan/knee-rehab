'use client';
import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Exercise } from '@/lib/data';

interface Props {
  exercise: Exercise;
  onClose: () => void;
}

export default function ExerciseModal({ exercise, onClose }: Props) {
  const [gifLoaded, setGifLoaded] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="card-glow w-full max-w-lg animate-in"
        style={{ maxHeight: '90vh', overflowY: 'auto' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-3">
          <div>
            <p className="mono text-xs mb-1" style={{ color: 'var(--teal)', letterSpacing: '0.08em' }}>EXERCISE GUIDE</p>
            <h2 className="text-lg font-medium" style={{ color: 'var(--text)' }}>{exercise.name}</h2>
            <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{exercise.sets}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all"
            style={{ color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            <X size={16} />
          </button>
        </div>

        {/* GIF */}
        <div className="mx-5 mb-4 rounded-lg overflow-hidden relative" style={{ background: 'var(--bg3)', aspectRatio: '16/9' }}>
          {!gifLoaded && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
              <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--border-strong)', borderTopColor: 'var(--teal)' }} />
              <p className="text-xs" style={{ color: 'var(--text-dim)' }}>Loading tutorial...</p>
            </div>
          )}
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full h-full object-cover"
            style={{ opacity: gifLoaded ? 1 : 0, transition: 'opacity 0.3s' }}
            onLoad={() => setGifLoaded(true)}
          />
        </div>
        <p className="text-center text-xs mx-5 mb-4" style={{ color: 'var(--text-dim)' }}>{exercise.gifCredit}</p>

        {/* Instructions */}
        <div className="mx-5 mb-4 p-4 rounded-lg" style={{ background: 'var(--bg3)', border: '1px solid var(--border)' }}>
          <p className="text-xs font-medium mb-2 mono" style={{ color: 'var(--teal)', letterSpacing: '0.06em' }}>HOW TO DO IT</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{exercise.detail}</p>
        </div>

        {/* Warning */}
        {exercise.warning && (
          <div className="mx-5 mb-5 p-3 rounded-lg flex gap-3 items-start" style={{ background: '#FCEBEB20', border: '1px solid rgba(226,75,74,0.3)' }}>
            <AlertTriangle size={14} style={{ color: '#E24B4A', flexShrink: 0, marginTop: 1 }} />
            <p className="text-xs leading-relaxed" style={{ color: '#E24B4A' }}>{exercise.warning}</p>
          </div>
        )}

        {/* Hemophilia note */}
        <div className="mx-5 mb-5 p-3 rounded-lg flex gap-3 items-start" style={{ background: 'rgba(29,158,117,0.08)', border: '1px solid var(--border)' }}>
          <span className="text-xs" style={{ color: 'var(--teal)' }}>⚑</span>
          <p className="text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            <strong style={{ color: 'var(--teal)' }}>Hemophilia A reminder:</strong> Stop immediately if you feel sudden warmth, swelling, or pain above 3/10. Do not push through joint discomfort.
          </p>
        </div>

        <div className="px-5 pb-5">
          <button className="btn-primary w-full" onClick={onClose}>Got it, let&apos;s go</button>
        </div>
      </div>
    </div>
  );
}
