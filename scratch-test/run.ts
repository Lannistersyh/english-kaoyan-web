import { parseImport } from './importer.ts'

const SAMPLE = `[题型] 阅读
[标签] 2024真题 Text1
# Text1 人工智能与就业

第一段讲技术取代岗位的担忧。

第二段讲历史经验：技术创造新岗位。

1. 作者对技术取代岗位的态度是什么？
A. 极度悲观
B. 总体乐观
C. 完全中立
D. 不予置评
[答案] B
[解析] 第二段 historical experience 表明作者认为旧岗位消失同时新岗位出现，B 是对该论点的同义替换。
[干扰项] A 过度推断：第一段确有担忧，但那是他人的观点，不是作者态度。
[干扰项] D 无中生有：文中并未出现不予置评的表述。

2. 作者举例历史经验是为了说明什么？
A. 技术永远有利
B. 岗位结构会变化
C. 政府应干预
D. 教育无关紧要
[答案] B
[解析] 例证服务于 claim：技术改变岗位结构而非消灭就业。

---

[题型] 完形
[标签] 模拟完形
# 完形测试

第一句，{{1}} 与第二句相关，{{2}} 是第二个空。

1. A. however B. therefore C. besides D. instead
2. A. adopt B. adapt C. adept D. adjust
[答案] A B
[解析] 第一空表转折；第二空考察 adapt to 搭配。

---

[题型] 新题型
[标签] 7选5测试
# 7选5 原文

第一段介绍话题。

{{1}} 第二段需要填入。

{{2}} 第三段需要填入。
[选项池] A. 过渡句一 | B. 过渡句二 | C. 过渡句三 | D. 过渡句四 | E. 过渡句五 | F. 过渡句六 | G. 过渡句七
[答案] A C
[解析] 空1承上启下；空2与下段衔接。
[干扰项] B 偷换概念：看似衔接但主语指代不一致。

---

[题型] 新题型
[标签] 排序测试
# 排序段落
[排序]
第一段内容。
第二段承接上文。
第三段转折。
第四段总结。
[答案] A C B D
[解析] 按逻辑链排序，代词指代是线索。

---

[题型] 翻译
[标签] 翻译测试
# 长难句

The environment, which has long been neglected, is now receiving more attention.
[参考译文] 长期以来被忽视的环境如今受到更多关注。
[步骤1] 切分：主句 + which 定语从句。
[步骤2] 重组：把定语从句提前。
[步骤3] 意译：避免直译"接受注意"。

---

[题型] 写作
[标签] 写作测试
# 图画作文

[图画描述] 两个人在书桌前，一人埋头苦干，一人喝茶。
[写作要求] Write an essay of 160-200 words.
[参考范文] The picture vividly depicts two contrasting scenes...
`

const BAD_SAMPLE = `[题型] 不存在的题型
# 无题

[答案] A
[干扰项] B 奇怪类型：xx
1. 有题干
A. 选项一
B. 选项二
[解析] 解析在答案之后，答案已丢失
`

let fail = 0
const ok = (cond: boolean, msg: string) => {
  if (cond) console.log(`  ✓ ${msg}`)
  else {
    fail++
    console.log(`  ✗ ${msg}`)
  }
}

const r = parseImport(SAMPLE)
ok(r.errors.length === 0, `正常样例无错误（实际 ${r.errors.length} 条：${JSON.stringify(r.errors)}）`)
ok(r.questions.length === 6, `解析出 6 道题（实际 ${r.questions.length}）`)

const [reading, cloze, gap7, reorder, trans, writing] = r.questions as [
  Question, Question, Question, Question, Question, Question,
]

