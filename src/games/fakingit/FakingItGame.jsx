import { useState } from 'react'

const THEME = '#F97316'

const PACKS = [
  {
    id: 'personal',
    name: 'Personal',
    icon: '🙋',
    questions: [
      { real: "What's something you do every morning without fail?", fake: "What's something you do every night before bed?" },
      { real: "What's a food you secretly hate but pretend to enjoy?", fake: "What's a food most people love that you just don't understand?" },
      { real: "What's your go-to excuse when you don't want to hang out?", fake: "What's your go-to excuse when you're running late?" },
      { real: "What song do you sing loudly when you're completely alone?", fake: "What song always gets stuck in your head?" },
      { real: "What's something you've never told your parents?", fake: "What's something you've kept secret from a close friend?" },
      { real: "What's your most embarrassing recurring habit?", fake: "What's a weird thing you do when no one's watching?" },
      { real: "What's your biggest irrational fear?", fake: "What's something most people fear that doesn't bother you at all?" },
      { real: "What's something you're weirdly competitive about?", fake: "What's something you're surprisingly bad at?" },
      { real: "What's your most useless skill?", fake: "What's a random topic you know a surprising amount about?" },
      { real: "What's the last thing you cried about?", fake: "What's the last thing that genuinely upset you?" },
      { real: "What's a compliment you get that you secretly don't believe?", fake: "What's a compliment you wish people gave you more often?" },
      { real: "What do you actually think about on long car rides?", fake: "What do you daydream about most often?" },
      { real: "What's something everyone seems to enjoy that you just don't get?", fake: "What's a trend you never got into?" },
      { real: "How many unread messages do you currently have?", fakeRange: "10 to 500 messages", isNumeric: true },
      { real: "How many hours of sleep do you actually get most nights?", fakeRange: "5 to 9 hours", isNumeric: true },
      { real: "What's a compliment you always deflect but secretly love?", fake: "What's a compliment that genuinely makes you uncomfortable?" },
      { real: "What's a completely random thing you're proud of?", fake: "What's a totally random skill you've been meaning to learn?" },
      { real: "What's something you always forget no matter how many times you try to remember?", fake: "What's something you wish you could just forget?" },
      { real: "What do you do to cheer yourself up when you're in a bad mood?", fake: "What do you do when you want to be left alone?" },
      { real: "What's the most useless thing you know a lot about?", fake: "What's a subject you always pretend to know more about than you do?" },
      { real: "What's a tiny thing that can instantly make your day better?", fake: "What's a tiny thing that can ruin your entire day?" },
      { real: "What's something you've been meaning to do for years but keep putting off?", fake: "What's something you recently started doing that you should have started years ago?" },
      { real: "What's a completely irrational thing you still believe in?", fake: "What's a superstition you used to believe but eventually grew out of?" },
      { real: "What's a food you ate constantly as a child that you'd refuse to eat now?", fake: "What's a food you hated as a child but love now?" },
      { real: "How many alarms do you set in the morning?", fakeRange: "1 to 10 alarms", isNumeric: true },
    ],
  },
  {
    id: 'spicy',
    name: 'Spicy',
    icon: '🌶️',
    questions: [
      { real: "What's the pettiest reason you've cut off or distanced from someone?", fake: "What's the pettiest argument you've ever had with someone?" },
      { real: "What's the last white lie you told?", fake: "What's a lie you tell regularly to avoid drama?" },
      { real: "What's something you did that you've never apologized for?", fake: "What's something you've done that you still feel guilty about?" },
      { real: "What's the most rebellious thing you've ever done?", fake: "What's a rule you break regularly without guilt?" },
      { real: "What's your most embarrassing drunk story?", fake: "What's the most embarrassing thing you've done at a party?" },
      { real: "What's something you judge people for but secretly do yourself?", fake: "What's something you judge people for but have never actually tried?" },
      { real: "What's the shadiest thing you've ever done for money?", fake: "What's something questionable you've done to get ahead?" },
      { real: "What's something you did as a teenager you'd never admit to your parents?", fake: "What's a teenage memory you've tried to bury?" },
      { real: "What's a text you sent that you immediately regretted?", fake: "What's a message you drafted but never sent?" },
      { real: "What's the most dramatic breakup or fallout you've experienced?", fake: "What's the most dramatic relationship situation you've been involved in?" },
      { real: "What's something you've taken that wasn't yours?", fake: "What's the sneakiest thing you've ever done?" },
      { real: "What's a secret you've been keeping for over a year?", fake: "What's something you know about someone you've never told them?" },
      { real: "Who is someone you've completely cut out of your life?", fake: "Who is someone you've drastically changed your opinion of?" },
      { real: "How many people have you kissed?", fakeRange: "1 to 20 people", isNumeric: true },
      { real: "How many times have you called in sick when you weren't?", fakeRange: "0 to 10 times", isNumeric: true },
      { real: "What's a line you told yourself you'd never cross that you eventually crossed?", fake: "What's a boundary you set for yourself that you've actually managed to keep?" },
      { real: "What's the most embarrassing thing you've done completely sober?", fake: "What's the most embarrassing thing you've ever witnessed someone else do?" },
      { real: "What's the most attention-seeking thing you've ever done?", fake: "What's something you did that accidentally got way more attention than you wanted?" },
      { real: "What's something you know you should apologize for but haven't?", fake: "What's an apology you gave that you didn't actually mean?" },
      { real: "Who was the last person to genuinely surprise you, and how?", fake: "Who is someone you completely misjudged when you first met them?" },
      { real: "What's the most dramatic you've ever reacted to something small?", fake: "What's something big you handled surprisingly calmly?" },
      { real: "What's a version of yourself you're glad nobody sees anymore?", fake: "What's a phase or version of yourself you miss?" },
      { real: "What's something you've done just to prove a point that wasn't even worth proving?", fake: "What's a time you backed down from an argument even though you were right?" },
      { real: "What's the worst lie you've told someone you care about?", fake: "What's a lie you've told someone to protect them?" },
      { real: "How long is the longest you've gone without replying to someone on purpose?", fakeRange: "1 hour to 2 weeks", isNumeric: false },
    ],
  },
  {
    id: 'opinions',
    name: 'Hot Takes',
    icon: '🗣️',
    questions: [
      { real: "What's a movie everyone loves that you think is deeply overrated?", fake: "What's a movie you've pretended to watch but haven't?" },
      { real: "What's an opinion you hold that most people would strongly disagree with?", fake: "What's a popular opinion you secretly agree with but won't admit?" },
      { real: "What's life advice you think is actually terrible?", fake: "What's commonly accepted wisdom you think is mostly wrong?" },
      { real: "What's something society treats as normal that you find genuinely weird?", fake: "What's a social norm you quietly refuse to follow?" },
      { real: "Who is an objectively talented person you just can't stand?", fake: "Who is someone everyone idolizes that you just don't get the appeal of?" },
      { real: "What's a law or rule you think should not exist?", fake: "What's a rule everyone follows that you think is pointless?" },
      { real: "What's your most controversial hot take about relationships?", fake: "What's an unpopular opinion you have about modern dating?" },
      { real: "What's a genre of music you genuinely cannot understand the appeal of?", fake: "What's a musical artist everyone loves that you find overrated?" },
      { real: "What's something considered healthy that you think is actually bad for you?", fake: "What's a wellness trend you think is complete nonsense?" },
      { real: "What's something children are commonly taught that you think is wrong?", fake: "What's something from your upbringing you now think was bad advice?" },
      { real: "What's a major life milestone you think is overrated?", fake: "What's a life goal society pushes that you find meaningless?" },
      { real: "What's a city or country you'd never want to live in, despite its reputation?", fake: "What's a place everyone raves about that you were disappointed by?" },
      { real: "What's something about your own generation you're embarrassed by?", fake: "What's a stereotype about your generation you think is actually true?" },
      { real: "At what age do you think someone is genuinely 'old'?", fakeRange: "40 to 80 years old", isNumeric: true },
      { real: "How many close friends do you think a person actually needs?", fakeRange: "1 to 10 friends", isNumeric: true },
      { real: "What's an opinion about success that you think most people have completely wrong?", fake: "What's a common definition of success you actually agree with?" },
      { real: "What's a social norm around friendship that you think is toxic but nobody talks about?", fake: "What's something considered rude that you think is actually just honest?" },
      { real: "What's a piece of advice adults give young people that you think actively makes life worse?", fake: "What's unconventional advice you'd give to your younger self?" },
      { real: "What's something everyone says they value but almost nobody actually practises?", fake: "What's a value most people claim to have that you're genuinely sceptical about?" },
      { real: "What's something about your own generation that genuinely embarrasses you?", fake: "What's something older generations criticise your generation for that you actually agree with?" },
      { real: "What's a personality trait society rewards that you think is actually harmful?", fake: "What's a personality trait society punishes that you think is actually healthy?" },
      { real: "What's a hot take you have about social media that most people would find uncomfortable?", fake: "What's something you've personally changed your habits around because of social media?" },
      { real: "What's an opinion you have about money and happiness that goes against the mainstream?", fake: "What's something you've bought that genuinely did make you happier?" },
      { real: "What's something considered mature and responsible that you think is actually overrated?", fake: "What's something considered immature that you think has real merit?" },
      { real: "How long do you think it takes to know if someone will be in your life long-term?", fakeRange: "1 week to 5 years", isNumeric: false },
    ],
  },
]

