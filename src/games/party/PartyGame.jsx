import { useState } from 'react'
import { PLAYER_PRESETS } from '../../data/presets'

const AVATARS = ['🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦋','🦄','🐙','🦀','🐠','🐢','🦜','🦩','🐝','🐞','🦕','🦑','🐬','🦔']

const RULE_PROMPTS = [
  'You can fly',
  'You are an animal',
  'You are fictional',
  'You have more than 2 legs',
  'You are from the past',
  'You are a villain',
  'You are a girl or woman',
  'You live underwater',
  'You are tiny (smaller than a cat)',
  'You can do magic',
  'You are a superhero',
  'You are a food or drink',
  'You have a tail',
  'You wear a hat',
  'You are from a movie',
  'You have superpowers',
  'You are red or orange',
  'You are older than 100 years',
  'You are a royalty (king, queen, prince...)',
  'You are a cartoon character',
  'You are a mythical creature',
  'You are cold (like ice or snow)',
  'You are scary',
  'You start with the letter B',
  'You have wings',
]

export default function PartyGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [hostIdx, setHostIdx] = useState(0)
  const [scores, setScores] = useState([]) // wins per player
  const [currentRule, setCurrentRule] = useState('')
  const [entries, setEntries] = useState([]) // [{player, canCome: bool}]
  const [roundsPlayed, setRoundsPlayed] = useState(0)

  function startGame(names) {
    const ps = names.map((name, i) => ({ id: i, name, avatar: AVATARS[i % AVATARS.length] }))
    setPlayers(ps)
    setHostIdx(0)
    setScores(new Array(names.length).fill(0))
    setCurrentRule('')
    setEntries([])
    setRoundsPlayed(0)
    setPhase('hostCover')
  }

  function handleRuleSet(rule) {
    setCurrentRule(rule)
    setEntries([])
    setPhase('gameCover')
  }

  function addEntry(canCome, text) {
    setEntries(e => [...e, { canCome, text: text || '', id: e.length }])
  }

  function handleCorrectGuess() {
    const guesserIdx = (hostIdx + 1) % players.length // simplification - whoever guessed
    const newScores = [...scores]
    newScores[guesserIdx] += 1
    setScores(newScores)
    setPhase('reveal')
  }

  function nextHost() {
    const nextIdx = (hostIdx + 1) % players.length
    setHostIdx(nextIdx)
    setCurrentRule('')
    setEntries([])
    setRoundsPlayed(r => r + 1)
    if (roundsPlayed + 1 >= players.length) {
      setPhase('scores')
    } else {
      setPhase('hostCover')
    }
  }

  const host = players[hostIdx]

  if (phase === 'setup') return <PartySetup onExit={onExit} onStart={startGame} />
  if (phase === 'hostCover') return <PartyHostCover host={host} roundIdx={hostIdx} total={players.length} onReady={() => setPhase('setRule')} />
  if (phase === 'setRule') return <PartySetRule host={host} onSubmit={handleRuleSet} />
  if (phase === 'gameCover') return <PartyGameCover host={host} onReady={() => setPhase('game')} />
  if (phase === 'game') return (
    <PartyHosting
      host={host}
      rule={currentRule}
      entries={entries}
      onAddYes={(text) => addEntry(true, text)}
      onAddNo={(text) => addEntry(false, text)}
      onCorrectGuess={handleCorrectGuess}
    />
  )
  if (phase === 'reveal') return <PartyReveal host={host} rule={currentRule} entries={entries} onNext={nextHost} isLast={roundsPlayed + 1 >= players.length} />
  if (phase === 'scores') return <PartyScores players={players} scores={scores} onRestart={() => startGame(players.map(p => p.name))} onExit={onExit} />
  return null
}

function PartySetup({ onExit, onStart }) {
  const [names, setNames] = useState(['', ''])
  const validNames = names.filter(n => n.trim())
  const canStart = validNames.length >= 2

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">🎉 I'm Hosting a Party</span>
      </div>
      <div className="section">
        <div style={{
          padding: '14px 16px', borderRadius: 12,
          background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)',
          fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6,
        }}>
          The host picks a secret rule. Others ask <em style={{ color: 'var(--party-accent)' }}>"Can [thing] come to your party?"</em> to figure it out!
        </div>

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

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-party" onClick={() => onStart(validNames)} disabled={!canStart}>
            🎉 Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

