import { useState } from 'react'
import { PLAYER_PRESETS } from '../../data/presets'

const AVATARS = ['🐱','🐶','🦊','🐻','🐼','🐨','🐯','🦁','🐸','🐵','🦋','🦄','🐙','🦀','🐠','🐢','🦜','🦩','🐝','🐞','🦕','🦑','🐬','🦔']

const GENERAL_PROMPTS = [
  { a: 'Be able to fly', b: 'Be invisible' },
  { a: 'Always be 10 minutes late to everything', b: 'Always be 20 minutes early to everything' },
  { a: 'Give up social media forever', b: 'Give up Netflix & streaming forever' },
  { a: 'Have unlimited money but no true friends', b: 'Be broke but have amazing close friends' },
  { a: 'Speak every language fluently', b: 'Play every instrument perfectly' },
  { a: 'Always have to whisper', b: 'Always have to shout' },
  { a: 'Have legs as long as your fingers', b: 'Have fingers as long as your legs' },
  { a: 'Fight 1 horse-sized duck', b: 'Fight 100 duck-sized horses' },
  { a: 'Know exactly when you will die', b: 'Know exactly how you will die' },
  { a: 'Live your life 10 years in the past', b: 'Live your life 10 years in the future' },
  { a: 'Be the funniest person in every room', b: 'Be the smartest person in every room' },
  { a: 'Have a photographic memory', b: 'Be able to forget anything you want instantly' },
  { a: 'Eat the same meal every single day', b: 'Never eat the same meal twice in your life' },
  { a: 'Be incredibly famous but widely disliked', b: 'Be completely unknown but deeply loved by those close to you' },
  { a: 'Have your dream job with average pay', b: 'Have a boring job with incredible pay' },
  { a: 'Be able to read minds', b: 'See exactly 5 minutes into the future' },
  { a: 'Only communicate by singing', b: 'Only communicate by rhyming' },
  { a: 'Find your true love tomorrow', b: 'Win the lottery next week' },
  { a: 'Never need sleep again', b: 'Never feel physical pain again' },
  { a: 'Go back in time and change one thing', b: 'Jump to any point in the future once' },
  { a: 'Lose all memories from before age 18', b: 'Lose all memories from after age 18' },
  { a: 'Have free unlimited Wi-Fi everywhere', b: 'Have free unlimited food everywhere' },
  { a: 'Have skin that changes colour with your mood', b: 'Have a face that shows exactly what you\'re thinking' },
  { a: 'Only be able to move by hopping everywhere', b: 'Only be able to walk sideways like a crab' },
  { a: 'Always feel like you\'re being watched', b: 'Always feel like you\'re forgetting something important' },
  { a: 'Have no one show up to your wedding', b: 'Have no one show up to your funeral' },
  { a: 'Be able to talk to animals', b: 'Be able to speak all human languages' },
  { a: 'Live in a world with no music at all', b: 'Live in a world with no movies or TV' },
  { a: 'Never be able to use a phone again', b: 'Never be able to use a computer again' },
  { a: 'Always know when someone is lying to you', b: 'Always get away with any lie you tell' },
  { a: 'Hiccup every single time you laugh', b: 'Sneeze every time you hear music' },
  { a: 'Be 2 feet taller than you are now', b: 'Be 2 feet shorter than you are now' },
  { a: 'Have a superpower but you can never tell anyone', b: 'Be super famous but have no special abilities' },
  { a: 'Only watch one movie for the rest of your life', b: 'Only listen to one song for the rest of your life' },
  { a: 'Live in the city forever', b: 'Live in the countryside forever' },
  { a: 'Be a master chef', b: 'Be a master athlete' },
  { a: 'Have 10 decent friends', b: 'Have 1 incredible best friend for life' },
  { a: 'Be able to pause time for 1 hour per day', b: 'Be able to rewind time by 10 minutes once per week' },
  { a: 'Always feel cold no matter what', b: 'Always feel hot no matter what' },
  { a: 'Have a personal chef', b: 'Have a personal driver 24/7' },
  { a: 'Always trip on a flat surface once a day in public', b: 'Always accidentally call your teacher "mum" or "dad"' },
  { a: 'Have your dream holiday every year but travel alone', b: 'Go on a mediocre holiday every year with your best friends' },
  { a: 'Be able to teleport anywhere instantly', b: 'Be able to breathe underwater indefinitely' },
  { a: 'Have a dog that talks but only says mean things', b: 'Have a cat that\'s completely silent and ignores you forever' },
  { a: 'Know the answer to any question but never be believed', b: 'Always be believed but frequently be wrong' },
  { a: 'Wake up 5 years younger every morning', b: 'Wake up 5 years older every morning' },
  { a: 'Live in a world where everyone can hear your thoughts', b: 'Live in a world where you can hear everyone else\'s thoughts' },
  { a: 'Have to wear a clown costume every Monday', b: 'Have to speak in a fake accent every Friday' },
  { a: 'Be allergic to your favourite food', b: 'Be addicted to your least favourite food' },
  { a: 'Have no sense of taste', b: 'Have no sense of smell' },
  { a: 'Get lost every time you try to navigate somewhere', b: 'Always arrive exactly on time but never know how' },
  { a: 'Have your phone battery always at 1%', b: 'Have your phone always at 100% but with no signal ever' },
  { a: 'Be able to shrink to the size of an ant', b: 'Be able to grow to the size of a building' },
  { a: 'Have the ability to stop time but age normally while time is stopped', b: 'Live forever but time moves 10x faster around you' },
  { a: 'Have a butler who judges every life choice you make', b: 'Have a robot assistant who gets everything slightly wrong' },
  { a: 'Eat a lemon whole every morning', b: 'Eat a raw onion every night' },
]

