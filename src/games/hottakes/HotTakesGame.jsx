import { useState } from 'react'
import { PLAYER_PRESETS } from '../../data/presets'

const AVATARS = ['🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦋','🦄','🐙','🦀','🐠','🐢','🦜','🦩','🐝','🐞','🦕','🦑','🐬','🦔']

const TOPICS = [
  "Pineapple on pizza",
  "The best decade for music",
  "Is cereal a soup?",
  "Cats vs dogs",
  "The most overrated movie of all time",
  "Remote work vs the office",
  "Is Die Hard a Christmas movie?",
  "The best social media platform right now",
  "Who pays on the first date?",
  "The most useless thing you learn in school",
  "Morning people are insufferable",
  "The best fast food chain",
  "TikTok vs YouTube vs Instagram",
  "Is a hot dog a sandwich?",
  "The most overrated travel destination",
  "The best way to spend a day off",
  "Introvert or extrovert — which has it better?",
  "The most overrated musician or band",
  "Is astrology real?",
  "The best streaming service",
  "Phone calls vs texting",
  "Reclining your airplane seat: rude or your right?",
  "The worst personality trait a person can have",
  "The most overrated food",
  "Books vs movies — which is better?",
  "The best superhero of all time",
  "Reality TV is destroying society",
  "The biggest red flag on a first date",
  "The most underrated thing in life",
  "Going out vs staying in",
  "The most annoying type of person at work or school",
  "The worst trend of the last decade",
  "Money or passion — which matters more?",
  "The most overhyped thing right now",
  "The best age to be",
  "The worst genre of music",
  "What actually makes someone successful?",
  "The most controversial opinion about friendship",
  "The best fictional universe to live in",
  "Social media has done more harm than good",
  "The most important quality in a partner",
  "Cold weather vs hot weather",
  "The most iconic meal of the day",
  "Cancel culture: fair or too far?",
  "The best holiday of the year",
  "The most overrated life advice people give",
  "Is jealousy ever healthy in a relationship?",
  "The worst thing about modern dating",
  "The most annoying thing people do at concerts",
  "Should you always tell the truth even if it hurts?",
  "The most overrated type of holiday",
  "Night owls vs early birds: which is superior?",
  "Is it ever okay to ghost someone?",
  "The best video game of all time",
  "The most useless invention ever created",
  "The worst type of social media user",
  "Should school uniforms exist?",
  "The best decade to have grown up in",
  "The most underrated movie genre",
  "Is working from home better or worse for society?",
  "The most annoying phrase people overuse",
  "Online friends vs real-life friends: which matters more?",
  "The most overrated sport to watch",
  "What ruins a movie more: bad acting or a bad plot?",
  "The worst trend in fashion right now",
  "Is it rude to be on your phone during a meal?",
  "The most underrated snack food",
  "Should people split bills equally on dates?",
  "The most iconic rivalry in history",
  "The worst thing you can put on a pizza",
  "City life vs village life: which wins?",
  "The most annoying type of person at a party",
  "Is it okay to have a favourite child?",
  "The best animated movie ever made",
  "The most overrated health trend of the decade",
  "Should you always follow your passion as a career?",
  "The best thing that happened to society in the last 20 years",
  "The worst thing that happened to society in the last 20 years",
  "The most overrated personality trait people glorify",
]

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

