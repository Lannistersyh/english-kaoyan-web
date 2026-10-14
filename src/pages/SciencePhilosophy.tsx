import { useState } from 'react'
import { sciencePhilosophyArticles } from '../data'
import { PracticeSession } from '../components/practice/PracticeSession'
import { StudyCollection } from '../components/ui/StudyCollection'

export default function SciencePhilosophy() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = sciencePhilosophyArticles.find(q => q.id === activeId)
  if (active) return <PracticeSession question={active} onExit={() => setActiveId(null)} />

  return (
    <div className="study-page">
      <h1 className="page-title">Science and Philosophy</h1>
      <p className="page-sub">Explore cybernetics, information theory, philosophy, and scientific thought through annotated English articles.</p>
      <StudyCollection questions={sciencePhilosophyArticles} onOpen={setActiveId} />
    </div>
  )
}
