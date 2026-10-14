import { useState } from 'react'
import { newsArticles } from '../data'
import { PracticeSession } from '../components/practice/PracticeSession'
import { StudyCollection } from '../components/ui/StudyCollection'
import { Card } from '../components/ui/Card'

export default function News() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const active = newsArticles.find(q => q.id === activeId)
  if (active) return <PracticeSession question={active} onExit={() => setActiveId(null)} />

  return (
    <div className="study-page">
      <h1 className="page-title">News Reading</h1>
      <p className="page-sub">Selected magazine articles with comprehension questions, argument annotations, and vocabulary notes.</p>
      <StudyCollection questions={newsArticles} onOpen={setActiveId} />
      <Card title="About this collection" className="study-section">
        <ul className="advice-list">
          <li>Identify claims, evidence, the author's attitude, and key terms in each article.</li>
          <li>Review distractor analysis and uncommon meanings of familiar words after answering.</li>
          <li>Add your own material through Import using the Reading format.</li>
        </ul>
      </Card>
    </div>
  )
}
