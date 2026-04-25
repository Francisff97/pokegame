'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Image from 'next/image';
import {
  TYPE_COLORS,
  TYPE_IT,
  STAT_LABELS,
  Difficulty,
} from '@/lib/pokemon-data';

// ─── Types ────────────────────────────────────────────────────────────────────

interface PokemonData {
  id: number;
  name: string;
  rawName: string;
  number: string;
  types: string[];
  image: string;
  flavor: string;
  genus: string;
  height: number;
  weight: number;
  abilities: { name: string; hidden: boolean }[];
  stats: { name: string; value: number }[];
  locations: { area: string; game: string }[];
  evolution: string[];
  generation: string;
  captureRate: number;
  isLegendary: boolean;
  isMythical: boolean;
  habitat: string | null;
}

interface HintItem {
  id: string;
  label: string;
  value: string | null;
  revealed: boolean;
  category: 'type' | 'stat' | 'info' | 'location';
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildHints(p: PokemonData): HintItem[] {
  const hints: HintItem[] = [
    {
      id: 'gen',
      label: 'Generazione',
      value: `Gen. ${p.generation}`,
      revealed: false,
      category: 'info',
    },
    {
      id: 'type',
      label: 'Tipo',
      value: p.types.map((t) => TYPE_IT[t] || t).join(' / '),
      revealed: false,
      category: 'type',
    },
    {
      id: 'height',
      label: 'Altezza',
      value: `${p.height} m`,
      revealed: false,
      category: 'info',
    },
    {
      id: 'weight',
      label: 'Peso',
      value: `${p.weight} kg`,
      revealed: false,
      category: 'info',
    },
    {
      id: 'genus',
      label: 'Categoria',
      value: p.genus,
      revealed: false,
      category: 'info',
    },
    {
      id: 'habitat',
      label: 'Habitat',
      value: p.habitat ? p.habitat.replace(/-/g, ' ') : '—',
      revealed: false,
      category: 'info',
    },
    {
      id: 'legendary',
      label: 'Rarità',
      value: p.isMythical
        ? 'Mitico 🌟'
        : p.isLegendary
        ? 'Leggendario ✨'
        : 'Comune',
      revealed: false,
      category: 'info',
    },
    {
      id: 'hp',
      label: 'PS base',
      value: String(p.stats.find((s) => s.name === 'hp')?.value ?? '—'),
      revealed: false,
      category: 'stat',
    },
    {
      id: 'speed',
      label: 'Velocità base',
      value: String(p.stats.find((s) => s.name === 'speed')?.value ?? '—'),
      revealed: false,
      category: 'stat',
    },
    {
      id: 'ability1',
      label: 'Abilità principale',
      value: p.abilities.filter((a) => !a.hidden)[0]?.name ?? '—',
      revealed: false,
      category: 'info',
    },
    {
      id: 'location',
      label: 'Dove si trova',
      value:
        p.locations.length > 0
          ? p.locations
              .slice(0, 2)
              .map((l) => `${l.area} (${l.game})`)
              .join(', ')
          : 'Solo tramite evoluzione o evento',
      revealed: false,
      category: 'location',
    },
    {
      id: 'flavor',
      label: 'Descrizione Pokédex',
      value: p.flavor,
      revealed: false,
      category: 'info',
    },
    {
      id: 'evolution',
      label: 'Linea evolutiva (nomi inglesi)',
      value: p.evolution.join(' → '),
      revealed: false,
      category: 'info',
    },
  ];

  return hints;
}

const CATEGORY_COLORS: Record<string, string> = {
  type: '#7038F8',
  stat: '#F08030',
  info: '#6890F0',
  location: '#78C850',
};

// ─── Component ────────────────────────────────────────────────────────────────

function GameContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const difficulty = (searchParams.get('difficulty') as Difficulty) || 'easy';

  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [hints, setHints] = useState<HintItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const fetchPokemon = useCallback(async () => {
    setLoading(true);
    setRevealed(false);
    setImageLoaded(false);
    setPokemon(null);
    try {
      const res = await fetch(`/api/pokemon?difficulty=${difficulty}`);
      const data: PokemonData = await res.json();
      setPokemon(data);
      setHints(buildHints(data));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [difficulty]);

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  function toggleHint(id: string) {
    setHints((prev) =>
      prev.map((h) => (h.id === id ? { ...h, revealed: !h.revealed } : h))
    );
  }

  function revealAll() {
    setHints((prev) => prev.map((h) => ({ ...h, revealed: true })));
    setRevealed(true);
  }

  const mainType = pokemon?.types[0] ?? 'normal';
  const typeColor = TYPE_COLORS[mainType] ?? '#888';

  // ── Loading state ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#111]">
        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            color: '#CC0000',
            fontSize: '0.6rem',
            marginBottom: '2rem',
            textAlign: 'center',
          }}
        >
          CARICAMENTO...
        </div>
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full load-dot"
              style={{
                background: '#CC0000',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#111] text-white">
        Errore nel caricamento. <button onClick={fetchPokemon} className="ml-2 underline">Riprova</button>
      </div>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <div
      className="min-h-screen pb-16"
      style={{ background: '#111111' }}
    >
      {/* Top bar — Pokedex style */}
      <div
        className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 border-b border-white/5"
        style={{
          background: 'rgba(17,17,17,0.95)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <button
          onClick={() => router.push('/')}
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '0.45rem',
            color: '#CC0000',
            letterSpacing: '0.05em',
          }}
        >
          ◀ MENU
        </button>

        <div
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '0.45rem',
            color: '#555',
            textTransform: 'uppercase',
          }}
        >
          {difficulty === 'easy' ? '⭐ FACILE' : difficulty === 'medium' ? '⭐⭐ MEDIO' : '⭐⭐⭐ DIFFICILE'}
        </div>

