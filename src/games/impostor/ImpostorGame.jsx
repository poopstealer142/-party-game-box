import { useState, useEffect, useRef } from 'react'
import { PLAYER_PRESETS, CUSTOM_WORD_PACKS } from '../../data/presets'

const AVATARS = ['🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦋','🦄','🐙','🦀','🐠','🐢','🦜','🦩','🐝','🐞','🦕','🦑','🐬','🦔']

const DEFAULT_PACKS = [
  {
    id: 'places',
    name: 'Places',
    emoji: '🗺',
    words: ['Beach','Airport','Hospital','Library','Casino','Zoo','Museum','Restaurant','School','Office','Space Station','Submarine','Pirate Ship','Jungle','Antarctica'],
  },
  {
    id: 'jobs',
    name: 'Jobs',
    emoji: '💼',
    words: ['Chef','Astronaut','Detective','Surgeon','Firefighter','Spy','Teacher','Pilot','Archaeologist','Clown','Lawyer','Mechanic','Photographer','Sailor','Barista'],
  },
  {
    id: 'activities',
    name: 'Activities',
    emoji: '⚽',
    words: ['Skydiving','Cooking','Yoga','Rock Climbing','Painting','Karaoke','Surfing','Chess','Bungee Jumping','Meditation','Pottery','Archery','Scuba Diving','Baking','Disco Dancing'],
  },
  {
    id: 'movies',
    name: 'Movies & TV',
    emoji: '🎬',
    words: ['Horror Movie','Reality Show','Documentary','Soap Opera','Action Movie','Animated Film','Game Show','True Crime','Fantasy Series','Romantic Comedy','News Channel','Sports Broadcast','Cooking Show','Nature Documentary','Crime Thriller'],
  },
  {
    id: 'food',
    name: 'Food',
    emoji: '🍕',
    words: ['Pizza','Sushi','Tacos','Ice Cream','Ramen','Burger','Croissant','Dim Sum','BBQ','Salad','Pasta','Fried Chicken','Cheesecake','Hot Pot','Paella'],
  },
  {
    id: 'demon_slayer',
    name: 'Demon Slayer',
    emoji: '⚔️',
    words: ['Tanjiro','Zenitsu','Inosuke','Rengoku','Giyu','Shinobu','Kanae','Kanao','Sanemi','Gyomei','Obanai','Mitsuri','Muichiro','Urokodaki','Tengen Uzui','Genya','Muzan','Kokushibo','Douma','Akaza','Hantengo','Gyokko','Gyutaro','Daki','Nezuko','Kaigaku','Nakime','Yoriichi','Aoi','Sabito','Kyogai','Ubuyashiki','Tamayo','Yushiro','Haganezuka','Enmu','Rui','Hinatsuru','Makio','Suma'],
  },
]

// ── Typography ──
const TAC = "'Chakra Petch', sans-serif"
const MONO = "'Share Tech Mono', monospace"

// ── Shared Components ──
function HudCorners() {
  return (
    <>
      <div className="hud-corner hud-corner--tl" />
      <div className="hud-corner hud-corner--tr" />
      <div className="hud-corner hud-corner--bl" />
      <div className="hud-corner hud-corner--br" />
    </>
  )
}

function ImpHeader({ onBack, title, subtitle, right }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '14px 20px',
      borderBottom: '1px solid rgba(239,68,68,0.12)',
      background: 'rgba(12,12,26,0.95)',
      backdropFilter: 'blur(8px)',
      WebkitBackdropFilter: 'blur(8px)',
      position: 'sticky', top: 0, zIndex: 10,
      flexShrink: 0,
    }}>
      {onBack && (
        <button className="back-btn" onClick={onBack}
          style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}>
          ←
        </button>
      )}
      <div>
        <div style={{ fontFamily: TAC, fontSize: 15, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(239,68,68,0.6)', marginTop: 2 }}>
            {subtitle}
          </div>
        )}
      </div>
      {right && <div style={{ marginLeft: 'auto' }}>{right}</div>}
    </div>
  )
}

function TacLabel({ children, style }) {
  return (
    <div style={{
      fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'rgba(239,68,68,0.7)',
      ...style,
    }}>
      {children}
    </div>
  )
}

function StepBar({ step, total }) {
  return (
    <div style={{ display: 'flex', gap: 4 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          flex: 1, height: 2,
          background: i < step ? 'var(--imp-primary)' : 'rgba(255,255,255,0.06)',
          transition: 'background 0.3s',
        }} />
      ))}
    </div>
  )
}


