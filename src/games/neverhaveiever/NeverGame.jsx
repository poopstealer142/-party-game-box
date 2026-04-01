import { useState } from 'react'
import { PLAYER_PRESETS } from '../../data/presets'

const AVATARS = ['🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦋','🦄','🐙','🦀','🐠','🐢','🦜','🦩','🐝','🐞','🦕','🦑','🐬','🦔']

const CARDS = {
  tame: [
    "stayed up all night",
    "cried watching a movie or TV show",
    "lied to get out of plans",
    "pretended to be sick to skip something",
    "eaten something off the floor",
    "sent a text to the completely wrong person",
    "been in a car accident",
    "gotten completely lost in a foreign country",
    "binge-watched an entire season in one sitting",
    "argued with a total stranger on the internet",
    "broken a bone",
    "pulled an all-nighter for work or school",
    "completely forgotten an important birthday",
    "skipped class or a meeting just because I didn't feel like it",
    "taken food that wasn't mine from a shared fridge",
    "been on a blind date",
    "lied about finishing a book I never actually read",
    "cried at work or school",
    "snuck out of my house",
    "pretended to know a song I'd never heard",
    "fallen asleep during a movie at the cinema",
    "talked to myself out loud in public",
    "run out of battery at the worst possible moment",
    "laughed at something I definitely shouldn't have",
    "Googled myself",
    "been ghosted by someone I liked",
    "accidentally liked someone's old photo while stalking their profile",
    "eaten an entire meal standing over the sink",
    "regifted a present",
    "lied about my age",
  ],
  spicy: [
    "kissed someone I'd just met that night",
    "flirted with someone to get something I wanted",
    "had a crush on a friend's partner",
    "gone skinny dipping",
    "had feelings for two people at the same time",
    "drunk texted someone and deeply regretted it",
    "told a secret I was trusted to keep",
    "snooped through someone's phone without them knowing",
    "blocked someone just to avoid a conversation",
    "lied to a partner about something important",
    "been in a situationship that went on way too long",
    "slid into someone's DMs completely out of nowhere",
    "faked being happy around someone I couldn't stand",
    "cancelled plans and then done something way more fun instead",
    "said 'I love you' without fully meaning it",
    "matched with someone on a dating app and actually met them",
    "pretended not to see someone I knew in public",
    "been jealous of a close friend",
    "talked badly about someone who genuinely thinks I'm their good friend",
    "cried over someone who absolutely did not deserve my tears",
    "sent a risky photo to someone",
    "had a secret they still don't know I know",
    "done something just to make someone jealous",
    "stayed in a relationship longer than I should have",
    "had a dream about someone in this room",
    "liked someone's years-old photo while stalking their profile late at night",
    "ghosted someone I actually liked",
    "pretended to be busy to avoid someone",
    "had a phase I'm genuinely embarrassed about",
    "dated someone my friends didn't approve of",
  ],
}

function cryptoRand(max) {
  const a = new Uint32Array(1)
  crypto.getRandomValues(a)
  return a[0] % max
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = cryptoRand(i + 1)
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function NeverGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [deck, setDeck] = useState([])
  const [cardIdx, setCardIdx] = useState(0)
  const [tapped, setTapped] = useState(new Set())
  const [deckType, setDeckType] = useState('tame')

  function startGame(names, type) {
    const ps = names.map((name, i) => ({ id: i, name, avatar: AVATARS[i % AVATARS.length] }))
    setPlayers(ps)
    setDeckType(type)
    setDeck(shuffle(CARDS[type]))
    setCardIdx(0)
    setTapped(new Set())
    setPhase('play')
  }

  function nextCard() {
    if (cardIdx + 1 >= deck.length) {
      setPhase('done')
    } else {
      setCardIdx(i => i + 1)
      setTapped(new Set())
    }
  }

  function togglePlayer(id) {
    setTapped(t => {
      const n = new Set(t)
      n.has(id) ? n.delete(id) : n.add(id)
      return n
    })
  }

  if (phase === 'setup') return <NSetup onExit={onExit} onStart={startGame} />
  if (phase === 'play') return (
    <NPlay
      card={deck[cardIdx]}
      cardIdx={cardIdx}
      total={deck.length}
      players={players}
      tapped={tapped}
      onToggle={togglePlayer}
      onNext={nextCard}
      deckType={deckType}
    />
  )
  if (phase === 'done') return (
    <NDone
      onRestart={() => { setDeck(shuffle(CARDS[deckType])); setCardIdx(0); setTapped(new Set()); setPhase('play') }}
      onExit={onExit}
    />
  )
  return null
}

