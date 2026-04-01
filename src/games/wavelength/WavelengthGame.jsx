import { useState } from 'react'
import { PLAYER_PRESETS } from '../../data/presets'

const AVATARS = ['🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦋','🦄','🐙','🦀','🐠','🐢','🦜','🦩','🐝','🐞','🦕','🦑','🐬','🦔']

const SPECTRUMS = [
  { left: 'Hot', right: 'Cold' },
  { left: 'Fast', right: 'Slow' },
  { left: 'Dangerous', right: 'Safe' },
  { left: 'Overrated', right: 'Underrated' },
  { left: 'Funny', right: 'Serious' },
  { left: 'Big', right: 'Small' },
  { left: 'Old', right: 'New' },
  { left: 'Popular', right: 'Unpopular' },
  { left: 'Healthy', right: 'Unhealthy' },
  { left: 'Cheap', right: 'Expensive' },
  { left: 'Easy', right: 'Hard' },
  { left: 'Loud', right: 'Quiet' },
  { left: 'Beautiful', right: 'Ugly' },
  { left: 'Good', right: 'Evil' },
  { left: 'Brave', right: 'Cowardly' },
  { left: 'Lucky', right: 'Unlucky' },
  { left: 'Natural', right: 'Artificial' },
  { left: 'Romantic', right: 'Unromantic' },
  { left: 'Logical', right: 'Emotional' },
  { left: 'Urban', right: 'Rural' },
  { left: 'Wild', right: 'Tame' },
  { left: 'Scary', right: 'Adorable' },
  { left: 'Boring', right: 'Exciting' },
  { left: 'Humble', right: 'Arrogant' },
  { left: 'Rare', right: 'Common' },
  { left: 'Dark', right: 'Light' },
  { left: 'Soft', right: 'Hard' },
  { left: 'Sweet', right: 'Bitter' },
  { left: 'Weak', right: 'Strong' },
  { left: 'Messy', right: 'Neat' },
  { left: 'High Tech', right: 'Low Tech' },
  { left: 'Introvert', right: 'Extrovert' },
  { left: 'Mainstream', right: 'Niche' },
  { left: 'Stressful', right: 'Relaxing' },
  { left: 'Formal', right: 'Casual' },
  { left: 'Magical', right: 'Mundane' },
  { left: 'Smart', right: 'Dumb' },
  { left: 'Simple', right: 'Complex' },
  { left: 'Wet', right: 'Dry' },
  { left: 'Heavy', right: 'Light' },
  { left: 'Guilty', right: 'Innocent' },
  { left: 'Genius', right: 'Clueless' },
  { left: 'Attractive', right: 'Repulsive' },
  { left: 'Addictive', right: 'Forgettable' },
  { left: 'Trustworthy', right: 'Sketchy' },
  { left: 'Classy', right: 'Trashy' },
  { left: 'Timeless', right: 'Dated' },
  { left: 'Wholesome', right: 'Cursed' },
  { left: 'Satisfying', right: 'Frustrating' },
  { left: 'Awkward', right: 'Smooth' },
  { left: 'Chaotic', right: 'Orderly' },
  { left: 'Iconic', right: 'Generic' },
  { left: 'Cringe', right: 'Cool' },
  { left: 'Energetic', right: 'Laid-back' },
  { left: 'Controversial', right: 'Universally loved' },
  { left: 'Nostalgic', right: 'Futuristic' },
  { left: 'Realistic', right: 'Fantastical' },
  { left: 'Mature', right: 'Childish' },
  { left: 'Pretentious', right: 'Down-to-earth' },
  { left: 'Spicy', right: 'Mild' },
  { left: 'Cozy', right: 'Intense' },
  { left: 'Productive', right: 'Lazy' },
  { left: 'Useful', right: 'Useless' },
  { left: 'Impressive', right: 'Meh' },
  { left: 'Peaceful', right: 'Chaotic' },
  { left: 'Creative', right: 'Predictable' },
  { left: 'Mainstream', right: 'Underground' },
  { left: 'Gourmet', right: 'Fast food' },
  { left: 'Sophisticated', right: 'Basic' },
  { left: 'Mysterious', right: 'Obvious' },
  { left: 'Masculine', right: 'Feminine' },
  { left: 'Rebellious', right: 'Conformist' },
  { left: 'Optimistic', right: 'Pessimistic' },
  { left: 'Private', right: 'Public' },
  { left: 'Physical', right: 'Mental' },
  { left: 'Ancient', right: 'Modern' },
  { left: 'Terrifying', right: 'Harmless' },
  { left: 'Chill', right: 'High-maintenance' },
]