ok(reading.type === 'reading', '阅读题类型')
ok(reading.items.length === 2 && reading.items[0].correctIds.length === 1, '阅读 2 小题各 1 个答案')
const rOpts = reading.items[0].options ?? []
ok(rOpts.length === 4, `阅读选项 4 个（实际 ${rOpts.length}）`)
const bIdx = rOpts.findIndex((o) => o.text.startsWith('总体乐观'))
ok(reading.items[0].correctIds[0] === rOpts[bIdx]?.id, '阅读第 1 题答案 = 选项 B')
ok((reading.items[0].distractors ?? []).length === 2, '阅读第 1 题 2 个干扰项')
ok(reading.items[0].distractors?.[0].type === '过度推断', '干扰项类型解析正确')
ok((reading.passageAnnotations ?? []).length === 0, '阅读无标注不报错')
ok(reading.sourceLabel === '2024真题 Text1', '标签解析正确')

ok(cloze.type === 'cloze' && cloze.items.length === 2, '完形 2 空')
ok((cloze.items[0].options ?? []).length === 4, '完形单行 4 选项')
ok(cloze.items[0].stem?.includes('1'), '完形第 1 空 stem 含编号')
const c1 = cloze.items[0].correctIds[0]
ok(c1 === (cloze.items[0].options ?? [])[0].id, '完形第 1 空答案 = A')
ok(cloze.passage?.includes('{{1}}'), '完形正文含占位符')

ok(gap7.type === 'matching' && gap7.items.length === 2, '7选5 2 个空位小题')
const pool = gap7.optionPools?.[gap7.items[0].optionPoolId ?? ''] ?? []
ok(pool.length === 7, `选项池 7 个（实际 ${pool.length}）`)
ok(gap7.items[0].correctIds[0] === pool[0]?.id && gap7.items[1].correctIds[0] === pool[2]?.id, '7选5 答案 A→池0，C→池2')
ok(gap7.items[0].optionPoolId === gap7.items[1].optionPoolId, '7选5 共享选项池')
ok(gap7.items[0].analysis?.includes('承上启下'), '7选5 共享解析挂到小题')
ok((gap7.items[0].distractors ?? []).length === 1 && gap7.items[0].distractors?.[0].optionId === pool[1]?.id, '7选5 干扰项解析到池内选项')

ok(reorder.type === 'matching' && reorder.items.length === 1, '排序 1 小题')
ok(reorder.items[0].kind === 'reorder' && (reorder.items[0].reorderItems ?? []).length === 4, '排序 4 个段落')
ok(JSON.stringify(reorder.items[0].correctIds) === JSON.stringify(['0', '2', '1', '3']), `排序答案 A C B D → [0,2,1,3]（实际 ${JSON.stringify(reorder.items[0].correctIds)}）`)

ok(trans.type === 'translation' && trans.items.length === 0, '翻译整题无小题')
ok(trans.referenceTranslation?.includes('长期'), '翻译参考译文')
ok((trans.translationSteps ?? []).length === 3, '翻译三步解析')

ok(writing.type === 'writing' && writing.figureDescription?.includes('书桌'), '写作图画描述')
ok(writing.writingPrompt?.includes('160-200'), '写作要求')
ok(writing.referenceEssay?.includes('depicts'), '参考范文')

// 错误样例
const b = parseImport(BAD_SAMPLE)
ok(b.errors.length >= 3, `错误样例产生错误（实际 ${b.errors.length}）`)
const hasUnknownType = b.errors.some((e) => e.message.includes('无法识别的题型'))
const hasBadDistractor = b.errors.some((e) => e.message.includes('奇怪类型'))
const hasMissingStem = b.errors.some((e) => e.message.includes('待定小题数'))
ok(hasUnknownType, '未知题型报错带行号')
ok(hasBadDistractor, '未知干扰项类型报错')
ok(hasMissingStem, '[答案] 无小题报错')
ok(b.questions.length === 1 && b.questions[0].items.length === 1, '错误样例仍解析出题干小题')

console.log(fail === 0 ? '\n全部通过' : `\n${fail} 项失败`)
process.exit(fail === 0 ? 0 : 1)