function NSetup({ onExit, onStart }) {
  const [names, setNames] = useState(['', ''])
  const [deck, setDeck] = useState('tame')
  const validNames = names.filter(n => n.trim())
  const canStart = validNames.length >= 3

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">🙈 Never Have I Ever</span>
      </div>
      <div className="section">
        <p className="text-muted text-sm">Add players (min 3). Tap your name if you've done it.</p>

        {PLAYER_PRESETS.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PLAYER_PRESETS.map(p => (
              <button key={p.id} className="btn btn-ghost btn-sm" onClick={() => setNames([...p.players])} style={{ fontSize: 13 }}>
                {p.emoji} {p.name}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {names.map((name, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span style={{ width: 28, textAlign: 'center', flexShrink: 0 }}>{AVATARS[i % AVATARS.length]}</span>
              <input className="input" placeholder={`Player ${i + 1}`} value={name}
                onChange={e => setNames(n => n.map((x, idx) => idx === i ? e.target.value : x))} maxLength={20} />
              {names.length > 2 && (
                <button className="remove-btn" onClick={() => setNames(n => n.filter((_, idx) => idx !== i))}>×</button>
              )}
            </div>
          ))}
        </div>
        <button className="btn btn-ghost" onClick={() => setNames(n => [...n, ''])}>+ Add Player</button>

        <div className="card" style={{ borderColor: 'var(--nhi-border)', background: 'var(--nhi-surface)' }}>
          <p className="section-title" style={{ marginBottom: 12 }}>Card Deck</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['tame', 'spicy'].map(d => (
              <button key={d} onClick={() => setDeck(d)} style={{
                flex: 1, padding: '12px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                border: deck === d ? '1px solid var(--nhi-border)' : '1px solid var(--border)',
                background: deck === d ? 'rgba(244,63,94,0.12)' : 'var(--surface)',
                color: deck === d ? 'var(--nhi-accent)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}>
                {d === 'tame' ? '😇 Tame' : '🔥 Spicy'}
              </button>
            ))}
          </div>
        </div>

        {!canStart && <p className="text-muted text-sm text-center">Need at least 3 players</p>}
        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-nhi" onClick={() => onStart(validNames, deck)} disabled={!canStart}>
            🙈 Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

function NPlay({ card, cardIdx, total, players, tapped, onToggle, onNext, deckType }) {
  return (
    <div className="screen fade-in">
      <div className="header">
        <span style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>
          {cardIdx + 1} / {total}
        </span>
        <span className="header-title" style={{ flex: 1, textAlign: 'center' }}>🙈 Never Have I Ever</span>
        <span style={{ fontSize: 18 }}>{deckType === 'spicy' ? '🔥' : '😇'}</span>
      </div>
      <div className="section" style={{ alignItems: 'center' }}>
        <div className="card" style={{
          borderColor: 'var(--nhi-border)',
          background: 'var(--nhi-surface)',
          textAlign: 'center',
          padding: '32px 24px',
          width: '100%',
          boxShadow: '0 4px 40px rgba(244,63,94,0.08)',
        }}>
          <p style={{ color: 'var(--nhi-accent)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16 }}>
            Never have I ever...
          </p>
          <p style={{ fontSize: 21, fontWeight: 800, lineHeight: 1.45, letterSpacing: '-0.01em' }}>{card}</p>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>
          Tap your name if you <strong>have</strong> done it
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: players.length <= 4 ? '1fr 1fr' : 'repeat(3, 1fr)',
          gap: 8,
          width: '100%',
        }}>
          {players.map(p => {
            const active = tapped.has(p.id)
            return (
              <button
                key={p.id}
                onClick={() => onToggle(p.id)}
                style={{
                  padding: '14px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: active ? '1px solid var(--nhi-primary)' : '1px solid var(--border)',
                  background: active ? 'rgba(244,63,94,0.15)' : 'var(--surface)',
                  color: active ? 'var(--nhi-accent)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                  fontFamily: 'var(--font-body)',
                  fontWeight: active ? 700 : 500,
                  fontSize: 13,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 4,
                  boxShadow: active ? '0 0 12px rgba(244,63,94,0.2)' : 'none',
                  transform: active ? 'scale(1.02)' : 'scale(1)',
                }}
              >
                <span style={{ fontSize: 22 }}>{p.avatar}</span>
                <span>{p.name}</span>
                {active && <span style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>I have!</span>}
              </button>
            )
          })}
        </div>

        <div style={{ marginTop: 'auto', width: '100%' }}>
          <button className="btn btn-nhi" onClick={onNext}>
            {cardIdx + 1 < total ? 'Next Card →' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  )
}

function NDone({ onRestart, onExit }) {
  return (
    <div className="screen slide-up" style={{ padding: 24, justifyContent: 'center', gap: 20, alignItems: 'center', textAlign: 'center' }}>
      <div style={{ fontSize: 72, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}>🙈</div>
      <div>
        <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em' }}>Deck finished!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>
          Hope you learned some things about each other.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
        <button className="btn btn-nhi" onClick={onRestart}>Shuffle & Play Again</button>
        <button className="btn btn-ghost" onClick={onExit}>Home</button>
      </div>
    </div>
  )
}
