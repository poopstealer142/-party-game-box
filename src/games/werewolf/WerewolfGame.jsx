import { useState, useCallback } from 'react'
import { PLAYER_PRESETS } from '../../data/presets'

const ROLES = {
  werewolf: { name: 'Werewolf', emoji: '🐺', team: 'wolf', desc: 'Kill a villager each night. Stay hidden during the day.' },
  villager: { name: 'Villager', emoji: '👤', team: 'village', desc: 'Find and vote out all werewolves.' },
  seer:     { name: 'Seer',     emoji: '🔮', team: 'village', desc: 'Each night, reveal one player\'s true role.' },
  doctor:   { name: 'Doctor',   emoji: '💊', team: 'village', desc: 'Each night, protect one player from being killed.' },
  hunter:   { name: 'Hunter',   emoji: '🏹', team: 'village', desc: 'When you die, drag one player to the grave with you.' },
}

const AVATARS = ['🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦋','🦄','🐙','🦀','🐠']

function getDefaultRoleCounts(n) {
  if (n <= 5) return  { werewolf: 1, seer: 1, doctor: 0, hunter: 0, villager: 3 }
  if (n <= 6) return  { werewolf: 1, seer: 1, doctor: 1, hunter: 0, villager: 3 }
  if (n <= 8) return  { werewolf: 2, seer: 1, doctor: 1, hunter: 0, villager: n - 4 }
  if (n <= 10) return { werewolf: 2, seer: 1, doctor: 1, hunter: 1, villager: n - 5 }
  return               { werewolf: 3, seer: 1, doctor: 1, hunter: 1, villager: n - 6 }
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function assignRoles(players, roleCounts) {
  const roleList = []
  Object.entries(roleCounts).forEach(([role, count]) => {
    for (let i = 0; i < count; i++) roleList.push(role)
  })
  const shuffled = shuffle(roleList)
  return players.map((p, i) => ({ ...p, role: shuffled[i] }))
}

function checkWin(players) {
  const alive = players.filter(p => !p.dead)
  const wolves = alive.filter(p => p.role === 'werewolf')
  const villagers = alive.filter(p => p.role !== 'werewolf')
  if (wolves.length === 0) return 'village'
  if (wolves.length >= villagers.length) return 'wolf'
  return null
}

// ─────────── Main Component ───────────
export default function WerewolfGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [roleCounts, setRoleCounts] = useState({})
  const [revealIndex, setRevealIndex] = useState(0)
  const [nightState, setNightState] = useState(null)
  const [dayLog, setDayLog] = useState([])
  const [votes, setVotes] = useState({})
  const [selected, setSelected] = useState(null)
  const [subPhase, setSubPhase] = useState('')
  const [winner, setWinner] = useState(null)
  const [hunterKiller, setHunterKiller] = useState(null)
  const [lastPlayerNames, setLastPlayerNames] = useState([])

  function startGame(playerNames, counts) {
    setLastPlayerNames(playerNames)
    const ps = playerNames.map((name, i) => ({
      id: i, name, avatar: AVATARS[i % AVATARS.length], dead: false, role: null,
    }))
    const withRoles = assignRoles(ps, counts)
    setPlayers(withRoles)
    setRoleCounts(counts)
    setRevealIndex(0)
    setPhase('roleReveal')
    setDayLog([])
  }

  function rematch() { startGame(lastPlayerNames, roleCounts) }

  function nextReveal() {
    if (revealIndex + 1 >= players.length) beginNight()
    else setRevealIndex(i => i + 1)
  }

  function beginNight() {
    setNightState({ wolfVote: null, doctorSave: null, seerReveal: null, seerResult: null, wolfDone: false, doctorDone: false, seerDone: false })
    setSubPhase('intro')
    setPhase('night')
  }

  const living = players.filter(p => !p.dead)
  const wolves = living.filter(p => p.role === 'werewolf')
  const hasDoctor = living.some(p => p.role === 'doctor')
  const hasSeer = living.some(p => p.role === 'seer')

  function advanceNightPhase() {
    if (subPhase === 'intro') setSubPhase('wolves')
    else if (subPhase === 'wolves') setSubPhase('wolfAction')
    else if (subPhase === 'wolfAction') {
      if (hasDoctor) setSubPhase('doctor')
      else if (hasSeer) setSubPhase('seer')
      else resolveNight()
    } else if (subPhase === 'doctor') setSubPhase('doctorAction')
    else if (subPhase === 'doctorAction') {
      if (hasSeer) setSubPhase('seer')
      else resolveNight()
    } else if (subPhase === 'seer') setSubPhase('seerAction')
    else if (subPhase === 'seerAction') resolveNight()
  }

  function resolveNight() {
    const { wolfVote, doctorSave } = nightState
    let log = []
    let updatedPlayers = [...players]
    if (wolfVote !== null && wolfVote !== doctorSave) {
      updatedPlayers = updatedPlayers.map(p => p.id === wolfVote ? { ...p, dead: true } : p)
      const victim = players.find(p => p.id === wolfVote)
      log.push({ type: 'kill', text: `${victim.name} was found dead at dawn.`, victim: victim.name, role: victim.role })
      if (victim.role === 'hunter') {
        setPlayers(updatedPlayers); setHunterKiller(victim.id); setSubPhase(''); setPhase('hunterRevenge'); setDayLog(log); return
      }
    } else if (wolfVote !== null && wolfVote === doctorSave) {
      log.push({ type: 'saved', text: 'The doctor saved someone last night. No one died.' })
    } else {
      log.push({ type: 'saved', text: 'It was a quiet night. No one died.' })
    }
    const win = checkWin(updatedPlayers)
    setPlayers(updatedPlayers); setDayLog(log); setVotes({}); setSelected(null); setSubPhase('')
    if (win) { setWinner(win); setPhase('gameOver') } else setPhase('day')
  }

  function resolveHunterRevenge(targetId) {
    const updatedPlayers = players.map(p => p.id === targetId ? { ...p, dead: true } : p)
    const target = players.find(p => p.id === targetId)
    const newLog = [...dayLog, { type: 'hunter', text: `The Hunter took ${target.name} with them!` }]
    setDayLog(newLog); setPlayers(updatedPlayers); setHunterKiller(null)
    const win = checkWin(updatedPlayers)
    if (win) { setWinner(win); setPhase('gameOver') } else { setVotes({}); setSelected(null); setPhase('day') }
  }

  function castVote(voterId, targetId) { setVotes(v => ({ ...v, [voterId]: targetId })) }

  function resolveVoting() {
    const livingPlayers = players.filter(p => !p.dead)
    const tally = {}
    livingPlayers.forEach(p => { tally[p.id] = 0 })
    Object.values(votes).forEach(tid => { if (tally[tid] !== undefined) tally[tid]++ })
    let maxVotes = 0; let eliminated = []
    Object.entries(tally).forEach(([id, v]) => {
      if (v > maxVotes) { maxVotes = v; eliminated = [parseInt(id)] }
      else if (v === maxVotes && v > 0) eliminated.push(parseInt(id))
    })
    let updatedPlayers = [...players]; let log = []
    if (eliminated.length === 1 && maxVotes > 0) {
      const victim = players.find(p => p.id === eliminated[0])
      updatedPlayers = updatedPlayers.map(p => p.id === victim.id ? { ...p, dead: true } : p)
      log.push({ type: 'vote', text: `The village voted to eliminate ${victim.name} (${ROLES[victim.role].emoji} ${ROLES[victim.role].name}).` })
      if (victim.role === 'hunter') { setPlayers(updatedPlayers); setHunterKiller(victim.id); setDayLog(log); return }
    } else {
      log.push({ type: 'tie', text: 'The vote was tied. No one was eliminated today.' })
    }
    const win = checkWin(updatedPlayers)
    setPlayers(updatedPlayers); setDayLog(log); setVotes({}); setSelected(null)
    if (win) { setWinner(win); setPhase('gameOver') } else beginNight()
  }

  // ── Render ──
  if (phase === 'setup') return <SetupScreen onStart={startGame} onExit={onExit} />

  if (phase === 'roleReveal') {
    const p = players[revealIndex]
    const role = ROLES[p.role]
    const wolves2 = players.filter(pl => pl.role === 'werewolf')
    return (
      <RoleRevealScreen
        player={p} role={role} isWolf={p.role === 'werewolf'}
        allies={p.role === 'werewolf' ? wolves2.filter(w => w.id !== p.id) : []}
        isLast={revealIndex === players.length - 1}
        totalPlayers={players.length} currentIndex={revealIndex} onNext={nextReveal}
      />
    )
  }

  if (phase === 'night')
    return (
      <NightPhaseScreen
        subPhase={subPhase} players={players} nightState={nightState}
        setNightState={setNightState} onAdvance={advanceNightPhase}
        onWolfVote={id => setNightState(s => ({ ...s, wolfVote: id }))}
        onDoctorSave={id => setNightState(s => ({ ...s, doctorSave: id }))}
        onSeerReveal={id => {
          const target = players.find(p => p.id === id)
          setNightState(s => ({ ...s, seerReveal: id, seerResult: target.role }))
        }}
      />
    )

  if (phase === 'hunterRevenge') {
    const hunter = players.find(p => p.id === hunterKiller)
    return <HunterRevengeScreen hunter={hunter} players={players} onRevenge={resolveHunterRevenge} />
  }

  if (phase === 'day')
    return (
      <DayPhaseScreen
        players={players} log={dayLog} votes={votes} selected={selected}
        setSelected={setSelected} onVote={castVote} onResolve={resolveVoting} onNight={beginNight}
      />
    )

  if (phase === 'gameOver')
    return <GameOverScreen winner={winner} players={players} onRematch={rematch} onRestart={() => setPhase('setup')} onExit={onExit} />

  return null
}

