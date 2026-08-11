import { useState } from 'react'
import type { ImportResult, Question } from '../types'
import { STORAGE_KEYS } from '../types'
import { QUESTION_TYPE_LABELS } from '../data'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { parseImport } from '../utils/importer'
import { Button } from '../components/ui/Button'
import { Tag } from '../components/ui/Tag'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { Modal } from '../components/ui/Modal'

const TEMPLATE = `[题型] 阅读
[标签] 2024真题 Text1
# Text1 · 你的标题

第一段正文……

第二段正文……

1. 第一题题干
A. 选项A
B. 选项B
C. 选项C
D. 选项D
[答案] B
[解析] 正确项如何对原文同义替换……
[干扰项] A 偷换概念：……
[干扰项] C 过度推断：……

2. 第二题题干
A. 选项A
B. 选项B
C. 选项C
D. 选项D
[答案] D
[解析] ……
[干扰项] A 张冠李戴：……

---

[题型] 完形
[标签] 模拟完形
# 完形练习

正文第一句，{{1}} 是第一个空，{{2}} 第二个空……

1. A. word1 B. word2 C. word3 D. word4
2. A. word1 B. word2 C. word3 D. word4
[答案] A B

---

[题型] 新题型
[标签] 7选5练习
# 7选5 练习

第一段……

{{1}} 第二段……

{{2}} 第三段……
[选项池] A. 选项句1 | B. 选项句2 | C. 选项句3 | D. 选项句4 | E. 选项句5 | F. 选项句6 | G. 选项句7
[答案] A C
[解析] 共享解析：说明每个空怎么选……（[干扰项] 也可同理写在答案之后）

---

[题型] 翻译
[标签] 翻译练习
# 翻译长难句

The sentence to be translated, which contains a relative clause, is written here.
[参考译文] 参考译文……
[步骤1] 切分结构说明……
[步骤2] 语序调整说明……
[步骤3] 意译提示……

---

[题型] 写作
[标签] 写作练习
# 图画作文练习

[图画描述] 画面内容描述……
[写作要求] Write an essay of 160-200 words……
[参考范文] 参考范文……`

export default function Import() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<ImportResult | null>(null)
  const [imported, setImported] = useLocalStorage<Question[]>(STORAGE_KEYS.questions, [])
  const [managing, setManaging] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState<Question | null>(null)

  const parse = () => {
    setResult(parseImport(text))
  }

  const confirmImport = () => {
    if (!result) return
    setImported([...imported, ...result.questions])
    setResult(null)
    setText('')
  }

  const copyTemplate = async () => {
    try {
      await navigator.clipboard.writeText(TEMPLATE)
      window.alert('模板已复制，粘贴到下方输入框后修改')
    } catch {
      window.alert('复制失败，请手动选择复制')
    }
  }

  return (
    <div>
      <h1 className="page-title">真题导入</h1>
      <p className="page-sub">
        把真题文本按格式粘贴进来，自动解析成练习题（真题有版权，不内置，全靠你自己导入）
      </p>

      <div className="toolbar">
        <Button variant="primary" onClick={copyTemplate}>📋 复制格式模板</Button>
        <Button variant={managing ? 'primary' : 'default'} onClick={() => setManaging(!managing)}>
          题目管理（{imported.length} 题）
        </Button>
        <span className="toolbar__spacer" />
        <span className="muted">支持：阅读 / 完形 / 7选5 / 排序 / 翻译 / 写作</span>
      </div>

      {managing ? (
        <Card title="已导入题目" extra={<span className="muted">导入的题可在此删除；删除后练习列表同步移除</span>}>
          {imported.length === 0 ? (
            <EmptyState icon="📥" title="暂无导入题目">先粘贴解析一篇真题吧</EmptyState>
          ) : (
            <div className="item-list">
              {imported.map((q) => (
                <div key={q.id} className="item-row" style={{ cursor: 'default' }}>
                  <div className="item-row__main">
                    <div className="item-row__title">
                      {q.title} <Tag variant="plain">{QUESTION_TYPE_LABELS[q.type]}</Tag>
                    </div>
                    <div className="item-row__meta">{q.sourceLabel} · {q.items.length > 0 ? `${q.items.length} 小题` : '主观题'}</div>
                  </div>
                  <Button variant="danger" style={{ padding: '5px 12px' }} onClick={() => setConfirmDelete(q)}>
                    删除
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      ) : (
        <>
          <textarea
            className="textarea"
            style={{ minHeight: 320, fontFamily: 'Consolas, monospace', fontSize: 13 }}
            placeholder={'粘贴真题文本……\n\n不确定格式？点上方「复制格式模板」'}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <div className="toolbar" style={{ marginTop: 12 }}>
            <Button variant="primary" onClick={parse} disabled={!text.trim()}>
              解析预览
            </Button>
            <Button onClick={() => setText('')} disabled={!text}>清空</Button>
          </div>
        </>
      )}

      {result && (
        <Modal
          title={`解析结果：${result.questions.length} 道题，${result.errors.length} 个问题`}
          onClose={() => setResult(null)}
          footer={
            <>
              <Button onClick={() => setResult(null)}>取消</Button>
              <Button variant="primary" onClick={confirmImport} disabled={result.questions.length === 0}>
                确认入库（{result.questions.length} 题）
              </Button>
            </>
          }
        >
          {result.errors.length > 0 && (
            <div className="card card--flat" style={{ borderColor: 'var(--c-warning)', marginBottom: 12 }}>
              <b className="small" style={{ color: 'var(--c-warning)' }}>解析问题（不影响入库）：</b>
              <ul style={{ margin: '6px 0 0', paddingLeft: 18, fontSize: 13 }}>
                {result.errors.map((e, i) => (
                  <li key={i}>第 {e.line} 行：{e.message}</li>
                ))}
              </ul>
            </div>
          )}
          {result.questions.length === 0 ? (
            <EmptyState icon="⚠️" title="没有解析出题目">请检查格式，或复制模板参考</EmptyState>
          ) : (
            <div className="item-list">
              {result.questions.map((q, i) => (
                <div key={i} className="card card--flat" style={{ padding: 12 }}>
                  <div className="flex-row" style={{ gap: 8, marginBottom: 4 }}>
                    <Tag variant="plain">{QUESTION_TYPE_LABELS[q.type]}</Tag>
                    <Tag>{q.sourceLabel}</Tag>
                    <b>{q.title}</b>
                  </div>
                  <div className="muted small">
                    {q.items.length > 0 ? `${q.items.length} 小题 · ` : ''}
                    {q.items.filter((it) => it.correctIds.length > 0).length} 题含答案
                    {q.referenceTranslation && ' · 含参考译文'}
                    {q.referenceEssay && ' · 含参考范文'}
                  </div>
                  {q.passage && (
                    <div className="small muted" style={{ marginTop: 4 }}>
                      {q.passage.slice(0, 80)}{q.passage.length > 80 ? '……' : ''}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </Modal>
      )}

      {confirmDelete && (
        <Modal
          title="删除题目"
          onClose={() => setConfirmDelete(null)}
          footer={
            <>
              <Button onClick={() => setConfirmDelete(null)}>取消</Button>
              <Button
                variant="danger"
                onClick={() => {
                  setImported(imported.filter((x) => x.id !== confirmDelete.id))
                  setConfirmDelete(null)
                }}
              >
                确认删除
              </Button>
            </>
          }
        >
          <p>确定删除「{confirmDelete.title}」吗？相关的错题档案记录将保留但显示「题目已删除」。</p>
        </Modal>
      )}
    </div>
  )
}
