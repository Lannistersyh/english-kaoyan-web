import { useState } from 'react'
import { getQuestionsByType } from '../utils/questions'
import { PracticeSession } from '../components/practice/PracticeSession'
import { PatternLibrary } from '../components/writing/PatternLibrary'
import { StudyCollection } from '../components/ui/StudyCollection'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'

export default function Writing() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [showLibrary, setShowLibrary] = useState(false)
  const questions = getQuestionsByType('writing')
  const active = questions.find((q) => q.id === activeId)

  if (active) {
    return <PracticeSession question={active} onExit={() => setActiveId(null)} />
  }

  return (
    <div className="study-page">
      <h1 className="page-title"> Writing </h1>
      <p className="page-sub">Past exam emails and notices, picture-based essays, original reference responses, and functional sentence patterns.</p>

      <div className="toolbar">
        <button className="btn" type="button" aria-expanded={showLibrary} onClick={() => setShowLibrary(!showLibrary)}>
          {showLibrary ? 'Hide' : 'Show'} sentence pattern library
        </button>
        <span className="toolbar__spacer" />
        <span className="muted">Follow the length and format specified in each task.</span>
      </div>

      {showLibrary && <PatternLibrary />}

      <h2 className="study-section-title">Writing exercises</h2>
      {questions.length === 0 ? (
        <Card>
          <EmptyState icon="📝" title="No writing questions yet"> Go to &quot;Real Exam Import&quot; and paste the real exam essay prompt </EmptyState>
        </Card>
      ) : (
        <StudyCollection questions={questions} onOpen={setActiveId} />
      )}
    </div>
  )
}
