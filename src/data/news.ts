import type { Question } from '../types'

/**
 * 外刊精读文章（6 篇，BBC / The Economist / CNN 风格）
 * 每篇 200-400 词，配词汇注释 + 阅读理解题 + 逻辑标注
 */
export const newsArticles: Question[] = [
  // ──── 1 ────
  {
    id: 'news-1',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'The Economist',
    title: 'Why Your Brain Prefers Procrastination',
    suggestedMinutes: 8,
    passage: `You have an important deadline tomorrow, yet you find yourself reorganising your bookshelf by colour. This familiar ritual — procrastination — is not a moral failing but a battle in your brain between two neural systems, and the impulsive limbic system often wins.

Psychologists at the University of California have identified that procrastination is fundamentally an emotional regulation problem, not a time management issue. When faced with a task that triggers anxiety, self-doubt, or boredom, the amygdala — the brain's threat-detection centre — fires up as if facing a physical danger. The prefrontal cortex, responsible for long-term planning, simply cannot compete with this immediate emotional response.

What makes this particularly insidious is the "present bias": our brains are wired to value immediate rewards over future ones. Watching a short video offers instant dopamine, while finishing a report promises only the distant satisfaction of completion. The temporal discounting effect means that a reward available now feels roughly twice as valuable as an identical reward available tomorrow.

However, researchers have found effective countermeasures. The "five-minute rule" — committing to work on a task for just five minutes — often bypasses the amygdala's resistance because the commitment feels trivial. Once engaged, the brain's task-positive network activates, and the emotional barrier dissolves. Similarly, breaking large tasks into specific, concrete actions ("open the document and write the first sentence") rather than abstract goals ("write the report") reduces the amygdala's threat response.

Understanding procrastination as a neurological tug-of-war rather than a character defect is liberating. You are not lazy; you are human. And with the right strategies, you can gently coax your prefrontal cortex back into the driver's seat.`,
    passageAnnotations: [
      { id: 'n1-a1', type: 'claim', text: 'procrastination is fundamentally an emotional regulation problem', note: '核心论点：拖延是情绪调节问题，非时间管理问题' },
      { id: 'n1-a2', type: 'evidence', text: 'Psychologists at the University of California have identified', note: '学术研究支撑论点' },
      { id: 'n1-a3', type: 'attitude', text: 'You are not lazy; you are human', note: '作者态度：去道德化，共情读者' },
      { id: 'n1-a4', type: 'keyword', text: 'present bias', note: '关键概念：即时偏误 — 高估当下回报' },
    ],
    items: [
      {
        id: 'n1-q1', kind: 'choice', stem: 'According to the passage, procrastination is primarily caused by:',
        options: [
          { id: 'A', text: 'poor time management skills' },
          { id: 'B', text: 'difficulty regulating emotions' },
          { id: 'C', text: 'lack of motivation for the task' },
          { id: 'D', text: 'excessive dopamine from social media' },
        ],
        correctIds: ['B'],
        analysis: '第二段首句明确指出 "procrastination is fundamentally an emotional regulation problem, not a time management issue"，对应选项 B。A 是文章明确否定的传统观点。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '文章明确否定了这是时间管理问题，这恰恰是传统误解' },
          { optionId: 'D', type: '无中生有', why: '文章提到 dopamine 是为了解释即时偏误，未说它是主要原因' },
        ],
        vocabNotes: ['ritual n. 例行公事，习惯性行为', 'limbic system 边缘系统（大脑情绪中枢）'],
        score: 2,
      },
      {
        id: 'n1-q2', kind: 'choice', stem: 'The "five-minute rule" works because:',
        options: [
          { id: 'A', text: 'five minutes is enough to finish most tasks' },
          { id: 'B', text: 'the commitment is so small that it bypasses the amygdala\'s resistance' },
          { id: 'C', text: 'it activates the brain\'s dopamine reward system' },
          { id: 'D', text: 'it forces the prefrontal cortex to override emotions' },
        ],
        correctIds: ['B'],
        analysis: '第四段 "the commitment feels trivial...the amygdala\'s resistance" 直接对应 B。',
        distractors: [
          { optionId: 'A', type: '过度推断', why: '文章未说五分钟足够完成大多数任务' },
          { optionId: 'D', type: '偷换概念', why: '不是"强制"override，而是"绕过"bypass' },
        ],
        vocabNotes: ['bypass v. 绕过，避开', 'trivial adj. 微不足道的'],
        score: 2,
      },
      {
        id: 'n1-q3', kind: 'choice', stem: 'The author\'s tone towards procrastinators can best be described as:',
        options: [
          { id: 'A', text: 'critical and judgmental' },
          { id: 'B', text: 'neutral and detached' },
          { id: 'C', text: 'understanding and reassuring' },
          { id: 'D', text: 'humorous and sarcastic' },
        ],
        correctIds: ['C'],
        analysis: '最后段 "You are not lazy; you are human...liberating" 表明作者态度是理解和安慰的。',
        distractors: [
          { optionId: 'B', type: '局部正确', why: '科普风格看似中性，但结尾情绪色彩强烈' },
        ],
        vocabNotes: ['liberating adj. 令人解脱的', 'coax v. 耐心地引导'],
        score: 2,
      },
    ],
    tips: ['先看结构标注（claim/evidence/attitude），再逐题作答', '注意 "present bias" 和 "temporal discounting" 这两个关键概念'],
    vocabNotes: ['procrastination n. 拖延', 'amygdala n. 杏仁核（大脑恐惧中枢）', 'prefrontal cortex 前额叶皮层（负责计划决策）', 'insidious adj. 潜伏的，暗中为害的', 'temporal discounting 时间折扣效应'],
  },

  // ──── 2 ────
  {
    id: 'news-2',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'BBC Future',
    title: 'The Quiet Revolution of Plant Intelligence',
    suggestedMinutes: 8,
    passage: `For centuries, the idea that plants might possess anything resembling intelligence was dismissed as romantic fantasy. But a quiet revolution in botanical science is forcing us to reconsider what "intelligence" actually means.

Recent research has revealed that plants communicate through vast underground fungal networks — colloquially dubbed the "Wood Wide Web." Through these mycorrhizal networks, trees can send chemical warning signals to neighbours about insect attacks, share nutrients with struggling members of their own species, and even recognise their own kin. A mother tree, researchers found, will preferentially shuttle carbon to her offspring through these subterranean pathways.

Plants also exhibit a form of memory. The Venus flytrap counts the number of times its trigger hairs are touched: one touch does nothing, but two touches within twenty seconds snap the trap shut — a mechanism that prevents wasted energy on false alarms like raindrops. More remarkably, the sensitive plant (Mimosa pudica), which folds its leaves when touched, learns to stop responding to harmless repeated stimuli — a phenomenon known as habituation that was long considered exclusive to animals with nervous systems.

Perhaps most striking is what scientists call "swarm intelligence" in plants. A forest does not operate as a collection of competing individuals but as an emergent network — distributing resources, coordinating defences, and maintaining a stable microclimate. The boundary between individual and community blurs.

None of this requires a brain or neurons. Plants use electrical signalling, chemical messengers, and hydraulic pressure changes to achieve what animals achieve with nervous systems. This has led some researchers to propose the concept of "plant neurobiology" — a term that remains controversial but signals a paradigm shift in how we understand cognition itself.`,
    passageAnnotations: [
      { id: 'n2-a1', type: 'claim', text: 'a quiet revolution in botanical science is forcing us to reconsider what intelligence actually means', note: '中心论点：植物研究正在颠覆我们对"智能"的定义' },
      { id: 'n2-a2', type: 'evidence', text: 'trees can send chemical warning signals to neighbours', note: '证据 1：化学信号传递' },
      { id: 'n2-a3', type: 'evidence', text: 'The Venus flytrap counts the number of times its trigger hairs are touched', note: '证据 2：捕蝇草计数能力 = 记忆' },
      { id: 'n2-a4', type: 'attitude', text: 'a paradigm shift in how we understand cognition', note: '作者态度：这是一个范式转变' },
    ],
    items: [
      {
        id: 'n2-q1', kind: 'choice', stem: 'The term "Wood Wide Web" refers to:',
        options: [
          { id: 'A', text: 'the internet of trees' },
          { id: 'B', text: 'underground fungal networks that connect plants' },
          { id: 'C', text: 'a conservation project for forests' },
          { id: 'D', text: 'the root system of a single tree' },
        ],
        correctIds: ['B'],
        analysis: '第二段直接定义 "vast underground fungal networks — colloquially dubbed the Wood Wide Web"，对应 B。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '是 fungal network 不是 internet' },
          { optionId: 'D', type: '局部正确', why: '不是单棵树，而是树与树之间的连接网络' },
        ],
        vocabNotes: ['colloquially adv. 通俗地称为', 'mycorrhizal adj. 菌根的'],
        score: 2,
      },
      {
        id: 'n2-q2', kind: 'choice', stem: 'The Venus flytrap example illustrates that plants:',
        options: [
          { id: 'A', text: 'can recognise their own kin' },
          { id: 'B', text: 'possess a form of memory' },
          { id: 'C', text: 'communicate through electrical signals' },
          { id: 'D', text: 'compete for resources' },
        ],
        correctIds: ['B'],
        analysis: '第三段首句 "Plants also exhibit a form of memory" 后立即用捕蝇草举例，说明植物具有记忆能力。',
        distractors: [
          { optionId: 'A', type: '张冠李戴', why: '识别亲属是第二段母树的例子，非捕蝇草' },
          { optionId: 'C', type: '局部正确', why: '电信号在末段提及，但不是捕蝇草例子的要点' },
        ],
        vocabNotes: ['trigger hairs 触发毛（捕蝇草的感应结构）', 'habituation n. 习惯化'],
        score: 2,
      },
      {
        id: 'n2-q3', kind: 'choice', stem: 'What is the author\'s view on the term "plant neurobiology"?',
        options: [
          { id: 'A', text: 'It is scientifically accurate and widely accepted' },
          { id: 'B', text: 'It is misleading and should be abandoned' },
          { id: 'C', text: 'It is controversial but signals an important conceptual shift' },
          { id: 'D', text: 'It is purely metaphorical with no scientific basis' },
        ],
        correctIds: ['C'],
        analysis: '末段 "remains controversial but signals a paradigm shift" 直接对应 C。',
        distractors: [
          { optionId: 'D', type: '过度推断', why: '文章强调有科学依据（电信号、化学信使等），非纯隐喻' },
        ],
        vocabNotes: ['paradigm shift 范式转变', 'cognition n. 认知'],
        score: 2,
      },
    ],
    tips: ['注意作者引用多个实验证据来支撑中心论点的论证结构', '关注末段对争议性术语的态度 — 常设为作者态度题'],
    vocabNotes: ['botanical adj. 植物学的', 'subterranean adj. 地下的', 'kin n. 亲属，同类', 'emergent adj. 涌现的', 'hydraulic adj. 液压的'],
  },

  // ──── 3 ────
  {
    id: 'news-3',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'CNN',
    title: 'How Microplastics Infiltrated the Human Body',
    suggestedMinutes: 7,
    passage: `In 2024, a landmark study published in the New England Journal of Medicine sent shockwaves through the scientific community: microplastics had been found lodged in the arterial plaques of over 50% of patients undergoing carotid surgery, and those with plastics in their arteries were 4.5 times more likely to suffer a heart attack, stroke, or death within three years.

This was not the first time microplastics had been detected inside the human body — they had previously been found in lung tissue, maternal breast milk, and even placental tissue — but it was the first study to directly link their presence to severe cardiovascular outcomes. The particles, typically smaller than 5 millimetres and often invisible to the naked eye, enter the human body through three primary routes: ingestion (food and water), inhalation (airborne particles), and dermal absorption (cosmetics and synthetic clothing).

The ubiquity of plastic in modern life makes avoidance nearly impossible. Bottled water contains an average of 240,000 plastic particles per litre, according to a 2024 Columbia University study. Synthetic fabrics shed microfibres with every wash cycle, and seafood inevitably contains particles from ocean plastic pollution. Even tea bags — many of which are sealed with polypropylene — release billions of microplastic particles into a single cup.

Scientists stress that panic is not warranted, but precaution is sensible. Filtering tap water, choosing natural fibres over synthetics, and reducing single-use plastics are practical steps. The longer-term solution, researchers argue, lies not in individual behaviour but in redesigning materials at the chemical level to ensure biodegradability without sacrificing functionality.`,
    passageAnnotations: [
      { id: 'n3-a1', type: 'claim', text: 'the first study to directly link their presence to severe cardiovascular outcomes', note: '核心新发现：微塑与心血管疾病的首个直接因果关联' },
      { id: 'n3-a2', type: 'evidence', text: '4.5 times more likely to suffer a heart attack, stroke, or death', note: '数据支撑：4.5 倍风险' },
      { id: 'n3-a3', type: 'keyword', text: 'ubiquity', note: '关键概念：塑料的无处不在使回避几乎不可能' },
      { id: 'n3-a4', type: 'attitude', text: 'panic is not warranted, but precaution is sensible', note: '作者态度：理性克制，不制造恐慌' },
    ],
    items: [
      {
        id: 'n3-q1', kind: 'choice', stem: 'What made the 2024 NEJM study particularly significant?',
        options: [
          { id: 'A', text: 'It was the first to detect microplastics in the human body' },
          { id: 'B', text: 'It directly linked microplastics to cardiovascular disease outcomes' },
          { id: 'C', text: 'It proved that microplastics cause cancer' },
          { id: 'D', text: 'It found microplastics in bottled water' },
        ],
        correctIds: ['B'],
        analysis: '第一段末尾加第二段首句 — 之前已有检出，但这是 "the first study to directly link their presence to severe cardiovascular outcomes"。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '不是首次检出（之前肺、母乳、胎盘中已发现），而是首次建立因果关联' },
          { optionId: 'C', type: '无中生有', why: '文章从未提及癌症' },
        ],
        vocabNotes: ['landmark adj. 里程碑式的', 'carotid artery 颈动脉', 'placental adj. 胎盘的'],
        score: 2,
      },
      {
        id: 'n3-q2', kind: 'choice', stem: 'According to the passage, which is NOT mentioned as a route for microplastics to enter the human body?',
        options: [
          { id: 'A', text: 'eating contaminated food' },
          { id: 'B', text: 'breathing airborne particles' },
          { id: 'C', text: 'absorbing through the skin' },
          { id: 'D', text: 'receiving blood transfusions' },
        ],
        correctIds: ['D'],
        analysis: '第二段列出三大途径：ingestion（食入）、inhalation（吸入）、dermal absorption（皮肤吸收）。输血未提及。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: 'A 对应 ingestion（food and water）' },
        ],
        vocabNotes: ['ingestion n. 摄入', 'inhalation n. 吸入', 'dermal adj. 皮肤的'],
        score: 2,
      },
      {
        id: 'n3-q3', kind: 'choice', stem: 'The author suggests that the ultimate solution to microplastic pollution lies in:',
        options: [
          { id: 'A', text: 'individual lifestyle changes' },
          { id: 'B', text: 'government bans on plastic production' },
          { id: 'C', text: 'redesigning materials to be biodegradable' },
          { id: 'D', text: 'better water filtration technology' },
        ],
        correctIds: ['C'],
        analysis: '末段 "redesigning materials at the chemical level to ensure biodegradability" 直接对应 C。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '文章说 individual behaviour 是 practical steps 但非 longer-term solution' },
        ],
        vocabNotes: ['biodegradability n. 可生物降解性', 'warrant v. 使…有必要'],
        score: 2,
      },
    ],
    tips: ['多重否定题（NOT mentioned）逐一回原文验证选项', '注意区分短期措施（individual）与长期方案（material redesign）'],
    vocabNotes: ['microplastics n. 微塑料', 'plaque n. （动脉）斑块', 'ubiquity n. 无处不在', 'polypropylene n. 聚丙烯', 'precaution n. 预防措施'],
  },

  // ──── 4 ────
  {
    id: 'news-4',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'The Atlantic',
    title: 'The Case for Boredom',
    suggestedMinutes: 7,
    passage: `In an age where the average person checks their phone 144 times a day and the mere sensation of an unoccupied moment triggers an almost reflexive reach for a screen, boredom has become something to be eradicated at all costs. But a growing body of research suggests that this war on boredom may be costing us our creativity.

Neuroscientists at the University of Central Lancashire found that participants who were assigned a deliberately boring task — copying numbers from a phone book — subsequently generated significantly more creative ideas in a divergent thinking test than those who had been given an engaging activity. The researchers hypothesise that boredom triggers the brain's "default mode network" — a constellation of brain regions that becomes active during rest and is strongly associated with spontaneous thought, autobiographical planning, and creative incubation.

The mechanism is intuitive: when external stimulation is removed, the mind turns inward. This inward turn — daydreaming, mental wandering, unbidden recollection — is where novel connections between disparate ideas are forged. The poet William Wordsworth described it as "emotion recollected in tranquillity." Steve Jobs famously credited his most innovative ideas to "just sitting and letting the mind wander."

Yet the modern digital environment is engineered precisely to prevent this. Infinite scroll, autoplay, and notification systems are designed to capture and hold attention, eliminating the interstitial moments — waiting for a bus, standing in a queue, sitting alone with a coffee — that historically served as portals to reflective thought. Children today spend an average of 44 hours per week consuming digital media, a figure that leaves vanishingly little room for unstructured mental play.

The prescription is not a Luddite rejection of technology but a deliberate cultivation of "boredom hygiene": scheduling device-free intervals, embracing single-tasking, and resisting the urge to fill every silence with input. The blank page, the empty room, the quiet walk — these are not voids to be filled but spaces to be inhabited.`,
    passageAnnotations: [
      { id: 'n4-a1', type: 'claim', text: 'this war on boredom may be costing us our creativity', note: '核心论点：消灭无聊可能正在扼杀创造力' },
      { id: 'n4-a2', type: 'evidence', text: 'participants who were assigned a deliberately boring task...generated significantly more creative ideas', note: '实验证据：无聊任务后创造力显著提升' },
      { id: 'n4-a3', type: 'keyword', text: 'default mode network', note: '关键概念：默认模式网络 — 大脑休息时的自发思维' },
      { id: 'n4-a4', type: 'attitude', text: 'not a Luddite rejection of technology but a deliberate cultivation', note: '作者态度：不是反技术，而是有意识地培养' },
    ],
    items: [
      {
        id: 'n4-q1', kind: 'choice', stem: 'According to the study cited, boring tasks boost creativity because they:',
        options: [
          { id: 'A', text: 'force participants to work harder' },
          { id: 'B', text: 'activate the brain\'s default mode network' },
          { id: 'C', text: 'increase dopamine levels' },
          { id: 'D', text: 'reduce anxiety about performance' },
        ],
        correctIds: ['B'],
        analysis: '第二段明确说明 "boredom triggers the brain\'s default mode network"，对应 B。',
        distractors: [
          { optionId: 'A', type: '无中生有', why: '文中未提及"更努力工作"' },
          { optionId: 'C', type: '张冠李戴', why: 'dopamine 未在本文出现，是另一篇文章的概念' },
        ],
        vocabNotes: ['divergent thinking 发散性思维', 'hypothesise v. （英式拼写）假设'],
        score: 2,
      },
      {
        id: 'n4-q2', kind: 'choice', stem: 'The author mentions Wordsworth and Steve Jobs primarily to:',
        options: [
          { id: 'A', text: 'demonstrate that creative people dislike technology' },
          { id: 'B', text: 'argue that poetry and technology are incompatible' },
          { id: 'C', text: 'illustrate the creative value of unstructured mental wandering' },
          { id: 'D', text: 'show that famous people also experience boredom' },
        ],
        correctIds: ['C'],
        analysis: '第三段用 Wordsworth 和 Jobs 作为例证支撑 "where novel connections...are forged" 这一观点。',
        distractors: [
          { optionId: 'D', type: '局部正确', why: '两位名人确实体验过无聊，但引用的目的是说明无聊与创造力的关系，而非仅仅证明名人也无聊' },
        ],
        vocabNotes: ['unbidden adj. 未经要求的，自发的', 'recollection n. 回忆', 'tranquillity n. 宁静'],
        score: 2,
      },
      {
        id: 'n4-q3', kind: 'choice', stem: 'The term "interstitial moments" most likely refers to:',
        options: [
          { id: 'A', text: 'moments of intense focus' },
          { id: 'B', text: 'brief pauses between structured activities' },
          { id: 'C', text: 'scheduled meditation sessions' },
          { id: 'D', text: 'periods of digital detox' },
        ],
        correctIds: ['B'],
        analysis: '从上下文 "waiting for a bus, standing in a queue, sitting alone with a coffee" 可知是结构化活动之间的碎片间隙。',
        distractors: [
          { optionId: 'D', type: '偷换概念', why: 'digital detox 是刻意行为，interstitial moments 是自然出现的间隙' },
        ],
        vocabNotes: ['interstitial adj. 间隙的', 'vanishingly adv. 几乎消失地'],
        score: 2,
      },
    ],
    tips: ['词汇推断题：利用破折号后的具体例子（waiting for a bus...）反推抽象词义', '注意区分作者主张（cultivation of boredom hygiene）与极端立场（Luddite rejection）'],
    vocabNotes: ['eradicate v. 根除', 'incubation n. 酝酿', 'Luddite n. 反对技术进步的人', 'cultivation n. 培养', 'void n. 空虚'],
  },

  // ──── 5 ────
  {
    id: 'news-5',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'Nature Briefing',
    title: 'CRISPR 2.0: Editing the Epigenome',
    suggestedMinutes: 8,
    passage: `When CRISPR-Cas9 burst onto the scientific stage in 2012, it promised to rewrite the code of life itself by cutting and replacing faulty DNA sequences. A decade later, a quieter but potentially more profound revolution is underway: epigenetic editing, which changes not the genetic code itself but how genes are expressed — turning them up, down, or off entirely without altering a single nucleotide.

The appeal of epigenetic editing lies in its subtlety and reversibility. Traditional CRISPR permanently alters the genome, which means any off-target edits could have irreversible consequences. Epigenetic editors, by contrast, add or remove chemical tags — methyl groups — that sit atop the DNA like Post-it notes, instructing the cellular machinery to read certain genes or skip them. Because the underlying DNA sequence remains intact, the edits can, in principle, be reversed.

This approach is particularly promising for complex diseases that involve not a single broken gene but a dysregulated network. In a landmark 2023 study, researchers at MIT used an epigenetic editor to silence a gene called PCSK9 in mice, reducing cholesterol levels by over 50% for at least six months — without changing the DNA sequence. The treatment involved a single injection of a modified CRISPR protein fused to enzymes that deposit repressive methyl marks.

The road to the clinic remains long. Delivery — getting the editor into the right cells at the right dose — is still the major bottleneck. There are also unresolved questions about the durability and specificity of epigenetic marks: some marks can spread to neighbouring genes or fade over time. But the field is accelerating. Several biotech startups have raised hundreds of millions of dollars to develop epigenetic therapies for everything from neurodegenerative diseases to ageing itself, betting that the next chapter of genetic medicine will be written not in the language of cutting but in the language of tuning.`,
    passageAnnotations: [
      { id: 'n5-a1', type: 'claim', text: 'a quieter but potentially more profound revolution is underway: epigenetic editing', note: '核心论点：表观遗传编辑可能是比 CRISPR 更深刻的变革' },
      { id: 'n5-a2', type: 'evidence', text: 'reduced cholesterol levels by over 50% for at least six months', note: '数据证据：单次注射降低胆固醇 50%+ 持续六个月' },
      { id: 'n5-a3', type: 'keyword', text: 'reversibility', note: '关键优势：可逆性 — 不改变 DNA 序列' },
      { id: 'n5-a4', type: 'attitude', text: 'the next chapter of genetic medicine will be written not in the language of cutting but in the language of tuning', note: '作者展望：基因医学的下一个时代是"调谐"而非"剪切"' },
    ],
    items: [
      {
        id: 'n5-q1', kind: 'choice', stem: 'Compared to traditional CRISPR, epigenetic editing\'s key advantage is:',
        options: [
          { id: 'A', text: 'it is cheaper and faster' },
          { id: 'B', text: 'it is reversible and does not alter the DNA sequence' },
          { id: 'C', text: 'it can cure all known genetic diseases' },
          { id: 'D', text: 'it has already been approved for clinical use' },
        ],
        correctIds: ['B'],
        analysis: '第二段明确指出 "the underlying DNA sequence remains intact, the edits can...be reversed"。',
        distractors: [
          { optionId: 'C', type: '过度推断', why: '文章只说对复杂疾病有前景，未说可治愈所有遗传病' },
          { optionId: 'D', type: '偷换概念', why: '文章明确说 "road to the clinic remains long"' },
        ],
        vocabNotes: ['nucleotide n. 核苷酸（DNA 基本单位）', 'methyl group 甲基'],
        score: 2,
      },
      {
        id: 'n5-q2', kind: 'choice', stem: 'The MIT study is mentioned primarily to:',
        options: [
          { id: 'A', text: 'demonstrate the safety of epigenetic editing in humans' },
          { id: 'B', text: 'provide a concrete example of epigenetic editing\'s therapeutic potential' },
          { id: 'C', text: 'prove that cholesterol can be permanently eliminated' },
          { id: 'D', text: 'show that mice are ideal subjects for CRISPR research' },
        ],
        correctIds: ['B'],
        analysis: '第三段 MIT 研究作为具体案例支撑 "particularly promising for complex diseases" 的观点。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '研究在老鼠身上进行，非人类安全性试验' },
          { optionId: 'C', type: '过度推断', why: '是降低 50% 持续六个月，不是永久消除' },
        ],
        vocabNotes: ['silence v. （基因）沉默 = 使其不表达', 'repressive adj. 抑制性的'],
        score: 2,
      },
      {
        id: 'n5-q3', kind: 'choice', stem: 'The major obstacle to clinical use of epigenetic editing is:',
        options: [
          { id: 'A', text: 'lack of funding from biotech companies' },
          { id: 'B', text: 'ethical concerns about editing human genes' },
          { id: 'C', text: 'difficulty delivering the editor to the right cells' },
          { id: 'D', text: 'the high cost of synthesising CRISPR proteins' },
        ],
        correctIds: ['C'],
        analysis: '末段 "Delivery...is still the major bottleneck" 直接对应 C。',
        distractors: [
          { optionId: 'A', type: '无中生有', why: '末段明确说 biotech startups 已融资数亿美元' },
          { optionId: 'B', type: '张冠李戴', why: '伦理问题是传统 CRISPR 的主要关注点，本文未将伦理列为表观遗传编辑的主要障碍' },
        ],
        vocabNotes: ['bottleneck n. 瓶颈', 'durability n. 持久性'],
        score: 2,
      },
    ],
    tips: ['注意对比结构：全文贯穿传统 CRISPR（剪切、不可逆）vs 表观遗传编辑（调谐、可逆）', '理解比喻：Post-it notes（便利贴）类比甲基标记的可移除性'],
    vocabNotes: ['epigenome n. 表观基因组', 'CRISPR n. 基因编辑技术', 'methylation n. 甲基化', 'dysregulated adj. 失调的', 'neurodegenerative adj. 神经退行性的'],
  },

  // ──── 6 ────
  {
    id: 'news-6',
    type: 'reading',
    source: 'builtin',
    sourceLabel: 'The New Yorker',
    title: 'Why We Tell Stories',
    suggestedMinutes: 7,
    passage: `Human beings have been called the "storytelling animal," and the label is not merely poetic. Cognitive scientists now argue that narrative is not a cultural luxury but a fundamental operating system of the human mind — the primary means by which we make sense of the world, construct our identities, and navigate social life.

Consider the evidence. When presented with random dots moving in a confined space, subjects in a classic psychology experiment spontaneously narrated stories about the dots: "the big dot is chasing the small dot," "the triangle is protecting the circle." The brain imposes narrative structure on chaos automatically, without conscious effort. Neuroimaging studies reveal that watching a well-structured film activates the same brain regions in different viewers — the director is, in effect, controlling the audience's neural activity through the architecture of story.

Stories also serve an evolutionary function. The psychologist Jonathan Haidt describes humans as "90 percent chimp and 10 percent bee" — individually self-interested but capable of extraordinary collective action. Stories are what bridge the gap: shared narratives — from religious texts to national constitutions to corporate mission statements — enable millions of strangers to coordinate their behaviour around common values and goals. A nation, after all, is not a physical entity but a story that enough people believe.

In the age of artificial intelligence, the uniquely human relationship with narrative takes on new significance. Large language models can generate grammatically perfect stories, but they do not experience the tension of an unresolved plot or the catharsis of a satisfying ending. They are storytellers without a self — narrators who have never been characters in their own drama. This distinction may prove to be one of the enduring boundaries between human and machine cognition: not the ability to tell a story, but the need to.`,
    passageAnnotations: [
      { id: 'n6-a1', type: 'claim', text: 'narrative is not a cultural luxury but a fundamental operating system of the human mind', note: '核心论点：叙事不是文化奢侈品，而是人类心智的基础操作系统' },
      { id: 'n6-a2', type: 'evidence', text: 'subjects spontaneously narrated stories about the dots', note: '实验证据：大脑自动将混沌强加叙事结构' },
      { id: 'n6-a3', type: 'keyword', text: 'shared narratives', note: '关键概念：共享叙事 — 让陌生人协调行为的机制' },
      { id: 'n6-a4', type: 'attitude', text: 'the need to tell a story...may prove to be one of the enduring boundaries', note: '作者态度：叙事需求可能是人机认知的终极界限' },
    ],
    items: [
      {
        id: 'n6-q1', kind: 'choice', stem: 'The dot experiment is cited to demonstrate that:',
        options: [
          { id: 'A', text: 'people are easily fooled by visual illusions' },
          { id: 'B', text: 'the brain automatically imposes narrative on random events' },
          { id: 'C', text: 'dots can communicate with each other' },
          { id: 'D', text: 'storytelling is a learned cultural behaviour' },
        ],
        correctIds: ['B'],
        analysis: '第二段 "The brain imposes narrative structure on chaos automatically" 直接对应 B。',
        distractors: [
          { optionId: 'D', type: '偷换概念', why: '实验显示叙事是自动的（automatic）而非习得的（learned）' },
        ],
        vocabNotes: ['spontaneously adv. 自发地', 'neuroimaging n. 神经影像学'],
        score: 2,
      },
      {
        id: 'n6-q2', kind: 'choice', stem: 'According to Haidt\'s metaphor, shared narratives enable humans to:',
        options: [
          { id: 'A', text: 'become more like chimpanzees' },
          { id: 'B', text: 'bridge the gap between individual self-interest and collective action' },
          { id: 'C', text: 'replace religion with science' },
          { id: 'D', text: 'communicate with artificial intelligence' },
        ],
        correctIds: ['B'],
        analysis: '第三段 "Stories are what bridge the gap" + "enable millions of strangers to coordinate" 对应 B。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: 'Haidt 的比喻是 90% 黑猩猩 + 10% 蜜蜂，故事帮助我们超越黑猩猩的自利部分' },
        ],
        vocabNotes: ['coordinated action 协同行动', 'constitution n. 宪法'],
        score: 2,
      },
      {
        id: 'n6-q3', kind: 'choice', stem: 'What does the author suggest is the key difference between human and AI storytelling?',
        options: [
          { id: 'A', text: 'AI stories are grammatically incorrect' },
          { id: 'B', text: 'humans tell stories faster than AI' },
          { id: 'C', text: 'humans have a genuine need to tell stories, while AI merely generates them' },
          { id: 'D', text: 'AI can write stories in more languages than humans' },
        ],
        correctIds: ['C'],
        analysis: '末段 "not the ability to tell a story, but the need to" — 关键区别不是能力而是需求。',
        distractors: [
          { optionId: 'A', type: '偷换概念', why: '末段明确说 LLMs "generate grammatically perfect stories"' },
        ],
        vocabNotes: ['catharsis n. 情感宣泄，净化', 'enduring adj. 持久的'],
        score: 2,
      },
    ],
    tips: ['注意末段 AI 对比 — 常设作者观点/态度题', '理解 Haidt 的"90%黑猩猩+10%蜜蜂"比喻：个体自私 vs 集体协作'],
    vocabNotes: ['cognitive adj. 认知的', 'evolutionary adj. 进化的', 'catharsis n. 情感宣泄', 'enduring adj. 持久的'],
  },
]
