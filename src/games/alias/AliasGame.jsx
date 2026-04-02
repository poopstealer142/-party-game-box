import { useState, useEffect, useRef } from 'react'
import { PLAYER_PRESETS } from '../../data/presets'

const AVATARS = ['🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦋','🦄','🐙','🦀','🐠','🐢','🦜','🦩','🐝','🐞','🦕','🦑','🐬','🦔']

const WORD_PACKS = [
  {
    id: 'general',
    name: 'General',
    emoji: '🎯',
    words: [
      { word: 'Pizza', taboo: ['cheese', 'tomato', 'Italian', 'dough', 'eat'] },
      { word: 'Birthday', taboo: ['cake', 'party', 'age', 'year', 'celebrate'] },
      { word: 'Rain', taboo: ['water', 'wet', 'clouds', 'storm', 'umbrella'] },
      { word: 'Library', taboo: ['books', 'quiet', 'read', 'borrow', 'shelves'] },
      { word: 'Wedding', taboo: ['marry', 'bride', 'groom', 'ring', 'ceremony'] },
      { word: 'Airport', taboo: ['plane', 'fly', 'travel', 'passport', 'terminal'] },
      { word: 'Doctor', taboo: ['hospital', 'sick', 'medicine', 'health', 'nurse'] },
      { word: 'Guitar', taboo: ['music', 'strings', 'play', 'band', 'instrument'] },
      { word: 'Mirror', taboo: ['reflection', 'glass', 'look', 'see', 'yourself'] },
      { word: 'Money', taboo: ['cash', 'pay', 'rich', 'coins', 'bank'] },
      { word: 'Mountain', taboo: ['climb', 'tall', 'peak', 'snow', 'hike'] },
      { word: 'Cooking', taboo: ['food', 'kitchen', 'chef', 'heat', 'recipe'] },
      { word: 'Dreams', taboo: ['sleep', 'night', 'unconscious', 'wish', 'goal'] },
      { word: 'School', taboo: ['learn', 'teacher', 'class', 'study', 'students'] },
      { word: 'Sunshine', taboo: ['sun', 'warm', 'light', 'bright', 'sky'] },
      { word: 'Dancing', taboo: ['move', 'music', 'rhythm', 'steps', 'club'] },
      { word: 'Fishing', taboo: ['fish', 'rod', 'lake', 'catch', 'bait'] },
      { word: 'Camping', taboo: ['tent', 'forest', 'fire', 'outdoor', 'nature'] },
      { word: 'Shopping', taboo: ['buy', 'store', 'mall', 'spend', 'purchase'] },
      { word: 'Swimming', taboo: ['water', 'pool', 'stroke', 'dive', 'splash'] },
      { word: 'Dentist', taboo: ['teeth', 'drill', 'mouth', 'pain', 'cavity'] },
      { word: 'Traffic', taboo: ['cars', 'road', 'slow', 'jam', 'highway'] },
      { word: 'Alarm', taboo: ['clock', 'wake', 'morning', 'ring', 'snooze'] },
      { word: 'Newspaper', taboo: ['news', 'read', 'print', 'paper', 'daily'] },
      { word: 'Telescope', taboo: ['stars', 'space', 'look', 'far', 'astronomer'] },
      { word: 'Passport', taboo: ['travel', 'country', 'border', 'visa', 'document'] },
      { word: 'Elevator', taboo: ['lift', 'floor', 'button', 'up', 'building'] },
      { word: 'Fireworks', taboo: ['explode', 'sky', 'celebration', 'colour', 'bang'] },
      { word: 'Sunscreen', taboo: ['sun', 'protect', 'cream', 'beach', 'burn'] },
      { word: 'Karaoke', taboo: ['sing', 'microphone', 'bar', 'song', 'performance'] },
      { word: 'Nightmare', taboo: ['dream', 'sleep', 'scary', 'night', 'horror'] },
      { word: 'Handshake', taboo: ['hand', 'greet', 'meet', 'shake', 'hello'] },
      { word: 'Treasure', taboo: ['gold', 'chest', 'pirate', 'find', 'valuable'] },
      { word: 'Volcano', taboo: ['lava', 'erupt', 'fire', 'mountain', 'magma'] },
      { word: 'Compass', taboo: ['north', 'direction', 'navigate', 'point', 'magnetic'] },
      { word: 'Thunderstorm', taboo: ['lightning', 'rain', 'thunder', 'clouds', 'weather'] },
      { word: 'Skyscraper', taboo: ['tall', 'building', 'city', 'floors', 'high'] },
      { word: 'Parachute', taboo: ['fall', 'sky', 'jump', 'plane', 'open'] },
      { word: 'Hourglass', taboo: ['sand', 'time', 'flip', 'timer', 'minutes'] },
    ],
  },
  {
    id: 'popculture',
    name: 'Pop Culture',
    emoji: '🎬',
    words: [
      { word: 'Spider-Man', taboo: ['spider', 'hero', 'web', 'Peter', 'Marvel'] },
      { word: 'Harry Potter', taboo: ['wizard', 'magic', 'Hogwarts', 'wand', 'witch'] },
      { word: 'Disney', taboo: ['princess', 'Mickey', 'magic', 'park', 'castle'] },
      { word: 'Batman', taboo: ['hero', 'dark', 'Gotham', 'cape', 'villain'] },
      { word: 'Avengers', taboo: ['Marvel', 'heroes', 'team', 'save', 'assemble'] },
      { word: 'Titanic', taboo: ['ship', 'sink', 'ocean', 'Leonardo', 'ice'] },
      { word: 'Star Wars', taboo: ['space', 'Jedi', 'Force', 'lightsaber', 'galaxy'] },
      { word: 'Minecraft', taboo: ['blocks', 'build', 'game', 'Steve', 'creeper'] },
      { word: 'Netflix', taboo: ['stream', 'watch', 'binge', 'series', 'show'] },
      { word: 'TikTok', taboo: ['video', 'dance', 'viral', 'social', 'short'] },
      { word: 'Squid Game', taboo: ['Korean', 'game', 'money', 'survival', 'Netflix'] },
      { word: 'Breaking Bad', taboo: ['Walter', 'drug', 'chemistry', 'blue', 'Heisenberg'] },
      { word: 'Friends', taboo: ['sitcom', 'New York', 'coffee', 'Rachel', 'Ross'] },
      { word: 'Game of Thrones', taboo: ['dragon', 'king', 'throne', 'medieval', 'winter'] },
      { word: 'The Office', taboo: ['Dwight', 'Michael', 'paper', 'work', 'mockumentary'] },
      { word: 'Stranger Things', taboo: ['Eleven', 'monster', 'upside', 'Netflix', 'eighties'] },
      { word: 'Frozen', taboo: ['ice', 'Elsa', 'queen', 'Disney', 'powers'] },
      { word: 'Shrek', taboo: ['ogre', 'Donkey', 'fairytale', 'swamp', 'green'] },
      { word: 'Toy Story', taboo: ['toy', 'Buzz', 'Woody', 'Andy', 'Pixar'] },
      { word: 'Lion King', taboo: ['lion', 'Simba', 'Africa', 'pride', 'Disney'] },
      { word: 'Taylor Swift', taboo: ['singer', 'pop', 'songs', 'music', 'Swifties'] },
      { word: 'Instagram', taboo: ['photo', 'filter', 'follow', 'social', 'post'] },
      { word: 'YouTube', taboo: ['video', 'watch', 'channel', 'subscribe', 'views'] },
      { word: 'Starbucks', taboo: ['coffee', 'green', 'cup', 'café', 'drink'] },
      { word: 'McDonald\'s', taboo: ['burger', 'fast', 'fries', 'food', 'Ronald'] },
      { word: 'Pokémon', taboo: ['pikachu', 'catch', 'battle', 'Nintendo', 'trainer'] },
      { word: 'The Simpsons', taboo: ['Homer', 'yellow', 'family', 'Springfield', 'cartoon'] },
      { word: 'Fortnite', taboo: ['battle', 'royale', 'build', 'storm', 'shoot'] },
      { word: 'Adele', taboo: ['singer', 'Hello', 'ballad', 'voice', 'British'] },
      { word: 'SpongeBob', taboo: ['sponge', 'Patrick', 'underwater', 'Bikini', 'cartoon'] },
      { word: 'Roblox', taboo: ['game', 'blocks', 'online', 'kids', 'build'] },
      { word: 'Avocado Toast', taboo: ['brunch', 'millennial', 'healthy', 'trend', 'green'] },
      { word: 'Wordle', taboo: ['word', 'guess', 'five', 'letters', 'daily'] },
      { word: 'The Last of Us', taboo: ['zombie', 'apocalypse', 'Joel', 'Ellie', 'HBO'] },
      { word: 'Elon Musk', taboo: ['Tesla', 'Twitter', 'billionaire', 'rocket', 'Mars'] },
      { word: 'Among Us', taboo: ['impostor', 'spaceship', 'vote', 'crewmate', 'sus'] },
      { word: 'Barbie', taboo: ['doll', 'pink', 'Ken', 'plastic', 'Mattel'] },
      { word: 'Wednesday Addams', taboo: ['Addams', 'dark', 'gloomy', 'Netflix', 'dance'] },
      { word: 'ChatGPT', taboo: ['AI', 'OpenAI', 'chat', 'language', 'robot'] },
    ],
  },
  {
    id: 'sports',
    name: 'Sports',
    emoji: '⚽',
    words: [
      { word: 'Basketball', taboo: ['ball', 'hoop', 'NBA', 'court', 'dunk'] },
      { word: 'Football', taboo: ['ball', 'kick', 'goal', 'FIFA', 'pitch'] },
      { word: 'Tennis', taboo: ['racket', 'ball', 'court', 'serve', 'net'] },
      { word: 'Boxing', taboo: ['fight', 'punch', 'ring', 'gloves', 'knockout'] },
      { word: 'Golf', taboo: ['club', 'ball', 'hole', 'course', 'swing'] },
      { word: 'Olympics', taboo: ['gold', 'medal', 'sport', 'country', 'athlete'] },
      { word: 'Surfing', taboo: ['waves', 'ocean', 'board', 'beach', 'tube'] },
      { word: 'Skateboarding', taboo: ['skate', 'board', 'tricks', 'halfpipe', 'wheels'] },
      { word: 'Marathon', taboo: ['run', 'race', 'miles', 'endurance', 'long'] },
      { word: 'Volleyball', taboo: ['ball', 'net', 'spike', 'team', 'beach'] },
      { word: 'Cycling', taboo: ['bike', 'pedal', 'race', 'Tour', 'wheels'] },
      { word: 'Archery', taboo: ['bow', 'arrow', 'target', 'aim', 'shoot'] },
      { word: 'Gymnastics', taboo: ['flip', 'balance', 'beam', 'tumble', 'routine'] },
      { word: 'Baseball', taboo: ['bat', 'pitcher', 'home', 'diamond', 'inning'] },
      { word: 'Ice Hockey', taboo: ['puck', 'ice', 'skate', 'stick', 'rink'] },
      { word: 'Bowling', taboo: ['pins', 'ball', 'lane', 'strike', 'spare'] },
      { word: 'Badminton', taboo: ['shuttlecock', 'racket', 'net', 'court', 'feather'] },
      { word: 'Rowing', taboo: ['boat', 'oar', 'water', 'paddle', 'crew'] },
      { word: 'Fencing', taboo: ['sword', 'blade', 'duel', 'mask', 'thrust'] },
      { word: 'Triathlon', taboo: ['swim', 'bike', 'run', 'three', 'endurance'] },
      { word: 'Rugby', taboo: ['ball', 'tackle', 'scrum', 'try', 'oval'] },
      { word: 'Skiing', taboo: ['snow', 'mountain', 'slope', 'poles', 'downhill'] },
      { word: 'Table Tennis', taboo: ['ping', 'pong', 'paddle', 'table', 'ball'] },
      { word: 'Wrestling', taboo: ['fight', 'mat', 'pin', 'grapple', 'hold'] },
      { word: 'Swimming', taboo: ['water', 'pool', 'stroke', 'race', 'lane'] },
      { word: 'Weightlifting', taboo: ['heavy', 'barbell', 'lift', 'gym', 'strength'] },
      { word: 'Dodgeball', taboo: ['throw', 'dodge', 'ball', 'school', 'team'] },
      { word: 'Snooker', taboo: ['cue', 'balls', 'table', 'pocket', 'green'] },
      { word: 'Handball', taboo: ['hand', 'throw', 'goal', 'team', 'court'] },
      { word: 'Parkour', taboo: ['jump', 'run', 'obstacle', 'city', 'climb'] },
      { word: 'Darts', taboo: ['throw', 'board', 'pub', 'bullseye', 'points'] },
      { word: 'Curling', taboo: ['stone', 'ice', 'sweep', 'Canada', 'winter'] },
      { word: 'Polo', taboo: ['horse', 'mallet', 'ball', 'field', 'rich'] },
      { word: 'Lacrosse', taboo: ['stick', 'net', 'ball', 'field', 'catch'] },
      { word: 'Kabaddi', taboo: ['tag', 'team', 'tackle', 'India', 'breathe'] },
      { word: 'Sumo', taboo: ['push', 'ring', 'Japan', 'wrestler', 'heavy'] },
      { word: 'Synchronized Swimming', taboo: ['water', 'team', 'routine', 'graceful', 'pool'] },
      { word: 'Biathlon', taboo: ['ski', 'shoot', 'rifle', 'winter', 'two'] },
      { word: 'Equestrian', taboo: ['horse', 'ride', 'jump', 'stable', 'dressage'] },
    ],
  },
]