// ═══════════════════════════════════════════
//  MAIN GAME COMPONENT
// ═══════════════════════════════════════════
export default function ImpostorGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [impostorIds, setImpostorIds] = useState([])
  const [twoMode, setTwoMode] = useState(false)
  const [word, setWord] = useState('')
  const [category, setCategory] = useState('')
  const [revealIndex, setRevealIndex] = useState(0)
  const [customPacks, setCustomPacks] = useState([...CUSTOM_WORD_PACKS])
  const [result, setResult] = useState(null)
  const [lastPlayerNames, setLastPlayerNames] = useState([])
  const [lastPackId, setLastPackId] = useState(null)
  const [lastCustomWord, setLastCustomWord] = useState(null)
  const [guessingImpostorId, setGuessingImpostorId] = useState(null)

  const allPacks = [...DEFAULT_PACKS, ...customPacks]

  function secureRandomIndex(length) {
    const arr = new Uint32Array(1)
    crypto.getRandomValues(arr)
    return arr[0] % length
  }

  function pickRandom(arr, exclude) {
    let pool = exclude != null ? arr.filter(x => x !== exclude) : arr
    if (pool.length === 0) pool = arr
    return pool[secureRandomIndex(pool.length)]
  }

  function pickTwoRandom(ids, excludeIds = []) {
    let pool = ids.filter(x => !excludeIds.includes(x))
    if (pool.length < 2) pool = [...ids]
    const i1 = secureRandomIndex(pool.length)
    const first = pool[i1]
    const pool2 = pool.filter(x => x !== first)
    const second = pool2[secureRandomIndex(pool2.length)]
    return [first, second]
  }

  function startGame(playerNames, packId, customWord, useTwoImpostors) {
    setLastPlayerNames(playerNames)
    setLastPackId(packId)
    setLastCustomWord(customWord)
    setTwoMode(useTwoImpostors)

    const ps = playerNames.map((name, i) => ({
      id: i, name, avatar: AVATARS[i % AVATARS.length],
    }))
    const ids = ps.map(p => p.id)

    const newIds = useTwoImpostors
      ? pickTwoRandom(ids, impostorIds)
      : [pickRandom(ids, impostorIds[0] ?? null)]

    setImpostorIds(newIds)
    setPlayers(ps)
    setResult(null)
    setRevealIndex(0)
    setGuessingImpostorId(null)

    if (customWord) {
      setWord(customWord)
      setCategory('Custom')
    } else {
      const pack = allPacks.find(p => p.id === packId)
      const w = pickRandom(pack.words, word)
      setWord(w)
      setCategory(pack.name)
    }
    setPhase('reveal')
  }

  function rematch() {
    startGame(lastPlayerNames, lastPackId, lastCustomWord, twoMode)
  }

  function nextReveal() {
    if (revealIndex + 1 >= players.length) {
      setPhase('discussion')
    } else {
      setRevealIndex(i => i + 1)
    }
  }

  function eliminatePlayer(playerId) {
    const caughtImpostor = impostorIds.includes(playerId)
    if (caughtImpostor) {
      // Surviving impostor (if two-mode) gets to guess the word
      const survivor = impostorIds.find(id => id !== playerId) ?? playerId
      setGuessingImpostorId(survivor)
      setResult({ impostorCaught: true, impostorGuessedWord: false })
      setPhase('impostorGuess')
    } else {
      setResult({ impostorCaught: false, impostorGuessedWord: false })
      setPhase('gameOver')
    }
  }

  function handleImpostorGuess(guessedCorrectly) {
    setResult(r => ({ ...r, impostorGuessedWord: guessedCorrectly }))
    setPhase('gameOver')
  }

  const currentPlayer = players[revealIndex]
  const currentIsImpostor = impostorIds.includes(currentPlayer?.id)
  const partnerName = twoMode && currentIsImpostor
    ? players.find(p => impostorIds.includes(p.id) && p.id !== currentPlayer?.id)?.name
    : null

  if (phase === 'setup')
    return (
      <SetupScreen
        onExit={onExit}
        onStart={startGame}
        packs={allPacks}
        setCustomPacks={setCustomPacks}
      />
    )

  if (phase === 'reveal')
    return (
      <RevealScreen
        key={revealIndex}
        player={currentPlayer}
        isImpostor={currentIsImpostor}
        partnerName={partnerName}
        word={word}
        category={category}
        currentIndex={revealIndex}
        totalPlayers={players.length}
        onNext={nextReveal}
      />
    )

  if (phase === 'discussion')
    return <DiscussionScreen players={players} onVote={() => setPhase('voting')} />

  if (phase === 'voting')
    return <EliminationScreen players={players} onEliminate={eliminatePlayer} />

  if (phase === 'impostorGuess') {
    const imp = players.find(p => p.id === guessingImpostorId)
    return (
      <ImpostorGuessScreen
        impostor={imp}
        word={word}
        category={category}
        onGuess={handleImpostorGuess}
      />
    )
  }

  if (phase === 'gameOver') {
    const impostors = players.filter(p => impostorIds.includes(p.id))
    return (
      <GameOverScreen
        impostors={impostors}
        result={result}
        word={word}
        category={category}
        onRematch={rematch}
        onRestart={() => setPhase('setup')}
        onExit={onExit}
      />
    )
  }

  return null
}


