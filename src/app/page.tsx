'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const difficulties = [
  {
    id: 'easy',
    label: 'Facile',
    emoji: '⭐',
    description: 'Pokémon iconici\nGen I e II',
    color: '#4CAF50',
    glow: 'rgba(76, 175, 80, 0.4)',
    hint: 'Pikachu, Charizard, Mewtwo...',
  },
  {
    id: 'medium',
    label: 'Medio',
    emoji: '⭐⭐',
    description: 'Gen I–III\nalcuni Gen IV',
    color: '#FF9800',
    glow: 'rgba(255, 152, 0, 0.4)',
    hint: 'Un po\' più rari...',
  },
  {
    id: 'hard',
    label: 'Difficile',
    emoji: '⭐⭐⭐',
    description: 'Gen IV–V\ni dimenticati',
    color: '#F44336',
    glow: 'rgba(244, 67, 54, 0.4)',
    hint: 'Solo per veri allenatori!',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [starting, setStarting] = useState(false);

  function handleStart() {
    if (!selected || starting) return;
    setStarting(true);
    router.push(`/game?difficulty=${selected}`);
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: '#111111' }}
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #CC0000 1px, transparent 0)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Red top bar — stile Pokedex */}
      <div
        className="absolute top-0 left-0 right-0 h-2"
        style={{ background: 'linear-gradient(90deg, #CC0000, #990000, #CC0000)' }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-4 py-16 w-full max-w-xl">

        {/* Logo / Titolo */}
        {/* 🔧 LOGO: sostituisci questo blocco con <Image src="/logo.png" ... /> */}
        <div className="flex flex-col items-center gap-3 animate-fadeIn">
          <div
            className="text-center"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              color: '#CC0000',
              fontSize: 'clamp(1.4rem, 5vw, 2.2rem)',
              lineHeight: 1.4,
              textShadow: '0 0 20px rgba(204,0,0,0.5), 3px 3px 0 #660000',
              letterSpacing: '-0.02em',
            }}
          >
            POKÉ<br />QUIZ
          </div>
          <p
            className="text-center text-sm"
            style={{ color: '#888', fontFamily: '"DM Sans", sans-serif', letterSpacing: '0.15em' }}
          >
            INDOVINA IL POKÉMON
          </p>
        </div>

        {/* Schermata Pokedex */}
        <div
          className="w-full rounded-2xl p-1 relative"
          style={{
            background: 'linear-gradient(135deg, #DD1111 0%, #BB0000 60%, #990000 100%)',
            boxShadow: '0 8px 40px rgba(204,0,0,0.3), 0 2px 8px rgba(0,0,0,0.8)',
          }}
        >
          {/* Cerchio decorativo in alto a sinistra */}
          <div className="flex items-center gap-2 px-4 pt-3 pb-1">
            <div
              className="w-5 h-5 rounded-full border-2 border-white/30"
              style={{ background: '#4AF', boxShadow: '0 0 8px rgba(68,170,255,0.6)' }}
            />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#F44' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#4F4' }} />
            <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#FF4' }} />
          </div>

          {/* Schermata interna */}
          <div
            className="rounded-xl p-6 relative scanlines"
            style={{
              background: '#0F380F',
              boxShadow: 'inset 0 0 20px rgba(0,0,0,0.6)',
            }}
          >
            <p
              className="text-center mb-5"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                color: '#9BBC0F',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
              }}
            >
              SCEGLI DIFFICOLTÀ
            </p>

            {/* Difficulty buttons */}
            <div className="flex flex-col gap-3">
              {difficulties.map((d) => (
                <button
                  key={d.id}
                  onClick={() => setSelected(d.id)}
                  className="w-full text-left rounded-lg p-3 transition-all duration-200 border-2"
                  style={{
                    background:
                      selected === d.id
                        ? `rgba(${hexToRgb(d.color)}, 0.15)`
                        : 'rgba(0,0,0,0.3)',
                    borderColor: selected === d.id ? d.color : 'rgba(155,188,15,0.2)',
                    boxShadow: selected === d.id ? `0 0 16px ${d.glow}` : 'none',
                    transform: selected === d.id ? 'scale(1.01)' : 'scale(1)',
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{d.emoji}</span>
                      <div>
                        <div
                          style={{
                            fontFamily: '"Press Start 2P", monospace',
                            fontSize: '0.55rem',
                            color: selected === d.id ? d.color : '#9BBC0F',
                          }}
                        >
                          {d.label.toUpperCase()}
                        </div>
                        <div
                          style={{
                            fontFamily: '"DM Sans", sans-serif',
                            fontSize: '0.7rem',
                            color: '#9BBC0F',
                            opacity: 0.7,
                            whiteSpace: 'pre-line',
                          }}
                        >
                          {d.description}
                        </div>
                      </div>
                    </div>
                    {selected === d.id && (
                      <div
                        style={{
                          fontFamily: '"Press Start 2P", monospace',
                          fontSize: '0.5rem',
                          color: d.color,
                        }}
                      >
                        ▶
                      </div>
                    )}
                  </div>
                  {selected === d.id && (
                    <div
                      className="mt-2"
                      style={{
                        fontFamily: '"DM Sans", sans-serif',
                        fontSize: '0.68rem',
                        color: '#9BBC0F',
                        opacity: 0.6,
                        borderTop: '1px solid rgba(155,188,15,0.2)',
                        paddingTop: '6px',
                      }}
                    >
                      {d.hint}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tasto GIOCA */}
          <div className="px-4 pb-4 pt-3">
            <button
              onClick={handleStart}
              disabled={!selected || starting}
              className="w-full py-3 rounded-xl font-bold transition-all duration-200 relative overflow-hidden"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.7rem',
                background: selected
                  ? 'linear-gradient(135deg, #DDDD00, #AAAA00)'
                  : 'rgba(255,255,255,0.1)',
                color: selected ? '#111' : '#555',
                boxShadow: selected ? '0 0 20px rgba(220,220,0,0.4), 0 4px 0 #777700' : 'none',
                cursor: selected ? 'pointer' : 'not-allowed',
                transform: selected && !starting ? 'translateY(0)' : 'translateY(2px)',
                letterSpacing: '0.05em',
              }}
            >
              {starting ? 'CARICAMENTO...' : '▶ GIOCA'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <p
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '0.4rem',
            color: '#444',
            textAlign: 'center',
          }}
        >
          GEN I – V · POKEAPI.CO
        </p>
      </div>

      {/* Bottom bar */}
      <div
        className="absolute bottom-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, #CC0000, #990000, #CC0000)' }}
      />
    </main>
  );
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r}, ${g}, ${b}`;
}