// ─────────── Setup Screen ───────────
function SetupScreen({ onStart, onExit }) {
  const [names, setNames] = useState(['', ''])
  const [step, setStep] = useState('players')
  const [roleCounts, setRoleCounts] = useState({})

  const validNames = names.filter(n => n.trim())
  const canProceed = validNames.length >= 5

  function addPlayer() { setNames(n => [...n, '']) }
  function removePlayer(i) { if (names.length <= 2) return; setNames(n => n.filter((_, idx) => idx !== i)) }
  function updateName(i, val) { setNames(n => n.map((name, idx) => idx === i ? val : name)) }
  function loadPreset(preset) { setNames([...preset.players]) }

  function goToRoles() {
    setRoleCounts(getDefaultRoleCounts(validNames.length))
    setStep('roles')
  }

  function handleStart() { onStart(validNames, roleCounts) }

  const total = Object.values(roleCounts).reduce((a, b) => a + b, 0)
  const diff = validNames.length - total

  if (step === 'roles') {
    return (
      <div className="screen">
        <div className="header">
          <button className="back-btn" onClick={() => setStep('players')}>←</button>
          <span className="header-title">🐺 Assign Roles</span>
        </div>
        <div className="section">
          <div className="banner banner-info" style={{ marginBottom: 0 }}>
            {validNames.length} players · {total} roles assigned
            {diff !== 0 && <span style={{ color: diff > 0 ? 'var(--yellow)' : 'var(--imp-accent)' }}>
              {' '}({diff > 0 ? `+${diff} unassigned` : `${Math.abs(diff)} too many`})
            </span>}
          </div>

          {Object.entries(ROLES).map(([key, role]) => (
            <div key={key} className="card flex items-center justify-between" style={{ gap: 12 }}>
              <div className="flex items-center gap-3" style={{ flex: 1 }}>
                <span style={{ fontSize: 28 }}>{role.emoji}</span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: 2 }}>{role.name}</div>
                  <div className="text-muted text-sm">{role.desc}</div>
                </div>
              </div>
              {key === 'villager' ? (
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, minWidth: 32, textAlign: 'center', color: 'var(--text-muted)' }}>
                  {roleCounts.villager ?? 0}
                </div>
              ) : (
                <div className="stepper" style={{ gap: 8 }}>
                  <button className="stepper-btn"
                    onClick={() => setRoleCounts(c => ({ ...c, [key]: Math.max(0, (c[key] ?? 0) - 1), villager: c.villager + 1 }))}>−</button>
                  <span className="stepper-val">{roleCounts[key] ?? 0}</span>
                  <button className="stepper-btn"
                    onClick={() => setRoleCounts(c => {
                      const vill = (c.villager ?? 0) - 1
                      if (vill < 0) return c
                      return { ...c, [key]: (c[key] ?? 0) + 1, villager: vill }
                    })}>+</button>
                </div>
              )}
            </div>
          ))}

          <div style={{ marginTop: 'auto' }}>
            <button className="btn btn-wolf" onClick={handleStart} disabled={diff !== 0 || roleCounts.werewolf < 1}>
              🐺 Start Game
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">🐺 Werewolf — Players</span>
      </div>
      <div className="section">
        <p className="text-muted text-sm">Add player names (min 5). Pass the phone to each player to set their name.</p>

        {PLAYER_PRESETS.length > 0 && (
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {PLAYER_PRESETS.map(preset => (
              <button key={preset.id} className="btn btn-ghost btn-sm" onClick={() => loadPreset(preset)}>
                {preset.emoji} Load "{preset.name}" ({preset.players.length})
              </button>
            ))}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {names.map((name, i) => (
            <div key={i} className="flex gap-2 items-center">
              <span style={{ width: 28, textAlign: 'center', flexShrink: 0, color: 'var(--text-muted)', fontSize: 14 }}>
                {AVATARS[i % AVATARS.length]}
              </span>
              <input className="input" placeholder={`Player ${i + 1}`} value={name}
                onChange={e => updateName(i, e.target.value)} maxLength={20} />
              {names.length > 2 && (
                <button className="remove-btn" onClick={() => removePlayer(i)}>×</button>
              )}
            </div>
          ))}
        </div>

        <button className="btn btn-ghost" onClick={addPlayer}>+ Add Player</button>
        {!canProceed && <p className="text-muted text-sm text-center">Need at least 5 players to start</p>}

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-wolf" onClick={goToRoles} disabled={!canProceed}>
            Next: Assign Roles →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────── Role Reveal Screen ───────────
function RoleRevealScreen({ player, role, isWolf, allies, isLast, totalPlayers, currentIndex, onNext }) {
  const [revealed, setRevealed] = useState(false)

  function handleReveal() {
    if (!revealed) setRevealed(true)
    else { setRevealed(false); onNext() }
  }

  if (!revealed) {
    return (
      <div className="cover-screen" onClick={handleReveal}>
        <div className="big-emoji">🌙</div>
        <div>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
            {player.name}
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Tap to see your secret role</p>
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-display)', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
          {currentIndex + 1} / {totalPlayers}
        </div>
      </div>
    )
  }

  return (
    <div className="screen fade-in" style={{ padding: 24, justifyContent: 'center', gap: 24 }}>
      <div className={`role-card ${isWolf ? 'wolf-role' : 'village-role'}`}>
        <div className="role-emoji">{role.emoji}</div>
        <div className="role-name">{role.name}</div>
        <span className={`tag ${isWolf ? 'tag-wolf' : 'tag-village'}`}>
          {isWolf ? '🐺 Wolf Team' : '🏘 Village Team'}
        </span>
        <p className="role-desc" style={{ marginTop: 12 }}>{role.desc}</p>
      </div>

      {isWolf && allies.length > 0 && (
        <div className="card" style={{ borderColor: 'var(--wolf-border)' }}>
          <p className="section-title" style={{ marginBottom: 12 }}>Your wolf pack</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {allies.map(a => (
              <div key={a.id} className="flex items-center gap-3">
                <span style={{ fontSize: 20 }}>{a.avatar}</span>
                <span style={{ fontWeight: 600 }}>{a.name}</span>
                <span className="tag tag-wolf" style={{ marginLeft: 'auto' }}>🐺 Wolf</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {isWolf && allies.length === 0 && (
        <div className="banner banner-wolf">You are a lone wolf. Hunt carefully.</div>
      )}

      <button className="btn btn-wolf" onClick={handleReveal}>
        {isLast ? '🌙 All roles revealed — Start Night' : 'Done — pass to next player'}
      </button>
    </div>
  )
}

// ─────────── Night Phase Screen ───────────
function NightPhaseScreen({ subPhase, players, nightState, setNightState, onAdvance, onWolfVote, onDoctorSave, onSeerReveal }) {
  const living = players.filter(p => !p.dead)
  const wolves = living.filter(p => p.role === 'werewolf')
  const [selected, setSelected] = useState(null)
  const [seerResult, setSeerResult] = useState(null)
  const [ready, setReady] = useState(false)

  function resetSelection() { setSelected(null); setSeerResult(null); setReady(false) }

  if (subPhase === 'intro') {
    return (
      <div className="cover-screen" style={{ background: 'var(--surface)' }}>
        <div className="big-emoji">🌙</div>
        <div className="text-center">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 12 }}>Night Falls</p>
          <p style={{ color: 'var(--text-secondary)' }}>Everyone close your eyes.</p>
          <p className="text-sm" style={{ marginTop: 8, color: 'var(--text-muted)' }}>The phone will be passed to each player privately.</p>
        </div>
        <button className="btn btn-wolf" style={{ maxWidth: 280 }} onClick={() => { resetSelection(); onAdvance() }}>
          Begin Night Phase
        </button>
      </div>
    )
  }

  if (subPhase === 'wolves') {
    return (
      <div className="cover-screen">
        <div className="big-emoji">🐺</div>
        <div className="text-center">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Werewolves, wake up
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Pass the phone to the werewolves.</p>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {wolves.map(w => (
              <span key={w.id} className="tag tag-wolf" style={{ padding: '6px 14px', fontSize: 13 }}>
                {w.avatar} {w.name}
              </span>
            ))}
          </div>
        </div>
        <button className="btn btn-wolf" style={{ maxWidth: 280 }} onClick={() => { resetSelection(); onAdvance() }}>
          Werewolves Ready
        </button>
      </div>
    )
  }

  if (subPhase === 'wolfAction') {
    const target = selected !== null ? players.find(p => p.id === selected) : null
    return (
      <div className="screen">
        <div className="header" style={{ background: 'var(--wolf-surface)', borderColor: 'var(--wolf-border)' }}>
          <span style={{ fontSize: 22 }}>🐺</span>
          <span className="header-title">Choose your victim</span>
        </div>
        <div className="section">
          <p className="text-muted text-sm">Choose one player to eliminate tonight. All wolves must agree.</p>
          <div className="player-grid">
            {living.filter(p => p.role !== 'werewolf').map(p => (
              <button key={p.id} className={`player-chip ${selected === p.id ? 'selected' : ''}`}
                onClick={() => setSelected(p.id)}>
                <div className="player-avatar" style={{ background: 'var(--imp-surface)', color: 'var(--imp-accent)' }}>
                  {p.avatar}
                </div>
                <span className="player-name">{p.name}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 'auto' }}>
            {target && <div className="banner banner-wolf" style={{ marginBottom: 12 }}>Target: {target.name}</div>}
            <button className="btn btn-wolf" disabled={selected === null}
              onClick={() => { onWolfVote(selected); resetSelection(); onAdvance() }}>
              Confirm Kill →
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (subPhase === 'doctor') {
    return (
      <div className="cover-screen">
        <div className="big-emoji">💊</div>
        <div className="text-center">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Doctor, wake up
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Pass the phone to the Doctor.</p>
        </div>
        <button className="btn btn-success" style={{ maxWidth: 280 }} onClick={() => { resetSelection(); onAdvance() }}>
          Doctor Ready
        </button>
      </div>
    )
  }

  if (subPhase === 'doctorAction') {
    const target = selected !== null ? players.find(p => p.id === selected) : null
    return (
      <div className="screen">
        <div className="header" style={{ background: 'var(--green-surface)', borderColor: 'var(--green-border)' }}>
          <span style={{ fontSize: 22 }}>💊</span>
          <span className="header-title">Protect someone</span>
        </div>
        <div className="section">
          <p className="text-muted text-sm">Choose one player to protect tonight (including yourself).</p>
          <div className="player-grid">
            {living.map(p => (
              <button key={p.id} className={`player-chip ${selected === p.id ? 'selected' : ''}`}
                onClick={() => setSelected(p.id)}
                style={selected === p.id ? { borderColor: 'var(--green)', background: 'var(--green-surface)' } : {}}>
                <div className="player-avatar" style={{ background: 'var(--green-surface)', color: 'var(--green-light)' }}>
                  {p.avatar}
                </div>
                <span className="player-name">{p.name}</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 'auto' }}>
            {target && <div className="banner banner-success" style={{ marginBottom: 12 }}>Protecting: {target.name}</div>}
            <button className="btn btn-success" disabled={selected === null}
              onClick={() => { onDoctorSave(selected); resetSelection(); onAdvance() }}>
              Confirm Protection →
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (subPhase === 'seer') {
    return (
      <div className="cover-screen">
        <div className="big-emoji">🔮</div>
        <div className="text-center">
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 8 }}>
            Seer, wake up
          </p>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Pass the phone to the Seer.</p>
        </div>
        <button className="btn" style={{ maxWidth: 280, background: '#6366f1', color: '#fff', boxShadow: '0 4px 20px rgba(99,102,241,0.15)' }}
          onClick={() => { resetSelection(); onAdvance() }}>
          Seer Ready
        </button>
      </div>
    )
  }

  if (subPhase === 'seerAction') {
    const target = selected !== null ? players.find(p => p.id === selected) : null
    const seerBg = '#0d0d20'
    const seerBorder = '#1e1e50'
    const seerColor = '#a5b4fc'
    return (
      <div className="screen">
        <div className="header" style={{ background: seerBg, borderColor: seerBorder }}>
          <span style={{ fontSize: 22 }}>🔮</span>
          <span className="header-title">Reveal a role</span>
        </div>
        <div className="section">
          {!seerResult ? (
            <>
              <p className="text-muted text-sm">Tap a player to see their true role.</p>
              <div className="player-grid">
                {living.filter(p => p.role !== 'seer').map(p => (
                  <button key={p.id} className={`player-chip ${selected === p.id ? 'selected' : ''}`}
                    onClick={() => { setSelected(p.id); setSeerResult(p.role) }}
                    style={selected === p.id ? { borderColor: '#6366f1', background: seerBg } : {}}>
                    <div className="player-avatar" style={{ background: seerBg, color: seerColor }}>
                      {p.avatar}
                    </div>
                    <span className="player-name">{p.name}</span>
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="fade-in" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div className="card text-center" style={{ padding: 32, borderColor: seerBorder, background: seerBg }}>
                <p className="text-muted text-sm" style={{ marginBottom: 8 }}>{target?.name} is...</p>
                <div style={{ fontSize: 48, marginBottom: 8 }}>{ROLES[seerResult].emoji}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 800 }}>{ROLES[seerResult].name}</div>
                <span className={`tag ${seerResult === 'werewolf' ? 'tag-wolf' : 'tag-village'}`} style={{ marginTop: 8, display: 'inline-flex' }}>
                  {seerResult === 'werewolf' ? '🐺 Wolf Team' : '🏘 Village Team'}
                </span>
              </div>
              <p className="text-muted text-sm text-center">Memorize this. Tap done to close your eyes.</p>
              <div style={{ marginTop: 'auto' }}>
                <button className="btn" style={{ background: '#6366f1', color: '#fff', boxShadow: '0 4px 20px rgba(99,102,241,0.15)' }}
                  onClick={() => { onSeerReveal(selected); resetSelection(); onAdvance() }}>
                  Done — Close Eyes →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return null
}

// ─────────── Hunter Revenge Screen ───────────
function HunterRevengeScreen({ hunter, players, onRevenge }) {
  const [selected, setSelected] = useState(null)
  const living = players.filter(p => !p.dead && p.id !== hunter?.id)

  return (
    <div className="screen">
      <div className="header" style={{ background: 'var(--yellow-surface)', borderColor: 'var(--yellow-border)' }}>
        <span style={{ fontSize: 22 }}>🏹</span>
        <span className="header-title">Hunter's Last Shot</span>
      </div>
      <div className="section">
        <div className="banner" style={{ background: 'var(--yellow-surface)', border: '1px solid var(--yellow-border)', color: 'var(--yellow-light)' }}>
          {hunter?.name} was the Hunter! Before dying, they take one player with them.
        </div>
        <p className="text-muted text-sm">{hunter?.name}, choose who to eliminate.</p>
        <div className="player-grid">
          {living.map(p => (
            <button key={p.id} className={`player-chip ${selected === p.id ? 'selected' : ''}`}
              onClick={() => setSelected(p.id)}
              style={selected === p.id ? { borderColor: 'var(--yellow)', background: 'var(--yellow-surface)' } : {}}>
              <div className="player-avatar" style={{ background: 'var(--yellow-surface)', color: 'var(--yellow-light)' }}>
                {p.avatar}
              </div>
              <span className="player-name">{p.name}</span>
            </button>
          ))}
        </div>
        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-danger" disabled={selected === null} onClick={() => onRevenge(selected)}>
            🏹 Fire Arrow →
          </button>
        </div>
      </div>
    </div>
  )
}

// ─────────── Day Phase Screen ───────────
function DayPhaseScreen({ players, log, votes, selected, setSelected, onVote, onResolve }) {
  const living = players.filter(p => !p.dead)
  const dead = players.filter(p => p.dead)
  const [tab, setTab] = useState('vote')
  const allVoted = living.every(p => votes[p.id] !== undefined)

  const tally = {}
  living.forEach(p => { tally[p.id] = 0 })
  Object.values(votes).forEach(tid => { if (tally[tid] !== undefined) tally[tid]++ })
  const maxTally = Math.max(...Object.values(tally), 1)

  return (
    <div className="screen">
      <div className="header">
        <span style={{ fontSize: 22 }}>☀️</span>
        <span className="header-title">Day Phase</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          <span className="tag tag-village">{living.length} alive</span>
          {dead.length > 0 && <span className="tag tag-dead">{dead.length} dead</span>}
        </div>
      </div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--border)', flexShrink: 0, background: 'var(--bg)' }}>
        {['log', 'vote'].map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '12px 16px', background: 'none', border: 'none',
            fontFamily: 'var(--font-display)', color: tab === t ? 'var(--text)' : 'var(--text-muted)',
            fontWeight: tab === t ? 700 : 500, fontSize: 13, cursor: 'pointer',
            borderBottom: `2px solid ${tab === t ? 'var(--wolf-primary)' : 'transparent'}`,
            transition: 'all 0.2s', letterSpacing: '0.01em',
          }}>
            {t === 'log' ? 'Night Report' : 'Vote'}
          </button>
        ))}
      </div>

      {tab === 'log' && (
        <div className="section fade-in">
          {log.map((entry, i) => (
            <div key={i} className="card" style={{
              borderColor: entry.type === 'kill' ? 'var(--imp-border)' : entry.type === 'saved' ? 'var(--green-border)' : 'var(--border)',
              background: entry.type === 'kill' ? 'var(--imp-surface)' : entry.type === 'saved' ? 'var(--green-surface)' : 'var(--surface)',
            }}>
              <p style={{ fontWeight: 600 }}>
                {entry.type === 'kill' ? '💀 ' : entry.type === 'saved' ? '💊 ' : '🗳 '}{entry.text}
              </p>
              {entry.role && (
                <p className="text-muted text-sm" style={{ marginTop: 4 }}>
                  They were a {ROLES[entry.role].emoji} {ROLES[entry.role].name}.
                </p>
              )}
            </div>
          ))}
          <div className="banner banner-info" style={{ marginTop: 8 }}>
            Discuss who might be a Werewolf, then vote to eliminate someone.
          </div>
          <div style={{ marginTop: 'auto' }}>
            <button className="btn btn-ghost" onClick={() => setTab('vote')}>Go to Voting →</button>
          </div>
        </div>
      )}

      {tab === 'vote' && (
        <div className="section fade-in">
          <p className="text-muted text-sm">
            Each player taps their name, then selects who to vote out. {Object.keys(votes).length}/{living.length} voted.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {living.map(voter => {
              const hasVoted = votes[voter.id] !== undefined
              const isSelected = selected === voter.id
              const votedFor = hasVoted ? players.find(p => p.id === votes[voter.id]) : null
              return (
                <div key={voter.id}>
                  <button className={`player-chip w-full ${isSelected ? 'selected' : ''}`}
                    style={{ width: '100%', justifyContent: 'space-between' }}
                    onClick={() => setSelected(isSelected ? null : voter.id)}>
                    <div className="flex items-center gap-3">
                      <div className="player-avatar" style={{ background: 'var(--wolf-surface)', color: 'var(--wolf-accent)' }}>
                        {voter.avatar}
                      </div>
                      <span className="player-name" style={{ fontSize: 15 }}>{voter.name}</span>
                    </div>
                    {hasVoted ? (
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>→ {votedFor?.name}</span>
                    ) : (
                      <span style={{ fontSize: 12, color: 'var(--yellow)' }}>tap to vote</span>
                    )}
                  </button>

                  {isSelected && !hasVoted && (
                    <div className="player-grid fade-in" style={{ marginTop: 8, paddingLeft: 8 }}>
                      {living.filter(p => p.id !== voter.id).map(target => (
                        <button key={target.id} className="player-chip selected-imp"
                          style={{ borderColor: 'var(--imp-border)', background: 'var(--imp-surface)' }}
                          onClick={() => { onVote(voter.id, target.id); setSelected(null) }}>
                          <div className="player-avatar" style={{ background: 'var(--imp-surface)', color: 'var(--imp-accent)' }}>
                            {target.avatar}
                          </div>
                          <span className="player-name">{target.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {Object.keys(votes).length > 0 && (
            <div className="card" style={{ marginTop: 8 }}>
              <p className="section-title" style={{ marginBottom: 10 }}>Current Tally</p>
              {living.map(p => {
                const v = tally[p.id] || 0
                if (v === 0) return null
                return (
                  <div key={p.id} style={{ marginBottom: 10 }}>
                    <div className="flex justify-between text-sm" style={{ marginBottom: 4 }}>
                      <span>{p.avatar} {p.name}</span>
                      <span style={{ fontWeight: 700 }}>{v} vote{v !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="vote-bar">
                      <div className="vote-fill" style={{ width: `${(v / maxTally) * 100}%`, background: 'var(--imp-primary)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {dead.length > 0 && (
            <div>
              <p className="section-title" style={{ marginBottom: 8 }}>Eliminated</p>
              <div className="flex" style={{ gap: 8, flexWrap: 'wrap' }}>
                {dead.map(p => (
                  <span key={p.id} className="tag tag-dead">{p.avatar} {p.name} · {ROLES[p.role].emoji}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 'auto' }}>
            <button className="btn btn-danger" onClick={onResolve} disabled={!allVoted}>
              🗳 Resolve Vote
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────── Game Over Screen ───────────
function GameOverScreen({ winner, players, onRematch, onRestart, onExit }) {
  const isWolf = winner === 'wolf'
  const wolfPlayers = players.filter(p => p.role === 'werewolf')
  const villagers = players.filter(p => p.role !== 'werewolf')

  return (
    <div className="screen" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, minHeight: '100%' }}>
        <div className="text-center slide-up" style={{ paddingTop: 20 }}>
          <div style={{ fontSize: 64, marginBottom: 16, filter: 'drop-shadow(0 12px 30px rgba(0,0,0,0.6))' }}>
            {isWolf ? '🐺' : '🏘'}
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 30, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 8 }}>
            {isWolf ? 'Werewolves Win!' : 'Village Wins!'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {isWolf ? 'The wolves devoured the village under cover of night.' : 'The villagers hunted down the last werewolf!'}
          </p>
        </div>

        <div className="card" style={{
          borderColor: isWolf ? 'var(--wolf-border)' : 'var(--green-border)',
          background: isWolf ? 'var(--wolf-surface)' : 'var(--green-surface)',
        }}>
          <p className="section-title" style={{ marginBottom: 12 }}>🐺 Werewolves</p>
          {wolfPlayers.map(p => (
            <div key={p.id} className="flex items-center gap-3" style={{ marginBottom: 10 }}>
              <div className="player-avatar" style={{ background: 'var(--wolf-surface)', border: '1px solid var(--wolf-border)' }}>
                {p.avatar}
              </div>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
              {p.dead && <span className="tag tag-dead" style={{ marginLeft: 'auto' }}>Eliminated</span>}
            </div>
          ))}
        </div>

        <div className="card">
          <p className="section-title" style={{ marginBottom: 12 }}>🏘 Village</p>
          {villagers.map(p => (
            <div key={p.id} className="flex items-center gap-3" style={{ marginBottom: 10 }}>
              <div className="player-avatar" style={{ background: 'var(--green-surface)', border: '1px solid var(--green-border)' }}>
                {p.avatar}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>{p.name}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: 12, marginLeft: 8 }}>{ROLES[p.role].emoji} {ROLES[p.role].name}</span>
              </div>
              {p.dead && <span className="tag tag-dead" style={{ flexShrink: 0 }}>Eliminated</span>}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 4 }}>
          <button className="btn btn-wolf" onClick={onRematch}>Rematch</button>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-ghost" onClick={onExit}>Home</button>
            <button className="btn btn-ghost" onClick={onRestart}>New Setup</button>
          </div>
        </div>
      </div>
    </div>
  )
}