// ── Shared cover screen ──────────────────────────────────────────────────────
function FICover({ name, action, onReady }) {
  return (
    <div style={{
      minHeight: '100dvh', background: '#000',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>
      <div style={{ fontSize: 56, marginBottom: 24 }}>🙈</div>
      <div style={{
        fontSize: 28, fontWeight: 700, color: 'rgba(235,235,245,0.92)',
        letterSpacing: '-0.02em', marginBottom: 8, textAlign: 'center',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
      }}>
        Pass to {name}
      </div>
      <div style={{
        fontSize: 16, color: 'rgba(235,235,245,0.4)', marginBottom: 48, textAlign: 'center',
      }}>
        Everyone else look away
      </div>
      <button
        onClick={onReady}
        style={{
          background: THEME, color: '#fff', border: 'none', borderRadius: 14,
          padding: '16px 40px', fontSize: 17, fontWeight: 600, cursor: 'pointer',
        }}
      >
        I'm ready →
      </button>
    </div>
  )
}

// ── Question + answer (combined) ─────────────────────────────────────────────
function FIQuestion({ name, questionText, onSubmit }) {
  const [revealed, setRevealed] = useState(false)
  const [text, setText] = useState('')

  if (!revealed) {
    return (
      <div style={{
        minHeight: '100dvh', background: '#000',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
      }}>
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ fontSize: 17, color: 'rgba(235,235,245,0.45)', marginBottom: 12 }}>{name}</div>
          <button
            onClick={() => setRevealed(true)}
            style={{
              background: '#1C1C1E', border: `1px solid ${THEME}40`,
              borderRadius: 20, padding: '20px 40px',
              fontSize: 17, fontWeight: 600, color: THEME,
              cursor: 'pointer', letterSpacing: '-0.01em',
            }}
          >
            Tap to see your question
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100dvh', background: '#000', display: 'flex', flexDirection: 'column',
      padding: 'max(52px, env(safe-area-inset-top, 52px)) 20px max(32px, env(safe-area-inset-bottom, 32px))',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', maxWidth: 440, margin: '0 auto', width: '100%' }}>
        <div style={{ fontSize: 14, color: 'rgba(235,235,245,0.4)', marginBottom: 16 }}>{name}</div>

        <div style={{
          background: '#1C1C1E', borderRadius: 16, padding: '20px',
          marginBottom: 20, borderLeft: `3px solid ${THEME}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(235,235,245,0.3)', letterSpacing: '0.05em', marginBottom: 8 }}>
            YOUR QUESTION
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'rgba(235,235,245,0.92)', lineHeight: 1.4 }}>
            {questionText}
          </div>
        </div>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type your answer..."
          autoFocus
          style={{
            background: '#1C1C1E',
            border: `1px solid ${text ? THEME + '60' : 'rgba(84,84,88,0.36)'}`,
            borderRadius: 14, padding: '16px',
            fontSize: 17, color: 'rgba(235,235,245,0.92)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            resize: 'none', minHeight: 100, width: '100%',
            outline: 'none', transition: 'border-color 0.15s ease', boxSizing: 'border-box',
          }}
        />
      </div>

      <div style={{ maxWidth: 440, margin: '0 auto', width: '100%' }}>
        <button
          onClick={() => text.trim() && onSubmit(text.trim())}
          disabled={!text.trim()}
          style={{
            background: text.trim() ? THEME : '#2C2C2E',
            color: text.trim() ? '#fff' : 'rgba(235,235,245,0.3)',
            border: 'none', borderRadius: 14, padding: '16px',
            fontSize: 17, fontWeight: 600,
            cursor: text.trim() ? 'pointer' : 'default',
            width: '100%', transition: 'background 0.15s ease',
          }}
        >
          Submit Answer
        </button>
      </div>
    </div>
  )
}

// ── Discussion screen ────────────────────────────────────────────────────────
function FIDiscuss({ players, answers, realQuestion, onVote }) {
  const list = players.map((name, i) => ({ name, answer: answers[i] }))
  const [shuffled] = useState(() => [...list].sort(() => Math.random() - 0.5))

  return (
    <div style={{
      minHeight: '100dvh', background: '#000', overflowY: 'auto',
      padding: 'max(52px, env(safe-area-inset-top, 52px)) 20px max(32px, env(safe-area-inset-bottom, 32px))',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: THEME, letterSpacing: '0.06em', marginBottom: 10 }}>
          THE REAL QUESTION
        </div>
        <div style={{
          background: '#1C1C1E', borderRadius: 16, padding: '20px',
          marginBottom: 28, borderLeft: `3px solid ${THEME}`,
        }}>
          <div style={{ fontSize: 20, fontWeight: 600, color: 'rgba(235,235,245,0.92)', lineHeight: 1.4 }}>
            {realQuestion}
          </div>
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(235,235,245,0.35)', letterSpacing: '0.06em', marginBottom: 10 }}>
          EVERYONE'S ANSWERS
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
          {shuffled.map((entry, i) => (
            <div key={i} style={{ background: '#1C1C1E', borderRadius: 14, padding: '16px' }}>
              <div style={{ fontSize: 11, color: 'rgba(235,235,245,0.35)', fontWeight: 700, marginBottom: 6, letterSpacing: '0.04em' }}>
                {entry.name.toUpperCase()}
              </div>
              <div style={{ fontSize: 16, color: 'rgba(235,235,245,0.85)', lineHeight: 1.4 }}>
                {entry.answer}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          background: '#1C1C1E', borderRadius: 14, padding: '16px', marginBottom: 20, textAlign: 'center',
        }}>
          <div style={{ fontSize: 14, color: 'rgba(235,235,245,0.45)', lineHeight: 1.6 }}>
            Discuss — one player got a{' '}
            <span style={{ color: THEME, fontWeight: 600 }}>different question</span>
            {' '}or a{' '}
            <span style={{ color: THEME, fontWeight: 600 }}>number range</span>
            {' '}instead. Who's faking it?
          </div>
        </div>

        <button
          onClick={onVote}
          style={{
            background: THEME, color: '#fff', border: 'none', borderRadius: 14,
            padding: '16px', fontSize: 17, fontWeight: 600, cursor: 'pointer', width: '100%',
          }}
        >
          Vote for the Faker →
        </button>
      </div>
    </div>
  )
}

// ── Vote screen ──────────────────────────────────────────────────────────────
function FIVote({ voter, voterIdx, players, onVote }) {
  const [selected, setSelected] = useState(null)
  const others = players.map((name, i) => ({ name, i })).filter(p => p.i !== voterIdx)

  return (
    <div style={{
      minHeight: '100dvh', background: '#000', overflowY: 'auto',
      padding: 'max(52px, env(safe-area-inset-top, 52px)) 20px max(32px, env(safe-area-inset-bottom, 32px))',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        <div style={{ fontSize: 15, color: 'rgba(235,235,245,0.4)', marginBottom: 6 }}>{voter}</div>
        <div style={{
          fontSize: 30, fontWeight: 800, color: 'rgba(235,235,245,0.92)',
          letterSpacing: '-0.03em', marginBottom: 6, lineHeight: 1.1,
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
        }}>
          Who's faking it?
        </div>
        <div style={{ fontSize: 15, color: 'rgba(235,235,245,0.35)', marginBottom: 28 }}>
          Pick the person you think got a different question
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
          {others.map(({ name, i }) => (
            <button
              key={i}
              onClick={() => setSelected(i)}
              style={{
                background: selected === i ? `${THEME}20` : '#1C1C1E',
                border: selected === i ? `1.5px solid ${THEME}` : '1.5px solid transparent',
                borderRadius: 14, padding: '16px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                cursor: 'pointer', color: 'rgba(235,235,245,0.92)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                fontSize: 17, fontWeight: 500, transition: 'all 0.12s ease',
                width: '100%',
              }}
            >
              {name}
              {selected === i && <span style={{ color: THEME, fontSize: 20 }}>✓</span>}
            </button>
          ))}
        </div>

        <button
          onClick={() => { if (selected !== null) onVote(selected) }}
          disabled={selected === null}
          style={{
            background: selected !== null ? THEME : '#2C2C2E',
            color: selected !== null ? '#fff' : 'rgba(235,235,245,0.3)',
            border: 'none', borderRadius: 14, padding: '16px',
            fontSize: 17, fontWeight: 600,
            cursor: selected !== null ? 'pointer' : 'default',
            width: '100%', transition: 'background 0.15s ease',
          }}
        >
          Cast Vote
        </button>
      </div>
    </div>
  )
}

// ── Result screen ────────────────────────────────────────────────────────────
function FIResult({ players, fakerIdxs, votes, question, onRematch, onExit }) {
  const voteCounts = {}
  players.forEach((_, i) => { voteCounts[i] = 0 })
  Object.values(votes).forEach(suspectIdx => {
    voteCounts[suspectIdx] = (voteCounts[suspectIdx] || 0) + 1
  })

  // A faker is "caught" if they received the most votes
  const maxVotes = Math.max(...Object.values(voteCounts))
  const topVoted = Object.keys(voteCounts).filter(i => voteCounts[i] === maxVotes && maxVotes > 0).map(Number)
  const caughtFakers = fakerIdxs.filter(i => topVoted.includes(i))
  const anyFakerCaught = caughtFakers.length > 0
  const multipleMode = fakerIdxs.length > 1

  return (
    <div style={{
      minHeight: '100dvh', background: '#000', overflowY: 'auto',
      padding: 'max(52px, env(safe-area-inset-top, 52px)) 20px max(32px, env(safe-area-inset-bottom, 32px))',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>

        {/* Outcome */}
        <div style={{
          background: anyFakerCaught ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
          border: `1px solid ${anyFakerCaught ? 'rgba(34,197,94,0.25)' : 'rgba(239,68,68,0.25)'}`,
          borderRadius: 20, padding: '28px 24px', textAlign: 'center', marginBottom: 20,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{anyFakerCaught ? '🎉' : '🕵️'}</div>
          <div style={{
            fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8,
            color: anyFakerCaught ? '#4ADE80' : '#F87171',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
          }}>
            {anyFakerCaught ? (caughtFakers.length === fakerIdxs.length ? 'All Fakers Caught!' : 'Faker Caught!') : 'Fakers Escape!'}
          </div>
          <div style={{ fontSize: 16, color: 'rgba(235,235,245,0.5)' }}>
            {anyFakerCaught
              ? caughtFakers.map(i => players[i]).join(' & ') + (caughtFakers.length === 1 ? ' was voted out' : ' were voted out')
              : fakerIdxs.map(i => players[i]).join(' & ') + ' fooled everyone'}
          </div>
        </div>

        {/* Faker details */}
        <div style={{ background: '#1C1C1E', borderRadius: 16, padding: '18px 20px', marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(235,235,245,0.3)', letterSpacing: '0.06em', marginBottom: 8 }}>
            {multipleMode ? 'THE FAKERS' : 'THE FAKER'}
          </div>
          <div style={{ fontSize: 20, fontWeight: 700, color: '#F87171', marginBottom: 6 }}>
            {fakerIdxs.map(i => players[i]).join(', ')}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(235,235,245,0.4)', lineHeight: 1.4 }}>
            {question.isNumeric
              ? `Got the range: "${question.fakeRange}"`
              : `Got the question: "${question.fake}"`}
          </div>
        </div>

        {/* Real question */}
        <div style={{
          background: '#1C1C1E', borderRadius: 16, padding: '18px 20px',
          marginBottom: 20, borderLeft: `3px solid ${THEME}`,
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(235,235,245,0.3)', letterSpacing: '0.06em', marginBottom: 8 }}>THE REAL QUESTION</div>
          <div style={{ fontSize: 15, fontWeight: 500, color: 'rgba(235,235,245,0.85)', lineHeight: 1.4 }}>{question.real}</div>
        </div>

        {/* Vote breakdown */}
        <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(235,235,245,0.3)', letterSpacing: '0.06em', marginBottom: 10 }}>VOTES</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
          {players
            .map((name, i) => ({ name, i, count: voteCounts[i] || 0 }))
            .sort((a, b) => b.count - a.count)
            .map(({ name, i, count }) => (
              <div key={i} style={{
                background: '#1C1C1E', borderRadius: 12, padding: '12px 16px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                border: fakerIdxs.includes(i) ? '1px solid rgba(239,68,68,0.3)' : '1px solid transparent',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ fontSize: 15, color: 'rgba(235,235,245,0.85)', fontWeight: 500 }}>{name}</span>
                  {fakerIdxs.includes(i) && (
                    <span style={{
                      fontSize: 10, fontWeight: 700, color: '#F87171',
                      background: 'rgba(239,68,68,0.15)', borderRadius: 4, padding: '2px 6px', letterSpacing: '0.04em',
                    }}>FAKER</span>
                  )}
                </div>
                <span style={{ fontSize: 15, fontWeight: 600, color: count > 0 ? 'rgba(235,235,245,0.7)' : 'rgba(235,235,245,0.2)' }}>
                  {count} {count === 1 ? 'vote' : 'votes'}
                </span>
              </div>
            ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button
            onClick={onRematch}
            style={{
              background: THEME, color: '#fff', border: 'none', borderRadius: 14,
              padding: '16px', fontSize: 17, fontWeight: 600, cursor: 'pointer', width: '100%',
            }}
          >
            Play Again
          </button>
          <button
            onClick={onExit}
            style={{
              background: '#1C1C1E', color: 'rgba(235,235,245,0.55)',
              border: 'none', borderRadius: 14, padding: '16px',
              fontSize: 17, fontWeight: 500, cursor: 'pointer', width: '100%',
            }}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Setup screen ─────────────────────────────────────────────────────────────
function FISetup({ onStart, onExit }) {
  const [names, setNames] = useState(['', '', '', ''])
  const [selectedPackId, setSelectedPackId] = useState('personal')
  const [chaosMode, setChaosMode] = useState(false)

  const validNames = names.map(n => n.trim()).filter(Boolean)
  const canStart = validNames.length >= 3

  function handleStart() {
    const pack = PACKS.find(p => p.id === selectedPackId)
    onStart(validNames, pack, chaosMode)
  }

  return (
    <div style={{
      minHeight: '100dvh', background: '#000', overflowY: 'auto',
      padding: 'max(52px, env(safe-area-inset-top, 52px)) 20px max(32px, env(safe-area-inset-bottom, 32px))',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
    }}>
      <div style={{ maxWidth: 440, margin: '0 auto' }}>
        <button onClick={onExit} style={{
          background: 'none', border: 'none', color: THEME, fontSize: 17,
          cursor: 'pointer', padding: '0 0 24px',
          fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
        }}>
          ← Back
        </button>

        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 34, marginBottom: 8 }}>🔍</div>
          <h1 style={{
            fontSize: 32, fontWeight: 800, margin: '0 0 6px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif',
            letterSpacing: '-0.03em', color: 'rgba(235,235,245,0.92)',
          }}>
            Who's Faking It?
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(235,235,245,0.4)', margin: 0, lineHeight: 1.5 }}>
            Everyone answers a question. One person secretly got a different one.
          </p>
        </div>

        {/* Players */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(235,235,245,0.3)', letterSpacing: '0.06em', marginBottom: 10 }}>
            PLAYERS
          </div>
          <div style={{ background: '#1C1C1E', borderRadius: 16, overflow: 'hidden', marginBottom: 10 }}>
            {names.map((name, i) => (
              <div key={i}>
                {i > 0 && <div style={{ height: 1, background: 'rgba(84,84,88,0.28)', marginLeft: 16 }} />}
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 16px' }}>
                  <span style={{ fontSize: 13, color: 'rgba(235,235,245,0.2)', width: 20, flexShrink: 0 }}>{i + 1}</span>
                  <input
                    value={name}
                    onChange={e => { const n = [...names]; n[i] = e.target.value; setNames(n) }}
                    placeholder={`Player ${i + 1}`}
                    style={{
                      flex: 1, background: 'none', border: 'none', outline: 'none',
                      padding: '14px 0 14px 10px', fontSize: 17,
                      color: 'rgba(235,235,245,0.92)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button
              onClick={() => names.length < 10 && setNames([...names, ''])}
              disabled={names.length >= 10}
              style={{
                flex: 1, background: '#1C1C1E', border: 'none', borderRadius: 10,
                padding: '10px', fontSize: 14, cursor: names.length < 10 ? 'pointer' : 'default',
                color: names.length < 10 ? 'rgba(235,235,245,0.6)' : 'rgba(235,235,245,0.2)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >+ Add Player</button>
            <button
              onClick={() => names.length > 3 && setNames(names.slice(0, -1))}
              disabled={names.length <= 3}
              style={{
                flex: 1, background: '#1C1C1E', border: 'none', borderRadius: 10,
                padding: '10px', fontSize: 14, cursor: names.length > 3 ? 'pointer' : 'default',
                color: names.length > 3 ? 'rgba(235,235,245,0.6)' : 'rgba(235,235,245,0.2)',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
              }}
            >− Remove</button>
          </div>
        </div>

        {/* Pack selection */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(235,235,245,0.3)', letterSpacing: '0.06em', marginBottom: 10 }}>
            QUESTION PACK
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PACKS.map(pack => (
              <button
                key={pack.id}
                onClick={() => setSelectedPackId(pack.id)}
                style={{
                  background: selectedPackId === pack.id ? `${THEME}18` : '#1C1C1E',
                  border: selectedPackId === pack.id ? `1.5px solid ${THEME}60` : '1.5px solid transparent',
                  borderRadius: 14, padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 12,
                  cursor: 'pointer',
                  fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
                }}
              >
                <span style={{ fontSize: 22 }}>{pack.icon}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(235,235,245,0.85)' }}>{pack.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(235,235,245,0.3)', marginTop: 2 }}>{pack.questions.length} questions</div>
                </div>
                {selectedPackId === pack.id && (
                  <span style={{ marginLeft: 'auto', color: THEME, fontSize: 18 }}>✓</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chaos mode */}
        <div style={{ marginBottom: 20 }}>
          <button
            onClick={() => setChaosMode(m => !m)}
            style={{
              width: '100%', background: chaosMode ? 'rgba(239,68,68,0.12)' : '#1C1C1E',
              border: chaosMode ? '1.5px solid rgba(239,68,68,0.4)' : '1.5px solid transparent',
              borderRadius: 14, padding: '14px 16px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: chaosMode ? '#F87171' : 'rgba(235,235,245,0.85)' }}>
                🎲 Chaos Mode
              </div>
              <div style={{ fontSize: 12, color: 'rgba(235,235,245,0.3)', marginTop: 2 }}>
                Random number of fakers — could be 1, could be more
              </div>
            </div>
            <div style={{
              width: 44, height: 26, borderRadius: 13,
              background: chaosMode ? '#EF4444' : '#3A3A3C',
              position: 'relative', transition: 'background 0.2s ease', flexShrink: 0,
            }}>
              <div style={{
                position: 'absolute', top: 3,
                left: chaosMode ? 21 : 3,
                width: 20, height: 20, borderRadius: 10,
                background: '#fff', transition: 'left 0.2s ease',
              }} />
            </div>
          </button>
        </div>

        <button
          onClick={handleStart}
          disabled={!canStart}
          style={{
            background: canStart ? THEME : '#2C2C2E',
            color: canStart ? '#fff' : 'rgba(235,235,245,0.3)',
            border: 'none', borderRadius: 14, padding: '16px',
            fontSize: 17, fontWeight: 600,
            cursor: canStart ? 'pointer' : 'default',
            width: '100%', transition: 'background 0.15s ease',
          }}
        >
          Start Game
        </button>
      </div>
    </div>
  )
}

// ── Main game controller ─────────────────────────────────────────────────────
export default function FakingItGame({ onExit }) {
  const [phase, setPhase] = useState('setup')
  const [players, setPlayers] = useState([])
  const [fakerIdxs, setFakerIdxs] = useState([])
  const [currentPack, setCurrentPack] = useState(null)
  const [currentChaosMode, setCurrentChaosMode] = useState(false)
  const [question, setQuestion] = useState(null)

  const [revealIdx, setRevealIdx] = useState(0)
  const [revealCover, setRevealCover] = useState(true)

  const [answers, setAnswers] = useState({})

  const [votes, setVotes] = useState({})
  const [voteIdx, setVoteIdx] = useState(0)
  const [voteCover, setVoteCover] = useState(true)

  function startGame(playerNames, pack, chaosMode) {
    const q = pack.questions[Math.floor(Math.random() * pack.questions.length)]
    let fakers
    if (chaosMode) {
      // 1 to floor(n/2) fakers, randomly chosen
      const maxFakers = Math.max(1, Math.floor(playerNames.length / 2))
      const count = Math.floor(Math.random() * maxFakers) + 1
      const shuffled = [...Array(playerNames.length).keys()].sort(() => Math.random() - 0.5)
      fakers = shuffled.slice(0, count)
    } else {
      fakers = [Math.floor(Math.random() * playerNames.length)]
    }
    setPlayers(playerNames)
    setFakerIdxs(fakers)
    setCurrentPack(pack)
    setCurrentChaosMode(chaosMode)
    setQuestion(q)
    setRevealIdx(0)
    setRevealCover(true)
    setAnswers({})
    setVotes({})
    setVoteIdx(0)
    setVoteCover(true)
    setPhase('roleReveal')
  }

  if (phase === 'setup') {
    return <FISetup onStart={startGame} onExit={onExit} />
  }

  if (phase === 'roleReveal') {
    if (revealCover) {
      return <FICover name={players[revealIdx]} action="see your question" onReady={() => setRevealCover(false)} />
    }
    const questionText = fakerIdxs.includes(revealIdx)
      ? (question.isNumeric ? question.fakeRange : question.fake)
      : question.real
    return (
      <FIQuestion
        name={players[revealIdx]}
        questionText={questionText}
        onSubmit={(answer) => {
          const newAnswers = { ...answers, [revealIdx]: answer }
          setAnswers(newAnswers)
          if (revealIdx < players.length - 1) {
            setRevealIdx(revealIdx + 1)
            setRevealCover(true)
          } else {
            setPhase('discuss')
          }
        }}
      />
    )
  }

  if (phase === 'discuss') {
    return (
      <FIDiscuss
        players={players}
        answers={answers}
        realQuestion={question.real}
        onVote={() => { setVoteIdx(0); setVoteCover(true); setPhase('vote') }}
      />
    )
  }

  if (phase === 'vote') {
    if (voteCover) {
      return <FICover name={players[voteIdx]} action="cast your vote" onReady={() => setVoteCover(false)} />
    }
    return (
      <FIVote
        key={voteIdx}
        voter={players[voteIdx]}
        voterIdx={voteIdx}
        players={players}
        onVote={(suspectIdx) => {
          const newVotes = { ...votes, [voteIdx]: suspectIdx }
          setVotes(newVotes)
          if (voteIdx < players.length - 1) {
            setVoteIdx(voteIdx + 1)
            setVoteCover(true)
          } else {
            setPhase('result')
          }
        }}
      />
    )
  }

  if (phase === 'result') {
    return (
      <FIResult
        players={players}
        fakerIdxs={fakerIdxs}
        votes={votes}
        question={question}
        onRematch={() => startGame(players, currentPack, currentChaosMode)}
        onExit={onExit}
      />
    )
  }

  return null
}
