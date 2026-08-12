import { useState } from 'react'
import type { SubQuestion } from '../../types'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { Tag } from '../ui/Tag'

interface Props {
  item: SubQuestion
  wrongAnswer: string[]
  /** 已有的思考记录（编辑模式） */
  initialThought?: string
  initialTrap?: string
  initialMapping?: string
  onSave: (myThought: string, distractorTrap: string, correctMapping: string) => void
  onSkip: () => void
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G']

/**
 * 错题三问表单：①我当时怎么想的 ②干扰项如何诱导我 ③正确选项如何同义替换
 * 这是错题档案的核心——把"错误思路"本身记录下来，下次才不会再踩同一个坑
 */
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
      title="错题三问 · 思维档案"
      onClose={onSkip}
      footer={
        <>
          <Button onClick={onSkip}>跳过（稍后在错题档案中补填）</Button>
          <Button
            variant="primary"
            disabled={!thought.trim() && !trap.trim() && !mapping.trim()}
            onClick={() => onSave(thought.trim(), trap.trim(), mapping.trim())}
          >
            保存到档案
          </Button>
        </>
      }
    >
      {item.stem && (
        <div className="card card--flat" style={{ padding: 12, background: '#f8fafc' }}>
          <div className="small" style={{ fontWeight: 600 }}>
            {item.stem}
            {wrongLetters && <span style={{ color: 'var(--c-danger)' }}>　（你选了 {wrongLetters}）</span>}
          </div>
          {item.analysis && <div className="muted" style={{ marginTop: 6 }}>正确思路：{item.analysis}</div>}
        </div>
      )}

      <div className="form-row">
        <div className="form-label">① 我当时是怎么想的？（写下错误思路本身，越具体越好）</div>
        <textarea
          className="textarea"
          placeholder="例如：我看到了原文某句话有 local，就选了有 local 的选项，没注意它偷换了修饰对象……"
          value={thought}
          onChange={(e) => setThought(e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-label">② 干扰项是如何诱导我的？（识别陷阱类型）</div>
        <textarea
          className="textarea"
          placeholder="例如：B 项是局部正确——它来自原文第二段，但回答的是第一段的问法……"
          value={trap}
          onChange={(e) => setTrap(e.target.value)}
        />
      </div>
      <div className="form-row">
        <div className="form-label">③ 正确选项是如何对原文做同义替换的？</div>
        <textarea
          className="textarea"
          placeholder="例如：正确项把原文的 'not from malicious intention' 改写成了 'unintended by-product'……"
          value={mapping}
          onChange={(e) => setMapping(e.target.value)}
        />
      </div>
      <div className="flex-row" style={{ gap: 8 }}>
        <Tag>提示</Tag>
        <span className="small muted">三问填得越具体，下次遇到同类陷阱时就越不容易再错。</span>
      </div>
    </Modal>
  )
}
