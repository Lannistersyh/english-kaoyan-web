import { useState } from 'react'
import type { SubQuestion } from '../../types'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Tag } from '../ui/Tag'

interface Props {
  item: SubQuestion
  wrongAnswer: string[]
  /* Existing thinking record (edit mode) */
  initialThought?: string
  initialTrap?: string
  initialMapping?: string
  onSave: (myThought: string, distractorTrap: string, correctMapping: string) => void
  onSkip: () => void
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

/* * Wrong-question three-question form: ① What was I thinking at the time ② How did the distractor lure me ③ How does the correct option make a synonymous substitution
 * This is the core of the wrong-question archive—record the "mistaken thinking" itself so you won't step into the same pit again next time */
export function ThinkingForm({ item, wrongAnswer, initialThought, initialTrap, initialMapping, onSave, onSkip }: Props) {
  const [thought, setThought] = useState(initialThought ?? '')
  const [trap, setTrap] = useState(initialTrap ?? '')
  const [mapping, setMapping] = useState(initialMapping ?? '')

  const options = item.options ?? []
  const wrongLetters = wrongAnswer
    .map((a) => LETTERS[options.findIndex((o) => o.id === a)])
    .join(', ')

  return (
    <Modal
      title="Wrong-question three questions · Thinking archive"
      onClose={onSkip}
      footer={
        <>
          <Button onClick={onSkip}> Skip (fill in later in the wrong-question archive) </Button>
          <Button
            variant="primary"
            disabled={!thought.trim() && !trap.trim() && !mapping.trim()}
            onClick={() => onSave(thought.trim(), trap.trim(), mapping.trim())}
          >

             Save to archive
          </Button>
        </>
      }
    >
      {item.stem && (
        <div className="card card--flat" style={{ padding: 12, background: '#f8fafc' }}>
          <div className="small" style={{ fontWeight: 600 }}>
            {item.stem}
            {wrongLetters && <span style={{ color: 'var(--c-danger)' }}>　　 (You chose  {wrongLetters}）</span>}
          </div>
          {item.analysis && <div className="muted" style={{ marginTop: 6 }}> Correct thinking: {item.analysis}</div>}
        </div>
      )}

      <div className="form-row">
        <div className="form-label"> ① What was I thinking at the time? (Write down the mistaken thinking itself, as specifically as possible) </div>
        <textarea
          className="textarea"
          placeholder="For example: I saw that a sentence in the original text had local, so I chose the option with local, not noticing that it had swapped the modified object..."
          value={thought}
          onChange={(e) => setThought(e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-label"> ② How did the distractor lure me? (Identify the trap type) </div>
        <textarea
          className="textarea"
          placeholder="For example: Option B is partially true—it comes from the second paragraph of the original text, but it answers the question form of the first paragraph..."
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-label"> ③ How does the correct option make a synonymous substitution for the original text? </div>
        <textarea
          className="textarea"
          placeholder="For example: The correct option rewrites the original text's 'not from malicious intention' as 'unintended by-product'..."
          value={mapping}
          onChange={(e) => setMapping(e.target.value)}
        />
      </div>
      <div className="flex-row" style={{ gap: 8 }}>
        <Tag> Tips </Tag>
        <span className="small muted"> The more specific the three questions are, the less likely you are to make the same mistake again when encountering the same type of trap next time. </span>
      </div>
    </Modal>
  )
}