export default function HotTakesGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [topics, setTopics] = useState([])
  const [roundIdx, setRoundIdx] = useState(0)
  const [maxRounds, setMaxRounds] = useState(3)
  const [submitIdx, setSubmitIdx] = useState(0)
  const [submissions, setSubmissions] = useState([])
  const [chosenSub, setChosenSub] = useState(null)
  const [votes, setVotes] = useState({})
  const [selected, setSelected] = useState(null)
  const [scores, setScores] = useState({})

  const currentTopic = topics[roundIdx]
  const authorPlayer = chosenSub ? players.find(p => p.id === chosenSub.playerId) : null
  const nonAuthors = players.filter(p => p.id !== chosenSub?.playerId)
  const allVoted = nonAuthors.every(p => votes[p.id] !== undefined)

  function startGame(names, rounds) {
    const ps = names.map((n, i) => ({ id: i, name: n, avatar: AVATARS[i % AVATARS.length] }))
    setPlayers(ps)
    setTopics(shuffle(TOPICS))
    setMaxRounds(Math.min(rounds, TOPICS.length))
    setScores(Object.fromEntries(ps.map(p => [p.id, 0])))
    setRoundIdx(0)
    setSubmissions([])
    setChosenSub(null)
    setSubmitIdx(0)
    setVotes({})
    setSelected(null)
    setPhase('topicReveal')
  }

  function handleSubmit(text) {
    const sub = { playerId: players[submitIdx].id, text }
    const newSubs = [...submissions, sub]
    setSubmissions(newSubs)
    if (submitIdx + 1 >= players.length) {
      const chosen = newSubs[cryptoRand(newSubs.length)]
      setChosenSub(chosen)
      setVotes({})
      setSelected(null)
      setPhase('voteReveal')
    } else {
      setSubmitIdx(i => i + 1)
      setPhase('submitCover')
    }
  }

  function castVote(voterId, guessedId) {
    setVotes(v => ({ ...v, [voterId]: guessedId }))
    setSelected(null)
  }

  function resolveRound() {
    const authorId = chosenSub.playerId
    const newScores = { ...scores }
    nonAuthors.forEach(p => {
      if (votes[p.id] === authorId) {
        newScores[p.id] = (newScores[p.id] || 0) + 1
      } else {
        newScores[authorId] = (newScores[authorId] || 0) + 1
      }
    })
    setScores(newScores)
    setPhase('reveal')
  }

  function nextRound() {
    const next = roundIdx + 1
    if (next >= maxRounds) {
      setPhase('scores')
    } else {
      setRoundIdx(next)
      setSubmissions([])
      setChosenSub(null)
      setSubmitIdx(0)
      setVotes({})
      setSelected(null)
      setPhase('topicReveal')
    }
  }

  if (phase === 'setup') return <HTSetup onExit={onExit} onStart={startGame} />
  if (phase === 'topicReveal') return <HTTopicReveal topic={currentTopic} round={roundIdx} total={maxRounds} onReady={() => setPhase('submitCover')} />
  if (phase === 'submitCover') return <HTSubmitCover player={players[submitIdx]} idx={submitIdx} total={players.length} onReady={() => setPhase('submit')} />
  if (phase === 'submit') return <HTSubmit player={players[submitIdx]} topic={currentTopic} onSubmit={handleSubmit} />
  if (phase === 'voteReveal') return <HTVoteReveal chosenSub={chosenSub} topic={currentTopic} onReady={() => setPhase('vote')} />
  if (phase === 'vote') return (
    <HTVote
      players={players}
      chosenSub={chosenSub}
      votes={votes}
      selected={selected}
      setSelected={setSelected}
      onVote={castVote}
      onResolve={resolveRound}
      allVoted={allVoted}
    />
  )
  if (phase === 'reveal') return (
    <HTReveal
      players={players}
      chosenSub={chosenSub}
      votes={votes}
      author={authorPlayer}
      scores={scores}
      onNext={nextRound}
      isLast={roundIdx + 1 >= maxRounds}
    />
  )
  if (phase === 'scores') return <HTScores players={players} scores={scores} onRestart={() => startGame(players.map(p => p.name), maxRounds)} onExit={onExit} />
  return null
}