const TURN_DURATION = 60
const WIN_SCORE = 15

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

export default function AliasGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [teams, setTeams] = useState([[], []]) // array of player objects per team
  const [scores, setScores] = useState([0, 0])
  const [activeTeam, setActiveTeam] = useState(0)
  const [describerIdxPerTeam, setDescriberIdxPerTeam] = useState([0, 0])
  const [selectedPack, setSelectedPack] = useState('general')
  const [lastTurnScore, setLastTurnScore] = useState(0)
  const [winner, setWinner] = useState(null)

  function startGame(names, packId) {
    const ps = names.map((name, i) => ({ id: i, name, avatar: AVATARS[i % AVATARS.length] }))
    const team0 = ps.filter((_, i) => i % 2 === 0)
    const team1 = ps.filter((_, i) => i % 2 === 1)
    setPlayers(ps)
    setTeams([team0, team1])
    setScores([0, 0])
    setActiveTeam(0)
    setDescriberIdxPerTeam([0, 0])
    setSelectedPack(packId)
    setLastTurnScore(0)
    setWinner(null)
    setPhase('teams')
  }

  function endTurn(turnScore) {
    const newScores = [scores[0], scores[1]]
    newScores[activeTeam] += turnScore
    setScores(newScores)
    setLastTurnScore(turnScore)

    const newDescrIdx = [...describerIdxPerTeam]
    newDescrIdx[activeTeam] = (newDescrIdx[activeTeam] + 1) % teams[activeTeam].length
    setDescriberIdxPerTeam(newDescrIdx)

    if (newScores[0] >= WIN_SCORE || newScores[1] >= WIN_SCORE) {
      setWinner(newScores[0] >= WIN_SCORE ? 0 : 1)
      setPhase('winner')
    } else {
      setActiveTeam(t => 1 - t)
      setPhase('turnResult')
    }
  }

  const pack = WORD_PACKS.find(p => p.id === selectedPack) || WORD_PACKS[0]
  const describer = teams[activeTeam]?.[describerIdxPerTeam[activeTeam]]

  if (phase === 'setup') return <AliasSetup onExit={onExit} onStart={startGame} packs={WORD_PACKS} />
  if (phase === 'teams') return <AliasTeams teams={teams} onStart={() => setPhase('cover')} onExit={onExit} />
  if (phase === 'cover') return <AliasCover describer={describer} teamIdx={activeTeam} scores={scores} onReady={() => setPhase('turn')} />
  if (phase === 'turn') return (
    <AliasTurn
      key={`${activeTeam}-${describerIdxPerTeam[activeTeam]}`}
      pack={pack}
      describer={describer}
      teamIdx={activeTeam}
      scores={scores}
      onEndTurn={endTurn}
    />
  )
  if (phase === 'turnResult') return (
    <AliasTurnResult
      lastScore={lastTurnScore}
      teamIdx={1 - activeTeam}
      scores={scores}
      onNext={() => setPhase('cover')}
    />
  )
  if (phase === 'winner') return (
    <AliasWinner
      winner={winner}
      teams={teams}
      scores={scores}
      onRestart={() => startGame(players.map(p => p.name), selectedPack)}
      onExit={onExit}
    />
  )
  return null
}

