import type { Question } from '../types'

/**
 * 科学哲学 · 控制论 · 信息论 · 历史与哲学
 * 20 篇深度阅读材料（Borges 风格：短小、精确、充满哲学张力）
 */

export const sciencePhilosophyArticles: Question[] = [
  // ════════════════════════════════════════════════════════
  // 1. 博尔赫斯式的地图
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-1',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Nautilus',
    title: 'The Map That Ate the Territory',
    suggestedMinutes: 8,
    passage: `In his one-paragraph story "On Exactitude in Science," Jorge Luis Borges describes an empire so devoted to cartography that it commissions a map at the scale of 1:1 — a map the same size as the territory itself. Generations later, tattered fragments of this useless colossus still litter the desert, inhabited by animals and beggars.

The parable seems absurd, yet Silicon Valley is building its equivalent. Digital twins — precise virtual replicas of entire cities, factories, and human bodies — are proliferating. Singapore maintains a full-scale 3D model of the city-state, updated in real-time with traffic, weather, and construction data. Pharmaceutical companies build computational replicas of human organs to test drugs before clinical trials.

The seduction is obvious: if the model is perfect, prediction becomes certainty. But Borges understood what many engineers do not — that a perfect map is not merely useless but dangerous. A map at 1:1 scale eliminates the very quality that makes maps valuable: abstraction. The purpose of a map is to compress reality, to strip away irrelevant detail so that the relevant patterns become visible. A map that includes everything communicates nothing.

This paradox has practical consequences. Climate models, however sophisticated, remain maps — partial, compressed, lossy. The danger arises when policymakers treat model outputs as territory: as certainties rather than informed guesses. The 2008 financial crisis was, in part, a crisis of mistaken cartography: risk models that assumed housing prices could not decline nationwide were treated not as maps but as the terrain itself.

The philosopher Alfred Korzybski coined the phrase "the map is not the territory" in 1931. Borges gave it narrative form. The lesson endures: the most dangerous map is the one we forget is a map.`,
    passageAnnotations: [
      { id: 'sp1-a1', type: 'claim', text: 'a perfect map is not merely useless but dangerous', note: '核心论点：完美地图不仅无用而且危险' },
      { id: 'sp1-a2', type: 'evidence', text: 'The 2008 financial crisis was, in part, a crisis of mistaken cartography', note: '历史证据：2008 金融危机是地图被误认为领土的后果' },
      { id: 'sp1-a3', type: 'keyword', text: 'the map is not the territory', note: '关键概念：Korzybski 的名言 — 地图不等于领土' },
      { id: 'sp1-a4', type: 'attitude', text: 'The most dangerous map is the one we forget is a map', note: '作者态度：最危险的地图是我们忘记它是地图的那张' },
    ],
    items: [
      {
        id: 'sp1-q1', kind: 'choice', stem: 'According to the passage, the primary purpose of a map is to:',
        options: [
          { id: 'A', text: 'replicate reality as precisely as possible' },
          { id: 'B', text: 'compress reality to reveal relevant patterns' },
          { id: 'C', text: 'replace the need for direct observation' },
          { id: 'D', text: 'predict future events with certainty' },
        ],
        correctIds: ['B'],
        analysis: '第三段明确指出 "the purpose of a map is to compress reality, to strip away irrelevant detail so that the relevant patterns become visible"，对应 B。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '1:1 地图恰恰是文章批判的对象，replicating reality 不是地图的目的' },
          { optionId: 'D', type: '过度推断', why: '文章说 models 输出是 "informed guesses" 而非 certainties' },
        ],
        vocabNotes: ['cartography n. 制图学', 'abstraction n. 抽象化'],
        score: 2,
      },
      {
        id: 'sp1-q2', kind: 'choice', stem: 'The 2008 financial crisis is cited as an example of:',
        options: [
          { id: 'A', text: 'the success of digital twin technology' },
          { id: 'B', text: 'the danger of confusing a model with reality' },
          { id: 'C', text: 'the inadequacy of climate models' },
          { id: 'D', text: 'the failure of cartography in modern society' },
        ],
        correctIds: ['B'],
        analysis: '第四段 "risk models...were treated not as maps but as the terrain itself" — 危机的例子说明将模型等同于现实的危险。',
        distractors: [
          { optionId: 'C', type: '张冠李戴', why: 'climate models 在本段作为另一个例子出现，不是金融危机的论点' },
        ],
        vocabNotes: ['proliferating adj. 迅速增加的', 'lossy adj. 有损的（压缩学术语）'],
        score: 2,
      },
      {
        id: 'sp1-q3', kind: 'choice', stem: 'The author\'s attitude toward digital twins can best be described as:',
        options: [
          { id: 'A', text: 'enthusiastic endorsement' },
          { id: 'B', text: 'complete dismissal' },
          { id: 'C', text: 'cautious appreciation tempered by philosophical warning' },
          { id: 'D', text: 'indifference' },
        ],
        correctIds: ['C'],
        analysis: '作者承认 digital twins 的 "seduction"（吸引力），但随即用 Borges 的寓言警告其危险性。这种态度是"谨慎欣赏 + 哲学警告"。',
        distractors: [
          { optionId: 'A', type: '局部正确', why: '作者确实提到了技术的吸引力，但整体论调是警告性的' },
        ],
        vocabNotes: ['seduction n. 诱惑、吸引力', 'colossus n. 巨像、庞然大物'],
        score: 2,
      },
    ],
    tips: ['注意 Borges 寓言与现代技术（digital twins）的类比结构', '理解 "map vs territory" 这一对哲学概念的贯穿全文作用'],
    vocabNotes: ['cartography n. 制图学', 'paradox n. 悖论', 'proliferating adj. 迅速增加的', 'abstraction n. 抽象化', 'lossy adj. 有损的'],
  },

  // ════════════════════════════════════════════════════════
  // 2. 控制论：控制的科学
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-2',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'The Atlantic',
    title: 'Cybernetics: The Science of Control',
    suggestedMinutes: 8,
    passage: `In 1948, a mathematician at MIT named Norbert Wiener published a slim volume called "Cybernetics: or Control and Communication in the Animal and the Machine." The book proposed something radical: that the principles governing a thermostat, a human nervous system, and a wartime anti-aircraft gun were fundamentally the same. All were systems that used feedback — information about the gap between desired and actual states — to correct their behaviour.

Wiener's insight was that control is not about power but about information. A steam engine governor does not "know" physics; it merely senses that it is spinning too fast and adjusts. The human body maintains a temperature of 37°C not through central command but through millions of distributed feedback loops — sweating, shivering, vasodilation — each responding to local information. The brain itself, Wiener argued, was not a commander issuing orders but a pattern-matching organ immersed in a continuous loop of sensation and response.

This framework transformed engineering. Servomechanisms, autopilots, and industrial controllers all emerged from cybernetic thinking. But Wiener foresaw a darker application: if machines could be made to behave like organisms, organisms could be made to behave like machines. In "The Human Use of Human Beings" (1950), he warned that a society obsessed with control and efficiency would inevitably treat its citizens as components in a feedback system — optimising for measurable outputs while ignoring everything that resists quantification.

The irony is that cybernetics, the science of control, ultimately revealed the limits of control. Complex systems — ecosystems, economies, human minds — do not behave like thermostats. They adapt, resist, and occasionally collapse in ways no feedback loop can predict. Wiener died in 1964, but his warning has only grown more urgent in the age of algorithmic governance, where the temptation to treat society as a controllable machine remains as powerful — and as dangerous — as ever.`,
    passageAnnotations: [
      { id: 'sp2-a1', type: 'claim', text: 'control is not about power but about information', note: '核心论点：控制的本质是信息而非权力' },
      { id: 'sp2-a2', type: 'evidence', text: 'a steam engine governor does not "know" physics; it merely senses', note: '证据：恒温器类比 — 控制不需要"理解"，只需要反馈' },
      { id: 'sp2-a3', type: 'attitude', text: 'the science of control ultimately revealed the limits of control', note: '作者态度：控制论最终揭示了控制的局限' },
      { id: 'sp2-a4', type: 'keyword', text: 'feedback', note: '关键概念：反馈 — 控制论的核心机制' },
    ],
    items: [
      {
        id: 'sp2-q1', kind: 'choice', stem: 'According to Wiener, what is the fundamental principle shared by thermostats, nervous systems, and anti-aircraft guns?',
        options: [
          { id: 'A', text: 'They all use mechanical force to achieve their goals' },
          { id: 'B', text: 'They all use feedback to correct their behaviour' },
          { id: 'C', text: 'They all rely on centralised command structures' },
          { id: 'D', text: 'They all process digital information' },
        ],
        correctIds: ['B'],
        analysis: '第一段末句 "All were systems that used feedback — information about the gap between desired and actual states — to correct their behaviour" 直接对应 B。',
        distractors: [
          { optionId: 'C', type: '偷换概念', why: '文章明确否定 centralised command — "not a commander issuing orders"' },
          { optionId: 'D', type: '无中生有', why: '1948 年的 cybernetics 不涉及 digital information' },
        ],
        vocabNotes: ['feedback n. 反馈', 'servomechanism n. 伺服机构'],
        score: 2,
      },
      {
        id: 'sp2-q2', kind: 'choice', stem: 'Wiener\'s warning about society treating citizens as machine components is mentioned to illustrate:',
        options: [
          { id: 'A', text: 'the inevitability of technological progress' },
          { id: 'B', text: 'the danger of applying control theory to human affairs' },
          { id: 'C', text: 'the superiority of machines over humans' },
          { id: 'D', text: 'the need for better engineering education' },
        ],
        correctIds: ['B'],
        analysis: '第三段 Wiener 警告 "a society obsessed with control and efficiency would treat its citizens as components" — 控制论思维应用于人类社会的危险。',
        distractors: [
          { optionId: 'A', type: '过度推断', why: '作者不是在庆祝技术进步，而是在警告其后果' },
        ],
        vocabNotes: ['quantification n. 量化', 'algorithmic governance 算法治理'],
        score: 2,
      },
      {
        id: 'sp2-q3', kind: 'choice', stem: 'The irony identified in the final paragraph is that:',
        options: [
          { id: 'A', text: 'cybernetics was abandoned by engineers' },
          { id: 'B', text: 'Wiener\'s ideas were rejected by the scientific community' },
          { id: 'C', text: 'the science of control revealed that complex systems resist control' },
          { id: 'D', text: 'thermostats turned out to be more complex than brains' },
        ],
        correctIds: ['C'],
        analysis: '末段首句 "cybernetics, the science of control, ultimately revealed the limits of control" — 控制论自身揭示了控制的极限，这就是 irony。',
        distractors: [
          { optionId: 'D', type: '无中生有', why: '文章从未比较恒温器和大脑的复杂度' },
        ],
        vocabNotes: ['vasodilation n. 血管舒张', 'distributed adj. 分布式的'],
        score: 2,
      },
    ],
    tips: ['注意全文的论证结构：理论提出 → 工程应用 → 社会警告 → 悖论揭示', 'feedback 是贯穿全文的核心概念，注意它在不同语境中的含义'],
    vocabNotes: ['cybernetics n. 控制论', 'feedback n. 反馈', 'servomechanism n. 伺服机构', 'vasodilation n. 血管舒张', 'quantification n. 量化'],
  },

  // ════════════════════════════════════════════════════════
  // 3. 熵与时间之箭
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-3',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Scientific American',
    title: 'Entropy and the Arrow of Time',
    suggestedMinutes: 8,
    passage: `A teacup falls from a table and shatters on the floor. No one has ever seen the reverse: shards leaping from the floor to reassemble into a cup on the table. Yet the laws of physics — Newton's mechanics, Maxwell's electromagnetism — are perfectly time-symmetric. They work equally well forwards and backwards. So why does time have a direction?

The answer, physicists tell us, is entropy. In 1865, Rudolf Clausius introduced the concept to describe the irreversible dispersal of energy in thermodynamic systems. The second law of thermodynamics states that in any closed system, entropy — disorder, randomness, the number of possible microscopic arrangements — never decreases. A shattered cup has enormously more possible arrangements than an intact one. Reassembly is not impossible, merely so improbable that it would take longer than the age of the universe.

In 1948, Claude Shannon borrowed the term for his mathematical theory of communication. Shannon's entropy measures the unpredictability of a message. A string of identical characters has low entropy; a random sequence has high entropy. The connection to thermodynamics is not merely metaphorical: both describe the tendency of systems to move from ordered states to disordered ones.

This has unsettling implications. If entropy always increases, the universe is heading toward "heat death" — a state of maximum disorder where no work can be extracted, no structure can form, and time itself loses meaning. Life, which maintains exquisite order through constant energy expenditure, is a local and temporary rebellion against this cosmic tide.

Yet there is a profound puzzle here. If the fundamental laws are time-symmetric, why did the universe begin in a state of extraordinarily low entropy? This is the "Past Hypothesis" — the observation that the Big Bang was a moment of almost miraculous order. No one knows why. The arrow of time, it seems, is not written into the laws of physics but into the initial conditions of the universe.`,
    passageAnnotations: [
      { id: 'sp3-a1', type: 'claim', text: 'time has a direction because of entropy, not because the laws of physics are asymmetric', note: '核心论点：时间方向来自熵，而非物理定律的不对称' },
      { id: 'sp3-a2', type: 'evidence', text: 'Newton\'s mechanics, Maxwell\'s electromagnetism — are perfectly time-symmetric', note: '证据：经典物理定律本身是时间对称的' },
      { id: 'sp3-a3', type: 'keyword', text: 'Past Hypothesis', note: '关键概念：过去假说 — 大爆炸为何是低熵状态' },
      { id: 'sp3-a4', type: 'attitude', text: 'No one knows why', note: '作者态度：坦诚承认未解之谜' },
    ],
    items: [
      {
        id: 'sp3-q1', kind: 'choice', stem: 'The teacup example is used to illustrate:',
        options: [
          { id: 'A', text: 'the superiority of classical physics over quantum mechanics' },
          { id: 'B', text: 'the puzzle of why time has a direction despite time-symmetric laws' },
          { id: 'C', text: 'the fragility of everyday objects' },
          { id: 'D', text: 'the limitations of Newtonian mechanics' },
        ],
        correctIds: ['B'],
        analysis: '第一段用茶杯下坠引出核心悖论：物理定律是时间对称的，但现实时间有方向。对应 B。',
        distractors: [
          { optionId: 'A', type: '无中生有', why: '文章未涉及量子力学与经典物理的对比' },
          { optionId: 'C', type: '过度推断', why: '茶杯破碎只是引子，不是讨论重点' },
        ],
        vocabNotes: ['time-symmetric adj. 时间对称的', 'thermodynamic adj. 热力学的'],
        score: 2,
      },
      {
        id: 'sp3-q2', kind: 'choice', stem: 'Shannon\'s entropy is connected to thermodynamic entropy because:',
        options: [
          { id: 'A', text: 'they were both discovered by the same person' },
          { id: 'B', text: 'they both measure the tendency of systems to move from order to disorder' },
          { id: 'C', text: 'they both apply only to closed systems' },
          { id: 'D', text: 'they both require computational power to calculate' },
        ],
        correctIds: ['B'],
        analysis: '第三段末 "both describe the tendency of systems to move from ordered states to disordered ones" 直接对应 B。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: 'Shannon 借用了 Clausius 的术语，但两人不是同一人' },
        ],
        vocabNotes: ['dispersal n. 分散、扩散', 'microscopic adj. 微观的'],
        score: 2,
      },
      {
        id: 'sp3-q3', kind: 'choice', stem: 'The "Past Hypothesis" refers to:',
        options: [
          { id: 'A', text: 'the theory that entropy will eventually decrease' },
          { id: 'B', text: 'the observation that the Big Bang was a state of unusually low entropy' },
          { id: 'C', text: 'the claim that time flows backwards near black holes' },
          { id: 'D', text: 'the prediction that the universe will end in heat death' },
        ],
        correctIds: ['B'],
        analysis: '末段 "the Past Hypothesis — the observation that the Big Bang was a moment of almost miraculous order" 直接定义。',
        distractors: [
          { optionId: 'D', type: '张冠李戴', why: 'heat death 是宇宙的终态，Past Hypothesis 讨论的是宇宙的初始状态' },
        ],
        vocabNotes: ['hypothesis n. 假说', 'initial conditions 初始条件'],
        score: 2,
      },
    ],
    tips: ['注意全文的时间框架：1865 Clausius → 1948 Shannon → 大爆炸', '理解 "时间对称的定律" vs "时间有方向的现实" 这一核心张力'],
    vocabNotes: ['entropy n. 熵', 'thermodynamics n. 热力学', 'dispersal n. 分散', 'exquisite adj. 精致的', 'miraculous adj. 奇迹般的'],
  },

  // ════════════════════════════════════════════════════════
  // 4. 哥德尔：数学为何不能自证完备
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-4',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Aeon',
    title: "Godel's Gift: Why Mathematics Cannot Complete Itself",
    suggestedMinutes: 8,
    passage: `In 1931, a quiet Austrian logician named Kurt Godel delivered a devastating blow to the foundations of mathematics. His incompleteness theorems proved that in any formal system powerful enough to describe basic arithmetic, there will always be true statements that cannot be proved within the system. Mathematics, the most rigorous of human endeavours, is inherently incomplete.

The proof works through a brilliant act of self-reference. Godel showed how to construct a mathematical statement that essentially says: "This statement cannot be proved within this system." If the statement is false, then it can be proved — but a system that proves false statements is inconsistent. If the statement is true, then it cannot be proved — confirming what it asserts. Either the system is inconsistent, or it is incomplete.

The implications extend far beyond mathematics. Any formal system — a legal code, a programming language, a theory of physics — that is sufficiently powerful to express self-referential statements will face the same limitation. There will always be truths that the system can recognise but cannot prove. Alan Turing later showed a computational analogue: there are problems that no algorithm can solve, no matter how much time or memory is available.

For mathematicians, the result was initially traumatic. David Hilbert, who had hoped to place all of mathematics on a single consistent foundation, saw his programme collapse. But Godel's theorem is not a counsel of despair. It tells us that mathematical truth is richer than any formal system can capture. There will always be new axioms to discover, new systems to build, new truths that lie just beyond the reach of proof.

In a sense, Godel liberated mathematics from the illusion of completeness. Like the Borges map that must always remain smaller than the territory, any mathematical system must leave some truths uncharted. The wilderness beyond the map is not a failure but an invitation.`,
    passageAnnotations: [
      { id: 'sp4-a1', type: 'claim', text: 'in any formal system powerful enough to describe basic arithmetic, there will always be true statements that cannot be proved', note: '哥德尔不完备定理的核心陈述' },
      { id: 'sp4-a2', type: 'evidence', text: 'This statement cannot be proved within this system', note: '自指构造：哥德尔证明的关键技巧' },
      { id: 'sp4-a3', type: 'keyword', text: 'self-reference', note: '关键概念：自指 — 哥德尔证明的核心机制' },
      { id: 'sp4-a4', type: 'attitude', text: 'Godel liberated mathematics from the illusion of completeness', note: '作者态度：不完备性不是绝望，而是解放' },
    ],
    items: [
      {
        id: 'sp4-q1', kind: 'choice', stem: 'Godel\'s proof works by constructing a statement that:',
        options: [
          { id: 'A', text: 'is too complex for any computer to evaluate' },
          { id: 'B', text: 'asserts its own unprovability within the system' },
          { id: 'C', text: 'contradicts the axioms of arithmetic' },
          { id: 'D', text: 'requires infinite time to verify' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "a mathematical statement that essentially says: This statement cannot be proved within this system" — 自指性的不可证明陈述。',
        distractors: [
          { optionId: 'A', type: '无中生有', why: '哥德尔定理不涉及计算复杂度' },
          { optionId: 'C', type: '偷换概念', why: '不是与算术公理矛盾，而是系统无法证明自身的一致性' },
        ],
        vocabNotes: ['self-reference n. 自指', 'inconsistent adj. 不一致的'],
        score: 2,
      },
      {
        id: 'sp4-q2', kind: 'choice', stem: 'According to the passage, Turing\'s contribution was to show that:',
        options: [
          { id: 'A', text: 'Godel\'s theorem was mathematically flawed' },
          { id: 'B', text: 'some computational problems are inherently unsolvable by any algorithm' },
          { id: 'C', text: 'computers can eventually prove all mathematical truths' },
          { id: 'D', text: 'formal systems are superior to informal reasoning' },
        ],
        correctIds: ['B'],
        analysis: '第三段 "Turing later showed a computational analogue: there are problems that no algorithm can solve" — Turing 将不完备性转化为计算不可解性。',
        distractors: [
          { optionId: 'C', type: '偷换概念', why: '文章说的恰恰相反：有些问题算法永远无法解决' },
        ],
        vocabNotes: ['analogue n. 类似物', 'algorithm n. 算法'],
        score: 2,
      },
      {
        id: 'sp4-q3', kind: 'choice', stem: 'The author compares Godel\'s theorem to Borges\' map to illustrate:',
        options: [
          { id: 'A', text: 'the impracticality of large-scale projects' },
          { id: 'B', text: 'that any system of representation must leave some truths uncharted' },
          { id: 'C', text: 'that mathematics is more reliable than cartography' },
          { id: 'D', text: 'the need for better formal systems' },
        ],
        correctIds: ['B'],
        analysis: '末段 "any mathematical system must leave some truths uncharted" — 正如地图必须比领土小，数学系统也必然有遗漏。',
        distractors: [
          { optionId: 'A', type: '过度推断', why: 'Borges 地图的类比不是关于"大型项目的不切实际"，而是关于"表示系统的固有局限"' },
        ],
        vocabNotes: ['liberated v. 解放', 'uncharted adj. 未标注的、未知的'],
        score: 2,
      },
    ],
    tips: ['理解自指（self-reference）是全文的关键机制', '注意哥德尔 → 图灵的论证扩展：从数学到计算'],
    vocabNotes: ['incompleteness n. 不完备性', 'axiom n. 公理', 'self-reference n. 自指', 'algorithm n. 算法', 'uncharted adj. 未知的'],
  },

  // ════════════════════════════════════════════════════════
  // 5. 库恩：科学革命的结构
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-5',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'The New Yorker',
    title: 'The Paradigm Shift: How Science Really Progresses',
    suggestedMinutes: 8,
    passage: `The popular image of science is one of steady accumulation: each generation adding new facts to an ever-growing pile of knowledge. Thomas Kuhn destroyed this comforting picture in 1962 with "The Structure of Scientific Revolutions," arguing that science does not progress by accumulation but by revolution — by what he called "paradigm shifts."

A paradigm, in Kuhn's sense, is not merely a theory but an entire worldview: a set of assumptions, methods, standards, and exemplary problems that define what counts as legitimate science. Normal science — the everyday work of most scientists — operates within an existing paradigm, solving puzzles that the paradigm defines. Anomalies — observations that don't fit — are typically ignored, explained away, or attributed to experimental error.

But anomalies accumulate. When they become too numerous and too significant to ignore, the paradigm enters a crisis. Competing theories emerge. Young scientists, less invested in the old paradigm, defect to the new. Eventually, a new paradigm replaces the old — not because it has been "proved" correct, but because it explains the anomalies and attracts a critical mass of adherents. Copernicus replaced Ptolemy. Einstein replaced Newton. Each shift changed not just what scientists believed but what questions they considered worth asking.

The philosopher Karl Popper objected that Kuhn's account made science seem irrational — a matter of fashion and sociology rather than logic and evidence. Kuhn responded that science is a human activity, and human activities cannot be understood by abstracting away the humans. Paradigm shifts are not arbitrary, but they are not purely logical either. They involve judgment, persuasion, and the willingness to see the world differently.

What makes Kuhn's insight enduring is its universality. Paradigm shifts occur not only in physics and biology but in economics, psychology, and even everyday reasoning. We all operate within paradigms — frameworks so familiar that we forget they are frameworks at all.`,
    passageAnnotations: [
      { id: 'sp5-a1', type: 'claim', text: 'science does not progress by accumulation but by revolution', note: '核心论点：科学不是渐进积累而是革命性范式转换' },
      { id: 'sp5-a2', type: 'evidence', text: 'Copernicus replaced Ptolemy. Einstein replaced Newton', note: '历史证据：科学革命的实例' },
      { id: 'sp5-a3', type: 'keyword', text: 'paradigm shift', note: '关键概念：范式转换' },
      { id: 'sp5-a4', type: 'attitude', text: 'We all operate within paradigms — frameworks so familiar that we forget they are frameworks at all', note: '作者态度：范式无处不在，但我们往往意识不到' },
    ],
    items: [
      {
        id: 'sp5-q1', kind: 'choice', stem: 'According to Kuhn, "normal science" is characterised by:',
        options: [
          { id: 'A', text: 'the pursuit of revolutionary discoveries' },
          { id: 'B', text: 'solving puzzles defined by the existing paradigm' },
          { id: 'C', text: 'the constant testing of fundamental assumptions' },
          { id: 'D', text: 'the rejection of all previous theories' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "Normal science...operates within an existing paradigm, solving puzzles that the paradigm defines" 直接对应 B。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: 'revolutionary discoveries 是 paradigm shift 的特征，不是 normal science 的' },
        ],
        vocabNotes: ['paradigm n. 范式', 'anomaly n. 异常现象'],
        score: 2,
      },
      {
        id: 'sp5-q2', kind: 'choice', stem: 'Popper objected to Kuhn\'s theory because:',
        options: [
          { id: 'A', text: 'it ignored the role of experiments in science' },
          { id: 'B', text: 'it made science seem driven by sociology rather than logic' },
          { id: 'C', text: 'it claimed that all paradigms are equally valid' },
          { id: 'D', text: 'it rejected the concept of scientific progress' },
        ],
        correctIds: ['B'],
        analysis: '第四段 Popper "objected that Kuhn\'s account made science seem irrational — a matter of fashion and sociology rather than logic and evidence" 直接对应 B。',
        distractors: [
          { optionId: 'C', type: '过度推断', why: 'Kuhn 从未声称所有范式同样有效' },
        ],
        vocabNotes: ['irrational adj. 非理性的', 'adherent n. 信徒、追随者'],
        score: 2,
      },
      {
        id: 'sp5-q3', kind: 'choice', stem: 'The author suggests that Kuhn\'s insight is universal because:',
        options: [
          { id: 'A', text: 'it applies to all branches of natural science' },
          { id: 'B', text: 'it has been confirmed by experiments in psychology' },
          { id: 'C', text: 'paradigm-shaped thinking extends beyond science to everyday life' },
          { id: 'D', text: 'it explains why science always progresses' },
        ],
        correctIds: ['C'],
        analysis: '末段 "Paradigm shifts occur not only in physics and biology but in economics, psychology, and even everyday reasoning" — 范式存在于日常思维中。',
        distractors: [
          { optionId: 'D', type: '偷换概念', why: 'Kuhn 的观点恰恰是科学不一定总是"进步"的，而是范式转换' },
        ],
        vocabNotes: ['defect v. 叛变、投靠', 'critical mass 临界质量'],
        score: 2,
      },
    ],
    tips: ['注意 Kuhn vs Popper 的哲学辩论结构', '理解 "paradigm" 不仅是理论，而是整个世界观'],
    vocabNotes: ['paradigm n. 范式', 'anomaly n. 异常', 'revolution n. 革命', 'adherent n. 追随者', 'arbitrary adj. 任意的'],
  },

  // ════════════════════════════════════════════════════════
  // 6. 海森堡：观测改变被观测者
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-6',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Nature',
    title: 'Heisenberg\'s Uncertainty: Seeing Changes What You See',
    suggestedMinutes: 8,
    passage: `In 1927, Werner Heisenberg, a 26-year-old German physicist, formulated a principle that shattered the classical dream of perfect knowledge. The uncertainty principle states that there is a fundamental limit to how precisely you can simultaneously know a particle's position and its momentum. The more accurately you measure one, the less accurately you can know the other. This is not a limitation of instruments — it is a feature of reality.

The reason is startlingly simple. To observe an electron, you must bounce something off it — typically a photon of light. But photons carry energy, and hitting a tiny electron with a photon is like trying to locate a billiard ball by shooting another billiard ball at it in the dark. The collision tells you where the ball was, but it also knocks it to a new position. You cannot observe without disturbing.

This principle has been misinterpreted more than perhaps any other in physics. It does not say that "we cannot know everything" — as if the universe keeps secrets from us. It says that certain pairs of properties do not simultaneously possess precise values. The electron does not "have" an exact position and an exact momentum that we merely fail to detect. The properties themselves are indeterminate until measured.

The philosophical consequences are profound. Classical science assumed that the universe is a clockwork mechanism: if you know the position and velocity of every particle, you can predict the future with certainty. Heisenberg showed that this Laplacean determinism is not merely impractical but logically impossible. Uncertainty is woven into the fabric of reality, not into our ignorance of it.

Yet physicists have learned to work with uncertainty rather than against it. Quantum mechanics, built on the uncertainty principle, is the most precisely tested theory in the history of science. The universe, it seems, is not a clock but a casino — and the house always wins.`,
    passageAnnotations: [
      { id: 'sp6-a1', type: 'claim', text: 'This is not a limitation of instruments — it is a feature of reality', note: '核心论点：不确定性是现实的特征而非观测的局限' },
      { id: 'sp6-a2', type: 'evidence', text: 'To observe an electron, you must bounce something off it', note: '物理解释：观测必然干扰被观测对象' },
      { id: 'sp6-a3', type: 'keyword', text: 'Laplacean determinism', note: '关键概念：拉普拉斯决定论 — 经典物理的决定论理想' },
      { id: 'sp6-a4', type: 'attitude', text: 'the universe is not a clock but a casino', note: '作者态度：宇宙不是钟表而是赌场' },
    ],
    items: [
      {
        id: 'sp6-q1', kind: 'choice', stem: 'The billiard ball analogy is used to explain:',
        options: [
          { id: 'A', text: 'why electrons behave like waves' },
          { id: 'B', text: 'why observation inevitably disturbs the observed object' },
          { id: 'C', text: 'why classical physics is more intuitive than quantum mechanics' },
          { id: 'D', text: 'why photons have mass' },
        ],
        correctIds: ['B'],
        analysis: '第二段用台球类比说明 "The collision tells you where the ball was, but it also knocks it to a new position" — 观测必然干扰被观测对象。',
        distractors: [
          { optionId: 'A', type: '无中生有', why: '文章未讨论波粒二象性' },
          { optionId: 'C', type: '过度推断', why: '类比是为了解释不确定性原理，不是为了比较物理理论' },
        ],
        vocabNotes: ['momentum n. 动量', 'photon n. 光子'],
        score: 2,
      },
      {
        id: 'sp6-q2', kind: 'choice', stem: 'According to the passage, the common misinterpretation of the uncertainty principle is that:',
        options: [
          { id: 'A', text: 'it applies only to subatomic particles' },
          { id: 'B', text: 'it is a statement about our knowledge, not about reality itself' },
          { id: 'C', text: 'it was disproven by later experiments' },
          { id: 'D', text: 'it only affects the position measurement' },
        ],
        correctIds: ['B'],
        analysis: '第三段 "It does not say that we cannot know everything...It says that certain pairs of properties do not simultaneously possess precise values" — 不确定性是关于现实本身，而非关于我们认知的局限。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '文章未说它仅限于亚原子粒子' },
        ],
        vocabNotes: ['indeterminate adj. 不确定的', 'Laplacean determinism 拉普拉斯决定论'],
        score: 2,
      },
      {
        id: 'sp6-q3', kind: 'choice', stem: 'The metaphor "the universe is not a clock but a casino" implies that:',
        options: [
          { id: 'A', text: 'quantum mechanics is based on gambling' },
          { id: 'B', text: 'scientific predictions are always wrong' },
          { id: 'C', text: 'fundamental randomness is built into the structure of reality' },
          { id: 'D', text: 'physicists should abandon the pursuit of knowledge' },
        ],
        correctIds: ['C'],
        analysis: '钟表隐喻决定论（可精确预测），赌场隐喻内在随机性。末段 "Uncertainty is woven into the fabric of reality" 对应 C。',
        distractors: [
          { optionId: 'A', type: '字面理解', why: 'casino 是隐喻，不是说物理学基于赌博' },
        ],
        vocabNotes: ['clockwork mechanism 钟表机制', 'casino n. 赌场'],
        score: 2,
      },
    ],
    tips: ['理解 billiard ball 类比的物理含义：观测行为本身的干扰', '注意作者纠正常见误解的论证方式'],
    vocabNotes: ['uncertainty n. 不确定性', 'momentum n. 动量', 'photon n. 光子', 'determinism n. 决定论', 'indeterminate adj. 不确定的'],
  },

  // ════════════════════════════════════════════════════════
  // 7. 图灵：机器能思考吗？
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-7',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'MIT Technology Review',
    title: 'Can Machines Think? Turing\'s Imitation Game',
    suggestedMinutes: 8,
    passage: `In 1950, Alan Turing published a paper in the journal Mind that asked, with deceptive simplicity: "Can machines think?" Rather than grappling with the philosophical quicksand of defining "thinking," Turing proposed a practical test. Place a human and a machine in separate rooms, and let an interrogator communicate with both via text. If the interrogator cannot reliably distinguish the machine from the human, the machine can be said to think.

This "imitation game" — now called the Turing Test — has been both enormously influential and deeply controversial. Critics argue that it conflates imitation with understanding. John Searle's famous "Chinese Room" thought experiment imagines a person who follows rules to manipulate Chinese symbols without understanding Chinese. The room produces perfect Chinese responses, but no comprehension exists inside. Searle argues that computers, however sophisticated, are merely symbol-manipulators — rooms without understanding.

Turing anticipated most objections. He addressed the "argument from consciousness" (machines cannot feel), the "mathematical objection" (Godel's theorem limits machines), and the "Lady Lovelace objection" (machines can only do what they are programmed to do). To each, he offered a rebuttal. To the consciousness objection, he asked: how do you know that other humans are conscious? You infer it from their behaviour — the same standard should apply to machines.

What makes Turing's paper remarkable is not its answer but its framing. By replacing the metaphysical question "what is thinking?" with the operational question "how would we recognise it?", Turing shifted the discussion from philosophy to engineering. Seventy-five years later, large language models can produce text indistinguishable from human writing. The Turing Test, once a philosophical thought experiment, has become an engineering benchmark — and the line between imitation and understanding has never been blurrier.

The deepest question Turing raised may be this: if a machine's behaviour is indistinguishable from thinking, does it matter whether it "really" thinks?`,
    passageAnnotations: [
      { id: 'sp7-a1', type: 'claim', text: 'Turing replaced the metaphysical question with an operational one', note: '核心论点：图灵将形而上学问题转化为工程问题' },
      { id: 'sp7-a2', type: 'evidence', text: 'John Searle\'s famous "Chinese Room" thought experiment', note: '反面证据：Searle 的中文房间论证' },
      { id: 'sp7-a3', type: 'keyword', text: 'imitation game', note: '关键概念：模仿游戏 — 图灵测试的原名' },
      { id: 'sp7-a4', type: 'attitude', text: 'the line between imitation and understanding has never been blurrier', note: '作者态度：模仿与理解的界限从未如此模糊' },
    ],
    items: [
      {
        id: 'sp7-q1', kind: 'choice', stem: 'Turing\'s practical approach to the question "Can machines think?" was to:',
        options: [
          { id: 'A', text: 'define thinking precisely and test for it' },
          { id: 'B', text: 'replace the question with a behavioural test' },
          { id: 'C', text: 'prove that machines can think mathematically' },
          { id: 'D', text: 'build a conscious machine' },
        ],
        correctIds: ['B'],
        analysis: '第一段 "Rather than grappling with...defining thinking, Turing proposed a practical test" — 用行为测试替代定义性问题。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '图灵恰恰回避了精确定义 thinking 的问题' },
        ],
        vocabNotes: ['interrogator n. 审问者、提问者', 'imitation n. 模仿'],
        score: 2,
      },
      {
        id: 'sp7-q2', kind: 'choice', stem: 'Searle\'s Chinese Room argument claims that:',
        options: [
          { id: 'A', text: 'machines can learn Chinese faster than humans' },
          { id: 'B', text: 'producing correct outputs does not necessarily imply understanding' },
          { id: 'C', text: 'the Turing Test is too easy for machines to pass' },
          { id: 'D', text: 'Chinese is too complex for machines to process' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "The room produces perfect Chinese responses, but no comprehension exists inside" — 正确输出不等于理解。',
        distractors: [
          { optionId: 'C', type: '无中生有', why: 'Searle 讨论的是理解问题，不是测试难度' },
        ],
        vocabNotes: ['conflation n. 混淆', 'comprehension n. 理解'],
        score: 2,
      },
      {
        id: 'sp7-q3', kind: 'choice', stem: 'The deepest question Turing raised, according to the author, is:',
        options: [
          { id: 'A', text: 'how to build a conscious machine' },
          { id: 'B', text: 'whether machines can ever be smarter than humans' },
          { id: 'C', text: 'whether behavioural indistinguishability from thinking constitutes thinking' },
          { id: 'D', text: 'why humans are superior to machines' },
        ],
        correctIds: ['C'],
        analysis: '末段 "if a machine\'s behaviour is indistinguishable from thinking, does it matter whether it really thinks?" — 行为等价是否等于思考。',
        distractors: [
          { optionId: 'A', type: '过度推断', why: '图灵的问题不是"如何建造有意识的机器"，而是"行为是否足以定义思考"' },
        ],
        vocabNotes: ['indistinguishable adj. 无法区分的', 'benchmark n. 基准'],
        score: 2,
      },
    ],
    tips: ['理解 Turing vs Searle 的哲学辩论结构', '注意作者对图灵测试的评价：从哲学思想实验到工程基准'],
    vocabNotes: ['imitation n. 模仿', 'comprehension n. 理解', 'metaphysical adj. 形而上学的', 'operational adj. 操作性的', 'indistinguishable adj. 无法区分的'],
  },

  // ════════════════════════════════════════════════════════
  // 8. 贝特森：信息即差异
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-8',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Aeon',
    title: 'Gregory Bateson: Information as a Difference That Makes a Difference',
    suggestedMinutes: 8,
    passage: `Gregory Bateson was an anthropologist, a cybernetician, a psychiatrist, and — by his own admission — a man who thought in patterns. His most famous contribution to intellectual history is a single sentence: "Information is a difference that makes a difference."

This deceptively simple definition resolves a problem that plagued Shannon's information theory. Shannon defined information as the reduction of uncertainty — a statistical measure of how much a message narrows the range of possible states. But this definition treats all messages equally: a random noise pattern and Shakespeare's sonnets carry the same amount of Shannon information if they are equally unpredictable. Bateson's formulation adds a crucial qualification: information must make a difference — it must change the behaviour of the receiving system.

A thermostat, Bateson would say, receives information because a temperature difference causes it to switch the furnace on or off. The difference in temperature makes a difference in behaviour. A rock rolling down a hill receives no information from the wind, because the wind does not alter the rock's subsequent behaviour in any systematic way. Information, in this view, is not a substance or a quantity but a relationship — between a signal and a system capable of responding to it.

This insight has profound implications for biology. An organism does not "receive" information from its environment the way a bucket receives water. Rather, the organism's nervous system is structured to detect certain differences — wavelengths of light, gradients of pressure, chemical concentrations — and to respond differentially. The frog's eye does not see the world; it sees moving dots. The bat's ear does not hear the world; it hears echoes.

Bateson's definition also illuminates the problem of meaning in artificial intelligence. A large language model processes text — differences in token sequences — but does the output make a difference to the model itself? If the model's behaviour is determined entirely by its weights and the input, with no capacity for genuine response, then perhaps it processes information without ever encountering meaning.`,
    passageAnnotations: [
      { id: 'sp8-a1', type: 'claim', text: 'Information is a difference that makes a difference', note: '贝特森对信息的经典定义' },
      { id: 'sp8-a2', type: 'evidence', text: 'a random noise pattern and Shakespeare\'s sonnets carry the same amount of Shannon information', note: 'Shannon 信息论的局限：不区分有意义与无意义的信息' },
      { id: 'sp8-a3', type: 'keyword', text: 'a difference that makes a difference', note: '贝特森的核心概念' },
      { id: 'sp8-a4', type: 'attitude', text: 'perhaps it processes information without ever encountering meaning', note: '作者态度：对 AI 的意义问题保持开放性' },
    ],
    items: [
      {
        id: 'sp8-q1', kind: 'choice', stem: 'Bateson\'s definition of information differs from Shannon\'s in that it:',
        options: [
          { id: 'A', text: 'is more mathematically precise' },
          { id: 'B', text: 'requires that the information causes a change in the receiving system' },
          { id: 'C', text: 'applies only to biological organisms' },
          { id: 'D', text: 'rejects the concept of uncertainty entirely' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "Bateson\'s formulation adds a crucial qualification: information must make a difference — it must change the behaviour of the receiving system" 直接对应 B。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: 'Bateson 的定义不如 Shannon 的数学精确，而是更概念化' },
          { optionId: 'C', type: '过度推断', why: 'Bateson 用恒温器为例说明信息不限于生物体' },
        ],
        vocabNotes: ['formulation n. 表述、公式化', 'qualification n. 限定条件'],
        score: 2,
      },
      {
        id: 'sp8-q2', kind: 'choice', stem: 'The frog\'s eye example illustrates that:',
        options: [
          { id: 'A', text: 'frogs have superior vision compared to humans' },
          { id: 'B', text: 'organisms detect only specific differences relevant to their survival' },
          { id: 'C', text: 'Shannon information is insufficient for understanding perception' },
          { id: 'D', text: 'all animals perceive the same reality' },
        ],
        correctIds: ['B'],
        analysis: '第四段 "the organism\'s nervous system is structured to detect certain differences" — 青蛙眼睛只看到移动的点，说明生物只检测与其生存相关的差异。',
        distractors: [
          { optionId: 'D', type: '偷换概念', why: '文章强调不同物种感知不同的世界，而非相同的现实' },
        ],
        vocabNotes: ['differentially adv. 差异性地', 'gradient n. 梯度'],
        score: 2,
      },
      {
        id: 'sp8-q3', kind: 'choice', stem: 'The passage suggests that the key question about AI and meaning is:',
        options: [
          { id: 'A', text: 'whether AI can process more information than humans' },
          { id: 'B', text: 'whether AI output constitutes genuine information or mere pattern matching' },
          { id: 'C', text: 'whether AI will eventually surpass human intelligence' },
          { id: 'D', text: 'whether AI can be creative' },
        ],
        correctIds: ['B'],
        analysis: '末段 "does the output make a difference to the model itself?" — AI 是否真正"接收"信息，还是只是模式匹配。',
        distractors: [
          { optionId: 'A', type: '过度推断', why: '信息处理量不是贝特森关心的问题' },
        ],
        vocabNotes: ['token n. 词元（AI 术语）', 'capacity n. 能力'],
        score: 2,
      },
    ],
    tips: ['理解贝特森定义的三层含义：差异 → 对接收系统有影响 → 关系性', '注意青蛙/蝙蝠例子对"信息是关系"的佐证'],
    vocabNotes: ['cybernetician n. 控制论学者', 'formulation n. 表述', 'differential adj. 差异的', 'gradient n. 梯度', 'token n. 词元'],
  },

  // ════════════════════════════════════════════════════════
  // 9. 博弈论：策略困境的数学
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-9',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'The Economist',
    title: 'Game Theory: The Mathematics of Strategic Dilemmas',
    suggestedMinutes: 8,
    passage: `In 1950, mathematician John Nash proved that every finite game has at least one equilibrium — a set of strategies where no player can improve their outcome by unilaterally changing their own. This "Nash equilibrium" became the cornerstone of game theory, the mathematical study of strategic interaction.

Game theory begins with a deceptively simple insight: the outcome of your decision depends on what others decide. Unlike physics, where nature follows fixed laws, in a strategic environment your opponent is thinking about you thinking about them. This recursive quality — "I know that you know that I know" — is what makes game theory mathematically distinct and humanly fascinating.

The most famous illustration is the Prisoner's Dilemma. Two suspects are interrogated separately. If both stay silent, each gets one year. If one betrays the other, the betrayer goes free and the betrayed gets ten years. If both betray, each gets five years. The rational strategy, paradoxically, is mutual betrayal — even though mutual cooperation would leave both better off. Individual rationality leads to collective disaster.

This pattern pervades modern life. Climate negotiations are a multi-player Prisoner's Dilemma: every nation benefits from others cutting emissions while continuing to pollute itself. Antibiotic resistance arises because each doctor, acting rationally, prescribes antibiotics to individual patients, accelerating resistance for all. Arms races, price wars, and traffic congestion all share this structure.

Nash won the Nobel Prize in 1994 for his work, but his personal story — marked by schizophrenia, institutionalisation, and eventual recovery — adds a poignant dimension. The man who mathematically formalised rationality spent decades unable to distinguish between reason and delusion. His equilibrium concept, meanwhile, has been applied to everything from evolutionary biology to auction design, proving that the mathematics of strategic interaction is as universal as it is counterintuitive.`,
    passageAnnotations: [
      { id: 'sp9-a1', type: 'claim', text: 'individual rationality leads to collective disaster', note: '核心论点：个体理性导致集体灾难 — 博弈论的悖论' },
      { id: 'sp9-a2', type: 'evidence', text: 'Climate negotiations are a multi-player Prisoner\'s Dilemma', note: '现实证据：气候谈判是多方囚徒困境' },
      { id: 'sp9-a3', type: 'keyword', text: 'Nash equilibrium', note: '关键概念：纳什均衡' },
      { id: 'sp9-a4', type: 'attitude', text: 'the man who mathematically formalised rationality spent decades unable to distinguish reason from delusion', note: '作者态度：Nash 的个人悲剧与理论的反讽' },
    ],
    items: [
      {
        id: 'sp9-q1', kind: 'choice', stem: 'A Nash equilibrium is defined as:',
        options: [
          { id: 'A', text: 'the strategy that maximises total welfare' },
          { id: 'B', text: 'a set of strategies where no player benefits from unilateral deviation' },
          { id: 'C', text: 'the outcome that both players prefer' },
          { id: 'D', text: 'the strategy that minimises risk' },
        ],
        correctIds: ['B'],
        analysis: '第一段 "a set of strategies where no player can improve their outcome by unilaterally changing their own" 直接定义纳什均衡。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '纳什均衡不一定最大化总福利（囚徒困境中双方背叛是均衡但不是最优）' },
          { optionId: 'C', type: '偷换概念', why: '囚徒困境中双方都不偏好均衡结果' },
        ],
        vocabNotes: ['equilibrium n. 均衡', 'unilaterally adv. 单方面地'],
        score: 2,
      },
      {
        id: 'sp9-q2', kind: 'choice', stem: 'The Prisoner\'s Dilemma illustrates that:',
        options: [
          { id: 'A', text: 'cooperation is always the rational choice' },
          { id: 'B', text: 'rational individual choices can lead to suboptimal collective outcomes' },
          { id: 'C', text: 'criminals always betray each other' },
          { id: 'D', text: 'game theory cannot be applied to real-world situations' },
        ],
        correctIds: ['B'],
        analysis: '第三段 "Individual rationality leads to collective disaster" — 个体理性选择导致集体次优结果。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '合作是更好的结果，但不是"理性"选择（理性导致互相背叛）' },
        ],
        vocabNotes: ['betray v. 背叛', 'paradoxically adv. 矛盾地'],
        score: 2,
      },
      {
        id: 'sp9-q3', kind: 'choice', stem: 'The author mentions Nash\'s personal struggle with schizophrenia to:',
        options: [
          { id: 'A', text: 'discredit his mathematical contributions' },
          { id: 'B', text: 'add biographical interest and highlight the irony of his work on rationality' },
          { id: 'C', text: 'suggest that genius requires mental illness' },
          { id: 'D', text: 'argue for better mental health funding' },
        ],
        correctIds: ['B'],
        analysis: '末段 "The man who mathematically formalised rationality spent decades unable to distinguish reason from delusion" — Nash 的个人悲剧与理论的反讽。',
        distractors: [
          { optionId: 'A', type: '无中生有', why: '作者明确肯定 Nash 获诺贝尔奖的贡献' },
        ],
        vocabNotes: ['schizophrenia n. 精神分裂症', 'poignant adj. 令人感慨的'],
        score: 2,
      },
    ],
    tips: ['理解囚徒困境的核心悖论：个体最优 ≠ 集体最优', '注意 Nash 个人经历与博弈论的反讽性对比'],
    vocabNotes: ['equilibrium n. 均衡', 'unilaterally adv. 单方面地', 'paradoxically adv. 矛盾地', 'poignant adj. 令人感慨的', 'counterintuitive adj. 反直觉的'],
  },

  // ════════════════════════════════════════════════════════
  // 10. 薛定谔：生命是什么？
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-10',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Nature',
    title: 'What is Life? Schrödinger and the Physics of Biology',
    suggestedMinutes: 8,
    passage: `In 1944, Erwin Schrödinger — the physicist famous for his thought experiment involving a cat — published a slim book called "What is Life?" The book asked a question that physics had never seriously addressed: how do living organisms defy the second law of thermodynamics?

The second law states that entropy — disorder — always increases in closed systems. A hot cup of coffee cools to room temperature; a sandcastle erodes into flat beach. Yet living things maintain exquisite order: DNA replicates with extraordinary fidelity, cells organise into tissues, organisms grow and reproduce. How can biology be so orderly when physics insists on disorder?

Schrödinger's answer was "negative entropy" — or negentropy. Living systems, he argued, are not closed but open: they continuously import order from their environment (food, sunlight) and export disorder (heat, waste). A living organism is a local eddy of order in a river of entropy, maintained not by violating physical law but by feeding on free energy.

The book had an electrifying effect on a generation of physicists who would go on to found molecular biology. Francis Crick, who co-discovered the structure of DNA, explicitly credited Schrödinger with inspiring his move from physics to biology. James Watson, Crick's partner, read the book as an undergraduate and was captivated by the idea that the secret of life might be written in molecular code.

Schrödinger also predicted that the gene must be an "aperiodic crystal" — a molecule with a non-repeating structure that carries information in its pattern. This was essentially a prediction of DNA, made a decade before Watson and Crick's discovery. The gene, Schrödinger intuited, was not a substance but a message — a code written in the three-dimensional language of molecular structure.

"What is Life?" remains one of the most influential popular science books ever written. Its central insight — that life is a process of importing order to combat entropy — has become a cornerstone of biophysics.`,
    passageAnnotations: [
      { id: 'sp10-a1', type: 'claim', text: 'living systems are not closed but open: they continuously import order from their environment', note: '核心论点：生命通过输入有序能量来对抗熵增' },
      { id: 'sp10-a2', type: 'evidence', text: 'Francis Crick explicitly credited Schrödinger with inspiring his move from physics to biology', note: '历史证据：薛定谔启发了 DNA 的发现者' },
      { id: 'sp10-a3', type: 'keyword', text: 'aperiodic crystal', note: '关键概念：非周期晶体 — 薛定谔对基因结构的预测' },
      { id: 'sp10-a4', type: 'attitude', text: 'life is a process of importing order to combat entropy', note: '作者态度：生命是输入有序以对抗熵的过程' },
    ],
    items: [
      {
        id: 'sp10-q1', kind: 'choice', stem: 'Schrödinger\'s answer to how living things maintain order was that:',
        options: [
          { id: 'A', text: 'they violate the second law of thermodynamics' },
          { id: 'B', text: 'they are closed systems that generate their own energy' },
          { id: 'C', text: 'they are open systems that import order and export disorder' },
          { id: 'D', text: 'they operate outside the laws of physics' },
        ],
        correctIds: ['C'],
        analysis: '第三段 "Living systems...are not closed but open: they continuously import order from their environment and export disorder" 直接对应 C。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '薛定谔明确说生命不是违反热力学第二定律，而是通过输入有序能量来局部减熵' },
        ],
        vocabNotes: ['negentropy n. 负熵', 'eddy n. 涡流'],
        score: 2,
      },
      {
        id: 'sp10-q2', kind: 'choice', stem: 'Schrödinger predicted that the gene would be:',
        options: [
          { id: 'A', text: 'a simple repeating crystal' },
          { id: 'B', text: 'an aperiodic crystal with non-repeating information' },
          { id: 'C', text: 'a protein molecule' },
          { id: 'D', text: 'a liquid solution' },
        ],
        correctIds: ['B'],
        analysis: '第五段 "the gene must be an aperiodic crystal — a molecule with a non-repeating structure that carries information" 直接对应 B。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '是 aperiodic（非周期的）而非 simple repeating（简单重复的）' },
        ],
        vocabNotes: ['aperiodic adj. 非周期的', 'fidelity n. 忠实度'],
        score: 2,
      },
      {
        id: 'sp10-q3', kind: 'choice', stem: 'The book\'s influence on molecular biology is mentioned to show that:',
        options: [
          { id: 'A', text: 'physics is more important than biology' },
          { id: 'B', text: 'interdisciplinary thinking can drive revolutionary discoveries' },
          { id: 'C', text: 'Schrödinger was a better biologist than physicist' },
          { id: 'D', text: 'popular science books are unreliable sources' },
        ],
        correctIds: ['B'],
        analysis: '第四段 Crick 和 Watson 的例子说明跨学科思维（物理→生物）推动了 DNA 的发现。',
        distractors: [
          { optionId: 'A', type: '过度推断', why: '文章不是在比较物理和生物的重要性' },
        ],
        vocabNotes: ['electrifying adj. 令人振奋的', 'interdisciplinary adj. 跨学科的'],
        score: 2,
      },
    ],
    tips: ['理解薛定谔的核心类比：生命 = 对抗熵增的局部有序系统', '注意 aperiodic crystal 概念对 DNA 发现的预见性'],
    vocabNotes: ['entropy n. 熵', 'negentropy n. 负熵', 'aperiodic adj. 非周期的', 'fidelity n. 忠实度', 'electrifying adj. 令人振奋的'],
  },

  // ════════════════════════════════════════════════════════
  // 11. 波普尔：不能被证伪的就不是科学
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-11',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Stanford Encyclopedia Review',
    title: 'Popper\'s Falsification: Science That Cannot Be Wrong Is Not Science',
    suggestedMinutes: 8,
    passage: `Karl Popper was troubled by a simple question: what distinguishes science from non-science? The logical positivists had answered: science is verified by observation. But Popper noticed that almost any theory can be "verified" by selectively choosing evidence. Freudian psychoanalysis, for instance, could explain any human behaviour — aggression confirmed the death drive, kindness confirmed sublimation, and neither could ever be disproved.

Popper's radical answer was falsification. A theory is scientific not if it can be confirmed but if it can be refuted. Einstein's general relativity was scientific because it made specific, risky predictions — light would bend by a precise amount during a solar eclipse — that could have been proved wrong. When Arthur Eddington observed the predicted bending in 1919, the theory survived its most dangerous test. Psychoanalysis, by contrast, was not scientific because no observation could contradict it.

This criterion solved the demarcation problem — the boundary between science and non-science — but created new puzzles. Scientific practice, historians of science pointed out, does not actually work this way. Scientists do not abandon theories at the first failed prediction. They adjust auxiliary hypotheses, check experimental apparatus, and look for systematic errors. Popper responded that he was describing the logic of science, not its sociology — how scientists should reason, not how they do reason.

The implications extend beyond philosophy. In medicine, randomised controlled trials are designed around Popperian logic: the null hypothesis is assumed true until evidence forces its rejection. In everyday reasoning, Popper's criterion offers a powerful heuristic: before believing a claim, ask what evidence would disprove it. If nothing could, the claim is not knowledge — it is faith.

Popper's most unsettling conclusion is that scientific knowledge is always provisional. We never prove a theory true; we merely fail to prove it false — so far. Every scientific truth carries an invisible asterisk: "pending refutation."`,
    passageAnnotations: [
      { id: 'sp11-a1', type: 'claim', text: 'A theory is scientific not if it can be confirmed but if it can be refuted', note: '核心论点：科学理论的标准是可证伪性而非可验证性' },
      { id: 'sp11-a2', type: 'evidence', text: 'Einstein\'s general relativity...made specific, risky predictions', note: '正面证据：爱因斯坦理论的可证伪性' },
      { id: 'sp11-a3', type: 'keyword', text: 'falsification', note: '关键概念：证伪 — 波普尔的核心标准' },
      { id: 'sp11-a4', type: 'attitude', text: 'Every scientific truth carries an invisible asterisk: pending refutation', note: '作者态度：所有科学真理都附带"待证伪"的隐形星号' },
    ],
    items: [
      {
        id: 'sp11-q1', kind: 'choice', stem: 'Popper considered Freudian psychoanalysis unscientific because:',
        options: [
          { id: 'A', text: 'it was not based on any observations' },
          { id: 'B', text: 'no observation could potentially disprove it' },
          { id: 'C', text: 'it was too complex to understand' },
          { id: 'D', text: 'it contradicted Einstein\'s theory' },
        ],
        correctIds: ['B'],
        analysis: '第一段 "Psychoanalysis...could explain any human behaviour...and neither could ever be disproved" — 无法被证伪。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '精神分析确实基于观察，问题是它能解释一切，没有任何观察能否定它' },
        ],
        vocabNotes: ['sublimation n. 升华（心理学术语）', 'demarcation n. 划界'],
        score: 2,
      },
      {
        id: 'sp11-q2', kind: 'choice', stem: 'The historian of science objection to Popper is that:',
        options: [
          { id: 'A', text: 'Einstein\'s theory was actually disproven' },
          { id: 'B', text: 'real scientists do not abandon theories at the first failed prediction' },
          { id: 'C', text: 'psychoanalysis is actually scientific' },
          { id: 'D', text: 'Popper\'s criterion is too lenient' },
        ],
        correctIds: ['B'],
        analysis: '第三段 "Scientists do not abandon theories at the first failed prediction. They adjust auxiliary hypotheses" — 真实科学实践不遵循严格证伪。',
        distractors: [
          { optionId: 'D', type: '偷换概念', why: '批评不是说波普尔的标准太宽松，而是说太严格（不符合实际科学实践）' },
        ],
        vocabNotes: ['auxiliary adj. 辅助的', 'heuristic n. 启发式方法'],
        score: 2,
      },
      {
        id: 'sp11-q3', kind: 'choice', stem: 'The "invisible asterisk" metaphor means that:',
        options: [
          { id: 'A', text: 'science is unreliable' },
          { id: 'B', text: 'scientific knowledge is always provisional and subject to future refutation' },
          { id: 'C', text: 'scientists should be more confident in their findings' },
          { id: 'D', text: 'all theories will eventually be disproven' },
        ],
        correctIds: ['B'],
        analysis: '末段 "We never prove a theory true; we merely fail to prove it false — so far" — 科学知识始终是暂时性的。',
        distractors: [
          { optionId: 'A', type: '过度推断', why: '暂时性不等于不可靠，只是说有被证伪的可能' },
        ],
        vocabNotes: ['provisional adj. 暂时的', 'refutation n. 反驳、证伪'],
        score: 2,
      },
    ],
    tips: ['理解波普尔的核心区分：可证伪 vs 不可证伪', '注意作者从逻辑 → 历史 → 日常应用的论证扩展'],
    vocabNotes: ['falsification n. 证伪', 'demarcation n. 划界', 'heuristic n. 启发式', 'provisional adj. 暂时的', 'refutation n. 反驳'],
  },

  // ════════════════════════════════════════════════════════
  // 12. 麦克卢汉：媒介即讯息
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-12',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'The Guardian',
    title: 'McLuhan: The Medium Is the Message',
    suggestedMinutes: 8,
    passage: `When Marshall McLuhan declared that "the medium is the message" in 1964, most people thought he was being provocative for its own sake. Television, they assumed, was simply a delivery system for content — what mattered was the programme, not the box. McLuhan insisted this was exactly wrong.

His argument was deceptively simple: the medium through which information travels shapes human consciousness more profoundly than the information itself. The printing press did not merely deliver books; it created the habit of linear, sequential thinking that defined modernity. Television did not merely broadcast news; it restructured attention spans, political discourse, and the boundary between public and private life. The content of any medium, McLuhan argued, is always another medium — the content of writing is speech, the content of print is writing, the content of the internet is everything that came before.

McLuhan distinguished between "hot" and "cool" media. Hot media (radio, film, photography) are high-definition: they fill the senses and require little participation from the audience. Cool media (television, telephone, comics) are low-definition: they leave gaps that the audience must actively fill. This distinction explains why radio created passive listeners while television — paradoxically, given its richer visual content — created more engaged viewers.

McLuhan also coined the term "global village" — the idea that electronic media would collapse distance and create a single, interconnected community of shared experience. Fifty years before social media, he predicted that this village would not be a peaceful utopia but a place of intense tribal conflict, because instant communication revives the emotional intensity of pre-literate oral culture.

McLuhan's ideas, once dismissed as academic provocation, have become essential vocabulary for understanding the digital age.`,
    passageAnnotations: [
      { id: 'sp12-a1', type: 'claim', text: 'the medium through which information travels shapes human consciousness more profoundly than the information itself', note: '核心论点：媒介对人类意识的影响比信息本身更深' },
      { id: 'sp12-a2', type: 'evidence', text: 'The printing press did not merely deliver books; it created the habit of linear, sequential thinking', note: '证据：印刷术创造了线性思维习惯' },
      { id: 'sp12-a3', type: 'keyword', text: 'global village', note: '关键概念：地球村 — 麦克卢汉对互联网时代的预言' },
      { id: 'sp12-a4', type: 'attitude', text: 'this village would not be a peaceful utopia but a place of intense tribal conflict', note: '作者态度：地球村不是乌托邦，而是部落冲突之地' },
    ],
    items: [
      {
        id: 'sp12-q1', kind: 'choice', stem: 'According to McLuhan, the most important thing about television was:',
        options: [
          { id: 'A', text: 'the quality of its programmes' },
          { id: 'B', text: 'how it restructured attention and public life' },
          { id: 'C', text: 'its ability to replace newspapers' },
          { id: 'D', text: 'its high-definition image quality' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "Television...restructured attention spans, political discourse, and the boundary between public and private life" — 媒介的影响在于重塑人类行为模式。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '这正是麦克卢汉反对的观点 — 内容不是最重要的' },
        ],
        vocabNotes: ['discourse n. 话语、论述', 'linear adj. 线性的'],
        score: 2,
      },
      {
        id: 'sp12-q2', kind: 'choice', stem: 'The "global village" concept predicted that electronic media would:',
        options: [
          { id: 'A', text: 'create world peace through understanding' },
          { id: 'B', text: 'collapse distance but also intensify tribal conflict' },
          { id: 'C', text: 'make everyone speak the same language' },
          { id: 'D', text: 'eliminate the need for physical travel' },
        ],
        correctIds: ['B'],
        analysis: '末段 "instant communication revives the emotional intensity of pre-literate oral culture" — 距离缩短但冲突加剧。',
        distractors: [
          { optionId: 'A', type: '相反判断', why: '麦克卢汉明确说地球村"不是和平乌托邦"' },
        ],
        vocabNotes: ['tribal adj. 部落的', 'utopia n. 乌托邦'],
        score: 2,
      },
      {
        id: 'sp12-q3', kind: 'choice', stem: 'The distinction between "hot" and "cool" media is based on:',
        options: [
          { id: 'A', text: 'the temperature of the device' },
          { id: 'B', text: 'how much audience participation is required' },
          { id: 'C', text: 'whether the content is fictional or factual' },
          { id: 'D', text: 'the cost of the technology' },
        ],
        correctIds: ['B'],
        analysis: '第三段 "Cool media...leave gaps that the audience must actively fill" — 冷媒介需要更多参与。',
        distractors: [
          { optionId: 'A', type: '望文生义', why: 'hot/cool 是隐喻，不是实际温度' },
        ],
        vocabNotes: ['participation n. 参与', 'paradoxically adv. 矛盾地'],
        score: 2,
      },
    ],
    tips: ['理解麦克卢汉的核心隐喻：媒介 ≠ 容器，而是塑造力量', '注意 hot/cool media 的定义与直觉相反'],
    vocabNotes: ['medium n. 媒介', 'discourse n. 话语', 'tribal adj. 部落的', 'utopia n. 乌托邦', 'participation n. 参与'],
  },

  // ════════════════════════════════════════════════════════
  // 13. 福柯：全景监狱
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-13',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'The New York Review of Books',
    title: 'The Panopticon: Foucault on Surveillance and Power',
    suggestedMinutes: 8,
    passage: `In 1785, the philosopher Jeremy Bentham designed a prison called the Panopticon: a circular building with cells arranged around a central watchtower. Every inmate could be observed at any moment, but no inmate could know whether they were being watched at any given moment. The genius of the design was that surveillance became self-enforcing — prisoners, uncertain of the watcher's gaze, would regulate their own behaviour.

Michel Foucault seized upon Bentham's design as a metaphor for modern power. In "Discipline and Punish" (1975), he argued that the Panopticon represented a fundamental shift in how power operates. Pre-modern power was spectacular: public executions, chain gangs, visible displays of sovereign authority. Modern power, by contrast, is disciplinary: it operates through internalised surveillance, routine examination, and the constant possibility of being watched.

Foucault traced this shift through changes in punishment. The public execution — a spectacle of sovereign violence — gave way to the prison, where punishment became invisible, administrative, and continuous. The goal was no longer to terrify the public but to reform the individual through constant observation and classification. Schools, hospitals, factories, and military barracks all adopted the same Panoptic logic: observe, classify, normalise.

The implications for the digital age are immediate. We carry Panopticons in our pockets — smartphones that track location, browsing history, and social connections. Social media creates a voluntary Panopticon: we curate our behaviour for an imagined audience of followers, performing normalcy without anyone needing to watch from a tower. CCTV cameras, credit scores, and algorithmic profiling extend the logic further: power operates not through visible force but through the internalised awareness that we are always potentially being watched.

Foucault's insight was that the most effective power is the kind you don't notice — the kind you enforce upon yourself.`,
    passageAnnotations: [
      { id: 'sp13-a1', type: 'claim', text: 'the Panopticon represented a fundamental shift in how power operates', note: '核心论点：全景监狱代表了权力运作方式的根本转变' },
      { id: 'sp13-a2', type: 'evidence', text: 'The public execution gave way to the prison, where punishment became invisible, administrative, and continuous', note: '证据：从公开处刑到隐形监狱的转变' },
      { id: 'sp13-a3', type: 'keyword', text: 'disciplinary power', note: '关键概念：规训权力 — 通过内化监视运作' },
      { id: 'sp13-a4', type: 'attitude', text: 'the most effective power is the kind you don\'t notice — the kind you enforce upon yourself', note: '作者态度：最有效的权力是你对自己施加的权力' },
    ],
    items: [
      {
        id: 'sp13-q1', kind: 'choice', stem: 'The genius of the Panopticon design was that:',
        options: [
          { id: 'A', text: 'prisoners could see each other at all times' },
          { id: 'B', text: 'the watchtower was hidden from view' },
          { id: 'C', text: 'surveillance became self-enforcing through uncertainty' },
          { id: 'D', text: 'prisoners were physically restrained' },
        ],
        correctIds: ['C'],
        analysis: '第一段 "surveillance became self-enforcing — prisoners, uncertain of the watcher\'s gaze, would regulate their own behaviour" — 不确定性使监视自动生效。',
        distractors: [
          { optionId: 'A', type: '无中生有', why: '设计重点是囚犯被中央塔监视，不是囚犯互相监视' },
        ],
        vocabNotes: ['enforce v. 执行', 'inmate n. 囚犯'],
        score: 2,
      },
      {
        id: 'sp13-q2', kind: 'choice', stem: 'Foucault argued that modern power differs from pre-modern power in that modern power:',
        options: [
          { id: 'A', text: 'relies on spectacular public displays' },
          { id: 'B', text: 'operates through internalised surveillance and classification' },
          { id: 'C', text: 'is less effective than pre-modern power' },
          { id: 'D', text: 'is only exercised in prisons' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "Modern power...is disciplinary: it operates through internalised surveillance, routine examination, and the constant possibility of being watched" — 规训权力通过内化运作。',
        distractors: [
          { optionId: 'A', type: '相反判断', why: '这是前现代权力的特征，不是现代权力的' },
        ],
        vocabNotes: ['disciplinary adj. 规训的', 'sovereign adj. 主权的', 'normalise v. 常态化'],
        score: 2,
      },
      {
        id: 'sp13-q3', kind: 'choice', stem: 'The passage suggests that social media functions as a Panopticon because:',
        options: [
          { id: 'A', text: 'it uses physical surveillance cameras' },
          { id: 'B', text: 'governments can read all private messages' },
          { id: 'C', text: 'users curate their behaviour for an imagined audience' },
          { id: 'D', text: 'it prevents people from expressing opinions' },
        ],
        correctIds: ['C'],
        analysis: '第四段 "we curate our behaviour for an imagined audience of followers, performing normalcy without anyone needing to watch from a tower" — 用户为假想观众自我审查。',
        distractors: [
          { optionId: 'A', type: '过度具体化', why: '社交媒体的全景监狱逻辑是心理的，不是物理摄像头' },
        ],
        vocabNotes: ['curate v. 策划', 'algorithmic adj. 算法的'],
        score: 2,
      },
    ],
    tips: ['理解福柯的核心区分：前现代权力 = 展示，现代权力 = 内化监视', '注意全景监狱逻辑在数字时代的延伸'],
    vocabNotes: ['panopticon n. 全景监狱', 'disciplinary adj. 规训的', 'surveillance n. 监视', 'normalise v. 常态化', 'internalise v. 内化'],
  },

  // ════════════════════════════════════════════════════════
  // 14. 海德格尔：技术之问
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-14',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Aeon',
    title: 'Heidegger and the Question Concerning Technology',
    suggestedMinutes: 8,
    passage: `Martin Heidegger's 1954 essay "The Question Concerning Technology" is one of the most influential — and most misunderstood — philosophical texts about technology. It is not, as many assume, an attack on machines. It is an investigation into what technology reveals about the nature of Being itself.

Heidegger begins with a distinction between ancient and modern technology. A windmill, he notes, works with the wind — it harnesses a natural force without exhausting it. A hydroelectric dam, by contrast, transforms the Rhine River into a standing reserve of energy: the river ceases to be a river and becomes a power source. This transformation, Heidegger argues, is not merely technical but ontological — it changes what the river is.

Modern technology, in Heidegger's analysis, enframes the world as "standing reserve" — resources to be ordered, optimised, and exploited. A forest becomes timber, a mountain becomes ore, a river becomes electricity. The danger is not that machines are destructive but that this enframing becomes the only way we see the world. We forget that the forest was once sacred, that the river was once a god, that nature was once something other than a warehouse.

Heidegger's most provocative claim is that technology is not merely a human activity but a mode of revealing — a way in which Being discloses itself. The essence of technology, he writes, is nothing technological. It is a way of seeing that reduces everything to calculable, optimisable resources. The antidote, Heidegger suggests, is not to reject technology but to cultivate a different relationship with Being — through art, through wonder, through what he calls "releasement toward things."

Heidegger's essay remains a touchstone for philosophers of technology, who continue to debate whether his insights offer genuine alternatives or merely poetic resistance to inevitable progress.`,
    passageAnnotations: [
      { id: 'sp14-a1', type: 'claim', text: 'Modern technology enframes the world as standing reserve — resources to be ordered, optimised, and exploited', note: '核心论点：现代技术将世界框定为待命资源' },
      { id: 'sp14-a2', type: 'evidence', text: 'A windmill works with the wind; a hydroelectric dam transforms the Rhine into a standing reserve', note: '对比证据：风车 vs 水电大坝' },
      { id: 'sp14-a3', type: 'keyword', text: 'enframing', note: '关键概念：座架/框定 — 海德格尔对现代技术本质的描述' },
      { id: 'sp14-a4', type: 'attitude', text: 'the essence of technology is nothing technological', note: '作者态度：技术的本质不是技术性的' },
    ],
    items: [
      {
        id: 'sp14-q1', kind: 'choice', stem: 'Heidegger\'s example of the Rhine River being transformed into a hydroelectric dam illustrates:',
        options: [
          { id: 'A', text: 'the efficiency of modern engineering' },
          { id: 'B', text: 'how modern technology changes the ontological status of natural things' },
          { id: 'C', text: 'the superiority of modern over ancient technology' },
          { id: 'D', text: 'the environmental damage caused by dams' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "the river ceases to be a river and becomes a power source...is not merely technical but ontological" — 技术改变了事物的存在状态。',
        distractors: [
          { optionId: 'D', type: '过度具体化', why: '海德格尔关心的不是环境问题，而是存在论问题' },
        ],
        vocabNotes: ['ontological adj. 存在论的', 'harness v. 利用'],
        score: 2,
      },
      {
        id: 'sp14-q2', kind: 'choice', stem: 'Heidegger\'s concept of "enframing" (Gestell) refers to:',
        options: [
          { id: 'A', text: 'the physical frame that holds a machine together' },
          { id: 'B', text: 'a way of seeing that reduces everything to calculable resources' },
          { id: 'C', text: 'the aesthetic design of modern buildings' },
          { id: 'D', text: 'the legal framework governing technology' },
        ],
        correctIds: ['B'],
        analysis: '第四段 "It is a way of seeing that reduces everything to calculable, optimisable resources" — 座架是一种将一切化约为可计算资源的看待方式。',
        distractors: [
          { optionId: 'A', type: '望文生义', why: 'enframing 不是物理框架，是存在论层面的框定' },
        ],
        vocabNotes: ['standing reserve n. 待命资源', 'releasement n. 泰然任之'],
        score: 2,
      },
      {
        id: 'sp14-q3', kind: 'choice', stem: 'Heidegger\'s proposed antidote to the danger of technology is:',
        options: [
          { id: 'A', text: 'to reject all modern technology' },
          { id: 'B', text: 'to regulate technology through government' },
          { id: 'C', text: 'to cultivate a different relationship with Being through art and wonder' },
          { id: 'D', text: 'to return to pre-industrial society' },
        ],
        correctIds: ['C'],
        analysis: '第四段 "The antidote...is not to reject technology but to cultivate a different relationship with Being — through art, through wonder" — 不是拒绝技术，而是改变关系。',
        distractors: [
          { optionId: 'A', type: '相反判断', why: '海德格尔明确说"不是拒绝技术"' },
        ],
        vocabNotes: ['antidote n. 解药', 'touchstone n. 试金石'],
        score: 2,
      },
    ],
    tips: ['理解海德格尔的核心区分：古代技术 = 合作，现代技术 = 框定', '注意 "enframing" 不是物理框架，而是存在论层面的框定'],
    vocabNotes: ['ontological adj. 存在论的', 'enframing n. 座架/框定', 'standing reserve n. 待命资源', 'releasement n. 泰然任之', 'touchstone n. 试金石'],
  },

  // ════════════════════════════════════════════════════════
  // 15. 汉娜·阿伦特：平庸之恶
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-15',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'The New Yorker',
    title: 'Hannah Arendt: The Banality of Evil',
    suggestedMinutes: 8,
    passage: `In 1961, Hannah Arendt travelled to Jerusalem to report on the trial of Adolf Eichmann, the Nazi bureaucrat who had organised the logistics of the Holocaust. What she found shocked her — not because Eichmann was a monster, but because he was not one. He was, she concluded, terrifyingly ordinary.

Arendt coined the phrase "the banality of evil" to describe what she observed. Eichmann was not a sadist or a fanatic. He was a careerist — a man who followed orders, filed reports, and worried about promotions. He spoke in clichés and bureaucratic jargon. He claimed he had never harboured anti-Semitic feelings. He was, in Arendt's memorable phrase, "terribly and terrifyingly normal."

This observation provoked outrage. Critics accused Arendt of minimising the Holocaust, of exculpating Eichmann, of failing to understand the depths of Nazi evil. But Arendt's point was precisely the opposite: the most terrible evil does not require terrible people. It requires ordinary people who stop thinking — who follow orders without questioning, who accept the rules of the system they inhabit, who treat other human beings as administrative problems to be processed.

Arendt drew on her earlier work on totalitarianism, which argued that modern bureaucracy creates conditions in which responsibility is diffused across an entire system. No single person feels responsible for the final outcome because each person only handles one step in the process. The bureaucrat who signs the deportation order, the train driver who transports the prisoners, the guard who opens the gas — each can claim to be merely doing their job.

Arendt's concept remains urgently relevant. In an age of algorithmic decision-making, corporate bureaucracy, and political polarisation, her warning is clear: evil does not always look evil. Sometimes it looks like efficiency, like compliance, like just doing what you're told.`,
    passageAnnotations: [
      { id: 'sp15-a1', type: 'claim', text: 'the most terrible evil does not require terrible people. It requires ordinary people who stop thinking', note: '核心论点：最大的恶不需要可怕的人，只需要停止思考的普通人' },
      { id: 'sp15-a2', type: 'evidence', text: 'Eichmann was not a sadist or a fanatic. He was a careerist — a man who followed orders', note: '证据：艾希曼不是变态，只是官僚' },
      { id: 'sp15-a3', type: 'keyword', text: 'banality of evil', note: '关键概念：平庸之恶 — 阿伦特的核心贡献' },
      { id: 'sp15-a4', type: 'attitude', text: 'evil does not always look evil. Sometimes it looks like efficiency, like compliance', note: '作者态度：恶不一定看起来像恶，有时看起来像效率和服从' },
    ],
    items: [
      {
        id: 'sp15-q1', kind: 'choice', stem: 'Arendt was shocked at the Eichmann trial because:',
        options: [
          { id: 'A', text: 'Eichmann showed no remorse for his crimes' },
          { id: 'B', text: 'Eichmann was terrifyingly ordinary rather than a monster' },
          { id: 'C', text: 'Eichmann denied the Holocaust had happened' },
          { id: 'D', text: 'Eichmann was more intelligent than expected' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "Eichmann was not a sadist or a fanatic. He was a careerist...terribly and terrifyingly normal" — 令阿伦特震惊的是他的普通。',
        distractors: [
          { optionId: 'A', type: '无中生有', why: '阿伦特震惊的不是缺乏悔意，而是缺乏恶意' },
        ],
        vocabNotes: ['banality n. 平庸', 'careerist n. 野心家、追名逐利者'],
        score: 2,
      },
      {
        id: 'sp15-q2', kind: 'choice', stem: 'The "banality of evil" concept means that:',
        options: [
          { id: 'A', text: 'evil acts are always committed by ordinary people' },
          { id: 'B', text: 'ordinary people can commit great evil by stopping to think and following orders' },
          { id: 'C', text: 'evil is always banal and uninteresting' },
          { id: 'D', text: 'the Holocaust was not as evil as people think' },
        ],
        correctIds: ['B'],
        analysis: '第三段 "the most terrible evil does not require terrible people. It requires ordinary people who stop thinking" — 平庸之恶的核心含义。',
        distractors: [
          { optionId: 'D', type: '过度推断', why: '阿伦特不是在淡化大屠杀，而是在分析其发生条件' },
        ],
        vocabNotes: ['cliché n. 陈词滥调', 'bureaucratic adj. 官僚的'],
        score: 2,
      },
      {
        id: 'sp15-q3', kind: 'choice', stem: 'Arendt\'s earlier work on totalitarianism argued that modern bureaucracy:',
        options: [
          { id: 'A', text: 'prevents evil by creating clear chains of command' },
          { id: 'B', text: 'diffuses responsibility so no single person feels accountable' },
          { id: 'C', text: 'is more efficient than older forms of government' },
          { id: 'D', text: 'was invented by the Nazi regime' },
        ],
        correctIds: ['B'],
        analysis: '第四段 "modern bureaucracy creates conditions in which responsibility is diffused across an entire system" — 官僚体制分散了责任。',
        distractors: [
          { optionId: 'A', type: '相反判断', why: '阿伦特的观点恰恰相反 — 明确的命令链并不能防止恶' },
        ],
        vocabNotes: ['diffuse v. 分散', 'totalitarianism n. 极权主义'],
        score: 2,
      },
    ],
    tips: ['理解阿伦特的核心区分：恶不需要恶意，只需要不思考', '注意 "平庸之恶" 不是在为艾希曼开脱，而是在分析恶的发生条件'],
    vocabNotes: ['banality n. 平庸', 'careerist n. 野心家', 'cliché n. 陈词滥调', 'diffuse v. 分散', 'totalitarianism n. 极权主义'],
  },

  // ════════════════════════════════════════════════════════
  // 16. 瓦尔特·本雅明：机械复制时代的艺术
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-16',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'London Review of Books',
    title: 'Walter Benjamin: Art in the Age of Mechanical Reproduction',
    suggestedMinutes: 8,
    passage: `In 1936, Walter Benjamin published one of the twentieth century's most influential essays: "The Work of Art in the Age of Mechanical Reproduction." His central question was deceptively simple: what happens to art when it can be copied?

Before mechanical reproduction — printing, photography, film — every artwork had a unique existence. The Mona Lisa was in one place, at one time, seen by one person at a moment. This uniqueness, Benjamin argued, gave the artwork its "aura" — a sense of distance, authority, and presence that surrounded the original like an invisible halo.

Mechanical reproduction destroys the aura. A photograph of the Mona Lisa can be reproduced millions of times, placed in textbooks, projected on screens, printed on coffee mugs. The image becomes ubiquitous — available everywhere, to everyone, at any time. What is lost, Benjamin argued, is not the image itself but the ritual and authority that surrounded the original. Art was once tied to religious ceremony, courtly display, and the sacred space of the museum. Reproduction liberates art from these contexts — and in doing so, transforms its function entirely.

Benjamin saw this transformation as politically ambiguous. On one hand, the destruction of aura was democratising: mass culture gave ordinary people access to images and experiences previously reserved for elites. Film, in particular, created a new form of collective experience — audiences shared emotions simultaneously, creating what Benjamin called a "distraction" that was actually a new form of perception.

On the other hand, mechanical reproduction made art available for political manipulation. Fascism, Benjamin noted, aestheticised politics — turning war and violence into spectacle. Communism, he countered, should politicise art — turning aesthetic experience into a tool for social transformation. Benjamin's essay, written as fascism swept Europe, remains a warning about the political uses of mass culture.`,
    passageAnnotations: [
      { id: 'sp16-a1', type: 'claim', text: 'Mechanical reproduction destroys the aura...What is lost is not the image itself but the ritual and authority that surrounded the original', note: '核心论点：机械复制摧毁的不是图像，而是原作的仪式和权威' },
      { id: 'sp16-a2', type: 'evidence', text: 'A photograph of the Mona Lisa can be reproduced millions of times...The image becomes ubiquitous', note: '证据：蒙娜丽莎照片的无限复制' },
      { id: 'sp16-a3', type: 'keyword', text: 'aura', note: '关键概念：灵韵 — 本雅明对原作独特性的描述' },
      { id: 'sp16-a4', type: 'attitude', text: 'Fascism aestheticised politics...Communism should politicise art', note: '作者态度：法西斯主义将政治审美化，共产主义应将艺术政治化' },
    ],
    items: [
      {
        id: 'sp16-q1', kind: 'choice', stem: 'Benjamin\'s concept of "aura" refers to:',
        options: [
          { id: 'A', text: 'the physical glow of a painting under museum lighting' },
          { id: 'B', text: 'the sense of distance, authority, and presence surrounding an original artwork' },
          { id: 'C', text: 'the market value of a rare painting' },
          { id: 'D', text: 'the emotional response of the viewer' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "a sense of distance, authority, and presence that surrounded the original like an invisible halo" — 灵韵是原作的权威感和距离感。',
        distractors: [
          { optionId: 'A', type: '望文生义', why: 'aura 不是物理光线，是精神层面的' },
        ],
        vocabNotes: ['aura n. 灵韵', 'ubiquitous adj. 无处不在的'],
        score: 2,
      },
      {
        id: 'sp16-q2', kind: 'choice', stem: 'Benjamin saw mechanical reproduction as politically ambiguous because:',
        options: [
          { id: 'A', text: 'it made art more expensive and exclusive' },
          { id: 'B', text: 'it could both democratise culture and enable political manipulation' },
          { id: 'C', text: 'it destroyed all forms of artistic expression' },
          { id: 'D', text: 'it was only available to the wealthy' },
        ],
        correctIds: ['B'],
        analysis: '第四段 "the destruction of aura was democratising" + 末段 "mechanical reproduction made art available for political manipulation" — 既有民主化也有操纵。',
        distractors: [
          { optionId: 'A', type: '相反判断', why: '复制使艺术更便宜、更普及，不是更昂贵' },
        ],
        vocabNotes: ['aestheticise v. 审美化', 'distraction n. 分散注意力'],
        score: 2,
      },
      {
        id: 'sp16-q3', kind: 'choice', stem: 'The essay was written as a warning about:',
        options: [
          { id: 'A', text: 'the decline of traditional art schools' },
          { id: 'B', text: 'the political uses of mass culture under fascism' },
          { id: 'C', text: 'the superiority of photography over painting' },
          { id: 'D', text: 'the need to preserve all original artworks' },
        ],
        correctIds: ['B'],
        analysis: '末段 "Fascism...aestheticised politics — turning war and violence into spectacle" + "written as fascism swept Europe" — 对法西斯利用大众文化的警告。',
        distractors: [
          { optionId: 'D', type: '过度推断', why: '本雅明不是在呼吁保护原作，而是在分析复制的政治影响' },
        ],
        vocabNotes: ['manipulation n. 操纵', 'spectacle n. 奇观'],
        score: 2,
      },
    ],
    tips: ['理解本雅明的核心区分：灵韵（原作）vs 复制（去仪式化）', '注意 "政治模糊性" — 同一技术既可民主化也可被操纵'],
    vocabNotes: ['aura n. 灵韵', 'ubiquitous adj. 无处不在的', 'aestheticise v. 审美化', 'spectacle n. 奇观', 'manipulation n. 操纵'],
  },

  // ════════════════════════════════════════════════════════
  // 17. 庄周梦蝶：心灵哲学
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-17',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Philosophy Now',
    title: 'Zhuangzi\'s Butterfly: Philosophy of Mind',
    suggestedMinutes: 8,
    passage: `The most famous passage in the Zhuangzi — one of the foundational texts of Chinese philosophy — is disarmingly brief: "Once Zhuangzi dreamt he was a butterfly, a butterfly flitting and fluttering around, happy with himself and doing as he pleased. He didn't know he was Zhuangzi. Suddenly he woke up and there he was, solid and unmistakable Zhuangzi. But he didn't know if he was Zhuangzi who had dreamt he was a butterfly, or a butterfly dreaming he was Zhuangzi."

This parable, written around the fourth century BCE, anticipates questions that Western philosophy would not seriously address for two millennia. It is, on one reading, about the problem of other minds: how can we know that our experience of being conscious is not an illusion? Descartes would ask a similar question in 1641 — "How do I know I am not dreaming?" — but Zhuangzi goes further. Descartes concluded that he could be certain of his own existence (cogito ergo sum); Zhuangzi offers no such certainty.

The parable also raises the question of personal identity. If Zhuangzi can be a butterfly in his dream, and a butterfly can be Zhuangzi in its dream, then the boundary between self and other, between dreaming and waking, is not as stable as we assume. The Buddhist tradition, which influenced and was influenced by Daoism, would develop this insight into the doctrine of anatta — the absence of a fixed, permanent self.

Western philosophers have struggled with the same puzzle. Daniel Dennett has argued that consciousness is a kind of "user illusion" — a convenient fiction that the brain tells itself. Thomas Metzinger has proposed that the self is a "transparent self-model" — a representation so convincing that we cannot see through it. These ideas echo Zhuangzi's intuition that the self is not a thing but a process — not a butterfly or a philosopher, but the dreaming itself.

Zhuangzi's genius was to present these insights not as abstract arguments but as a story — a story that, like a dream, slips through your fingers the moment you try to grasp it.`,
    passageAnnotations: [
      { id: 'sp17-a1', type: 'claim', text: 'He didn\'t know if he was Zhuangzi who had dreamt he was a butterfly, or a butterfly dreaming he was Zhuangzi', note: '核心论点：自我与他者的边界不稳定' },
      { id: 'sp17-a2', type: 'evidence', text: 'Descartes would ask a similar question in 1641...but Zhuangzi goes further', note: '对比证据：笛卡尔与庄子的相似与超越' },
      { id: 'sp17-a3', type: 'keyword', text: 'personal identity', note: '关键概念：个人同一性 — 自我的本质是什么' },
      { id: 'sp17-a4', type: 'attitude', text: 'the self is not a thing but a process — not a butterfly or a philosopher, but the dreaming itself', note: '作者态度：自我不是实体，而是过程' },
    ],
    items: [
      {
        id: 'sp17-q1', kind: 'choice', stem: 'The passage suggests that Zhuangzi\'s parable anticipates Western philosophy by:',
        options: [
          { id: 'A', text: 'several years' },
          { id: 'B', text: 'several centuries' },
          { id: 'C', text: 'about two thousand years' },
          { id: 'D', text: 'exactly the same time' },
        ],
        correctIds: ['C'],
        analysis: '第二段 "anticipates questions that Western philosophy would not seriously address for two millennia" — 庄子比西方早两千年。',
        distractors: [
          { optionId: 'B', type: '程度错误', why: '不是几百年，是两千年' },
        ],
        vocabNotes: ['anticipate v. 预见', 'millennia n. 千年（复数）'],
        score: 2,
      },
      {
        id: 'sp17-q2', kind: 'choice', stem: 'Zhuangzi goes further than Descartes because:',
        options: [
          { id: 'A', text: 'Zhuangzi was a more skilled writer' },
          { id: 'B', text: 'Zhuangzi did not even conclude that he could be certain of his own existence' },
          { id: 'C', text: 'Descartes was a Christian and Zhuangzi was not' },
          { id: 'D', text: 'Zhuangzi lived in a different country' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "Descartes concluded that he could be certain of his own existence; Zhuangzi offers no such certainty" — 庄子甚至没有得出"我思故我在"的确定性。',
        distractors: [
          { optionId: 'A', type: '无关选项', why: '写作技巧不是哲学深度的衡量标准' },
        ],
        vocabNotes: ['cogito ergo sum 我思故我在（拉丁语）'],
        score: 2,
      },
      {
        id: 'sp17-q3', kind: 'choice', stem: 'The final paragraph suggests that Zhuangzi\'s genius lies in:',
        options: [
          { id: 'A', text: 'using logical arguments to prove his point' },
          { id: 'B', text: 'presenting philosophical insights as a story rather than abstract argument' },
          { id: 'C', text: 'writing in a language that is easy to translate' },
          { id: 'D', text: 'being the first philosopher to discuss dreams' },
        ],
        correctIds: ['B'],
        analysis: '末段 "Zhuangzi\'s genius was to present these insights not as abstract arguments but as a story" — 用故事而非抽象论证表达哲学洞见。',
        distractors: [
          { optionId: 'A', type: '相反判断', why: '庄子恰恰不是用逻辑论证，而是用寓言' },
        ],
        vocabNotes: ['anatta n. 无我（佛教术语）', 'transparent adj. 透明的'],
        score: 2,
      },
    ],
    tips: ['理解庄子与笛卡尔的核心差异：笛卡尔找到了确定性，庄子没有', '注意 "自我不是实体，而是过程" 这一现代心灵哲学的核心观点'],
    vocabNotes: ['anticipate v. 预见', 'millennia n. 千年', 'anatta n. 无我', 'cogito ergo sum 我思故我在', 'transparent adj. 透明的'],
  },

  // ════════════════════════════════════════════════════════
  // 18. 忒修斯之船：什么使你成为你？
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-18',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'BBC Culture',
    title: 'The Ship of Theseus: What Makes You You?',
    suggestedMinutes: 8,
    passage: `The Ship of Theseus is one of the oldest thought experiments in Western philosophy. Plutarch, writing in the first century CE, told the story of a ship preserved by the Athenians as a memorial to their hero Theseus. Over the years, as its wooden planks rotted, each was replaced with new timber. Eventually, every original piece had been swapped out. The question: was it still the same ship?

The problem deepens when Plutarch adds a twist: what if someone collected all the old, discarded planks and reassembled them into a ship? Which one is the "real" Ship of Theseus — the one in the harbour, or the one made from the original parts?

This puzzle has been debated for two thousand years because it exposes a fundamental problem with our concept of identity. We intuitively feel that things — and people — persist through time. You are the same person you were ten years ago, despite the fact that nearly every cell in your body has been replaced. But on what basis do we make this claim? Not physical continuity, since your matter has changed. Not psychological continuity, since your memories, beliefs, and desires have also changed.

The philosopher John Locke proposed that personal identity is rooted in consciousness — specifically, in memory. You are the same person as your ten-year-old self because you remember being that child. But this solution creates its own puzzles: if you develop amnesia and forget your childhood entirely, do you cease to be the same person? And what about false memories — if you vividly "remember" events that never happened, does that make them part of your identity?

Derek Parfit, perhaps the most important philosopher of personal identity in the twentieth century, argued that the question itself is confused. There is no deep fact about whether you are "the same person" — there is only psychological continuity and connectedness, which come in degrees. Identity, Parfit concluded, is not what matters. What matters is survival — the continuation of your experiences, values, and relationships, even if the "you" that carries them is not, in any metaphysically robust sense, the same entity.`,
    passageAnnotations: [
      { id: 'sp18-a1', type: 'claim', text: 'Identity, Parfit concluded, is not what matters. What matters is survival — the continuation of your experiences, values, and relationships', note: '核心论点：同一性不重要，重要的是延续性' },
      { id: 'sp18-a2', type: 'evidence', text: 'nearly every cell in your body has been replaced', note: '物理证据：人体细胞几乎全部替换' },
      { id: 'sp18-a3', type: 'keyword', text: 'Ship of Theseus', note: '关键概念：忒修斯之船 — 最古老的思想实验之一' },
      { id: 'sp18-a4', type: 'attitude', text: 'the question itself is confused. There is no deep fact about whether you are the same person', note: '作者态度：问题本身是混乱的，没有关于同一性的深层事实' },
    ],
    items: [
      {
        id: 'sp18-q1', kind: 'choice', stem: 'The Ship of Theseus thought experiment raises the problem of:',
        options: [
          { id: 'A', text: 'whether ancient ships should be preserved' },
          { id: 'B', text: 'how identity persists through material change' },
          { id: 'C', text: 'whether Athenians were good sailors' },
          { id: 'D', text: 'how to build ships from old materials' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "it exposes a fundamental problem with our concept of identity" — 忒修斯之船揭示了同一性如何在物质变化中持续的问题。',
        distractors: [
          { optionId: 'A', type: '望文生义', why: '不是关于文物保护，是关于同一性哲学' },
        ],
        vocabNotes: ['plank n. 木板', 'persist v. 持续存在'],
        score: 2,
      },
      {
        id: 'sp18-q2', kind: 'choice', stem: 'Locke\'s theory of personal identity based on memory faces the problem that:',
        options: [
          { id: 'A', text: 'memory is always perfectly accurate' },
          { id: 'B', text: 'amnesia would seem to destroy personal identity' },
          { id: 'C', text: 'everyone has the same memories' },
          { id: 'D', text: 'memory cannot be scientifically measured' },
        ],
        correctIds: ['B'],
        analysis: '第四段 "if you develop amnesia and forget your childhood entirely, do you cease to be the same person?" — 遗忘似乎会摧毁同一性。',
        distractors: [
          { optionId: 'A', type: '相反判断', why: '文章提到虚假记忆说明记忆并不总是准确的' },
        ],
        vocabNotes: ['amnesia n. 失忆症', 'psychological adj. 心理的'],
        score: 2,
      },
      {
        id: 'sp18-q3', kind: 'choice', stem: 'Parfit argued that what matters for personal identity is:',
        options: [
          { id: 'A', text: 'having the same physical body' },
          { id: 'B', text: 'having the same soul' },
          { id: 'C', text: 'psychological continuity and connectedness, not strict identity' },
          { id: 'D', text: 'being remembered by others' },
        ],
        correctIds: ['C'],
        analysis: '末段 "There is only psychological continuity and connectedness, which come in degrees" — 心理连续性和连接性，不是严格同一性。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '帕菲特明确否认物理身体是同一性的基础' },
        ],
        vocabNotes: ['metaphysically adv. 形而上学地', 'continuity n. 连续性'],
        score: 2,
      },
    ],
    tips: ['理解帕菲特的核心区分：同一性（identity）vs 延续性（survival）', '注意思想实验的两层困境：替换的船 vs 重组的船'],
    vocabNotes: ['plank n. 木板', 'persist v. 持续存在', 'amnesia n. 失忆症', 'continuity n. 连续性', 'metaphysically adv. 形而上学地'],
  },

  // ════════════════════════════════════════════════════════
  // 19. 贝叶斯：不确定性推理
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-19',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Nautilus',
    title: 'Thomas Bayes: Reasoning Under Uncertainty',
    suggestedMinutes: 8,
    passage: `Thomas Bayes was an eighteenth-century English minister whose most famous work was published after his death. His essay, "An Essay towards solving a Problem in the Doctrine of Chances," introduced a formula that would eventually reshape statistics, artificial intelligence, and our understanding of rational thought itself.

Bayes' theorem addresses a simple but profound problem: how should we update our beliefs when we encounter new evidence? The formula is elegant: the probability of a hypothesis given the evidence equals the probability of the evidence given the hypothesis, multiplied by the prior probability of the hypothesis, divided by the total probability of the evidence. In symbols: P(H|E) = P(E|H) × P(H) / P(E).

The key insight is the prior — the probability you assign to a hypothesis before seeing the evidence. Bayesian reasoning is not purely objective; it starts with a subjective estimate and revises it. If you believe strongly that it will rain tomorrow (high prior), a partly cloudy sky (weak evidence) will not change your mind much. If you are neutral on the question (moderate prior), the same evidence will shift your belief more significantly.

This framework has revolutionary implications for medicine, law, and everyday reasoning. Consider a medical test for a rare disease. The test is 99% accurate. You test positive. What is the probability you actually have the disease? Most people — including many doctors — answer 99%. But if the disease affects only one in ten thousand people, Bayes' theorem shows the actual probability is less than 1%. The base rate (the prior) matters enormously.

Bayesian reasoning also explains why conspiracy theories are so persistent. When someone is deeply committed to a hypothesis (extremely high prior), no amount of evidence can shift their belief significantly. Every piece of counter-evidence is reinterpreted as further confirmation — the government is covering up the truth, which proves the conspiracy is real. Bayesian updating, taken to extremes, can become a trap: the stronger your prior, the less evidence matters.

Bayes' theorem was largely ignored for two centuries. Today, it powers spam filters, search engines, medical diagnostics, and machine learning — a formula ahead of its time.`,
    passageAnnotations: [
      { id: 'sp19-a1', type: 'claim', text: 'Bayesian reasoning is not purely objective; it starts with a subjective estimate and revises it', note: '核心论点：贝叶斯推理从主观先验开始，然后修正' },
      { id: 'sp19-a2', type: 'evidence', text: 'If the disease affects only one in ten thousand people, Bayes\' theorem shows the actual probability is less than 1%', note: '数学证据：罕见病检测的真实阳性率远低于直觉' },
      { id: 'sp19-a3', type: 'keyword', text: 'prior', note: '关键概念：先验概率 — 看到证据之前的主观估计' },
      { id: 'sp19-a4', type: 'attitude', text: 'the stronger your prior, the less evidence matters', note: '作者态度：先验越强，证据越不重要（既是优势也是陷阱）' },
    ],
    items: [
      {
        id: 'sp19-q1', kind: 'choice', stem: 'The key insight of Bayesian reasoning is:',
        options: [
          { id: 'A', text: 'probability is always objective' },
          { id: 'B', text: 'our beliefs should be updated based on prior probability and new evidence' },
          { id: 'C', text: 'mathematics cannot be applied to real-world problems' },
          { id: 'D', text: 'all medical tests are unreliable' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "how should we update our beliefs when we encounter new evidence" + 公式 P(H|E) = P(E|H) × P(H) / P(E) — 核心是根据先验和新证据更新信念。',
        distractors: [
          { optionId: 'A', type: '相反判断', why: '贝叶斯推理恰恰承认概率是主观的（先验）' },
        ],
        vocabNotes: ['prior n. 先验', 'posterior n. 后验'],
        score: 2,
      },
      {
        id: 'sp19-q2', kind: 'choice', stem: 'In the medical test example, why is the actual probability of having the disease less than 1%?',
        options: [
          { id: 'A', text: 'because the test is not actually 99% accurate' },
          { id: 'B', text: 'because the base rate of the disease is very low (one in ten thousand)' },
          { id: 'C', text: 'because doctors make calculation errors' },
          { id: 'D', text: 'because the patient is lying about symptoms' },
        ],
        correctIds: ['B'],
        analysis: '第四段 "if the disease affects only one in ten thousand people" — 基础率（先验）极低导致真实阳性率远低于测试准确率。',
        distractors: [
          { optionId: 'A', type: '无中生有', why: '测试准确率确实是 99%，问题在于基础率' },
        ],
        vocabNotes: ['base rate n. 基础率', 'diagnostics n. 诊断学'],
        score: 2,
      },
      {
        id: 'sp19-q3', kind: 'choice', stem: 'The passage suggests that conspiracy theories persist because:',
        options: [
          { id: 'A', text: 'conspiracy theorists are unintelligent' },
          { id: 'B', text: 'extremely strong priors make evidence nearly irrelevant to belief updating' },
          { id: 'C', text: 'there is always some evidence for conspiracy theories' },
          { id: 'D', text: 'Bayesian reasoning does not apply to social phenomena' },
        ],
        correctIds: ['B'],
        analysis: '第五段 "When someone is deeply committed to a hypothesis (extremely high prior), no amount of evidence can shift their belief significantly" — 极强先验使证据几乎无关。',
        distractors: [
          { optionId: 'A', type: '无关选项', why: '文章不是在批评阴谋论者的智力' },
        ],
        vocabNotes: ['reinterpret v. 重新解释', 'counter-evidence n. 反证'],
        score: 2,
      },
    ],
    tips: ['理解贝叶斯公式的核心：P(H|E) = P(E|H) × P(H) / P(E)', '注意先验的双重性：既是理性的起点，也可能是偏见的来源'],
    vocabNotes: ['prior n. 先验', 'posterior n. 后验', 'base rate n. 基础率', 'diagnostics n. 诊断学', 'reinterpret v. 重新解释'],
  },

  // ════════════════════════════════════════════════════════
  // 20. 塔勒布：黑天鹅
  // ════════════════════════════════════════════════════════
  {
    id: 'sp-20',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Financial Times',
    title: 'The Black Swan: Nassim Taleb on the Limits of Prediction',
    suggestedMinutes: 8,
    passage: `For centuries, Europeans believed that all swans were white. It was a certainty grounded in millennia of observation — every swan ever recorded was white. Then, in 1697, Dutch explorers discovered black swans in Australia. A single observation destroyed a universal claim.

Nassim Nicholas Taleb borrowed this image for his 2007 book "The Black Swan," which argues that history is dominated by rare, unpredictable events that we rationalise only after they occur. The fall of the Berlin Wall, the rise of the internet, the 2008 financial crisis — all were "black swans": events that were extreme outliers, carried massive impact, and were retrospectively explained as inevitable.

Taleb identifies three characteristics of black swans. First, they are outliers — they lie outside the realm of regular expectations. Second, they carry extreme impact. Third, we concoct explanations for them after the fact, creating the illusion that they were predictable. This third characteristic is the most dangerous: our narrative fallacy — the tendency to construct stories that make the past seem orderly — blinds us to the role of randomness.

The problem, Taleb argues, is that we use the wrong tools to predict the future. Bell curves and Gaussian distributions work well for "mediocristan" — a world where individual events cluster around the average. Height, weight, and blood pressure all follow bell curves. But wealth, book sales, and social media followers belong to "extremistan" — a world where a single outlier can dominate the entire distribution. In extremistan, the bell curve is not just inaccurate but dangerous, because it systematically underestimates the probability of extreme events.

Taleb's practical advice is to build systems that are "antifragile" — not merely robust (able to withstand shocks) but actually strengthened by them. A fragile system breaks under stress; a robust system survives; an antifragile system improves. The human immune system, evolution, and the scientific method are all antifragile: they benefit from disorder.

"The Black Swan" is ultimately a book about epistemic humility — the recognition that we know less than we think, and that the most important events are precisely those we cannot predict.`,
    passageAnnotations: [
      { id: 'sp20-a1', type: 'claim', text: 'history is dominated by rare, unpredictable events that we rationalise only after they occur', note: '核心论点：历史由罕见的、不可预测的事件主导' },
      { id: 'sp20-a2', type: 'evidence', text: 'The fall of the Berlin Wall, the rise of the internet, the 2008 financial crisis — all were black swans', note: '证据：柏林墙倒塌、互联网兴起、2008 金融危机' },
      { id: 'sp20-a3', type: 'keyword', text: 'black swan', note: '关键概念：黑天鹅 — 极端、不可预测、事后被合理化' },
      { id: 'sp20-a4', type: 'attitude', text: 'the most important events are precisely those we cannot predict', note: '作者态度：最重要的事件恰恰是我们无法预测的' },
    ],
    items: [
      {
        id: 'sp20-q1', kind: 'choice', stem: 'Taleb defines a "black swan" event as one that:',
        options: [
          { id: 'A', text: 'is predicted by experts before it happens' },
          { id: 'B', text: 'is an extreme outlier with massive impact that is retrospectively explained as inevitable' },
          { id: 'C', text: 'follows a normal distribution' },
          { id: 'D', text: 'only occurs in financial markets' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "events that were extreme outliers, carried massive impact, and were retrospectively explained as inevitable" — 黑天鹅三特征。',
        distractors: [
          { optionId: 'A', type: '相反判断', why: '黑天鹅恰恰是不可预测的' },
        ],
        vocabNotes: ['outlier n. 离群值', 'retrospectively adv. 回顾性地'],
        score: 2,
      },
      {
        id: 'sp20-q2', kind: 'choice', stem: 'The distinction between "mediocristan" and "extremistan" means that:',
        options: [
          { id: 'A', text: 'bell curves work well for all types of data' },
          { id: 'B', text: 'some domains are dominated by averages while others are dominated by extreme outliers' },
          { id: 'C', text: 'height and wealth follow the same distribution' },
          { id: 'D', text: 'extremistan is a real country' },
        ],
        correctIds: ['B'],
        analysis: '第四段 "Height, weight, and blood pressure all follow bell curves. But wealth, book sales...belong to extremistan" — 两个世界遵循不同分布。',
        distractors: [
          { optionId: 'A', type: '相反判断', why: '塔勒布明确说钟形曲线在极端斯坦"不仅不准确而且危险"' },
        ],
        vocabNotes: ['Gaussian adj. 高斯的', 'distribution n. 分布'],
        score: 2,
      },
      {
        id: 'sp20-q3', kind: 'choice', stem: 'An "antifragile" system is one that:',
        options: [
          { id: 'A', text: 'breaks under stress' },
          { id: 'B', text: 'survives stress unchanged' },
          { id: 'C', text: 'is actually strengthened by stress and disorder' },
          { id: 'D', text: 'avoids all forms of stress' },
        ],
        correctIds: ['C'],
        analysis: '第五段 "an antifragile system improves...The human immune system, evolution, and the scientific method are all antifragile: they benefit from disorder" — 反脆弱系统从混乱中获益。',
        distractors: [
          { optionId: 'B', type: '偷换概念', why: 'robust（稳健）才是不受影响，antifragile 是因压力而变强' },
        ],
        vocabNotes: ['antifragile adj. 反脆弱的', 'epistemic adj. 认识论的'],
        score: 2,
      },
    ],
    tips: ['理解塔勒布的三层区分：fragile → robust → antifragile', '注意 mediocristan vs extremistan 的核心差异'],
    vocabNotes: ['outlier n. 离群值', 'retrospectively adv. 回顾性地', 'antifragile adj. 反脆弱的', 'epistemic adj. 认识论的', 'narrative fallacy n. 叙事谬误'],
  },
]