// ── Setup ──
function HTSetup({ onExit, onStart }) {
  const [names, setNames] = useState(['', ''])
  const [rounds, setRounds] = useState(3)
  const validNames = names.filter(n => n.trim())
  const canStart = validNames.length >= 3

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">🌶️ Hot Takes</span>
      </div>
      <div className="section">
        <p className="text-muted text-sm">Add players (min 3). Everyone submits a hot take — one is chosen and you guess who wrote it.</p>

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

        <div className="card" style={{ borderColor: 'var(--ht-border)', background: 'var(--ht-surface)' }}>
          <p className="section-title" style={{ marginBottom: 12 }}>Rounds</p>
          <div style={{ display: 'flex', gap: 8 }}>
            {[3, 5, 7].map(r => (
              <button key={r} onClick={() => setRounds(r)} style={{
                flex: 1, padding: '11px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
                fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
                border: rounds === r ? '1px solid var(--ht-border)' : '1px solid var(--border)',
                background: rounds === r ? 'rgba(234,88,12,0.12)' : 'var(--surface)',
                color: rounds === r ? 'var(--ht-accent)' : 'var(--text-muted)',
                transition: 'all 0.15s',
              }}>
                {r}
              </button>
            ))}
          </div>
        </div>

        {!canStart && <p className="text-muted text-sm text-center">Need at least 3 players</p>}
        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-ht" onClick={() => onStart(validNames, rounds)} disabled={!canStart}>
            🌶️ Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Topic Reveal ──
function HTTopicReveal({ topic, round, total, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}>
      <div>
        <p style={{ color: 'var(--ht-accent)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 16, textAlign: 'center' }}>
          Round {round + 1} of {total}
        </p>
        <div style={{ fontSize: 64, textAlign: 'center', marginBottom: 16, filter: 'drop-shadow(0 8px 32px rgba(234,88,12,0.35))' }}>🌶️</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center', marginBottom: 12 }}>The topic is</p>
        <p style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', textAlign: 'center', lineHeight: 1.3 }}>{topic}</p>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Tap to start submitting</p>
    </div>
  )
}

// ── Submit Cover ──
function HTSubmitCover({ player, idx, total, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}>
      <div style={{ fontSize: 64, filter: 'drop-shadow(0 8px 32px rgba(234,88,12,0.3))' }}>🤔</div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {player?.name}'s turn
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pass the phone to {player?.name}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>Submit your hot take privately</p>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>{idx + 1} / {total}</p>
    </div>
  )
}

// ── Submit Hot Take ──
function HTSubmit({ player, topic, onSubmit }) {
  const [text, setText] = useState('')

  return (
    <div className="screen fade-in">
      <div className="header">
        <span className="header-title">🌶️ {player?.name}'s Hot Take</span>
      </div>
      <div className="section">
        <div className="card" style={{ borderColor: 'var(--ht-border)', background: 'var(--ht-surface)', textAlign: 'center' }}>
          <p style={{ color: 'var(--ht-accent)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Topic</p>
          <p style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.4 }}>{topic}</p>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Give your most controversial, unexpected, or hilarious hot take on this topic.
        </p>

        <textarea
          className="input"
          placeholder="Type your hot take..."
          value={text}
          onChange={e => setText(e.target.value)}
          maxLength={150}
          style={{ minHeight: 100, resize: 'none', fontFamily: 'var(--font-body)', lineHeight: 1.6 }}
          autoFocus
        />
        <p style={{ color: 'var(--text-muted)', fontSize: 11, textAlign: 'right' }}>{text.length}/150</p>

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-ht" onClick={() => onSubmit(text.trim())} disabled={!text.trim()}>
            Submit →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Vote Reveal (show the chosen hot take) ──
function HTVoteReveal({ chosenSub, topic, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}>
      <div style={{ fontSize: 64, filter: 'drop-shadow(0 8px 32px rgba(234,88,12,0.35))' }}>🎲</div>
      <div style={{ width: '100%', maxWidth: 340 }}>
        <p style={{ color: 'var(--ht-accent)', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center', marginBottom: 16 }}>
          A hot take was chosen
        </p>
        <div style={{
          background: 'var(--ht-surface)',
          border: '1px solid var(--ht-border)',
          borderRadius: 'var(--radius)',
          padding: '20px 24px',
          boxShadow: '0 4px 40px rgba(234,88,12,0.12)',
        }}>
          <p style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.55, textAlign: 'center' }}>
            "{chosenSub?.text}"
          </p>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, textAlign: 'center', marginTop: 16 }}>
          Who wrote this? Tap to start voting.
        </p>
      </div>
    </div>
  )
}

