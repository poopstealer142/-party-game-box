import { useState } from 'react'

const GAMES = [
  { id: 'werewolf', icon: '🐺', name: 'Werewolf', desc: 'Hidden roles · Night kills · Trust no one', players: '5–15', time: '20–40m', tag: 'social', color: '#8B5CF6' },
  { id: 'impostor', icon: '🕵️', name: 'Impostor', desc: 'Secret words · Deduction · Bluffing', players: '3–24', time: '10–20m', tag: 'social', color: '#EF4444' },
  { id: 'never', icon: '🙈', name: 'Never Have I Ever', desc: 'Confess · Tap · Judge', players: '3+', time: '10–20m', tag: 'social', color: '#F43F5E' },
  { id: 'hottakes', icon: '🌶️', name: 'Hot Takes', desc: 'Submit · Guess the author', players: '3+', time: '10–15m', tag: 'quick', color: '#EA580C' },
  { id: 'wyr', icon: '🤔', name: 'Would You Rather', desc: 'Vote secretly · Big reveal · Debate', players: '2+', time: '10–20m', tag: 'quick', color: '#A855F7' },
  { id: 'alias', icon: '🚫', name: 'Alias', desc: 'Describe · No taboo words · Score', players: '4+', time: '15–30m', tag: 'teams', color: '#22C55E' },
  { id: 'wavelength', icon: '🌊', name: 'Wavelength', desc: 'One clue · Hit the spectrum · Telepathy', players: '2+', time: '10–20m', tag: 'social', color: '#6366F1' },
  { id: 'party', icon: '🎉', name: "I'm Hosting a Party", desc: 'Secret rule · Yes or no · Guess it', players: '2+', time: '10–20m', tag: 'quick', color: '#EC4899' },
  { id: 'fakingit', icon: '🔍', name: "Who's Faking It?", desc: 'Answer a question · Spot the faker · Vote', players: '3+', time: '10–20m', tag: 'social', color: '#F97316' },
  { id: 'herdmentality', icon: '🐑', name: 'Herd Mentality', desc: 'Same question · Match the majority · Score', players: '2+', time: '10–20m', tag: 'quick', color: '#10B981' },
]

const TAGS = [
  { id: 'all', label: 'All' },
  { id: 'quick', label: 'Quick Play' },
  { id: 'teams', label: 'Teams' },
  { id: 'social', label: 'Social' },
]

function GameRow({ game, onSelect }) {
  const [pressed, setPressed] = useState(false)

  return (
    <button
      onClick={() => onSelect(game.id)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '12px 16px',
        background: pressed ? 'rgba(255,255,255,0.05)' : 'transparent',
        border: 'none',
        cursor: 'pointer',
        color: '#f5f5f7',
        textAlign: 'left',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        width: '100%',
        transition: 'background 0.08s ease',
        borderRadius: 0,
      }}
    >
      <div style={{
        width: 50, height: 50, borderRadius: 14, flexShrink: 0,
        background: `${game.color}20`,
        border: `1px solid ${game.color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 24,
      }}>
        {game.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 2, color: 'rgba(235,235,245,0.92)' }}>
          {game.name}
        </div>
        <div style={{ fontSize: 13, color: 'rgba(235,235,245,0.4)', lineHeight: 1.4, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {game.desc}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3, flexShrink: 0 }}>
        <span style={{ color: game.color, fontSize: 11, fontWeight: 700, letterSpacing: '0.03em' }}>
          {game.players}
        </span>
        <span style={{ color: 'rgba(235,235,245,0.25)', fontSize: 11 }}>
          {game.time}
        </span>
      </div>
      <div style={{ color: 'rgba(235,235,245,0.2)', fontSize: 18, fontWeight: 300, marginLeft: 2, flexShrink: 0 }}>
        ›
      </div>
    </button>
  )
}

export default function Home({ onSelect }) {
  const [activeTag, setActiveTag] = useState('all')

  const filtered = activeTag === 'all' ? GAMES : GAMES.filter(g => g.tag === activeTag)

  return (
    <div style={{
      minHeight: '100dvh',
      background: '#000',
      padding: 'max(52px, env(safe-area-inset-top, 52px)) 20px max(40px, env(safe-area-inset-bottom, 40px))',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch',
    }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>

        {/* Hero */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <div style={{
              width: 44, height: 44,
              background: '#1C1C1E',
              borderRadius: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22,
              boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
              flexShrink: 0,
            }}>
              🎮
            </div>
            <div>
              <div style={{
                fontSize: 15, fontWeight: 600, color: 'rgba(235,235,245,0.92)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                letterSpacing: '-0.01em',
              }}>
                Party Game Box
              </div>
              <div style={{
                fontSize: 12, color: 'rgba(235,235,245,0.38)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}>
                Pass the phone. Play together.
              </div>
            </div>
          </div>

          <h1 style={{
            fontSize: 40,
            fontWeight: 800,
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-0.04em',
            lineHeight: 1.05,
            color: 'rgba(235,235,245,0.92)',
            margin: 0,
          }}>
            Game night,{' '}
            <span style={{
              background: 'linear-gradient(135deg, #818CF8 0%, #C084FC 50%, #F472B6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              simplified.
            </span>
          </h1>
        </div>

        {/* Filter chips */}
        <div style={{
          display: 'flex', gap: 8, marginBottom: 20,
          overflowX: 'auto', paddingBottom: 2,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}>
          {TAGS.map(tag => (
            <button
              key={tag.id}
              onClick={() => setActiveTag(tag.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: activeTag === tag.id
                  ? '1px solid rgba(129,140,248,0.6)'
                  : '1px solid rgba(84,84,88,0.36)',
                background: activeTag === tag.id
                  ? 'rgba(129,140,248,0.15)'
                  : 'rgba(28,28,30,0.8)',
                color: activeTag === tag.id
                  ? '#A5B4FC'
                  : 'rgba(235,235,245,0.55)',
                fontSize: 13,
                fontWeight: 500,
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0,
                transition: 'all 0.15s ease',
              }}
            >
              {tag.label}
            </button>
          ))}
        </div>

        {/* Game list — iOS inset grouped style */}
        <div style={{
          background: '#1C1C1E',
          borderRadius: 16,
          overflow: 'hidden',
        }}>
          {filtered.map((game, i) => (
            <div key={game.id}>
              {i > 0 && (
                <div style={{
                  height: 1,
                  background: 'rgba(84,84,88,0.28)',
                  marginLeft: 80,
                }} />
              )}
              <GameRow game={game} onSelect={onSelect} />
            </div>
          ))}
        </div>

        <p style={{
          textAlign: 'center',
          color: 'rgba(235,235,245,0.18)',
          fontSize: 12,
          fontWeight: 500,
          marginTop: 24,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
          letterSpacing: '0.01em',
        }}>
          No accounts · No internet · Just vibes
        </p>
      </div>
    </div>
  )
}