// Scoring: distance from center of target
function calcScore(target, guess) {
  const dist = Math.abs(target - guess)
  if (dist <= 8) return 4
  if (dist <= 16) return 3
  if (dist <= 26) return 2
  if (dist <= 38) return 1
  return 0
}

function secureRandom(max) {
  const arr = new Uint32Array(1)
  crypto.getRandomValues(arr)
  return arr[0] % max
}

function shuffleArr(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = secureRandom(i + 1);
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const PLAYER_COLORS = ['#6366F1','#22C55E','#F59E0B','#EF4444','#EC4899','#06B6D4','#A855F7','#F97316']

export default function WavelengthGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [spectrums] = useState(() => shuffleArr(SPECTRUMS))
  const [roundIdx, setRoundIdx] = useState(0)
  const [target, setTarget] = useState(50)
  const [clue, setClue] = useState('')
  const [playerGuesses, setPlayerGuesses] = useState({}) // {playerId: value}
  const [guessingIdx, setGuessingIdx] = useState(0)      // index in nonPsychicPlayers
  const [playerTotalScores, setPlayerTotalScores] = useState({}) // {playerId: total}
  const [roundHistory, setRoundHistory] = useState([])   // [{clue, spectrum, target, guesses}]

  function startGame(names) {
    const ps = names.map((name, i) => ({ id: i, name, avatar: AVATARS[i % AVATARS.length] }))
    setPlayers(ps)
    setRoundIdx(0)
    setPlayerGuesses({})
    setGuessingIdx(0)
    setPlayerTotalScores(Object.fromEntries(ps.map(p => [p.id, 0])))
    setRoundHistory([])
    setClue('')
    setTarget(15 + secureRandom(70))
    setPhase('psychicCover')
  }

  function handleClueSubmit(clueText) {
    setClue(clueText)
    setPlayerGuesses({})
    setGuessingIdx(0)
    setPhase('playerGuessCover')
  }

  const nonPsychicPlayers = players.filter((_, i) => i !== roundIdx)

  function handlePlayerGuess(guessVal) {
    const guesser = nonPsychicPlayers[guessingIdx]
    const newGuesses = { ...playerGuesses, [guesser.id]: guessVal }
    setPlayerGuesses(newGuesses)

    if (guessingIdx + 1 >= nonPsychicPlayers.length) {
      // All guessed — score each player
      const newTotals = { ...playerTotalScores }
      nonPsychicPlayers.forEach(p => {
        newTotals[p.id] = (newTotals[p.id] || 0) + calcScore(target, newGuesses[p.id])
      })
      setPlayerTotalScores(newTotals)
      setRoundHistory(h => [...h, { clue, spectrum: spectrums[roundIdx % spectrums.length], target, guesses: newGuesses }])
      setPhase('reveal')
    } else {
      setGuessingIdx(i => i + 1)
      setPhase('playerGuessCover')
    }
  }

  function nextRound() {
    if (roundIdx + 1 >= players.length) {
      setPhase('scores')
    } else {
      setTarget(15 + secureRandom(70))
      setClue('')
      setPlayerGuesses({})
      setGuessingIdx(0)
      setRoundIdx(i => i + 1)
      setPhase('psychicCover')
    }
  }

  const psychic = players[roundIdx]
  const spectrum = spectrums[roundIdx % spectrums.length]

  if (phase === 'setup') return <WLSetup onExit={onExit} onStart={startGame} />
  if (phase === 'psychicCover') return (
    <WLPsychicCover psychic={psychic} roundIdx={roundIdx} total={players.length} onReady={() => setPhase('psychic')} />
  )
  if (phase === 'psychic') return (
    <WLPsychic psychic={psychic} spectrum={spectrum} target={target} onSubmit={handleClueSubmit} />
  )
  if (phase === 'playerGuessCover') return (
    <WLPlayerGuessCover
      guesser={nonPsychicPlayers[guessingIdx]}
      guessingIdx={guessingIdx}
      total={nonPsychicPlayers.length}
      clue={clue}
      onReady={() => setPhase('playerGuess')}
    />
  )
  if (phase === 'playerGuess') return (
    <WLPlayerGuess
      guesser={nonPsychicPlayers[guessingIdx]}
      guesserColor={PLAYER_COLORS[nonPsychicPlayers[guessingIdx]?.id % PLAYER_COLORS.length]}
      spectrum={spectrum}
      clue={clue}
      onSubmit={handlePlayerGuess}
    />
  )
  if (phase === 'reveal') return (
    <WLReveal
      spectrum={spectrum}
      target={target}
      playerGuesses={playerGuesses}
      nonPsychicPlayers={nonPsychicPlayers}
      clue={clue}
      psychic={psychic}
      roundIdx={roundIdx}
      total={players.length}
      onNext={nextRound}
      isLast={roundIdx + 1 >= players.length}
    />
  )
  if (phase === 'scores') return (
    <WLScores
      players={players}
      playerTotalScores={playerTotalScores}
      roundHistory={roundHistory}
      onRestart={() => startGame(players.map(p => p.name))}
      onExit={onExit}
    />
  )
  return null
}

