import { useState } from 'react'
import { PLAYER_PRESETS } from '../../data/presets'

const AVATARS = ['🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦋','🦄','🐙','🦀','🐠','🐢','🦜','🦩','🐝','🐞','🦕','🦑','🐬','🦔']

const QUESTIONS = {
  mild: [
    "What's the most embarrassing thing that's ever happened to you in public?",
    "What's the biggest lie you've ever told?",
    "What's something you've never told anyone in this room?",
    "Who here would you trust the most in a real crisis?",
    "What's the weirdest thing you've ever Googled?",
    "What's the pettiest thing you've ever done?",
    "What's a habit you have that you're not proud of?",
    "What's the worst advice you've given someone?",
    "Who here do you think is the best liar?",
    "What's the most childish thing you still do?",
    "What's your most irrational fear?",
    "If you could take back one decision, what would it be?",
    "What's the most money you've wasted on something dumb?",
    "What was your most embarrassing phase growing up?",
    "What's the pettiest grudge you're currently holding?",
    "What's something you pretend to like but actually hate?",
    "What's the most awkward thing you've done to impress someone?",
    "What's your go-to excuse when you want to cancel plans?",
    "What's a secret talent or skill no one here knows you have?",
    "What's the most ridiculous thing you've cried over?",
  ],
  spicy: [
    "Who here would you date if you absolutely had to pick one?",
    "What's something you've done that your parents definitely can't know?",
    "Who here have you talked badly about behind their back?",
    "What's the most desperate thing you've done for someone's attention?",
    "Have you ever cheated? On anything?",
    "What's the most embarrassing thing on your camera roll right now?",
    "Who here has the worst taste in partners?",
    "What's the worst thing you've done that no one found out about?",
    "Who here have you had a secret crush on?",
    "What's your most embarrassing drunk story?",
    "What's the shadiest thing you've done in a relationship?",
    "Who in this room would you least want to be stranded with?",
    "What's the most toxic trait you have?",
    "What's something you did that you're genuinely ashamed of?",
    "What's the worst thing you've thought about someone in this room?",
    "Who here do you think secretly dislikes you?",
    "What's a lie you've told to someone in this room?",
    "What's the worst date you've ever been on?",
    "Who here would you trade lives with for a week?",
    "What's something you've done that you'd rate a solid 8/10 regret?",
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

export default function HotSeatGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [pack, setPack] = useState('mild')
  const [currentIdx, setCurrentIdx] = useState(0)
  const [questions, setQuestions] = useState([])
  const [qIdx, setQIdx] = useState(0)

  const player = players[currentIdx]

  function startGame(names, chosenPack) {
    const ps = names.map((name, i) => ({ id: i, name, avatar: AVATARS[i % AVATARS.length] }))
    setPlayers(ps)
    setPack(chosenPack)
    setCurrentIdx(0)
    setQuestions(shuffle(QUESTIONS[chosenPack]).slice(0, 5))
    setQIdx(0)
    setPhase('cover')
  }

  function nextQuestion() {
    if (qIdx + 1 >= questions.length) {
      if (currentIdx + 1 >= players.length) {
        setPhase('done')
      } else {
        setPhase('between')
      }
    } else {
      setQIdx(q => q + 1)
    }
  }

  function nextPlayer() {
    setCurrentIdx(i => i + 1)
    setQuestions(shuffle(QUESTIONS[pack]).slice(0, 5))
    setQIdx(0)
    setPhase('cover')
  }

  if (phase === 'setup') return <SetupScreen onExit={onExit} onStart={startGame} />
  if (phase === 'cover') return <CoverScreen player={player} idx={currentIdx} total={players.length} onReady={() => setPhase('questions')} />
  if (phase === 'questions') return <QuestionScreen question={questions[qIdx]} qIdx={qIdx} total={questions.length} player={player} onNext={nextQuestion} />
  if (phase === 'between') return <BetweenScreen next={players[currentIdx + 1]} onContinue={nextPlayer} onEnd={() => setPhase('done')} />
  if (phase === 'done') return <DoneScreen players={players} onRestart={() => startGame(players.map(p => p.name), pack)} onExit={onExit} />
  return null
}

function SetupScreen({ onExit, onStart }) {
  const [names, setNames] = useState(['', ''])
  const [pack, setPack] = useState('mild')
  const validNames = names.filter(n => n.trim())
  const canStart = validNames.length >= 3

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">🪑 Hot Seat</span>
      </div>
      <div className="section">
        <p className="text-muted text-sm">Add players (min 3). Everyone takes a turn answering questions.</p>

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

        <div className="card" style={{ borderColor: 'var(--hs-border)', background: 'var(--hs-surface)' }}>
          <p className="section-title" style={{ marginBottom: 12 }}>Question Pack</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {['mild', 'spicy'].map(p => (
              <button key={p} onClick={() => setPack(p)} style={{
                flex: 1, padding: '12px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
                border: pack === p ? '1px solid var(--hs-border)' : '1px solid var(--border)',
                background: pack === p ? 'rgba(245,158,11,0.12)' : 'var(--surface)',
                color: pack === p ? 'var(--hs-accent)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}>
                {p === 'mild' ? '😌 Mild' : '🌶 Spicy'}
              </button>
            ))}
          </div>
        </div>

        {!canStart && <p className="text-muted text-sm text-center">Need at least 3 players</p>}
        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-hs" onClick={() => onStart(validNames, pack)} disabled={!canStart}>
            🪑 Start Hot Seat
          </button>
        </div>
      </div>
    </div>
  )
}

function CoverScreen({ player, idx, total, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}>
      <div style={{ fontSize: 72, filter: 'drop-shadow(0 8px 32px rgba(245,158,11,0.35))' }}>🪑</div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {player?.name}'s turn
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pass the phone to {player?.name}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>Tap when ready</p>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>{idx + 1} / {total}</p>
    </div>
  )
}

function QuestionScreen({ question, qIdx, total, player, onNext }) {
  return (
    <div className="screen fade-in" style={{ padding: 24, justifyContent: 'center', gap: 24 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 56, marginBottom: 12, filter: 'drop-shadow(0 4px 20px rgba(245,158,11,0.3))' }}>🔥</div>
        <p style={{ color: 'var(--hs-accent)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          {player?.name} — Question {qIdx + 1} of {total}
        </p>
      </div>

      <div className="card" style={{
        borderColor: 'var(--hs-border)',
        background: 'var(--hs-surface)',
        textAlign: 'center',
        padding: '36px 24px',
        boxShadow: '0 4px 40px rgba(245,158,11,0.08)',
      }}>
        <p style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.55, letterSpacing: '-0.01em' }}>{question}</p>
      </div>

      <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center' }}>Answer out loud, then continue</p>

      <div style={{ marginTop: 'auto' }}>
        <button className="btn btn-hs" onClick={onNext}>
          {qIdx + 1 < total ? 'Next Question →' : 'All Done ✓'}
        </button>
      </div>
    </div>
  )
}

function BetweenScreen({ next, onContinue, onEnd }) {
  return (
    <div className="screen fade-in" style={{ padding: 24, justifyContent: 'center', gap: 20, alignItems: 'center', textAlign: 'center' }}>
      <div style={{ fontSize: 64 }}>👏</div>
      <div>
        <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em' }}>Round done!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>
          Next up: <strong style={{ color: 'var(--hs-accent)' }}>{next?.avatar} {next?.name}</strong>
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
        <button className="btn btn-hs" onClick={onContinue}>Continue →</button>
        <button className="btn btn-ghost" onClick={onEnd}>End Game</button>
      </div>
    </div>
  )
}

function DoneScreen({ players, onRestart, onExit }) {
  return (
    <div className="screen slide-up" style={{ padding: 24, justifyContent: 'center', gap: 20, alignItems: 'center', textAlign: 'center' }}>
      <div style={{ fontSize: 72, filter: 'drop-shadow(0 8px 24px rgba(0,0,0,0.4))' }}>🏆</div>
      <div>
        <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em' }}>All done!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 8 }}>
          All {players.length} players survived the hot seat.
        </p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', marginTop: 8 }}>
        <button className="btn btn-hs" onClick={onRestart}>Play Again</button>
        <button className="btn btn-ghost" onClick={onExit}>Home</button>
      </div>
    </div>
  )
}
