import { useState } from 'react'
import { PLAYER_PRESETS } from '../../data/presets'

const AVATARS = ['🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦋','🦄','🐙','🦀','🐠','🐢','🦜','🦩','🐝','🐞','🦕','🦑','🐬','🦔']

// ── Question bank ──────────────────────────────────────────────────────────
// type: 'open' = free text answer, 'choice' = pick from options
const QUESTIONS = [
  // ── Multiple choice ───────────────────────────────────────────────────────
  { q: "What's the best day of the week?", type: 'choice', options: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'] },
  { q: "Pick a season.", type: 'choice', options: ['Spring','Summer','Autumn','Winter'] },
  { q: "Best meal of the day?", type: 'choice', options: ['Breakfast','Lunch','Dinner','Midnight snack'] },
  { q: "You'd rather live near a…", type: 'choice', options: ['Beach','Mountain','Forest','City','Desert'] },
  { q: "Pick a superpower.", type: 'choice', options: ['Fly','Invisible','Time travel','Mind reading','Super strength','Teleport'] },
  { q: "Worst thing about Mondays?", type: 'choice', options: ['Waking up early','Going to work/school','The whole day','Weekend ending','Nothing — I like Mondays'] },
  { q: "Pick a pet.", type: 'choice', options: ['Dog','Cat','Fish','Bird','Rabbit','Reptile','None'] },
  { q: "Best way to spend a day off?", type: 'choice', options: ['Sleep in','Go out with friends','Binge TV/films','Go on an adventure','Do something productive','Eat lots of food'] },
  { q: "Which is scariest?", type: 'choice', options: ['Heights','Spiders','The dark','Deep water','Being alone','Failure'] },
  { q: "Choose a drink.", type: 'choice', options: ['Water','Coffee','Tea','Juice','Energy drink','Soft drink','Alcohol'] },
  { q: "Best pizza topping?", type: 'choice', options: ['Pepperoni','Cheese only','Chicken','Mushroom','Pineapple','Vegetables','BBQ'] },
  { q: "What would you be in a group project?", type: 'choice', options: ['The leader','The one who does everything','The ideas person','The one who disappears','The moral support','The presenter'] },
  { q: "Favourite type of movie?", type: 'choice', options: ['Horror','Comedy','Action','Romance','Thriller','Sci-fi','Animation'] },
  { q: "Pick a fast food chain.", type: 'choice', options: ["McDonald's",'KFC','Burger King','Subway','Pizza Hut','Dominos','Taco Bell'] },
  { q: "What kind of traveller are you?", type: 'choice', options: ['Planner','Winger','Beach bum','Explorer','Foodie tourist','Reluctant traveller'] },
  { q: "Your go-to comfort food?", type: 'choice', options: ['Noodles / pasta','Rice dishes','Fried food','Pizza','Ice cream','Soup','Bread / toast'] },
  { q: "If you were a school subject, you'd be…", type: 'choice', options: ['Maths','English','Science','History','PE','Art','Music'] },
  { q: "Which emoji best describes your personality?", type: 'choice', options: ['😂','😈','🥺','💀','🤔','✨','😴'] },
  { q: "Ideal party size?", type: 'choice', options: ['Just me alone','2–3 people','5–8 people','10–20 people','The bigger the better'] },
  { q: "What animal would you be?", type: 'choice', options: ['Lion','Dolphin','Wolf','Cat','Eagle','Bear','Octopus'] },
  { q: "Most important quality in a best friend?", type: 'choice', options: ['Loyal','Funny','Honest','Kind','Reliable','Adventurous','Non-judgemental'] },
  { q: "Pick a social media platform.", type: 'choice', options: ['Instagram','TikTok','Twitter / X','YouTube','Snapchat','Reddit','None'] },
  { q: "Best time to go to sleep?", type: 'choice', options: ['Before 10pm','10–11pm','11pm–midnight','12–1am','After 1am','No fixed time'] },
  { q: "Your love language?", type: 'choice', options: ['Words of affirmation','Quality time','Physical touch','Acts of service','Gift giving'] },
  { q: "Biggest personality flaw?", type: 'choice', options: ['Stubborn','Overthinks','Lazy','Impatient','Too honest','Too soft','Indecisive'] },
  { q: "Pick a holiday destination type.", type: 'choice', options: ['Beach resort','City trip','Mountain retreat','Road trip','Jungle / nature','Cultural / historical'] },
  { q: "What's your energy at 8am?", type: 'choice', options: ['Already productive','Slowly waking up','Barely functional','Still asleep','Depends on the day'] },
  { q: "If your life were a TV show genre, it would be…", type: 'choice', options: ['Comedy','Drama','Reality show','Thriller','Documentary','Soap opera','Sitcom'] },
  { q: "Worst household chore?", type: 'choice', options: ['Doing dishes','Vacuuming','Cleaning the bathroom','Laundry','Cooking','Taking out the bins','All of them'] },
  { q: "Which fictional world would you live in?", type: 'choice', options: ['Harry Potter','Star Wars','Marvel','Game of Thrones','The Sims','Avatar','Lord of the Rings'] },
  { q: "Pick a type of music for a road trip.", type: 'choice', options: ['Pop hits','Hip-hop','Rock','Chill vibes','80s classics','Whatever plays on shuffle','Silence'] },
  { q: "What's the first thing you do in the morning?", type: 'choice', options: ['Check phone','Shower','Eat breakfast','Lie there doing nothing','Exercise','Brush teeth','Make coffee'] },
  { q: "If you could only eat one cuisine forever?", type: 'choice', options: ['Italian','Japanese','Chinese','Indian','Mexican','American','Thai'] },
  { q: "How do you handle conflict?", type: 'choice', options: ['Confront it directly','Avoid it entirely','Stew quietly','Crack a joke','Talk it out calmly','Cry','Overthink it for days'] },
  { q: "Best thing about weekends?", type: 'choice', options: ['No alarm','Sleeping in','Seeing friends','Doing nothing','Going out','Catching up on stuff','Freedom'] },

  // ── Open / one-word answers ───────────────────────────────────────────────
  { q: "Name a country everyone wants to visit.", type: 'open' },
  { q: "Name a word that describes a good friend.", type: 'open' },
  { q: "Name something you find on every desk.", type: 'open' },
  { q: "Name a famous landmark.", type: 'open' },
  { q: "Name something you do when you're bored.", type: 'open' },
  { q: "Name an animal that's secretly terrifying.", type: 'open' },
  { q: "Name a thing people always lose.", type: 'open' },
  { q: "Name something you always have in your bag.", type: 'open' },
  { q: "Name a word that describes 2024.", type: 'open' },
  { q: "Name something people do on their phone in bed.", type: 'open' },
  { q: "Name a food that goes with everything.", type: 'open' },
  { q: "Name the first thing you'd buy if you won the lottery.", type: 'open' },
  { q: "Name something people secretly judge others for.", type: 'open' },
  { q: "Name a skill everyone wishes they had.", type: 'open' },
  { q: "Name something that makes a party better.", type: 'open' },
  { q: "Name a reason someone might quit their job.", type: 'open' },
  { q: "Name something you'd find in a teenager's room.", type: 'open' },
  { q: "Name a word to describe a bad date.", type: 'open' },
  { q: "Name something you'd grab if your house was on fire.", type: 'open' },
  { q: "Name a word to describe the perfect holiday.", type: 'open' },
  { q: "Name the most overrated thing in life.", type: 'open' },
  { q: "Name something that instantly ruins your mood.", type: 'open' },
  { q: "Name a habit most people are too embarrassed to admit.", type: 'open' },
  { q: "Name a word everyone overuses.", type: 'open' },
  { q: "Name the best invention of the last 50 years.", type: 'open' },
  { q: "Name a red flag on a first date.", type: 'open' },
  { q: "Name something you pretend to enjoy.", type: 'open' },
  { q: "Name the worst thing someone can do at a cinema.", type: 'open' },
  { q: "Name something that gets better with age.", type: 'open' },
  { q: "Name a word to describe a toxic person.", type: 'open' },
  { q: "Name something you'd find in every grandparent's house.", type: 'open' },
  { q: "Name a thing people always lie about on their CV.", type: 'open' },
  { q: "Name something people do to procrastinate.", type: 'open' },
  { q: "Name the best thing about being a child.", type: 'open' },
  { q: "Name something people spend too much money on.", type: 'open' },
  { q: "Name a thing people always say they'll do but never do.", type: 'open' },
  { q: "Name something that belongs in every kitchen.", type: 'open' },
  { q: "Name a word that describes Monday mornings.", type: 'open' },
  { q: "Name a famous person everyone seems to love.", type: 'open' },
  { q: "Name something that's more fun with other people.", type: 'open' },
  { q: "Name a thing people are obsessed with for no good reason.", type: 'open' },
  { q: "Name something you do when nobody's watching.", type: 'open' },
  { q: "Name the most annoying sound in the world.", type: 'open' },
  { q: "Name something that makes you feel instantly at home.", type: 'open' },
  { q: "Name a word that describes someone who talks too much.", type: 'open' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function HerdMentalityGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [questions, setQuestions] = useState([])
  const [qIdx, setQIdx] = useState(0)
  const [answers, setAnswers] = useState({}) // { playerId: answer }
  const [submitIdx, setSubmitIdx] = useState(0)
  const [scores, setScores] = useState({})
  const [roundResult, setRoundResult] = useState(null) // { majority, winners, losers }

  const currentQ = questions[qIdx]

  function startGame(names) {
    const ps = names.map((n, i) => ({ id: i, name: n, avatar: AVATARS[i % AVATARS.length] }))
    const qs = shuffle(QUESTIONS)
    setPlayers(ps)
    setQuestions(qs)
    setQIdx(0)
    setAnswers({})
    setSubmitIdx(0)
    setScores(Object.fromEntries(ps.map(p => [p.id, 0])))
    setRoundResult(null)
    setPhase('cover')
  }

  function handleAnswer(answer) {
    const newAnswers = { ...answers, [players[submitIdx].id]: answer }
    setAnswers(newAnswers)

    if (submitIdx + 1 >= players.length) {
      // All submitted — compute result
      const counts = {}
      Object.values(newAnswers).forEach(a => {
        const key = a.trim().toLowerCase()
        counts[key] = (counts[key] || 0) + 1
      })
      const maxCount = Math.max(...Object.values(counts))
      // majority = the answer(s) shared by the most people
      const majorityKeys = Object.keys(counts).filter(k => counts[k] === maxCount)

      const winners = []
      const losers = []
      players.forEach(p => {
        const key = newAnswers[p.id]?.trim().toLowerCase()
        if (majorityKeys.includes(key) && maxCount > 1) {
          winners.push(p)
        } else {
          losers.push(p)
        }
      })

      const newScores = { ...scores }
      winners.forEach(p => { newScores[p.id] = (newScores[p.id] || 0) + 1 })

      // Build grouped answer display
      const groups = {}
      players.forEach(p => {
        const raw = newAnswers[p.id]
        const key = raw?.trim().toLowerCase()
        if (!groups[key]) groups[key] = { display: raw, players: [] }
        groups[key].players.push(p)
      })

      setScores(newScores)
      setRoundResult({ majorityKeys, maxCount, groups, winners })
      setPhase('reveal')
    } else {
      setSubmitIdx(i => i + 1)
      setPhase('cover')
    }
  }

  function nextRound() {
    if (qIdx + 1 >= questions.length) {
      setPhase('done')
    } else {
      setQIdx(i => i + 1)
      setAnswers({})
      setSubmitIdx(0)
      setRoundResult(null)
      setPhase('cover')
    }
  }

  if (phase === 'setup') return <HMSetup onExit={onExit} onStart={startGame} />
  if (phase === 'cover') return <HMCover player={players[submitIdx]} idx={submitIdx} total={players.length} qNum={qIdx + 1} totalQ={questions.length} onReady={() => setPhase('answer')} />
  if (phase === 'answer') return <HMAnswer question={currentQ} player={players[submitIdx]} onSubmit={handleAnswer} />
  if (phase === 'reveal') return <HMReveal question={currentQ} result={roundResult} players={players} scores={scores} onNext={nextRound} isLast={qIdx + 1 >= questions.length} />
  if (phase === 'done') return <HMDone players={players} scores={scores} onRestart={() => startGame(players.map(p => p.name))} onExit={onExit} />
  return null
}

// ── Setup ──────────────────────────────────────────────────────────────────
function HMSetup({ onExit, onStart }) {
  const [names, setNames] = useState(['', ''])
  const validNames = names.filter(n => n.trim())
  const canStart = validNames.length >= 2

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">🐑 Herd Mentality</span>
      </div>
      <div className="section">
        <p className="text-muted text-sm">
          Everyone gets the same question. Match the majority answer to score. Unique answer? No points.
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

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-hm" onClick={() => onStart(validNames)} disabled={!canStart}>
            🐑 Start Game
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Cover (pass phone) ─────────────────────────────────────────────────────
function HMCover({ player, idx, total, qNum, totalQ, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}>
      <div style={{ fontSize: 72, filter: 'drop-shadow(0 8px 32px rgba(16,185,129,0.35))' }}>🐑</div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {player?.name}'s turn
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pass the phone to {player?.name}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>No peeking at others' answers!</p>
      </div>
      <div style={{ display: 'flex', gap: 16, color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>
        <span>Q {qNum} / {totalQ}</span>
        <span>·</span>
        <span>Player {idx + 1} / {total}</span>
      </div>
    </div>
  )
}

// ── Answer screen ──────────────────────────────────────────────────────────
function HMAnswer({ question, player, onSubmit }) {
  const [selected, setSelected] = useState(null)
  const [text, setText] = useState('')

  const isChoice = question?.type === 'choice'
  const canSubmit = isChoice ? selected !== null : text.trim().length > 0

  function submit() {
    onSubmit(isChoice ? selected : text.trim())
  }

  return (
    <div className="screen fade-in">
      <div className="header">
        <span className="header-title">🐑 {player?.name}'s Answer</span>
      </div>
      <div className="section" style={{ gap: 16 }}>

        {/* Question card */}
        <div style={{
          padding: '24px 22px',
          borderRadius: 16,
          background: 'rgba(16,185,129,0.08)',
          border: '1px solid rgba(16,185,129,0.2)',
          boxShadow: '0 4px 32px rgba(16,185,129,0.06)',
        }}>
          <p style={{
            color: '#10B981',
            fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
            letterSpacing: '0.12em', marginBottom: 12,
          }}>
            🐑 Think like the herd
          </p>
          <p style={{ fontSize: 20, fontWeight: 800, lineHeight: 1.4, letterSpacing: '-0.01em' }}>
            {question?.q}
          </p>
        </div>

        {/* Choice options */}
        {isChoice && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {question.options.map(opt => (
              <button
                key={opt}
                onClick={() => setSelected(opt)}
                style={{
                  padding: '15px 18px',
                  borderRadius: 12,
                  border: selected === opt ? '2px solid #10B981' : '1px solid var(--border)',
                  background: selected === opt ? 'rgba(16,185,129,0.12)' : 'var(--surface)',
                  color: selected === opt ? '#10B981' : 'var(--text)',
                  fontWeight: selected === opt ? 700 : 500,
                  fontSize: 15,
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.12s',
                  boxShadow: selected === opt ? '0 0 0 1px #10B981' : 'none',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}
              >
                <span style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: selected === opt ? '2px solid #10B981' : '1px solid var(--border)',
                  background: selected === opt ? '#10B981' : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, color: selected === opt ? '#000' : 'transparent',
                  fontWeight: 900,
                }}>✓</span>
                {opt}
              </button>
            ))}
          </div>
        )}

        {/* Open text */}
        {!isChoice && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: 12 }}>Keep it short — one or two words works best</p>
            <input
              className="input"
              placeholder="Your answer..."
              value={text}
              onChange={e => setText(e.target.value)}
              maxLength={40}
              autoFocus
              style={{ fontSize: 17, padding: '16px 18px' }}
              onKeyDown={e => e.key === 'Enter' && canSubmit && submit()}
            />
          </div>
        )}

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-hm" onClick={submit} disabled={!canSubmit}>
            Lock In →
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Reveal ─────────────────────────────────────────────────────────────────
function HMReveal({ question, result, players, scores, onNext, isLast }) {
  if (!result) return null
  const { majorityKeys, maxCount, groups, winners } = result

  const sortedGroups = Object.entries(groups).sort(([, a], [, b]) => b.players.length - a.players.length)
  const isMajority = (key) => majorityKeys.includes(key) && maxCount > 1

  const sorted = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))

  return (
    <div className="screen slide-up" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Result headline */}
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ fontSize: 56, marginBottom: 10 }}>
            {winners.length === players.length ? '🧠' : winners.length === 0 ? '🤯' : '🐑'}
          </div>
          <h2 style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 4 }}>
            {winners.length === players.length
              ? 'Perfect herd! Everyone matched!'
              : winners.length === 0
              ? 'No majority — nobody scores!'
              : `${winners.length} player${winners.length > 1 ? 's' : ''} matched the herd`}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.5 }}>{question?.q}</p>
        </div>

        {/* Answer groups */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {sortedGroups.map(([key, group]) => {
            const isWin = isMajority(key)
            return (
              <div key={key} style={{
                padding: '14px 16px',
                borderRadius: 14,
                border: `1px solid ${isWin ? 'rgba(16,185,129,0.35)' : 'var(--border)'}`,
                background: isWin ? 'rgba(16,185,129,0.08)' : 'var(--surface)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <span style={{
                    fontSize: 16, fontWeight: 800,
                    color: isWin ? '#10B981' : 'var(--text)',
                  }}>
                    {isWin && '✓ '}{group.display}
                  </span>
                  <span style={{
                    fontSize: 12, fontWeight: 700,
                    color: isWin ? '#10B981' : 'var(--text-muted)',
                    background: isWin ? 'rgba(16,185,129,0.15)' : 'var(--surface)',
                    padding: '3px 9px', borderRadius: 20,
                    border: `1px solid ${isWin ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
                  }}>
                    {group.players.length} {group.players.length === 1 ? 'player' : 'players'}
                    {isWin && ' · +1 pt'}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {group.players.map(p => (
                    <span key={p.id} style={{
                      padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                      background: isWin ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                      border: `1px solid ${isWin ? 'rgba(16,185,129,0.25)' : 'var(--border)'}`,
                      color: isWin ? '#6EE7B7' : 'var(--text-secondary)',
                    }}>
                      {p.avatar} {p.name}
                    </span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Leaderboard */}
        <div style={{
          borderRadius: 14, border: '1px solid var(--border)',
          background: 'var(--surface)', overflow: 'hidden',
        }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
            <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)' }}>
              Leaderboard
            </p>
          </div>
          {sorted.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 16px',
              borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none',
              background: winners.some(w => w.id === p.id) ? 'rgba(16,185,129,0.05)' : 'transparent',
            }}>
              <span style={{ color: 'var(--text-muted)', fontSize: 12, width: 16, flexShrink: 0 }}>{i + 1}</span>
              <span style={{ fontSize: 18 }}>{p.avatar}</span>
              <span style={{ flex: 1, fontWeight: 600, fontSize: 14 }}>{p.name}</span>
              {winners.some(w => w.id === p.id) && (
                <span style={{ fontSize: 11, color: '#10B981', fontWeight: 700, marginRight: 4 }}>+1</span>
              )}
              <span style={{ fontWeight: 800, fontSize: 18, color: scores[p.id] > 0 ? '#10B981' : 'var(--text-muted)' }}>
                {scores[p.id] || 0}
              </span>
            </div>
          ))}
        </div>

        <button className="btn btn-hm" onClick={onNext}>
          {isLast ? 'See Final Scores →' : 'Next Question →'}
        </button>
      </div>
    </div>
  )
}

// ── Done ───────────────────────────────────────────────────────────────────
function HMDone({ players, scores, onRestart, onExit }) {
  const sorted = [...players].sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0))
  const winner = sorted[0]
  const topScore = scores[winner?.id] || 0
  const tied = sorted.filter(p => (scores[p.id] || 0) === topScore)

  return (
    <div className="screen slide-up" style={{ overflow: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ textAlign: 'center', paddingTop: 8 }}>
          <div style={{ fontSize: 72, marginBottom: 12 }}>🐑</div>
          <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 6 }}>Game Over!</h2>
          <p style={{ color: '#10B981', fontSize: 15, fontWeight: 700 }}>
            {tied.length > 1
              ? `${tied.map(p => p.name).join(' & ')} tied with ${topScore} pts!`
              : `${winner?.avatar} ${winner?.name} wins with ${topScore} pts!`}
          </p>
        </div>

        <div style={{
          borderRadius: 14, border: '1px solid var(--border)',
          background: 'var(--surface)', overflow: 'hidden',
        }}>
          {sorted.map((p, i) => (
            <div key={p.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '14px 18px',
              borderBottom: i < sorted.length - 1 ? '1px solid var(--border)' : 'none',
              background: i === 0 ? 'rgba(16,185,129,0.07)' : 'transparent',
            }}>
              <span style={{
                width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                background: i === 0 ? 'rgba(16,185,129,0.2)' : 'var(--surface)',
                border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.4)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 800,
                color: i === 0 ? '#10B981' : 'var(--text-muted)',
              }}>{i + 1}</span>
              <span style={{ fontSize: 22 }}>{p.avatar}</span>
              <span style={{ flex: 1, fontWeight: 700, fontSize: 15 }}>{p.name}</span>
              <span style={{
                fontWeight: 900, fontSize: 22,
                color: i === 0 ? '#10B981' : 'var(--text)',
              }}>
                {scores[p.id] || 0}
              </span>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn btn-hm" onClick={onRestart}>Play Again</button>
          <button className="btn btn-ghost" onClick={onExit}>Home</button>
        </div>
      </div>
    </div>
  )
}
