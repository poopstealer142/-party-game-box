import { useState } from 'react'
import { PLAYER_PRESETS } from '../../data/presets'

const AVATARS = ['🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦋','🦄','🐙','🦀','🐠','🐢','🦜','🦩','🐝','🐞','🦕','🦑','🐬','🦔']

export default function TruthsGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [submissions, setSubmissions] = useState([]) // [{stmts:[s,s,s], lieIdx:0|1|2}]
  const [submitIdx, setSubmitIdx] = useState(0)
  const [guessRound, setGuessRound] = useState(0)
  const [groupGuess, setGroupGuess] = useState(null)
  const [roundResults, setRoundResults] = useState([]) // [{fooled: bool, lieIdx, guess}]

  function startGame(names) {
    const ps = names.map((name, i) => ({ id: i, name, avatar: AVATARS[i % AVATARS.length] }))
    setPlayers(ps)
    setSubmissions([])
    setSubmitIdx(0)
    setGuessRound(0)
    setGroupGuess(null)
    setRoundResults([])
    setPhase('submitCover')
  }

  function handleSubmit(stmts, lieIdx) {
    const newSubs = [...submissions, { stmts, lieIdx }]
    setSubmissions(newSubs)
    if (submitIdx + 1 >= players.length) {
      setGuessRound(0)
      setGroupGuess(null)
      setPhase('guess')
    } else {
      setSubmitIdx(i => i + 1)
      setPhase('submitCover')
    }
  }

  function handleGroupGuess(lieIdx) {
    const sub = submissions[guessRound]
    const fooled = lieIdx !== sub.lieIdx
    setGroupGuess(lieIdx)
    setRoundResults(r => [...r, { fooled, lieIdx: sub.lieIdx, guess: lieIdx }])
    setPhase('reveal')
  }

  function nextRound() {
    if (guessRound + 1 >= players.length) {
      setPhase('scores')
    } else {
      setGuessRound(r => r + 1)
      setGroupGuess(null)
      setPhase('guess')
    }
  }

  const subjectPlayer = players[guessRound]
  const currentSub = submissions[guessRound]

  if (phase === 'setup') return <TSetup onExit={onExit} onStart={startGame} />
  if (phase === 'submitCover') return <TSubmitCover player={players[submitIdx]} idx={submitIdx} total={players.length} onReady={() => setPhase('submit')} />
  if (phase === 'submit') return <TSubmit player={players[submitIdx]} onSubmit={handleSubmit} />
  if (phase === 'guess') return <TGuess player={subjectPlayer} sub={currentSub} onGuess={handleGroupGuess} round={guessRound} total={players.length} />
  if (phase === 'reveal') return <TReveal player={subjectPlayer} sub={currentSub} groupGuess={groupGuess} onNext={nextRound} isLast={guessRound + 1 >= players.length} />
  if (phase === 'scores') return <TScores players={players} roundResults={roundResults} onRestart={() => startGame(players.map(p => p.name))} onExit={onExit} />
  return null
}

function TSetup({ onExit, onStart }) {
  const [names, setNames] = useState(['', ''])
  const validNames = names.filter(n => n.trim())
  const canStart = validNames.length >= 3

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">🤥 Two Truths & A Lie</span>
      </div>
      <div className="section">
        <p className="text-muted text-sm">Add players (min 3). Each person privately enters 2 truths and 1 lie.</p>

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

        {!canStart && <p className="text-muted text-sm text-center">Need at least 3 players</p>}
        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-tt" onClick={() => onStart(validNames)} disabled={!canStart}>
            🤥 Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

function TSubmitCover({ player, idx, total, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}>
      <div style={{ fontSize: 72, filter: 'drop-shadow(0 8px 32px rgba(6,182,212,0.35))' }}>🤫</div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {player?.name}'s turn
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pass the phone to {player?.name}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>Enter your statements privately</p>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>{idx + 1} / {total}</p>
    </div>
  )
}

