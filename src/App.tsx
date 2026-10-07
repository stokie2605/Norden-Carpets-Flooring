import { Hero } from './components/Hero'
import { MaterialSwitcher } from './components/MaterialSwitcher'
import { ProofWall } from './components/ProofWall'
import { ShowroomMap } from './components/ShowroomMap'
import { SiteShell } from './components/SiteShell'
import { SubfloorAdvantage } from './components/SubfloorAdvantage'
import { TeamStrip } from './components/TeamStrip'
import { SectionDivider } from './components/ui/SectionDivider'

export default function App() {
  return (
    <SiteShell>
      <Hero />
      <MaterialSwitcher />
      <SubfloorAdvantage />
      <TeamStrip />
      <ProofWall />
      <SectionDivider />
      <ShowroomMap />
    </SiteShell>
  )
}