// ═══════════════════════════════════════════
//  SETUP SCREEN
// ═══════════════════════════════════════════
function SetupScreen({ onExit, onStart, packs, setCustomPacks }) {
  const [names, setNames] = useState(['', ''])
  const [step, setStep] = useState('players')
  const [selectedPack, setSelectedPack] = useState('places')
  const [customWord, setCustomWord] = useState('')
  const [useCustom, setUseCustom] = useState(false)
  const [twoImpostors, setTwoImpostors] = useState(false)
  const [newPackName, setNewPackName] = useState('')
  const [newPackWords, setNewPackWords] = useState('')
  const [editingCustom, setEditingCustom] = useState(false)

  const validNames = names.filter(n => n.trim())
  const minPlayers = twoImpostors ? 5 : 3
  const canProceed = validNames.length >= minPlayers

  function addPlayer() { setNames(n => [...n, '']) }
  function removePlayer(i) { if (names.length > 2) setNames(n => n.filter((_, idx) => idx !== i)) }
  function updateName(i, val) { setNames(n => n.map((name, idx) => idx === i ? val : name)) }
  function loadPreset(preset) { setNames([...preset.players]) }

  function handleStart() {
    if (useCustom && customWord.trim()) {
      onStart(validNames, null, customWord.trim(), twoImpostors)
    } else {
      onStart(validNames, selectedPack, null, twoImpostors)
    }
  }

  function saveCustomPack() {
    if (!newPackName.trim() || !newPackWords.trim()) return
    const words = newPackWords.split(',').map(w => w.trim()).filter(Boolean)
    if (words.length < 3) return
    const pack = {
      id: `custom_${Date.now()}`,
      name: newPackName.trim(),
      emoji: '✏️',
      words,
    }
    setCustomPacks(p => [...p, pack])
    setNewPackName('')
    setNewPackWords('')
    setEditingCustom(false)
    setSelectedPack(pack.id)
    setUseCustom(false)
  }

  if (step === 'players') {
    return (
      <div className="imp-screen">
        <ImpHeader onBack={onExit} title="Impostor" subtitle="operation setup" />
        <div className="section">
          <StepBar step={1} total={2} />
          <TacLabel>step 01 — personnel</TacLabel>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: TAC }}>
            Register agents for this operation. Minimum 3 required.
          </p>

          {PLAYER_PRESETS.length > 0 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {PLAYER_PRESETS.map(preset => (
                <button key={preset.id} className="btn-ghost-tac btn-sm"
                  style={{ padding: '6px 12px', width: 'auto' }}
                  onClick={() => loadPreset(preset)}>
                  {preset.emoji} {preset.name} ({preset.players.length})
                </button>
              ))}
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {names.map((name, i) => (
              <div key={i} className="imp-player-row">
                <span style={{ fontFamily: MONO, fontSize: 10, color: '#8888a5', width: 20, flexShrink: 0, textAlign: 'center' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: 14, flexShrink: 0 }}>{AVATARS[i % AVATARS.length]}</span>
                <input className="input" placeholder={`AGENT ${i + 1}`} value={name}
                  onChange={e => updateName(i, e.target.value)} maxLength={20} />
                {names.length > 2 && (
                  <button className="remove-btn" onClick={() => removePlayer(i)}
                    style={{ border: 'none', fontSize: 12 }}>×</button>
                )}
              </div>
            ))}
          </div>

          <button className="btn-ghost-tac" onClick={addPlayer}
            style={{ borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.08)' }}>
            + add agent
          </button>

          {/* Mode toggle */}
          <div style={{ display: 'flex', gap: 4, padding: '2px', background: 'rgba(255,255,255,0.04)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.06)' }}>
            <button
              onClick={() => setTwoImpostors(false)}
              style={{
                flex: 1, padding: '8px 10px', border: 'none', borderRadius: 3, cursor: 'pointer',
                fontFamily: TAC, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                background: !twoImpostors ? 'rgba(239,68,68,0.18)' : 'transparent',
                color: !twoImpostors ? 'var(--imp-primary)' : '#8888a5',
                transition: 'all 0.15s',
              }}
            >1 Impostor</button>
            <button
              onClick={() => setTwoImpostors(true)}
              style={{
                flex: 1, padding: '8px 10px', border: 'none', borderRadius: 3, cursor: 'pointer',
                fontFamily: TAC, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
                background: twoImpostors ? 'rgba(239,68,68,0.18)' : 'transparent',
                color: twoImpostors ? 'var(--imp-primary)' : '#8888a5',
                transition: 'all 0.15s',
              }}
            >2 Impostors</button>
          </div>

          {!canProceed && (
            <div style={{ textAlign: 'center', fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: '#8888a5' }}>
              {validNames.length}/{minPlayers} AGENTS MINIMUM
            </div>
          )}

          <div style={{ marginTop: 'auto' }}>
            <button className="btn-imp-tac" onClick={() => setStep('packs')} disabled={!canProceed}>
              select intel →
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Pack Selection Step ──
  return (
    <div className="imp-screen">
      <ImpHeader onBack={() => setStep('players')} title="Select Intel" subtitle="step 02 — word selection" />
      <div className="section">
        <StepBar step={2} total={2} />

        {/* Mode toggle */}
        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => setUseCustom(false)} style={{
            flex: 1, padding: 10, background: 'none', border: 'none',
            fontFamily: TAC, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: !useCustom ? 'var(--imp-primary)' : '#8888a5', cursor: 'pointer',
            borderBottom: !useCustom ? '2px solid var(--imp-primary)' : '2px solid transparent',
            transition: 'all 0.15s',
          }}>word packs</button>
          <button onClick={() => setUseCustom(true)} style={{
            flex: 1, padding: 10, background: 'none', border: 'none',
            fontFamily: TAC, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: useCustom ? 'var(--imp-primary)' : '#8888a5', cursor: 'pointer',
            borderBottom: useCustom ? '2px solid var(--imp-primary)' : '2px solid transparent',
            transition: 'all 0.15s',
          }}>custom word</button>
        </div>

        {!useCustom ? (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {packs.map(pack => {
                const active = selectedPack === pack.id
                return (
                  <button key={pack.id}
                    className={`imp-pack-btn ${active ? 'active' : ''}`}
                    onClick={() => setSelectedPack(pack.id)}>
                    <span style={{ fontSize: 20, flexShrink: 0 }}>{pack.emoji}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: TAC, fontWeight: 600, fontSize: 14, letterSpacing: '0.02em' }}>{pack.name}</div>
                      <div style={{ fontFamily: MONO, fontSize: 10, color: '#8888a5', letterSpacing: '0.05em', marginTop: 2 }}>
                        {pack.words.length} WORDS
                      </div>
                    </div>
                    {active && (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: 'var(--imp-primary)',
                        boxShadow: '0 0 10px rgba(239,68,68,0.6)',
                        flexShrink: 0,
                      }} />
                    )}
                  </button>
                )
              })}
            </div>

            {editingCustom ? (
              <div className="hud-frame" style={{ padding: 20 }}>
                <HudCorners />
                <TacLabel style={{ marginBottom: 14 }}>new word pack</TacLabel>
                <input className="input" placeholder="Pack name" value={newPackName}
                  onChange={e => setNewPackName(e.target.value)}
                  style={{ marginBottom: 10, background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)' }} />
                <textarea className="input" placeholder="Words separated by commas (min 3)"
                  value={newPackWords} onChange={e => setNewPackWords(e.target.value)}
                  style={{ minHeight: 70, resize: 'vertical', fontFamily: 'inherit', background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)' }} />
                <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
                  <button className="btn-ghost-tac" style={{ padding: '8px 14px', width: 'auto', fontSize: 11 }}
                    onClick={() => setEditingCustom(false)}>cancel</button>
                  <button className="btn-imp-tac" style={{ padding: '8px 14px', width: 'auto', fontSize: 11 }}
                    onClick={saveCustomPack}
                    disabled={!newPackName.trim() || newPackWords.split(',').filter(w => w.trim()).length < 3}>
                    save
                  </button>
                </div>
              </div>
            ) : (
              <button className="btn-ghost-tac" onClick={() => setEditingCustom(true)}
                style={{ borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.08)' }}>
                + create word pack
              </button>
            )}
          </>
        ) : (
          <div className="hud-frame" style={{ padding: 24 }}>
            <HudCorners />
            <TacLabel style={{ marginBottom: 12 }}>custom intel</TacLabel>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, fontFamily: TAC, marginBottom: 14 }}>
              Enter a secret word. One agent won't see it.
            </p>
            <input className="input" placeholder="e.g. Underwater Volcano" value={customWord}
              onChange={e => setCustomWord(e.target.value)} maxLength={40}
              style={{ background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.08)', fontFamily: TAC }} />
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          <button className="btn-imp-tac" onClick={handleStart}
            disabled={useCustom ? !customWord.trim() : !selectedPack}>
            deploy agents →
          </button>
        </div>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════
//  REVEAL SCREEN
// ═══════════════════════════════════════════
function RevealScreen({ player, isImpostor, partnerName, word, category, currentIndex, totalPlayers, onNext }) {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="imp-cover" onClick={!revealed ? () => setRevealed(true) : undefined}>
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '25%', left: '50%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(239,68,68,0.1) 0%, transparent 70%)',
        transform: 'translate(-50%, -50%)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Progress dots */}
      <div style={{ display: 'flex', gap: 6 }}>
        {Array.from({ length: totalPlayers }).map((_, i) => (
          <div key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: i < currentIndex ? 'var(--imp-primary)' : i === currentIndex ? '#FCA5A5' : 'rgba(255,255,255,0.1)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Flip Card */}
      <div className="flip-container">
        <div className={`flip-inner ${revealed ? 'flipped' : ''}`}>
          {/* ── FRONT (face down) ── */}
          <div className="flip-front hud-frame" style={{
            padding: '48px 28px', textAlign: 'center',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 320,
          }}>
            <HudCorners />
            <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em', color: 'rgba(239,68,68,0.65)', marginBottom: 24 }}>
              CLASSIFIED DOSSIER
            </div>
            <div style={{ fontSize: 40, marginBottom: 16, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.4))' }}>
              {player?.avatar}
            </div>
            <div style={{ fontFamily: TAC, fontSize: 22, fontWeight: 700, letterSpacing: '0.02em', marginBottom: 32 }}>
              {player?.name}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.12em', color: '#8888a5', animation: 'imp-flicker 3s infinite' }}>
              TAP TO DECLASSIFY
            </div>
          </div>

          {/* ── BACK (face up) ── */}
          <div className="flip-back hud-frame" style={{
            padding: '36px 24px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            textAlign: 'center',
            background: isImpostor ? 'rgba(30,14,14,0.95)' : 'rgba(16,16,30,0.95)',
            borderColor: isImpostor ? 'rgba(239,68,68,0.25)' : 'rgba(255,255,255,0.1)',
          }}>
            <HudCorners />
            {isImpostor ? (
              <>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em', color: 'rgba(239,68,68,0.7)', marginBottom: 20 }}>
                  ROLE ASSIGNMENT
                </div>
                <div className="glitch-text" data-text="IMPOSTOR" style={{
                  fontFamily: TAC, fontSize: 36, fontWeight: 700,
                  color: 'var(--imp-primary)', letterSpacing: '0.06em',
                }}>
                  IMPOSTOR
                </div>
                <div style={{
                  marginTop: 20, padding: '6px 16px',
                  border: '2px solid var(--imp-primary)', borderRadius: 2,
                  fontFamily: TAC, fontSize: 11, fontWeight: 600,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  color: 'var(--imp-primary)', transform: 'rotate(-6deg)',
                  animation: 'imp-stamp-slam 0.4s cubic-bezier(0.2, 0, 0, 1.3) 0.4s both',
                }}>
                  CLASSIFIED
                </div>
                <div style={{ color: '#b0b0c8', fontSize: 12, fontFamily: TAC, marginTop: 20, lineHeight: 1.8 }}>
                  You don't know the word.<br />Blend in. Don't get caught.
                </div>
                {partnerName && (
                  <div style={{
                    marginTop: 16, padding: '8px 16px',
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)',
                    fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', color: 'var(--imp-primary)',
                  }}>
                    PARTNER: {partnerName.toUpperCase()}
                  </div>
                )}
              </>
            ) : (
              <>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em', color: 'rgba(239,68,68,0.7)', marginBottom: 8 }}>
                  INTEL BRIEFING
                </div>
                <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: '#8888a5', marginBottom: 16 }}>
                  {category.toUpperCase()}
                </div>
                <div style={{
                  fontFamily: TAC, fontSize: 34, fontWeight: 700, letterSpacing: '-0.02em',
                  color: 'var(--text)', animation: 'imp-text-reveal 0.6s ease-out 0.4s both',
                }}>
                  {word}
                </div>
                <div style={{
                  marginTop: 24, padding: '8px 14px',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)',
                  fontSize: 11, color: '#b0b0c8', fontFamily: MONO, letterSpacing: '0.05em',
                }}>
                  One agent doesn't know this word
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Bottom */}
      {revealed ? (
        <button className="btn-imp-tac" style={{ maxWidth: 320, width: '100%' }}
          onClick={(e) => { e.stopPropagation(); onNext() }}>
          {currentIndex + 1 < totalPlayers ? 'secure & pass →' : 'begin operation →'}
        </button>
      ) : (
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.15em', color: '#8888a5' }}>
          AGENT {currentIndex + 1} OF {totalPlayers}
        </div>
      )}
    </div>
  )
}


// ═══════════════════════════════════════════
//  DISCUSSION SCREEN
// ═══════════════════════════════════════════
function DiscussionScreen({ players, onVote }) {
  const [seconds, setSeconds] = useState(0)
  const [initialSeconds, setInitialSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  function startTimer(s) {
    setSeconds(s)
    setInitialSeconds(s)
    setRunning(true)
  }

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setTimeout(() => setSeconds(s => s - 1), 1000)
    } else if (seconds === 0 && running) {
      setRunning(false)
    }
    return () => clearTimeout(intervalRef.current)
  }, [running, seconds])

  const progress = initialSeconds > 0 ? seconds / initialSeconds : 1
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const isUrgent = seconds > 0 && seconds <= 30
  const isFinished = initialSeconds > 0 && seconds === 0
  const circumference = 2 * Math.PI * 72

  const timerOptions = [
    { label: '1 MIN', s: 60 },
    { label: '2 MIN', s: 120 },
    { label: '3 MIN', s: 180 },
    { label: '5 MIN', s: 300 },
  ]

  return (
    <div className="imp-screen">
      <ImpHeader
        title="Discussion"
        subtitle="interrogation phase"
        right={
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: '#8888a5' }}>
            {players.length} AGENTS
          </span>
        }
      />
      <div className="section" style={{ alignItems: 'center', justifyContent: 'center' }}>

        {initialSeconds === 0 ? (
          <>
            <TacLabel>set discussion timer</TacLabel>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginTop: 4 }}>
              {timerOptions.map(opt => (
                <button key={opt.s} className="btn-ghost-tac"
                  style={{ padding: '8px 16px', width: 'auto', fontSize: 11 }}
                  onClick={() => startTimer(opt.s)}>
                  {opt.label}
                </button>
              ))}
            </div>
            <button className="btn-ghost-tac"
              style={{ padding: '8px 16px', width: 'auto', fontSize: 11, marginTop: 4, borderColor: 'rgba(255,255,255,0.06)' }}
              onClick={onVote}>
              skip timer →
            </button>
          </>
        ) : (
          <>
            {/* Radar Timer */}
            <div style={{ position: 'relative', width: 180, height: 180 }}>
              <svg width="180" height="180" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                <circle cx="90" cy="90" r="72" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1.5" />
                <circle cx="90" cy="90" r="48" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
                <circle cx="90" cy="90" r="24" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="0.5" />
                <circle cx="90" cy="90" r="72" fill="none"
                  stroke={isUrgent ? 'var(--imp-primary)' : 'rgba(239,68,68,0.5)'}
                  strokeWidth="2"
                  strokeLinecap="butt"
                  strokeDasharray={circumference}
                  strokeDashoffset={circumference * (1 - progress)}
                  style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.5s' }}
                />
              </svg>
              {running && (
                <div style={{
                  position: 'absolute', inset: 8, borderRadius: '50%',
                  background: `conic-gradient(from 0deg, transparent 0deg, rgba(239,68,68,${isUrgent ? 0.15 : 0.06}) 20deg, transparent 40deg)`,
                  animation: 'imp-radar-spin 3s linear infinite',
                }} />
              )}
              {isUrgent && (
                <div style={{
                  position: 'absolute', inset: 8, borderRadius: '50%',
                  border: '1px solid var(--imp-primary)',
                  animation: 'imp-pulse-ring 2s ease-out infinite',
                }} />
              )}
              <div style={{
                position: 'absolute', inset: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              }}>
                <div style={{
                  fontFamily: MONO, fontSize: 40,
                  letterSpacing: '0.05em',
                  color: isUrgent ? 'var(--imp-primary)' : 'var(--text)',
                  animation: isUrgent ? 'imp-flicker 2s infinite' : 'none',
                }}>
                  {mins}:{secs.toString().padStart(2, '0')}
                </div>
                <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.2em', color: '#8888a5', marginTop: 4 }}>
                  {running ? 'REMAINING' : 'ELAPSED'}
                </div>
              </div>
            </div>

            {isFinished && (
              <div style={{
                fontFamily: TAC, fontSize: 14, fontWeight: 700,
                letterSpacing: '0.1em', color: 'var(--imp-primary)',
                animation: 'imp-flicker 1.5s infinite',
              }}>
                TIME EXPIRED
              </div>
            )}
          </>
        )}

        {/* Player roster */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'center', marginTop: 12 }}>
          {players.map(p => (
            <div key={p.id} style={{
              padding: '5px 10px', background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.06)',
              fontSize: 12, display: 'flex', alignItems: 'center', gap: 6,
            }}>
              {p.avatar} <span style={{ fontFamily: TAC, fontWeight: 500, fontSize: 12 }}>{p.name}</span>
            </div>
          ))}
        </div>

        {/* Mission brief */}
        <div className="hud-frame" style={{ padding: 16, width: '100%', maxWidth: 380 }}>
          <HudCorners />
          <TacLabel style={{ marginBottom: 10 }}>mission brief</TacLabel>
          <ul style={{ color: '#b0b0c8', fontSize: 12, lineHeight: 2.2, paddingLeft: 16, fontFamily: TAC }}>
            <li>Question each other about the secret word</li>
            <li>The impostor will try to blend in</li>
            <li>Vote amongst yourselves, then select who to eliminate</li>
          </ul>
        </div>

        <div style={{ marginTop: 'auto', width: '100%' }}>
          <button className="btn-imp-tac" onClick={onVote}>
            initiate vote →
          </button>
        </div>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════
