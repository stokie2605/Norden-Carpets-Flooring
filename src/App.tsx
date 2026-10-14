import { Hero } from './components/Hero'
import { MaterialSwitcher } from './components/MaterialSwitcher'
import { PreviousWork } from './components/PreviousWork'
import { ProofWall } from './components/ProofWall'
import { ShowroomMap } from './components/ShowroomMap'
import { SiteShell } from './components/SiteShell'
import { TeamStrip } from './components/TeamStrip'

export default function App() {
  return (
    <SiteShell>
      <Hero />
      <MaterialSwitcher />
      <PreviousWork />
      <TeamStrip />
      <ProofWall />
      <ShowroomMap />
    </SiteShell>
  )
}