function AliasSetup({ onExit, onStart, packs }) {
  const [names, setNames] = useState(['', '', '', ''])
  const [selectedPack, setSelectedPack] = useState('general')
  const validNames = names.filter(n => n.trim())
  const canStart = validNames.length >= 4

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">🚫 Alias</span>
      </div>
      <div className="section">
        <p className="text-muted text-sm">Min 4 players (2 teams). Describe words without saying them!</p>

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
              {names.length > 4 && (
                <button className="remove-btn" onClick={() => setNames(n => n.filter((_, idx) => idx !== i))}>×</button>
              )}
            </div>
          ))}
        </div>
        <button className="btn btn-ghost" onClick={() => setNames(n => [...n, ''])}>+ Add Player</button>

        <div>
          <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Word Pack</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {packs.map(p => (
              <button key={p.id}
                onClick={() => setSelectedPack(p.id)}
                style={{
                  flex: 1, padding: '10px 8px', borderRadius: 10,
                  background: selectedPack === p.id ? 'rgba(34,197,94,0.12)' : 'var(--surface)',
                  border: selectedPack === p.id ? '1px solid var(--alias-primary)' : '1px solid var(--border)',
                  color: selectedPack === p.id ? 'var(--alias-primary)' : 'var(--text-secondary)',
                  fontSize: 12, fontWeight: 600, cursor: 'pointer', textAlign: 'center',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}>
                <div style={{ fontSize: 18, marginBottom: 4 }}>{p.emoji}</div>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        {!canStart && <p className="text-muted text-sm text-center">Need at least 4 players (2 per team)</p>}
        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-alias" onClick={() => onStart(validNames, selectedPack)} disabled={!canStart}>
            🚫 Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

const TEAM_COLORS = ['#22C55E', '#F59E0B']
const TEAM_NAMES = ['Team Green', 'Team Gold']
const TEAM_EMOJIS = ['🟢', '🟡']

function AliasTeams({ teams, onStart, onExit }) {
  return (
    <div className="screen fade-in">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">🚫 Teams</span>
      </div>
      <div className="section" style={{ gap: 20 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, textAlign: 'center' }}>
          First to {WIN_SCORE} points wins! {TURN_DURATION}s per turn.
        </p>

        {teams.map((team, ti) => (
          <div key={ti} style={{
            padding: '16px 18px', borderRadius: 14,
            background: `${TEAM_COLORS[ti]}10`,
            border: `1px solid ${TEAM_COLORS[ti]}30`,
          }}>
            <div style={{ color: TEAM_COLORS[ti], fontWeight: 800, fontSize: 14, marginBottom: 10 }}>
              {TEAM_EMOJIS[ti]} {TEAM_NAMES[ti]}
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {team.map(p => (
                <span key={p.id} style={{
                  padding: '4px 12px', borderRadius: 20,
                  background: `${TEAM_COLORS[ti]}18`, border: `1px solid ${TEAM_COLORS[ti]}30`,
                  fontSize: 13, fontWeight: 600,
                }}>
                  {p.avatar} {p.name}
                </span>
              ))}
            </div>
          </div>
        ))}

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-alias" onClick={onStart}>
            Let's Go! →
          </button>
        </div>
      </div>
    </div>
  )
}

function AliasCover({ describer, teamIdx, scores, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}
      style={{ background: `${TEAM_COLORS[teamIdx]}08` }}>
      <div style={{ fontSize: 72, filter: `drop-shadow(0 8px 32px ${TEAM_COLORS[teamIdx]}50)` }}>🎤</div>
      <div>
        <p style={{ color: TEAM_COLORS[teamIdx], fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>
          {TEAM_NAMES[teamIdx]}'s Turn
        </p>
        <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {describer?.name} describes
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Only you look at the phone</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>Your team shouts guesses out loud</p>
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        {scores.map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ color: TEAM_COLORS[i], fontSize: 22, fontWeight: 800 }}>{s}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11 }}>{TEAM_NAMES[i]}</div>
          </div>
        ))}
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>Tap anywhere to start</p>
    </div>
  )
}