function PartyHostCover({ host, roundIdx, total, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}>
      <div style={{ fontSize: 72, filter: 'drop-shadow(0 8px 32px rgba(236,72,153,0.4))' }}>🎉</div>
      <div>
        <p style={{ color: 'var(--party-accent)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
          Round {roundIdx + 1} of {total}
        </p>
        <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {host?.name} is hosting!
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pass phone to {host?.name}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>You'll pick a secret rule — others look away!</p>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>Tap to continue</p>
    </div>
  )
}

function PartySetRule({ host, onSubmit }) {
  const [rule, setRule] = useState('')
  const [showPrompts, setShowPrompts] = useState(false)

  return (
    <div className="screen fade-in">
      <div className="header">
        <span className="header-title">🤫 {host?.name}'s Secret Rule</span>
      </div>
      <div className="section" style={{ gap: 20 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
          Pick a secret rule for who can come to your party. You'll start by saying:<br />
          <em style={{ color: 'var(--party-accent)', fontStyle: 'normal', fontWeight: 700 }}>"I'm hosting a party and… [example] can come, but [example] can't."</em>
        </p>

        <input
          className="input"
          placeholder="You can fly / You are an animal / ..."
          value={rule}
          onChange={e => setRule(e.target.value)}
          maxLength={60}
          autoFocus
          style={{ fontSize: 16, fontWeight: 600 }}
        />

        <button
          className="btn btn-ghost"
          onClick={() => setShowPrompts(s => !s)}
          style={{ fontSize: 13 }}
        >
          {showPrompts ? 'Hide ideas ↑' : 'Need ideas? ↓'}
        </button>

        {showPrompts && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {RULE_PROMPTS.map(p => (
              <button
                key={p}
                onClick={() => setRule(p)}
                style={{
                  padding: '6px 12px', borderRadius: 20,
                  background: rule === p ? 'rgba(236,72,153,0.15)' : 'var(--surface)',
                  border: rule === p ? '1px solid var(--party-primary)' : '1px solid var(--border)',
                  color: rule === p ? 'var(--party-accent)' : 'var(--text-secondary)',
                  fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                  transition: 'all 0.12s',
                }}
              >
                {p}
              </button>
            ))}
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-party" onClick={() => onSubmit(rule.trim())} disabled={!rule.trim()}>
            I'm Ready to Host →
          </button>
        </div>
      </div>
    </div>
  )
}

function PartyGameCover({ host, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}>
      <div style={{ fontSize: 72 }}>🎊</div>
      <div>
        <p style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {host?.name} has their rule!
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
          Everyone can look now.<br />Ask <em style={{ color: 'var(--party-accent)', fontStyle: 'normal' }}>"Can [thing] come to your party?"</em><br />
          Host answers YES or NO.
        </p>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>Tap to start</p>
    </div>
  )
}

function PartyHosting({ host, rule, entries, onAddYes, onAddNo, onCorrectGuess }) {
  const [ruleVisible, setRuleVisible] = useState(false)
  const [currentGuess, setCurrentGuess] = useState('')
  const yesCount = entries.filter(e => e.canCome).length
  const noCount = entries.filter(e => !e.canCome).length

  function submitAnswer(canCome) {
    if (canCome) onAddYes(currentGuess.trim())
    else onAddNo(currentGuess.trim())
    setCurrentGuess('')
  }

  return (
    <div className="screen fade-in">
      <div className="header">
        <span className="header-title">🎉 {host?.name}'s Party</span>
        <button
          onClick={() => setRuleVisible(v => !v)}
          style={{
            marginLeft: 'auto', padding: '5px 12px', borderRadius: 8,
            background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.2)',
            color: 'var(--party-accent)', fontSize: 11, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit', letterSpacing: '0.05em',
          }}
        >
          {ruleVisible ? '🙈 Hide' : '👁 Rule'}
        </button>
      </div>
      <div className="section" style={{ gap: 14 }}>

        {ruleVisible && (
          <div style={{
            padding: '10px 14px', borderRadius: 10,
            background: 'rgba(236,72,153,0.08)', border: '1px solid rgba(236,72,153,0.2)',
            fontSize: 13, color: 'var(--party-accent)', fontWeight: 700,
            textAlign: 'center',
          }}>
            🤫 Rule: {rule}
          </div>
        )}

        {/* Guess input + Yes/No */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            className="input"
            placeholder='Type the guess, e.g. "Can a dog come?"'
            value={currentGuess}
            onChange={e => setCurrentGuess(e.target.value)}
            maxLength={60}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => submitAnswer(false)}
              disabled={!currentGuess.trim()}
              style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                color: '#FC8181', fontSize: 18, fontWeight: 800, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.1s', opacity: currentGuess.trim() ? 1 : 0.35,
              }}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onPointerUp={e => e.currentTarget.style.transform = ''}
              onPointerLeave={e => e.currentTarget.style.transform = ''}
            >
              ✗ No
            </button>
            <button
              onClick={() => submitAnswer(true)}
              disabled={!currentGuess.trim()}
              style={{
                flex: 1, padding: '14px', borderRadius: 12,
                background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
                color: '#86EFAC', fontSize: 18, fontWeight: 800, cursor: 'pointer',
                fontFamily: 'inherit', transition: 'all 0.1s', opacity: currentGuess.trim() ? 1 : 0.35,
              }}
              onPointerDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
              onPointerUp={e => e.currentTarget.style.transform = ''}
              onPointerLeave={e => e.currentTarget.style.transform = ''}
            >
              ✓ Yes
            </button>
          </div>
        </div>

        {/* Guest counters */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{
            flex: 1, padding: '10px', borderRadius: 10, textAlign: 'center',
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#22C55E' }}>{yesCount}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>✓ Can come</div>
          </div>
          <div style={{
            flex: 1, padding: '10px', borderRadius: 10, textAlign: 'center',
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          }}>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#EF4444' }}>{noCount}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>✗ Can't come</div>
          </div>
        </div>

        {/* Log */}
        {entries.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1, overflowY: 'auto', minHeight: 0 }}>
            {[...entries].reverse().map((e) => (
              <div key={e.id} style={{
                padding: '8px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                background: e.canCome ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
                border: `1px solid ${e.canCome ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
              }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: e.canCome ? '#22C55E' : '#EF4444', flexShrink: 0 }}>
                  {e.canCome ? '✓' : '✗'}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text)', flex: 1, lineHeight: 1.4 }}>
                  {e.text || `Question #${e.id + 1}`}
                </span>
                <span style={{ fontSize: 11, fontWeight: 700, color: e.canCome ? '#22C55E' : '#EF4444', flexShrink: 0 }}>
                  {e.canCome ? 'YES' : 'NO'}
                </span>
              </div>
            ))}
          </div>
        )}

        <button className="btn btn-party" onClick={onCorrectGuess} style={{ marginTop: 'auto' }}>
          🎊 Someone Guessed the Rule!
        </button>
      </div>
    </div>
  )
}

function PartyReveal({ host, rule, entries, onNext, isLast }) {
  return (
    <div className="screen slide-up" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>🎊</div>
        <div>
          <p style={{ color: 'var(--party-accent)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
            {host?.name}'s secret rule was
          </p>
          <div style={{
            padding: '16px 20px', borderRadius: 14,
            background: 'rgba(236,72,153,0.1)', border: '1px solid rgba(236,72,153,0.3)',
            fontSize: 22, fontWeight: 800, color: 'var(--text)',
          }}>
            "{rule}"
          </div>
        </div>

        {/* Full guess log */}
        {entries.length > 0 && (
          <div style={{ width: '100%', textAlign: 'left' }}>
            <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
              All guesses
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {entries.map(e => (
                <div key={e.id} style={{
                  padding: '8px 12px', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                  background: e.canCome ? 'rgba(34,197,94,0.06)' : 'rgba(239,68,68,0.06)',
                  border: `1px solid ${e.canCome ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
                }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: e.canCome ? '#22C55E' : '#EF4444', flexShrink: 0 }}>
                    {e.canCome ? '✓' : '✗'}
                  </span>
                  <span style={{ fontSize: 13, flex: 1, color: 'var(--text)', lineHeight: 1.4 }}>
                    {e.text || `Question #${e.id + 1}`}
                  </span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: e.canCome ? '#22C55E' : '#EF4444', flexShrink: 0 }}>
                    {e.canCome ? 'YES' : 'NO'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <button className="btn btn-party" style={{ maxWidth: 320, width: '100%' }} onClick={onNext}>
          {isLast ? 'See Final Scores →' : 'Next Host →'}
        </button>
      </div>
    </div>
  )
}

function PartyScores({ players, scores, onRestart, onExit }) {
  const sorted = [...players].map((p, i) => ({ ...p, score: scores[i] })).sort((a, b) => b.score - a.score)

  return (
    <div className="screen slide-up" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>🏆</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em' }}>Final Scores</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>Who was the best guesser?</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {sorted.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 16px', borderRadius: 14,
              background: i === 0 ? 'rgba(236,72,153,0.08)' : 'var(--surface)',
              border: `1px solid ${i === 0 ? 'rgba(236,72,153,0.25)' : 'var(--border)'}`,
            }}>
              <span style={{ fontSize: 18, width: 24, textAlign: 'center', color: i === 0 ? '#F9A8D4' : 'var(--text-muted)', fontWeight: 800 }}>
                {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `#${i + 1}`}
              </span>
              <span style={{ fontSize: 22 }}>{p.avatar}</span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{p.name}</span>
              <span style={{ fontSize: 20, fontWeight: 900, color: i === 0 ? 'var(--party-primary)' : 'var(--text-secondary)' }}>
                {p.score}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-party" onClick={onRestart}>Play Again</button>
          <button className="btn btn-ghost" onClick={onExit}>Home</button>
        </div>
      </div>
    </div>
  )
}