//  ELIMINATION SCREEN (replaces VotingScreen)
// ═══════════════════════════════════════════
function EliminationScreen({ players, onEliminate }) {
  const [selectedId, setSelectedId] = useState(null)

  return (
    <div className="imp-screen">
      <ImpHeader title="Elimination" subtitle="cast your verdict" />
      <div className="section">
        <TacLabel>who was voted out?</TacLabel>
        <p style={{ color: '#b0b0c8', fontSize: 13, fontFamily: TAC }}>
          Discuss and vote amongst yourselves, then select who the group chose to eliminate.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {players.map(p => {
            const isSelected = selectedId === p.id
            return (
              <button key={p.id}
                className={`imp-voter-chip ${isSelected ? 'active' : ''}`}
                onClick={() => setSelectedId(p.id)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 18 }}>{p.avatar}</span>
                  <span style={{ fontFamily: TAC, fontWeight: 600, fontSize: 14, letterSpacing: '0.02em' }}>
                    {p.name}
                  </span>
                </div>
                {isSelected && (
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: 'var(--imp-primary)',
                    boxShadow: '0 0 10px rgba(239,68,68,0.6)',
                    flexShrink: 0,
                  }} />
                )}
              </button>
            )
          })}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button className="btn-imp-tac" onClick={() => onEliminate(selectedId)} disabled={selectedId === null}>
            confirm elimination →
          </button>
        </div>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════