function AliasTurn({ pack, describer, teamIdx, scores, onEndTurn }) {
  const [started, setStarted] = useState(false)
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION)
  const [words] = useState(() => shuffleArr(pack.words))
  const [wordIdx, setWordIdx] = useState(0)
  const [turnScore, setTurnScore] = useState(0)
  const timerRef = useRef(null)

  useEffect(() => {
    if (started && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    } else if (started && timeLeft === 0) {
      onEndTurn(turnScore)
    }
    return () => clearTimeout(timerRef.current)
  }, [started, timeLeft, turnScore, onEndTurn])

  function handleCorrect() {
    const newScore = turnScore + 1
    setTurnScore(newScore)
    if (wordIdx + 1 >= words.length) {
      clearTimeout(timerRef.current)
      onEndTurn(newScore)
    } else {
      setWordIdx(i => i + 1)
    }
  }

  function handleSkip() {
    if (wordIdx + 1 >= words.length) {
      clearTimeout(timerRef.current)
      onEndTurn(turnScore)
    } else {
      setWordIdx(i => i + 1)
    }
  }

  const current = words[wordIdx]
  const progress = timeLeft / TURN_DURATION
  const isUrgent = timeLeft <= 10
  const circumference = 2 * Math.PI * 28

  if (!started) {
    return (
      <div className="screen fade-in" style={{ justifyContent: 'center', alignItems: 'center', gap: 20, padding: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 56 }}>🎤</div>
        <div>
          <p style={{ color: TEAM_COLORS[teamIdx], fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            {TEAM_NAMES[teamIdx]} — {describer?.name} describing
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6 }}>
            Describe words to your team.<br />
            <strong style={{ color: 'var(--text)' }}>Don't say the taboo words!</strong>
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 8 }}>{TURN_DURATION} seconds · {pack.words.length} words available</p>
        </div>
        <button className="btn btn-alias" style={{ maxWidth: 280 }} onClick={() => setStarted(true)}>
          Start Timer →
        </button>
      </div>
    )
  }

  return (
    <div className="screen fade-in">
      {/* Header with timer + score */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 20px', borderBottom: '1px solid var(--border)',
        flexShrink: 0, background: 'var(--bg)',
      }}>
        <div>
          <div style={{ color: TEAM_COLORS[teamIdx], fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            {TEAM_NAMES[teamIdx]}
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--alias-primary)' }}>
            +{turnScore} pts
          </div>
        </div>

        {/* Circular timer */}
        <div style={{ position: 'relative', width: 72, height: 72 }}>
          <svg width="72" height="72" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
            <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
            <circle cx="36" cy="36" r="28" fill="none"
              stroke={isUrgent ? '#EF4444' : 'var(--alias-primary)'}
              strokeWidth="3" strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={circumference * (1 - progress)}
              style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 20,
            color: isUrgent ? '#EF4444' : 'var(--text)',
          }}>
            {timeLeft}
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          {scores.map((s, i) => (
            <div key={i} style={{ fontSize: i === teamIdx ? 18 : 13, fontWeight: 800, color: i === teamIdx ? TEAM_COLORS[i] : 'var(--text-muted)' }}>
              {s}
            </div>
          ))}
        </div>
      </div>

      <div className="section" style={{ gap: 16, justifyContent: 'center', alignItems: 'center' }}>
        {/* Word */}
        <div style={{
          padding: '28px 24px', borderRadius: 18, textAlign: 'center', width: '100%',
          background: 'var(--surface)', border: '1px solid var(--border)',
        }}>
          <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 16 }}>
            {current?.word}
          </div>
          {/* Taboo words */}
          <div style={{ display: 'flex', gap: 6, justifyContent: 'center', flexWrap: 'wrap' }}>
            {current?.taboo.map(t => (
              <span key={t} style={{
                padding: '4px 10px', borderRadius: 20,
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)',
                fontSize: 12, fontWeight: 600, color: '#FC8181',
                textDecoration: 'line-through',
              }}>
                🚫 {t}
              </span>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10, width: '100%' }}>
          <button
            onClick={handleSkip}
            style={{
              flex: 1, padding: '18px 10px', borderRadius: 14,
              background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
              color: '#FC8181', fontSize: 22, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.1s',
            }}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onPointerUp={e => e.currentTarget.style.transform = ''}
            onPointerLeave={e => e.currentTarget.style.transform = ''}
          >
            ✗ <span style={{ fontSize: 13 }}>Skip</span>
          </button>
          <button
            onClick={handleCorrect}
            style={{
              flex: 2, padding: '18px 10px', borderRadius: 14,
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              color: 'var(--alias-primary)', fontSize: 22, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.1s',
            }}
            onPointerDown={e => e.currentTarget.style.transform = 'scale(0.95)'}
            onPointerUp={e => e.currentTarget.style.transform = ''}
            onPointerLeave={e => e.currentTarget.style.transform = ''}
          >
            ✓ <span style={{ fontSize: 13 }}>Got it!</span>
          </button>
        </div>

        <p style={{ color: 'var(--text-muted)', fontSize: 11, textAlign: 'center' }}>
          {wordIdx + 1} / {words.length} words
        </p>
      </div>
    </div>
  )
}