        <button
          onClick={fetchPokemon}
          style={{
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '0.45rem',
            color: '#9BBC0F',
            letterSpacing: '0.05em',
          }}
        >
          NUOVO ↻
        </button>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">

        {/* ── Pokemon Header Card ── */}
        <div
          className="rounded-2xl overflow-hidden relative"
          style={{
            background: `linear-gradient(135deg, ${typeColor}22, ${typeColor}08, #111)`,
            border: `1px solid ${typeColor}33`,
            boxShadow: `0 0 40px ${typeColor}15`,
          }}
        >
          {/* Pattern di sfondo */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, ${typeColor} 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative p-6 flex flex-col items-center gap-4">
            {/* Numero Pokédex 
            <div
              className="self-start"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.55rem',
                color: typeColor,
                opacity: 0.7,
              }}
            >
              #{pokemon.number}
            </div>
*/}
            {/* Immagine — nascosta fino al reveal */}
            <div className="relative w-48 h-48 sm:w-56 sm:h-56">
              {!revealed && (
                <div
                  className="absolute inset-0 rounded-full flex items-center justify-center z-10"
                  style={{
                    background: 'rgba(0,0,0,0.85)',
                    backdropFilter: 'blur(4px)',
                    border: `2px dashed ${typeColor}44`,
                  }}
                >
                  <span
                    style={{
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: '0.4rem',
                      color: typeColor,
                      textAlign: 'center',
                      opacity: 0.8,
                    }}
                  >
                    ???
                  </span>
                </div>
              )}
              {pokemon.image && (
                <Image
                  src={pokemon.image}
                  alt={revealed ? pokemon.name : 'Pokémon sconosciuto'}
                  fill
                  className="pokemon-image object-contain"
                  style={{
                    filter: revealed
                      ? `drop-shadow(0 8px 24px ${typeColor}66)`
                      : 'brightness(0)',
                    transition: 'filter 0.6s ease',
                  }}
                  onLoad={() => setImageLoaded(true)}
                  priority
                />
              )}
            </div>

            {/* Nome */}
            <div className="text-center">
              {revealed ? (
                <h1
                  className="animate-fadeIn"
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: 'clamp(0.9rem, 3vw, 1.4rem)',
                    color: '#fff',
                    textShadow: `0 0 20px ${typeColor}88`,
                    letterSpacing: '0.05em',
                  }}
                >
                  {pokemon.name.toUpperCase()}
                </h1>
              ) : (
                <div
                  style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: '1.2rem',
                    color: '#444',
                    letterSpacing: '0.3em',
                  }}
                >
                  ??? ??? ???
                </div>
              )}
              {revealed && pokemon.genus && (
                <p
                  className="mt-1"
                  style={{
                    fontFamily: '"DM Sans", sans-serif',
                    color: typeColor,
                    fontSize: '0.85rem',
                    opacity: 0.8,
                  }}
                >
                  {pokemon.genus}
                </p>
              )}
            </div>

            {/* Tipi (visibili solo se hint rivelato o reveal all) */}
            {(revealed || hints.find(h => h.id === 'type')?.revealed) && (
              <div className="flex gap-2 animate-fadeIn">
                {pokemon.types.map((t) => (
                  <span
                    key={t}
                    className="type-badge"
                    style={{
                      background: TYPE_COLORS[t] + '33',
                      color: TYPE_COLORS[t],
                      borderColor: TYPE_COLORS[t] + '44',
                    }}
                  >
                    {TYPE_IT[t] || t}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Indizi ── */}
        <div>
          <div
            className="mb-3"
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '0.5rem',
              color: '#9BBC0F',
              letterSpacing: '0.1em',
            }}
          >
            INDIZI — TAP PER RIVELARE
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {hints.map((hint) => (
              <button
                key={hint.id}
                onClick={() => toggleHint(hint.id)}
                className="hint-card text-left rounded-xl p-3 border transition-all duration-200"
                style={{
                  background: hint.revealed
                    ? `${CATEGORY_COLORS[hint.category]}11`
                    : 'rgba(255,255,255,0.03)',
                  borderColor: hint.revealed
                    ? CATEGORY_COLORS[hint.category] + '44'
                    : 'rgba(255,255,255,0.07)',
                  boxShadow: hint.revealed
                    ? `0 0 12px ${CATEGORY_COLORS[hint.category]}22`
                    : 'none',
                }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    style={{
                      fontFamily: '"Press Start 2P", monospace',
                      fontSize: '0.42rem',
                      color: hint.revealed
                        ? CATEGORY_COLORS[hint.category]
                        : '#555',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {hint.label.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.6rem', opacity: 0.4 }}>
                    {hint.revealed ? '▲' : '▼'}
                  </span>
                </div>
                {hint.revealed ? (
                  <p
                    className="animate-fadeIn"
                    style={{
                      fontFamily: '"DM Sans", sans-serif',
                      fontSize: '0.82rem',
                      color: '#ddd',
                      lineHeight: 1.5,
                      fontWeight: 500,
                    }}
                  >
                    {hint.value}
                  </p>
                ) : (
                  <div
                    className="h-3 rounded animate-pulse"
                    style={{ background: 'rgba(255,255,255,0.06)', width: '60%' }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Statistiche (visibili con reveal all) ── */}
        {revealed && (
          <div
            className="rounded-2xl p-5 animate-slideUp"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <div
              className="mb-4"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.5rem',
                color: '#9BBC0F',
                letterSpacing: '0.1em',
              }}
            >
              STATISTICHE BASE
            </div>
            <div className="space-y-3">
              {pokemon.stats.map((stat, i) => {
                const pct = Math.min((stat.value / 255) * 100, 100);
                const label = STAT_LABELS[stat.name] || stat.name;
                const color =
                  stat.value >= 100 ? '#4CAF50' : stat.value >= 60 ? '#FF9800' : '#F44336';
                return (
                  <div key={stat.name} className="flex items-center gap-3">
                    <div
                      style={{
                        fontFamily: '"Press Start 2P", monospace',
                        fontSize: '0.38rem',
                        color: '#888',
                        width: '52px',
                        flexShrink: 0,
                        textAlign: 'right',
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontFamily: '"Press Start 2P", monospace',
                        fontSize: '0.42rem',
                        color: color,
                        width: '28px',
                        flexShrink: 0,
                        textAlign: 'center',
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      className="flex-1 rounded-full overflow-hidden"
                      style={{ background: 'rgba(255,255,255,0.06)', height: '8px' }}
                    >
                      <div
                        className="h-full rounded-full stat-bar"
                        style={{
                          '--fill': `${pct}%`,
                          '--delay': `${i * 0.1}s`,
                          background: color,
                          boxShadow: `0 0 6px ${color}66`,
                        } as React.CSSProperties}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── CTA Buttons ── */}
        <div className="flex gap-3 pb-4">
          {!revealed ? (
            <button
              onClick={revealAll}
              className="flex-1 py-4 rounded-xl font-bold transition-all duration-200"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.6rem',
                background: 'linear-gradient(135deg, #CC0000, #990000)',
                color: '#fff',
                boxShadow: '0 0 20px rgba(204,0,0,0.4), 0 4px 0 #660000',
                letterSpacing: '0.05em',
              }}
            >
              🎯 RIVELA POKÉMON
            </button>
          ) : (
            <button
              onClick={fetchPokemon}
              className="flex-1 py-4 rounded-xl font-bold transition-all duration-200"
              style={{
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '0.6rem',
                background: 'linear-gradient(135deg, #DDDD00, #AAAA00)',
                color: '#111',
                boxShadow: '0 0 20px rgba(200,200,0,0.4), 0 4px 0 #777700',
                letterSpacing: '0.05em',
              }}
            >
              ▶ PROSSIMO
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function GamePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[#111]">
        <div style={{ fontFamily: '"Press Start 2P", monospace', color: '#CC0000', fontSize: '0.6rem' }}>
          CARICAMENTO...
        </div>
      </div>
    }>
      <GameContent />
    </Suspense>
  );
}