function WLSetup({ onExit, onStart }) {
  const [names, setNames] = useState(['', ''])
  const validNames = names.filter(n => n.trim())
  const canStart = validNames.length >= 2

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">🌊 Wavelength</span>
      </div>
      <div className="section">
        <p className="text-muted text-sm">
          One player sees a secret target on a spectrum. They give ONE word clue. The group tries to guess where on the spectrum it falls!
        </p>

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

        {/* Scoring guide */}
        <div style={{ padding: '12px 16px', borderRadius: 12, background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>Scoring</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[{ pts: 4, label: 'Bullseye', color: '#22C55E' }, { pts: 3, label: 'Close', color: '#84CC16' }, { pts: 2, label: 'Near', color: '#F59E0B' }, { pts: 1, label: 'Far', color: '#F97316' }].map(({ pts, label, color }) => (
              <div key={pts} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ color, fontSize: 16, fontWeight: 800 }}>{pts}pt</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 10 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-wl" onClick={() => onStart(validNames)} disabled={!canStart}>
            🌊 Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

function WLPsychicCover({ psychic, roundIdx, total, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}>
      <div style={{ fontSize: 72, filter: 'drop-shadow(0 8px 32px rgba(99,102,241,0.4))' }}>🔮</div>
      <div>
        <p style={{ color: 'var(--wl-accent)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
          Round {roundIdx + 1} of {total}
        </p>
        <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {psychic?.name} is the Psychic
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pass phone to {psychic?.name}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>You'll see the secret target — others look away!</p>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>Tap to reveal</p>
    </div>
  )
}

function WLPsychic({ psychic, spectrum, target, onSubmit }) {
  const [clue, setClue] = useState('')

  return (
    <div className="screen fade-in">
      <div className="header">
        <span className="header-title">🔮 {psychic?.name}'s Secret</span>
      </div>
      <div className="section" style={{ gap: 24 }}>
        <p style={{ color: 'var(--wl-accent)', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>
          Only you can see this!
        </p>

        {/* Spectrum with target marker */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 15, fontWeight: 800 }}>{spectrum.left}</span>
            <span style={{ fontSize: 15, fontWeight: 800 }}>{spectrum.right}</span>
          </div>
          <div style={{ position: 'relative', height: 48 }}>
            {/* Background */}
            <div style={{
              position: 'absolute', top: '50%', left: 0, right: 0,
              height: 8, transform: 'translateY(-50%)', borderRadius: 4,
              background: 'linear-gradient(to right, var(--wl-primary), rgba(99,102,241,0.2))',
            }} />
            {/* Target zone */}
            <div style={{
              position: 'absolute', top: '50%', transform: 'translateY(-50%)',
              left: `calc(${target}% - 8%)`, width: '16%', height: 28, borderRadius: 6,
              background: 'rgba(99,102,241,0.35)', border: '2px solid var(--wl-primary)',
            }} />
            {/* Target arrow */}
            <div style={{
              position: 'absolute', top: 0,
              left: `calc(${target}% - 12px)`, width: 24, height: 24,
              background: 'var(--wl-primary)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 12, color: '#fff', fontWeight: 800,
              boxShadow: '0 2px 12px rgba(99,102,241,0.5)',
            }}>
              ★
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--wl-accent)', fontWeight: 700 }}>
              Target is {target < 35 ? 'closer to ' + spectrum.left : target > 65 ? 'closer to ' + spectrum.right : 'near the middle'}
            </span>
          </div>
        </div>

        {/* Clue input */}
        <div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 10 }}>
            Give ONE word that hints where the star falls on this spectrum. Say it out loud OR type it below.
          </p>
          <input
            className="input"
            placeholder="Your one-word clue..."
            value={clue}
            onChange={e => setClue(e.target.value)}
            maxLength={30}
            autoFocus
            style={{ fontSize: 18, fontWeight: 700, textAlign: 'center' }}
          />
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-wl" onClick={() => onSubmit(clue.trim())} disabled={!clue.trim()}>
            Submit Clue →
          </button>
        </div>
      </div>
    </div>
  )
}

function WLPlayerGuessCover({ guesser, guessingIdx, total, clue, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}>
      <div style={{ fontSize: 72, filter: 'drop-shadow(0 8px 32px rgba(99,102,241,0.4))' }}>🌊</div>
      <div>
        <p style={{ color: 'var(--wl-accent)', fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
          Guesser {guessingIdx + 1} of {total}
        </p>
        <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {guesser?.name}'s guess
        </p>
        <p style={{ color: 'var(--wl-primary)', fontSize: 26, fontWeight: 900, marginBottom: 8 }}>"{clue}"</p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pass phone to {guesser?.name}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>Guess secretly — don't share!</p>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>Tap to guess</p>
    </div>
  )
}

function WLPlayerGuess({ guesser, guesserColor, spectrum, clue, onSubmit }) {
  const [guess, setGuess] = useState(50)

  return (
    <div className="screen fade-in">
      <div className="header">
        <span className="header-title" style={{ color: guesserColor }}>{guesser?.avatar} {guesser?.name}</span>
      </div>
      <div className="section" style={{ gap: 24, justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>The Clue</p>
          <p style={{ fontSize: 32, fontWeight: 900, color: 'var(--wl-primary)', letterSpacing: '-0.02em' }}>"{clue}"</p>
        </div>

        <div style={{ width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 16, fontWeight: 800 }}>{spectrum.left}</span>
            <span style={{ fontSize: 16, fontWeight: 800 }}>{spectrum.right}</span>
          </div>
          <div style={{ position: 'relative', height: 60, display: 'flex', alignItems: 'center' }}>
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 8, borderRadius: 4,
              background: `linear-gradient(to right, ${guesserColor}cc, ${guesserColor}33)`,
            }} />
            <input
              type="range" min={0} max={100} value={guess}
              onChange={e => setGuess(Number(e.target.value))}
              style={{
                position: 'relative', width: '100%',
                WebkitAppearance: 'none', appearance: 'none',
                background: 'transparent', outline: 'none',
                height: 40, cursor: 'pointer', zIndex: 1,
              }}
            />
          </div>
          <div style={{ textAlign: 'center', marginTop: 8 }}>
            <span style={{
              padding: '6px 16px', borderRadius: 20,
              background: `${guesserColor}15`, border: `1px solid ${guesserColor}40`,
              fontSize: 14, fontWeight: 700, color: guesserColor,
            }}>
              {guess < 20 ? `Very ${spectrum.left}` : guess < 40 ? spectrum.left : guess > 80 ? `Very ${spectrum.right}` : guess > 60 ? spectrum.right : 'Middle'}
            </span>
          </div>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-wl" onClick={() => onSubmit(guess)}>
            Lock In →
          </button>
        </div>
      </div>
    </div>
  )
}

const SCORE_COLORS = { 4: '#22C55E', 3: '#84CC16', 2: '#F59E0B', 1: '#F97316', 0: '#EF4444' }

function WLReveal({ spectrum, target, playerGuesses, nonPsychicPlayers, clue, psychic, roundIdx, total, onNext, isLast }) {
  return (
    <div className="screen slide-up">
      <div className="header">
        <span className="header-title">🎯 Reveal</span>
        <span style={{ marginLeft: 'auto', color: 'var(--wl-accent)', fontSize: 12, fontWeight: 700 }}>{roundIdx + 1}/{total}</span>
      </div>
      <div className="section" style={{ gap: 20 }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
            {psychic?.name}'s clue
          </p>
          <p style={{ fontSize: 28, fontWeight: 900, color: 'var(--wl-primary)' }}>"{clue}"</p>
        </div>

        {/* Spectrum with all guesses */}
        <div style={{ padding: '20px 20px 12px', background: 'var(--surface)', borderRadius: 16, border: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>{spectrum.left}</span>
            <span style={{ fontSize: 14, fontWeight: 800 }}>{spectrum.right}</span>
          </div>
          <div style={{ position: 'relative', height: 64 }}>
            {/* Track */}
            <div style={{
              position: 'absolute', top: 16, left: 0, right: 0,
              height: 6, borderRadius: 3, background: 'var(--border)',
            }} />
            {/* Target zone */}
            <div style={{
              position: 'absolute', top: 8, transform: 'none',
              left: `calc(${target}% - 8%)`, width: '16%', height: 22, borderRadius: 4,
              background: 'rgba(34,197,94,0.2)', border: '2px solid #22C55E',
            }} />
            {/* Target star */}
            <div style={{
              position: 'absolute', top: 7, left: `${target}%`, transform: 'translateX(-50%)',
              width: 22, height: 22, borderRadius: '50%',
              background: '#22C55E', border: '2px solid #fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, color: '#fff', fontWeight: 800,
            }}>★</div>
            {/* Player guess markers */}
            {nonPsychicPlayers.map((p) => {
              const g = playerGuesses[p.id]
              const color = PLAYER_COLORS[p.id % PLAYER_COLORS.length]
              const score = calcScore(target, g)
              return (
                <div key={p.id} style={{
                  position: 'absolute', bottom: 0, left: `${g}%`, transform: 'translateX(-50%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2,
                }}>
                  <div style={{ width: 3, height: 28, background: color, borderRadius: 2 }} />
                  <span style={{ fontSize: 10, fontWeight: 800, color, whiteSpace: 'nowrap' }}>
                    {p.avatar}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22C55E' }} />
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Target</span>
            </div>
            {nonPsychicPlayers.map(p => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 3, height: 10, borderRadius: 2, background: PLAYER_COLORS[p.id % PLAYER_COLORS.length] }} />
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Per-player scores */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {nonPsychicPlayers
            .map(p => ({ p, score: calcScore(target, playerGuesses[p.id]), guess: playerGuesses[p.id] }))
            .sort((a, b) => b.score - a.score)
            .map(({ p, score, guess: g }) => (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 14px', borderRadius: 12,
                background: 'var(--surface)', border: '1px solid var(--border)',
              }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: PLAYER_COLORS[p.id % PLAYER_COLORS.length], flexShrink: 0 }} />
                <span style={{ fontSize: 18 }}>{p.avatar}</span>
                <span style={{ flex: 1, fontWeight: 700, fontSize: 14 }}>{p.name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                  {g < 20 ? `Very ${spectrum.left}` : g < 40 ? spectrum.left : g > 80 ? `Very ${spectrum.right}` : g > 60 ? spectrum.right : 'Middle'}
                </span>
                <span style={{ fontSize: 16, fontWeight: 900, color: SCORE_COLORS[score], minWidth: 32, textAlign: 'right' }}>
                  {score}pt
                </span>
              </div>
            ))}
        </div>

        <button className="btn btn-wl" onClick={onNext} style={{ marginTop: 'auto' }}>
          {isLast ? 'See Final Scores →' : 'Next Round →'}
        </button>
      </div>
    </div>
  )
}

function WLScores({ players, playerTotalScores, roundHistory, onRestart, onExit }) {
  const sorted = [...players]
    .filter(p => playerTotalScores[p.id] !== undefined)
    .sort((a, b) => (playerTotalScores[b.id] || 0) - (playerTotalScores[a.id] || 0))
  const maxPossible = roundHistory.length * 4

  return (
    <div className="screen slide-up" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ fontSize: 56, marginBottom: 8 }}>🔮</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 4 }}>Final Scores</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Who's on the same wavelength?</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sorted.map((p, rank) => {
            const score = playerTotalScores[p.id] || 0
            const pct = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0
            const color = PLAYER_COLORS[p.id % PLAYER_COLORS.length]
            return (
              <div key={p.id} style={{
                padding: '14px 16px', borderRadius: 14,
                background: rank === 0 ? `${color}12` : 'var(--surface)',
                border: `1px solid ${rank === 0 ? color + '30' : 'var(--border)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <span style={{ fontSize: 16, width: 24, textAlign: 'center', fontWeight: 800, color: rank === 0 ? color : 'var(--text-muted)' }}>
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `#${rank + 1}`}
                  </span>
                  <span style={{ fontSize: 20 }}>{p.avatar}</span>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{p.name}</span>
                  <span style={{ fontWeight: 900, fontSize: 20, color: rank === 0 ? color : 'var(--text)' }}>
                    {score}
                  </span>
                </div>
                <div style={{ height: 4, borderRadius: 2, background: 'var(--border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 2 }} />
                </div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-wl" onClick={onRestart}>Play Again</button>
          <button className="btn btn-ghost" onClick={onExit}>Home</button>
        </div>
      </div>
    </div>
  )
}