// ── Vote (guess who wrote it) ──
function HTVote({ players, chosenSub, votes, selected, setSelected, onVote, onResolve, allVoted }) {
  return (
    <div className="screen">
      <div className="header">
        <span style={{ fontSize: 20 }}>🕵️</span>
        <span className="header-title">Who wrote this?</span>
      </div>
      <div className="section">
        <div style={{
          background: 'var(--ht-surface)',
          border: '1px solid var(--ht-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '16px 18px',
          boxShadow: '0 2px 20px rgba(234,88,12,0.08)',
        }}>
          <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.55, fontStyle: 'italic', color: 'var(--text)' }}>
            "{chosenSub?.text}"
          </p>
        </div>

        <p className="text-muted text-sm">
          Each player taps their name, then votes. {Object.keys(votes).length}/{players.filter(p => p.id !== chosenSub?.playerId).length} voted.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {players.map(voter => {
            const isAuthor = voter.id === chosenSub?.playerId
            const hasVoted = votes[voter.id] !== undefined
            const isOpen = selected === voter.id
            const votedFor = hasVoted ? players.find(p => p.id === votes[voter.id]) : null

            return (
              <div key={voter.id}>
                <button
                  onClick={() => !hasVoted && !isAuthor && setSelected(isOpen ? null : voter.id)}
                  style={{
                    width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '12px 14px',
                    background: isOpen ? 'rgba(234,88,12,0.08)' : 'var(--surface)',
                    border: isOpen ? '1px solid var(--ht-border)' : '1px solid var(--border)',
                    borderRadius: 'var(--radius-sm)',
                    cursor: hasVoted || isAuthor ? 'default' : 'pointer',
                    transition: 'all 0.15s',
                    opacity: isAuthor ? 0.4 : 1,
                    fontFamily: 'var(--font-body)',
                    color: 'var(--text)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{voter.avatar}</span>
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{voter.name}</span>
                  </div>
                  {isAuthor ? (
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>skips</span>
                  ) : hasVoted ? (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>→ {votedFor?.name}</span>
                  ) : (
                    <span style={{ fontSize: 11, color: 'var(--ht-accent)', fontWeight: 700 }}>tap to vote</span>
                  )}
                </button>

                {isOpen && !hasVoted && !isAuthor && (
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6,
                    padding: '8px 0 4px 16px',
                    animation: 'fadeIn 0.2s ease-out',
                  }}>
                    {players.filter(p => p.id !== voter.id).map(target => (
                      <button key={target.id}
                        onClick={() => onVote(voter.id, target.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 8,
                          padding: '10px 12px',
                          background: 'rgba(234,88,12,0.06)',
                          border: '1px solid rgba(234,88,12,0.15)',
                          borderRadius: 'var(--radius-xs)',
                          cursor: 'pointer',
                          fontFamily: 'var(--font-body)',
                          color: 'var(--text)',
                          fontSize: 13,
                          transition: 'all 0.12s',
                        }}
                      >
                        <span style={{ fontSize: 16 }}>{target.avatar}</span>
                        <span style={{ fontWeight: 600 }}>{target.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-ht" onClick={onResolve} disabled={!allVoted}>
            Reveal →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Reveal ──
function HTReveal({ players, chosenSub, votes, author, scores, onNext, isLast }) {
  const correctGuessers = players.filter(p => p.id !== author?.id && votes[p.id] === author?.id)
  const fooled = correctGuessers.length === 0

  return (
    <div className="screen slide-up" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ fontSize: 64, marginBottom: 12 }}>{fooled ? '😈' : '🎯'}</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 6 }}>
            {fooled ? `${author?.name} fooled everyone!` : `${author?.name} was caught!`}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            {author?.avatar} {author?.name} wrote it
          </p>
        </div>

        <div style={{
          background: 'var(--ht-surface)',
          border: '1px solid var(--ht-border)',
          borderRadius: 'var(--radius)',
          padding: '20px 22px',
          boxShadow: '0 4px 32px rgba(234,88,12,0.1)',
        }}>
          <p style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.55, fontStyle: 'italic', textAlign: 'center' }}>
            "{chosenSub?.text}"
          </p>
        </div>

        <div className="card">
          <p className="section-title" style={{ marginBottom: 12 }}>Who voted for who</p>
          {players.filter(p => p.id !== author?.id).map(p => {
            const guessed = players.find(g => g.id === votes[p.id])
            const correct = votes[p.id] === author?.id
            return (
              <div key={p.id} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 0',
                borderBottom: '1px solid var(--border)',
                fontSize: 14,
              }}>
                <span style={{ fontWeight: 600 }}>{p.avatar} {p.name}</span>
                <span style={{ color: correct ? '#10B981' : 'var(--text-muted)', fontWeight: 600, fontSize: 13 }}>
                  {correct ? '✓ ' : '✗ '}{guessed?.name ?? '–'}
                </span>
              </div>
            )
          })}
        </div>

        <div className="card">
          <p className="section-title" style={{ marginBottom: 12 }}>Scores</p>
          {[...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0)).map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '8px 0',
              borderBottom: i < players.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 12, width: 16 }}>{i + 1}</span>
              <span style={{ fontSize: 18 }}>{p.avatar}</span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{p.name}</span>
              <span style={{ fontWeight: 800, fontSize: 16, color: 'var(--ht-accent)' }}>{scores[p.id] || 0}</span>
            </div>
          ))}
        </div>

        <button className="btn btn-ht" onClick={onNext}>
          {isLast ? 'Final Scores →' : 'Next Round →'}
        </button>
      </div>
    </div>
  )
}

// ── Final Scores ──
function HTScores({ players, scores, onRestart, onExit }) {
  const sorted = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
  const winner = sorted[0]

  return (
    <div className="screen slide-up" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ fontSize: 72, marginBottom: 12 }}>🏆</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 6 }}>Game Over</h2>
          <p style={{ color: 'var(--ht-accent)', fontSize: 15, fontWeight: 700 }}>
            {winner?.avatar} {winner?.name} wins!
          </p>
        </div>

        <div className="card">
          {sorted.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 0',
              borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none',
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8,
                background: i === 0 ? 'rgba(234,88,12,0.2)' : 'var(--surface)',
                border: i === 0 ? '1px solid var(--ht-border)' : '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800,
                color: i === 0 ? 'var(--ht-accent)' : 'var(--text-muted)',
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 22 }}>{p.avatar}</span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{p.name}</span>
              <span style={{ fontWeight: 900, fontSize: 20, color: i === 0 ? 'var(--ht-accent)' : 'var(--text)' }}>
                {scores[p.id] || 0}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-ht" onClick={onRestart}>Play Again</button>
          <button className="btn btn-ghost" onClick={onExit}>Home</button>
        </div>
      </div>
    </div>
  )
}
