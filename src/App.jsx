import { useState } from 'react'
import Home from './games/Home.jsx'
import WerewolfGame from './games/werewolf/WerewolfGame.jsx'
import ImpostorGame from './games/impostor/ImpostorGame.jsx'
import HotSeatGame from './games/hotseat/HotSeatGame.jsx'
import TruthsGame from './games/truths/TruthsGame.jsx'
import NeverGame from './games/neverhaveiever/NeverGame.jsx'
import HotTakesGame from './games/hottakes/HotTakesGame.jsx'
import WouldYouRatherGame from './games/wouldyourather/WouldYouRatherGame.jsx'
import AliasGame from './games/alias/AliasGame.jsx'
import WavelengthGame from './games/wavelength/WavelengthGame.jsx'
import PartyGame from './games/party/PartyGame.jsx'
import FakingItGame from './games/fakingit/FakingItGame.jsx'

export default function App() {
  const [screen, setScreen] = useState('home')

  if (screen === 'werewolf') return <WerewolfGame onExit={() => setScreen('home')} />
  if (screen === 'impostor') return <ImpostorGame onExit={() => setScreen('home')} />
  if (screen === 'hotseat') return <HotSeatGame onExit={() => setScreen('home')} />
  if (screen === 'truths') return <TruthsGame onExit={() => setScreen('home')} />
  if (screen === 'never') return <NeverGame onExit={() => setScreen('home')} />
  if (screen === 'hottakes') return <HotTakesGame onExit={() => setScreen('home')} />
  if (screen === 'wyr') return <WouldYouRatherGame onExit={() => setScreen('home')} />
  if (screen === 'alias') return <AliasGame onExit={() => setScreen('home')} />
  if (screen === 'wavelength') return <WavelengthGame onExit={() => setScreen('home')} />
  if (screen === 'party') return <PartyGame onExit={() => setScreen('home')} />
  if (screen === 'fakingit') return <FakingItGame onExit={() => setScreen('home')} />
  return <Home onSelect={setScreen} />
}