function AliasTurnResult({ lastScore, teamIdx, scores, onNext }) {
  const scoringTeam = 1 - teamIdx // the team that just played (we swapped)
  // Actually teamIdx passed is the team that just played's index
  return (
    <div className="screen slide-up" style={{ justifyContent: 'center', alignItems: 'center', gap: 24, padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 64 }}>{lastScore >= 5 ? '🔥' : lastScore >= 3 ? '👍' : '😬'}</div>
      <div>
        <p style={{ color: TEAM_COLORS[teamIdx], fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          {TEAM_NAMES[teamIdx]} scored
        </p>
        <p style={{ fontSize: 52, fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--alias-primary)', marginBottom: 4 }}>
          +{lastScore}
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          {lastScore === 0 ? 'Tough round!' : lastScore >= 5 ? 'Crushing it!' : 'Nice work!'}
        </p>
      </div>
      {/* Scoreboard */}
      <div style={{ display: 'flex', gap: 16 }}>
        {scores.map((s, i) => (
          <div key={i} style={{
            padding: '12px 20px', borderRadius: 12,
            background: `${TEAM_COLORS[i]}12`, border: `1px solid ${TEAM_COLORS[i]}30`,
            textAlign: 'center',
          }}>
            <div style={{ color: TEAM_COLORS[i], fontSize: 28, fontWeight: 900 }}>{s}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 11, marginTop: 2 }}>{TEAM_NAMES[i]}</div>
          </div>
        ))}
      </div>
      <div style={{ color: 'var(--text-muted)', fontSize: 12 }}>First to {WIN_SCORE} wins</div>
      <button className="btn btn-alias" style={{ maxWidth: 280 }} onClick={onNext}>
        Next Team's Turn →
      </button>
    </div>
  )
}

function AliasWinner({ winner, teams, scores, onRestart, onExit }) {
  return (
    <div className="screen slide-up" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center', minHeight: '100%', justifyContent: 'center' }}>
        <div style={{ fontSize: 72 }}>🏆</div>
        <div>
          <p style={{ color: TEAM_COLORS[winner], fontSize: 12, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
            Winner!
          </p>
          <h2 style={{ fontSize: 32, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
            {TEAM_EMOJIS[winner]} {TEAM_NAMES[winner]}
          </h2>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            {teams[winner].map(p => (
              <span key={p.id} style={{ fontSize: 15, fontWeight: 600 }}>{p.avatar} {p.name}</span>
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          {scores.map((s, i) => (
            <div key={i} style={{
              padding: '14px 22px', borderRadius: 14,
              background: `${TEAM_COLORS[i]}12`, border: `1px solid ${TEAM_COLORS[i]}30`,
              textAlign: 'center',
            }}>
              <div style={{ color: TEAM_COLORS[i], fontSize: 32, fontWeight: 900 }}>{s}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{TEAM_NAMES[i]}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
          <button className="btn btn-alias" onClick={onRestart}>Play Again</button>
          <button className="btn btn-ghost" onClick={onExit}>Home</button>
        </div>
      </div>
    </div>
  )
}