const EXTREME_PROMPTS = [
  { a: 'Have your full search history shown to your parents', b: 'Have your last 100 texts shown to the person you like most' },
  { a: 'Find out your childhood best friend secretly hated you the whole time', b: 'Find out your current best friend has a crush on your partner' },
  { a: 'Have your most embarrassing memory played out loud at a family dinner', b: 'Have your most embarrassing photo sent to your entire school or workplace' },
  { a: 'Know how every person you\'ve ever loved truly feels about you deep down', b: 'Never know but spend your whole life wondering' },
  { a: 'Find out your entire personality is performed and not real', b: 'Find out your closest friends only hang out with you out of pity' },
  { a: 'Have your most toxic ex read every diary entry you\'ve ever written', b: 'Have your parents read your most dramatic text argument word for word' },
  { a: 'Spend a week locked in a room with your worst ex', b: 'Spend a week completely alone with no phone or contact with anyone' },
  { a: 'Be publicly humiliated once in front of 1000 strangers', b: 'Be mildly embarrassed every single day in front of coworkers or classmates for a year' },
  { a: 'Accidentally confess your real opinion of your boss while drunk at a work event', b: 'Accidentally blurt out your feelings to someone who definitely does not feel the same' },
  { a: 'Have to narrate your honest inner thoughts out loud for one full day', b: 'Have a stranger narrate your life out loud wherever you go for a week' },
  { a: 'Have your most cringe teenage phase photos go viral online', b: 'Have your most dramatic text argument published in a national newspaper' },
  { a: 'Never be able to feel romantic love again', b: 'Never be able to form a lasting deep friendship again' },
  { a: 'Have to rate every person you meet out of 10 out loud upon meeting them', b: 'Have every person rate you out of 10 out loud when they first see you' },
  { a: 'Have to bathe in public once a month', b: 'Use a public bathroom with a live studio audience once a week' },
  { a: 'Be caught doing something deeply embarrassing by your celebrity crush', b: 'Be caught doing something mildly embarrassing by your entire extended family at once' },
  { a: 'Accidentally send a screenshot of a roast chat about someone directly to that person', b: 'Accidentally mass-send a very personal voice note to every contact you have' },
  { a: 'Have a live laugh track play every time you do something embarrassing', b: 'Have a dramatic orchestral sting every time you enter a room' },
  { a: 'Find out someone has been keeping a detailed list of every bad thing you\'ve ever done', b: 'Find out someone has been keeping a journal about how boring they find you' },
  { a: 'Have your biggest secret exposed to everyone you know right now', b: 'Keep it forever but live in constant fear it could come out any second' },
  { a: 'Have to swap lives with the person you dislike most for a month', b: 'Have the person you dislike most move in with you for two weeks' },
  { a: 'Find out you\'ve been the villain in multiple people\'s stories without knowing', b: 'Find out someone has been pretending to be your close friend for years with an ulterior motive' },
  { a: 'Have everything you\'ve ever said behind someone\'s back revealed to them', b: 'Have everything everyone\'s ever said behind YOUR back revealed to you' },
  { a: 'Only ever date people who are completely wrong for you but feel perfect', b: 'Only ever date people who are perfectly right for you but feel completely boring' },
  { a: 'Lose all your money but keep all your friends and relationships', b: 'Become incredibly wealthy but have every close relationship in your life fall apart' },
  { a: 'Be told a brutal honest truth about yourself by a stranger every morning', b: 'Never receive honest feedback from anyone ever again no matter what' },
  { a: 'Have your most recent 3am thoughts broadcast to everyone who knows you', b: 'Have your most recent dream described in detail to your family at breakfast' },
  { a: 'Find out the person you trust most has been subtly manipulating you for years', b: 'Find out you have been unknowingly and subtly manipulating the people you love' },
  { a: 'Have to tell every new person you meet your most embarrassing secret within the first minute', b: 'Have a stranger who knows all your secrets follow you silently everywhere for a month' },
  { a: 'Go back and re-live your most regrettable moment fully conscious of what\'s happening', b: 'Be forced to watch a highlight reel of all your most regrettable moments in front of everyone you know' },
  { a: 'Have a live Twitter thread of your every petty thought for one week', b: 'Have every passive aggressive thing you\'ve ever texted read aloud at a dinner party' },
  { a: 'Have to describe your last situationship to your grandparents in full detail', b: 'Have your grandparents describe their most intimate memory to you in full detail' },
  { a: 'Find out someone in this room has been venting about you to mutual friends for months', b: 'Find out someone in this room finds you deeply annoying but has never said anything' },
  { a: 'Have to send a voice note to your ex right now explaining why you broke up, with everyone listening', b: 'Have your ex send a voice note to everyone in this room explaining why they broke up with you' },
  { a: 'Go one full year without lying about anything no matter how awkward', b: 'Have every lie you told in the last year revealed to the exact people you told them to' },
  { a: 'Have your most unhinged 2am impulse purchase history shown to everyone here', b: 'Have your camera roll from 3 years ago projected on a screen for everyone to scroll through' },
  { a: 'Find out you\'re the least funny person in your friend group and everyone just laughs to be nice', b: 'Find out you\'re the one everyone subtly leaves out of plans when you\'re not looking' },
  { a: 'Have to read aloud your most embarrassing text chain to everyone in this room right now', b: 'Have someone else in the room pick a random text chain from your phone and read it aloud' },
  { a: 'Accidentally like a 3-year-old Instagram photo of someone you\'re not supposed to be thinking about', b: 'Have someone screenshot your profile and post it to a group chat you\'re also in' },
  { a: 'Have everyone in this room rank you by attractiveness right now', b: 'Have everyone in this room rank you by how much they genuinely enjoy your company' },
  { a: 'Find out your closest friend has been secretly judging a life choice you\'re really proud of', b: 'Find out someone you barely know has a parasocial obsession with your life and knows everything about you' },
  { a: 'Have to confess your pettiest thought about someone in this room out loud', b: 'Have everyone in this room confess their pettiest thought about you' },
  { a: 'Have your phone screen time report shown to everyone here', b: 'Have your Spotify listening history from the past month shown to everyone here' },
  { a: 'Date someone who is deeply in love with you but you feel nothing for', b: 'Be deeply in love with someone who only kind of likes you back' },
  { a: 'Have everyone in this room know your body count', b: 'Have everyone in this room know your monthly spending habits in full detail' },
  { a: 'Send a risky text to the last person you were talking about behind their back right now', b: 'Call the last person you vented about and let everyone in the room listen' },
  { a: 'Have your most embarrassing autocorrect fail sent to your entire contact list', b: 'Have your most embarrassing Google search autofill shown on a billboard in your hometown' },
  { a: 'Have to swap phones with the person in this room you trust least for 24 hours', b: 'Have to give one person in this room full access to your email for a week' },
  { a: 'Find out the group chat without you is mostly positive but occasionally brutal', b: 'Find out there is no group chat without you because nobody talks about you at all' },
  { a: 'Have to describe your current biggest personal insecurity to the group right now', b: 'Have the group guess your biggest personal insecurity and see how close they are' },
  { a: 'Say one completely honest thing to every person in this room right now with no filter', b: 'Have every person in this room say one completely honest thing to you with no filter' },
  { a: 'Have everyone here find out who you\'ve had a crush on in the last 12 months', b: 'Have everyone here find out who you\'ve genuinely disliked but pretended to like in the last 12 months' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function WouldYouRatherGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [prompts, setPrompts] = useState([])
  const [promptIdx, setPromptIdx] = useState(0)
  const [picks, setPicks] = useState({}) // {playerId: 'A'|'B'}
  const [votingIdx, setVotingIdx] = useState(0)
  const [mode, setMode] = useState('general')

  function startGame(names, selectedMode) {
    const ps = names.map((name, i) => ({ id: i, name, avatar: AVATARS[i % AVATARS.length] }))
    const pool = selectedMode === 'extreme' ? EXTREME_PROMPTS : GENERAL_PROMPTS
    setPlayers(ps)
    setMode(selectedMode)
    setPrompts(shuffle(pool))
    setPromptIdx(0)
    setPicks({})
    setVotingIdx(0)
    setPhase('prompt')
  }

  function startVoting() {
    setPicks({})
    setVotingIdx(0)
    setPhase('cover')
  }

  function handlePick(choice) {
    const newPicks = { ...picks, [players[votingIdx].id]: choice }
    setPicks(newPicks)
    if (votingIdx + 1 >= players.length) {
      setPhase('reveal')
    } else {
      setVotingIdx(i => i + 1)
      setPhase('cover')
    }
  }

  function nextPrompt() {
    if (promptIdx + 1 >= prompts.length) {
      setPhase('done')
    } else {
      setPromptIdx(i => i + 1)
      setPicks({})
      setVotingIdx(0)
      setPhase('prompt')
    }
  }

  const prompt = prompts[promptIdx]
  const aPlayers = players.filter(p => picks[p.id] === 'A')
  const bPlayers = players.filter(p => picks[p.id] === 'B')

  if (phase === 'setup') return <WYRSetup onExit={onExit} onStart={startGame} />
  if (phase === 'prompt') return <WYRPrompt prompt={prompt} idx={promptIdx} total={prompts.length} onStart={startVoting} onExit={onExit} mode={mode} />
  if (phase === 'cover') return <WYRCover player={players[votingIdx]} idx={votingIdx} total={players.length} onReady={() => setPhase('vote')} />
  if (phase === 'vote') return <WYRVote prompt={prompt} player={players[votingIdx]} onPick={handlePick} />
  if (phase === 'reveal') return <WYRReveal prompt={prompt} aPlayers={aPlayers} bPlayers={bPlayers} total={players.length} onNext={nextPrompt} isLast={promptIdx + 1 >= prompts.length} />
  if (phase === 'done') return <WYRDone onRestart={() => startGame(players.map(p => p.name), mode)} onExit={onExit} />
  return null
}

function WYRSetup({ onExit, onStart }) {
  const [names, setNames] = useState(['', ''])
  const [mode, setMode] = useState('general')
  const validNames = names.filter(n => n.trim())
  const canStart = validNames.length >= 2

  return (
    <div className="screen">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">🤔 Would You Rather</span>
      </div>
      <div className="section">
        <p className="text-muted text-sm">Add players. Everyone secretly votes, then all is revealed.</p>

        {/* Mode selector */}
        <div style={{ display: 'flex', gap: 8 }}>
          <button
            onClick={() => setMode('general')}
            style={{
              flex: 1, padding: '12px 10px', borderRadius: 12, border: '2px solid',
              borderColor: mode === 'general' ? 'var(--wyr-primary)' : 'var(--border)',
              background: mode === 'general' ? 'rgba(168,85,247,0.12)' : 'var(--surface)',
              color: mode === 'general' ? 'var(--wyr-primary)' : 'var(--text-secondary)',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s', textAlign: 'center',
            }}
          >
            😇 General<br />
            <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>Fun & harmless</span>
          </button>
          <button
            onClick={() => setMode('extreme')}
            style={{
              flex: 1, padding: '12px 10px', borderRadius: 12, border: '2px solid',
              borderColor: mode === 'extreme' ? '#ef4444' : 'var(--border)',
              background: mode === 'extreme' ? 'rgba(239,68,68,0.12)' : 'var(--surface)',
              color: mode === 'extreme' ? '#ef4444' : 'var(--text-secondary)',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
              transition: 'all 0.15s', textAlign: 'center',
            }}
          >
            🔥 Extreme<br />
            <span style={{ fontSize: 11, fontWeight: 500, opacity: 0.8 }}>Spicy & unhinged</span>
          </button>
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
          <button
            className="btn btn-wyr"
            onClick={() => onStart(validNames, mode)}
            disabled={!canStart}
            style={mode === 'extreme' ? { background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 20px rgba(239,68,68,0.35)' } : {}}
          >
            {mode === 'extreme' ? '🔥 Start Extreme Mode' : '🤔 Start Game'}
          </button>
        </div>
      </div>
    </div>
  )
}

function WYRPrompt({ prompt, idx, total, onStart, onExit, mode }) {
  const isExtreme = mode === 'extreme'
  const accent = isExtreme ? '#ef4444' : 'var(--wyr-accent)'
  const cardBg = isExtreme ? 'rgba(239,68,68,0.07)' : 'rgba(168,85,247,0.08)'
  const cardBorder = isExtreme ? 'rgba(239,68,68,0.2)' : 'rgba(168,85,247,0.2)'

  return (
    <div className="screen fade-in">
      <div className="header">
        <button className="back-btn" onClick={onExit}>←</button>
        <span className="header-title">{isExtreme ? '🔥' : '🤔'} Would You Rather</span>
        <span style={{ marginLeft: 'auto', color: accent, fontSize: 12, fontWeight: 700 }}>{idx + 1}/{total}</span>
      </div>
      <div className="section" style={{ justifyContent: 'center', alignItems: 'center', gap: 24, textAlign: 'center' }}>
        <p style={{ color: accent, fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          {isExtreme ? '🔥 Extreme Mode — Discuss, then vote secretly' : 'Discuss, then vote secretly'}
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
          <div style={{
            padding: '20px 22px', borderRadius: 14,
            background: cardBg, border: `1px solid ${cardBorder}`,
            fontSize: 18, fontWeight: 700, lineHeight: 1.4,
          }}>
            <span style={{ color: accent, fontWeight: 800, fontSize: 13, display: 'block', marginBottom: 8, letterSpacing: '0.06em' }}>A</span>
            {prompt?.a}
          </div>

          <div style={{ color: 'var(--text-muted)', fontWeight: 800, fontSize: 14 }}>OR</div>

          <div style={{
            padding: '20px 22px', borderRadius: 14,
            background: cardBg, border: `1px solid ${cardBorder}`,
            fontSize: 18, fontWeight: 700, lineHeight: 1.4,
          }}>
            <span style={{ color: accent, fontWeight: 800, fontSize: 13, display: 'block', marginBottom: 8, letterSpacing: '0.06em' }}>B</span>
            {prompt?.b}
          </div>
        </div>

        <div style={{ marginTop: 'auto', width: '100%' }}>
          <button
            className="btn btn-wyr"
            onClick={onStart}
            style={isExtreme ? { background: 'linear-gradient(135deg, #ef4444, #dc2626)', boxShadow: '0 4px 20px rgba(239,68,68,0.35)' } : {}}
          >
            Start Voting →
          </button>
        </div>
      </div>
    </div>
  )
}

function WYRCover({ player, idx, total, onReady }) {
  return (
    <div className="cover-screen" onClick={onReady}>
      <div style={{ fontSize: 72, filter: 'drop-shadow(0 8px 32px rgba(168,85,247,0.35))' }}>🤫</div>
      <div>
        <p style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>
          {player?.name}'s turn
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Pass the phone to {player?.name}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>Vote privately — no peeking!</p>
      </div>
      <p style={{ color: 'var(--text-muted)', fontSize: 12, fontWeight: 600 }}>{idx + 1} / {total}</p>
    </div>
  )
}

function WYRVote({ prompt, player, onPick }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="screen fade-in">
      <div className="header">
        <span className="header-title">🤫 {player?.name}'s Vote</span>
      </div>
      <div className="section" style={{ justifyContent: 'center', gap: 16 }}>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
          Which would you rather?
        </p>

        {[{ key: 'A', text: prompt?.a }, { key: 'B', text: prompt?.b }].map(({ key, text }) => (
          <button key={key}
            onClick={() => setSelected(key)}
            style={{
              padding: '20px 20px',
              background: selected === key ? 'rgba(168,85,247,0.15)' : 'var(--surface)',
              border: selected === key ? '2px solid var(--wyr-primary)' : '1px solid var(--border)',
              borderRadius: 14, color: 'var(--text)', fontSize: 16, fontWeight: 600,
              lineHeight: 1.5, textAlign: 'left', cursor: 'pointer', transition: 'all 0.15s',
              fontFamily: 'inherit', width: '100%',
              boxShadow: selected === key ? '0 0 0 1px var(--wyr-primary)' : 'none',
            }}
          >
            <span style={{ color: 'var(--wyr-accent)', fontWeight: 800, fontSize: 12, display: 'block', marginBottom: 6, letterSpacing: '0.08em' }}>
              {selected === key ? '✓ ' : ''}{key}
            </span>
            {text}
          </button>
        ))}

        <div style={{ marginTop: 'auto' }}>
          <button className="btn btn-wyr" onClick={() => onPick(selected)} disabled={!selected}>
            Lock In →
          </button>
        </div>
      </div>
    </div>
  )
}

function WYRReveal({ prompt, aPlayers, bPlayers, total, onNext, isLast }) {
  const aPercent = total > 0 ? Math.round((aPlayers.length / total) * 100) : 50
  const bPercent = 100 - aPercent

  return (
    <div className="screen slide-up">
      <div className="header">
        <span className="header-title">🎉 Results</span>
      </div>
      <div className="section" style={{ gap: 20 }}>
        {/* Split bar */}
        <div style={{ borderRadius: 12, overflow: 'hidden', display: 'flex', height: 12 }}>
          {aPercent > 0 && (
            <div style={{ flex: aPercent, background: 'var(--wyr-primary)', transition: 'flex 0.6s ease' }} />
          )}
          {bPercent > 0 && (
            <div style={{ flex: bPercent, background: 'rgba(168,85,247,0.2)', transition: 'flex 0.6s ease' }} />
          )}
        </div>

        {/* Options + who chose */}
        {[{ key: 'A', text: prompt?.a, players: aPlayers, percent: aPercent },
          { key: 'B', text: prompt?.b, players: bPlayers, percent: bPercent }].map(({ key, text, players: pl, percent }) => (
          <div key={key} style={{
            padding: '16px 18px', borderRadius: 14,
            background: pl.length > 0 ? 'rgba(168,85,247,0.08)' : 'var(--surface)',
            border: `1px solid ${pl.length > 0 ? 'rgba(168,85,247,0.25)' : 'var(--border)'}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: pl.length > 0 ? 10 : 0 }}>
              <div>
                <span style={{ color: 'var(--wyr-accent)', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', marginRight: 8 }}>{key}</span>
                <span style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.4 }}>{text}</span>
              </div>
              <span style={{ color: 'var(--wyr-primary)', fontWeight: 800, fontSize: 20, flexShrink: 0, marginLeft: 12 }}>{percent}%</span>
            </div>
            {pl.length > 0 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {pl.map(p => (
                  <span key={p.id} style={{
                    padding: '3px 10px', borderRadius: 20,
                    background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.2)',
                    fontSize: 12, fontWeight: 600,
                  }}>
                    {p.avatar} {p.name}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        <button className="btn btn-wyr" onClick={onNext} style={{ marginTop: 'auto' }}>
          {isLast ? 'That\'s a wrap!' : 'Next Question →'}
        </button>
      </div>
    </div>
  )
}

function WYRDone({ onRestart, onExit }) {
  return (
    <div className="screen slide-up" style={{ justifyContent: 'center', alignItems: 'center', gap: 24, padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 72 }}>🤔</div>
      <div>
        <h2 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 8 }}>Game Over!</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>Hope some interesting debates happened.</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: '100%', maxWidth: 320 }}>
        <button className="btn btn-wyr" onClick={onRestart}>Play Again</button>
        <button className="btn btn-ghost" onClick={onExit}>Home</button>
      </div>
    </div>
  )
}