//  IMPOSTOR GUESS SCREEN
// ═══════════════════════════════════════════
function ImpostorGuessScreen({ impostor, word, category, onGuess }) {
  const [guess, setGuess] = useState('')

  function checkGuess() {
    const correct = guess.trim().toLowerCase() === word.toLowerCase()
    onGuess(correct)
  }

  return (
    <div className="imp-screen" style={{ justifyContent: 'center', alignItems: 'center', padding: 24, gap: 24 }}>
      {/* Ambient red pulse */}
      <div style={{
        position: 'fixed', inset: 0,
        background: 'radial-gradient(circle at 50% 40%, rgba(239,68,68,0.08) 0%, transparent 60%)',
        pointerEvents: 'none', zIndex: 0,
        animation: 'imp-breathe 3s ease-in-out infinite',
      }} />

      <div style={{ textAlign: 'center', zIndex: 1 }}>
        <TacLabel style={{ marginBottom: 16 }}>agent intercepted</TacLabel>
        <div style={{
          fontFamily: TAC, fontSize: 28, fontWeight: 700, letterSpacing: '0.04em',
          color: 'var(--imp-primary)', textTransform: 'uppercase', marginBottom: 8,
          animation: 'imp-entry-up 0.5s ease-out',
        }}>
          You've been caught
        </div>
        <div style={{ fontFamily: TAC, fontSize: 18, fontWeight: 600, marginBottom: 8 }}>
          {impostor?.avatar} {impostor?.name}
        </div>
        <div style={{ color: '#b0b0c8', fontSize: 13, fontFamily: TAC }}>
          Guess the word correctly to win
        </div>
      </div>

      <div className="hud-frame" style={{ padding: 24, width: '100%', maxWidth: 360, zIndex: 1 }}>
        <HudCorners />
        <TacLabel style={{ marginBottom: 12 }}>last transmission</TacLabel>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: '0.1em', color: '#8888a5', marginBottom: 12 }}>
          CATEGORY: {category.toUpperCase()}
        </div>
        <input
          className="input"
          placeholder="TYPE YOUR GUESS..."
          value={guess}
          onChange={e => setGuess(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && guess.trim() && checkGuess()}
          maxLength={50}
          autoFocus
          style={{
            background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(239,68,68,0.2)',
            fontFamily: MONO, fontSize: 14, letterSpacing: '0.03em',
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 10, width: '100%', maxWidth: 360, zIndex: 1 }}>
        <button className="btn-ghost-tac" onClick={() => onGuess(false)} style={{ flex: 1 }}>
          abort
        </button>
        <button className="btn-imp-tac" disabled={!guess.trim()} onClick={checkGuess} style={{ flex: 2 }}>
          transmit →
        </button>
      </div>
    </div>
  )
}