function TSubmit({ player, onSubmit }) {
  const [stmts, setStmts] = useState(['', '', ''])
  const [lieIdx, setLieIdx] = useState(null)
  const canSubmit = stmts.every(s => s.trim()) && lieIdx !== null

  function updateStmt(i, val) {
    setStmts(s => s.map((x, idx) => idx === i ? val : x))
  }

  return (
    <div className="screen fade-in">
      <div className="header">
        <span className="header-title">🤫 {player?.name}'s Statements</span>
      </div>
      <div className="section">
        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Enter 3 statements about yourself, then tap the one that's <strong style={{ color: 'var(--tt-accent)' }}>the lie</strong>.
        </p>

        {[0, 1, 2].map(i => (
          <div key={i} style={{ position: 'relative' }}>
            <input
              className="input"
              placeholder={`Statement ${i + 1}`}
              value={stmts[i]}
              onChange={e => updateStmt(i, e.target.value)}
              maxLength={80}
              style={{
                borderColor: lieIdx === i ? 'var(--tt-primary)' : undefined,
                background: lieIdx === i ? 'rgba(6,182,212,0.08)' : undefined,
                paddingRight: 48,
              }}
            />
            <button
              onClick={() => setLieIdx(lieIdx === i ? null : i)}
              style={{
                position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
                background: lieIdx === i ? 'var(--tt-primary)' : 'var(--surface-hover)',
                border: 'none', borderRadius: 6, padding: '4px 8px',
                cursor: 'pointer', fontSize: 11, fontWeight: 700,
                color: lieIdx === i ? '#001820' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}
            >
              {lieIdx === i ? '🤥 LIE' : 'lie?'}
            </button>
          </div>
        ))}

        {lieIdx === null && stmts.every(s => s.trim()) && (
          <p style={{ color: 'var(--tt-accent)', fontSize: 12, textAlign: 'center' }}>
            Tap "lie?" on the statement that's false
          </p>
        )}

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-tt" onClick={() => onSubmit(stmts, lieIdx)} disabled={!canSubmit}>
            Done — Pass Phone →
          </button>
        </div>
      </div>
    </div>
  )
}

function TGuess({ player, sub, onGuess, round, total }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="screen fade-in">
      <div className="header">
        <span className="header-title">🧐 Guess the Lie</span>
      </div>
      <div className="section">
        <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
          <p style={{ color: 'var(--tt-accent)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
            Round {round + 1} of {total}
          </p>
          <p style={{ fontSize: 18, fontWeight: 800 }}>
            {player?.avatar} {player?.name}'s statements
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>
            Discuss, then vote — which one is the lie?
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sub?.stmts.map((stmt, i) => (
            <button
              key={i}
              onClick={() => setSelected(selected === i ? null : i)}
              style={{
                padding: '16px 18px',
                background: selected === i ? 'rgba(6,182,212,0.1)' : 'var(--surface)',
                border: selected === i ? '1px solid var(--tt-primary)' : '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--text)',
                fontSize: 15,
                fontWeight: 500,
                lineHeight: 1.5,
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
                boxShadow: selected === i ? '0 0 0 1px var(--tt-primary)' : 'none',
              }}
            >
              <span style={{ color: 'var(--tt-accent)', fontWeight: 700, marginRight: 10, fontSize: 13 }}>
                {selected === i ? '→' : String.fromCharCode(65 + i)}
              </span>
              {stmt}
            </button>
          ))}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-tt" onClick={() => onGuess(selected)} disabled={selected === null}>
            Lock In Answer →
          </button>
        </div>
      </div>
    </div>
  )
}

function TReveal({ player, sub, groupGuess, onNext, isLast }) {
  const fooled = groupGuess !== sub?.lieIdx

  return (
    <div className="screen slide-up" style={{ padding: 24, justifyContent: 'center', gap: 20 }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 64, marginBottom: 12 }}>{fooled ? '😈' : '🎯'}</div>
        <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 }}>
          {fooled ? `${player?.name} fooled you!` : 'You caught the lie!'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {fooled ? "The group guessed wrong." : "Nice detective work."}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {sub?.stmts.map((stmt, i) => {
          const isLie = i === sub.lieIdx
          const wasGuessed = i === groupGuess
          return (
            <div key={i} style={{
              padding: '14px 18px',
              background: isLie ? 'rgba(244,63,94,0.1)' : 'rgba(16,185,129,0.06)',
              border: `1px solid ${isLie ? 'rgba(244,63,94,0.3)' : 'rgba(16,185,129,0.2)'}`,
              borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                <p style={{ fontSize: 14, lineHeight: 1.5, color: 'var(--text)', flex: 1 }}>{stmt}</p>
                <span style={{
                  fontSize: 11, fontWeight: 700, flexShrink: 0,
                  color: isLie ? '#F43F5E' : '#10B981',
                  textTransform: 'uppercase', letterSpacing: '0.06em',
                }}>
                  {isLie ? '🤥 LIE' : '✓ TRUE'}
                </span>
              </div>
              {wasGuessed && !isLie && (
                <p style={{ fontSize: 11, color: 'var(--tt-accent)', marginTop: 6 }}>← You picked this</p>
              )}
            </div>
          )
        })}
      </div>

      <button className="btn btn-tt" onClick={onNext}>
        {isLast ? 'See Scores →' : 'Next Round →'}
      </button>
    </div>
  )
}

function TScores({ players, roundResults, onRestart, onExit }) {
  return (
    <div className="screen slide-up" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>🏅</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 6 }}>Results</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Who fooled the group?</p>
        </div>

        <div className="card">
          {players.map((p, i) => {
            const result = roundResults[i]
            const fooled = result?.fooled
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '12px 0',
                borderBottom: i < players.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{ fontSize: 22 }}>{p.avatar}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: 15 }}>{p.name}</p>
                  <p style={{ fontSize: 12, color: fooled ? 'var(--nhi-accent)' : 'var(--text-muted)', marginTop: 2 }}>
                    {fooled ? 'Fooled the group 😈' : 'Lie was caught 🎯'}
                  </p>
                </div>
                <span style={{ fontSize: 22 }}>{fooled ? '😈' : '🎯'}</span>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-tt" onClick={onRestart}>Play Again</button>
          <button className="btn btn-ghost" onClick={onExit}>Home</button>
        </div>
      </div>
    </div>
  )
}