// ═══════════════════════════════════════════
//  GAME OVER SCREEN
// ═══════════════════════════════════════════
function GameOverScreen({ impostors, result, word, category, onRematch, onRestart, onExit }) {
  const { impostorCaught, impostorGuessedWord } = result || {}
  const impostorWins = !impostorCaught || impostorGuessedWord
  const twoMode = impostors?.length > 1

  return (
    <div className="imp-screen" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 24, minHeight: '100%', justifyContent: 'center' }}>
        {/* Mission status */}
        <div style={{ textAlign: 'center', animation: 'imp-entry-up 0.5s ease-out' }}>
          <TacLabel style={{
            marginBottom: 16,
            color: impostorWins ? 'rgba(239,68,68,0.7)' : 'rgba(16,185,129,0.7)',
          }}>
            operation result
          </TacLabel>
          <div style={{
            fontFamily: TAC, fontSize: 34, fontWeight: 700, letterSpacing: '0.04em',
            textTransform: 'uppercase',
            color: impostorWins ? 'var(--imp-primary)' : 'var(--green)',
            animation: 'imp-text-reveal 0.8s ease-out',
          }}>
            {impostorWins ? 'COMPROMISED' : 'MISSION COMPLETE'}
          </div>
          <div style={{ color: '#b0b0c8', fontSize: 14, fontFamily: TAC, marginTop: 10 }}>
            {!impostorCaught && `The ${twoMode ? 'impostors' : 'impostor'} escaped undetected`}
            {impostorCaught && impostorGuessedWord && 'Caught — but guessed the word correctly'}
            {impostorCaught && !impostorGuessedWord && `The ${twoMode ? 'impostors were' : 'impostor was'} identified and eliminated`}
          </div>
        </div>

        {/* Impostor(s) + Word Reveal */}
        <div className="hud-frame" style={{
          padding: 32, textAlign: 'center',
          borderColor: impostorWins ? 'rgba(239,68,68,0.2)' : 'rgba(16,185,129,0.2)',
          animation: 'imp-entry-up 0.5s ease-out 0.2s both',
        }}>
          <HudCorners />
          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.15em', color: '#8888a5', marginBottom: 12 }}>
            {twoMode ? 'THE IMPOSTORS WERE' : 'THE IMPOSTOR WAS'}
          </div>
          {twoMode ? (
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 24 }}>
              {impostors.map(imp => (
                <div key={imp.id}>
                  <div style={{ fontSize: 36, marginBottom: 6 }}>{imp.avatar}</div>
                  <div style={{ fontFamily: TAC, fontSize: 18, fontWeight: 700, letterSpacing: '0.02em' }}>{imp.name}</div>
                </div>
              ))}
            </div>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 8 }}>{impostors?.[0]?.avatar}</div>
              <div style={{ fontFamily: TAC, fontSize: 24, fontWeight: 700, letterSpacing: '0.02em', marginBottom: 24 }}>
                {impostors?.[0]?.name}
              </div>
            </>
          )}

          <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.08)', margin: '0 auto 24px' }} />

          <div style={{ fontFamily: MONO, fontSize: 9, letterSpacing: '0.15em', color: '#8888a5', marginBottom: 10 }}>
            THE SECRET WORD
          </div>
          <div style={{ fontFamily: TAC, fontSize: 30, fontWeight: 700, letterSpacing: '-0.01em' }}>
            {word}
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: '#8888a5', letterSpacing: '0.08em', marginTop: 6 }}>
            {category.toUpperCase()}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, animation: 'imp-entry-up 0.5s ease-out 0.4s both' }}>
          <button className="btn-imp-tac" onClick={onRematch}>redeploy</button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-ghost-tac" onClick={onExit} style={{ flex: 1 }}>extract</button>
            <button className="btn-ghost-tac" onClick={onRestart} style={{ flex: 1 }}>new operation</button>
          </div>
        </div>
      </div>
    </div>
  )
}
