import type { Question } from '../types'

/* * Foreign magazine intensive reading articles (6 articles, BBC / The Economist / CNN style)
 * Each 200-400 words, with vocabulary notes + reading comprehension questions + logic annotations */
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
      { id: 'n1-a1', type: 'claim', text: 'procrastination is fundamentally an emotional regulation problem', note: "Core argument: procrastination is an emotional regulation problem, not a time management problem" },
      { id: 'n1-a2', type: 'evidence', text: 'Psychologists at the University of California have identified', note: "Academic research supports the argument" },
      { id: 'n1-a3', type: 'attitude', text: 'You are not lazy; you are human', note: "Author's attitude: de-moralizing, empathizing with readers" },
      { id: 'n1-a4', type: 'keyword', text: 'present bias', note: "Key concept: present bias — overvaluing immediate rewards" },
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
        analysis: "The first sentence of the second paragraph clearly states \"procrastination is fundamentally an emotional regulation problem, not a time management issue,\" corresponding to option B. A is the traditional view that the article explicitly rejects.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "The article explicitly denies that this is a time management problem; that is precisely the traditional misunderstanding." },
          { optionId: 'D', type: "Unsupported claim", why: "The article mentions dopamine to explain present bias, not to say it is the main cause." },
        ],
        vocabNotes: ["ritual n. a routine, a habitual action", "limbic system (the brain's emotional center)"],
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
        analysis: "The fourth paragraph, \"the commitment feels trivial...the amygdala's resistance,\" directly corresponds to B.",
        distractors: [
          { optionId: 'A', type: "Over-inference", why: "The article does not say five minutes is enough to complete most tasks." },
          { optionId: 'D', type: "Concept substitution", why: "It is not a \"forced\" override, but a \"bypass.\"" },
        ],
        vocabNotes: ["bypass v. to go around, to avoid", "trivial adj. insignificant"],
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
        analysis: "The final paragraph, \"You are not lazy; you are human...liberating,\" shows that the author's attitude is understanding and comforting.",
        distractors: [
          { optionId: 'B', type: "Partially true", why: "The popular science style seems neutral, but the ending has a strong emotional tone." },
        ],
        vocabNotes: ["liberating adj. freeing, emancipating", "coax v. to guide patiently"],
        score: 2,
      },
    ],
    tips: ["First look at the structural annotations (claim/evidence/attitude), then answer the questions one by one.", "Pay attention to the two key concepts \"present bias\" and \"temporal discounting\"."],
    vocabNotes: ["procrastination n. procrastination", "amygdala n. amygdala (the brain's fear center)", "prefrontal cortex prefrontal cortex (responsible for planning and decision-making)", "insidious adj. insidious, harmfully stealthy", "temporal discounting temporal discounting effect"],
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
      { id: 'n2-a1', type: 'claim', text: "a quiet revolution in botanical science is forcing us to reconsider what \"intelligence\" actually means", note: "Central argument: plant research is overturning our definition of \"intelligence\"." },
      { id: 'n2-a2', type: 'evidence', text: 'trees can send chemical warning signals to neighbours', note: "Evidence 1: chemical signaling" },
      { id: 'n2-a3', type: 'evidence', text: 'The Venus flytrap counts the number of times its trigger hairs are touched', note: "Evidence 2: the Venus flytrap's counting ability = memory" },
      { id: 'n2-a4', type: 'attitude', text: 'a paradigm shift in how we understand cognition', note: "Author's attitude: this is a paradigm shift." },
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
        analysis: "The second paragraph directly defines \"vast underground fungal networks — colloquially dubbed the Wood Wide Web\", which corresponds to B.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "It is a fungal network, not the internet." },
          { optionId: 'D', type: "Partially true", why: "It is not a single tree, but a connection network between trees." },
        ],
        vocabNotes: ["colloquially adv. colloquially known as", "mycorrhizal adj. mycorrhizal"],
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
        analysis: "The first sentence of the third paragraph, \"Plants also exhibit a form of memory\", is immediately followed by the Venus flytrap example, showing that plants have memory capacity.",
        distractors: [
          { optionId: 'A', type: "Misattribution", why: "Recognizing kin is the example of the mother tree in the second paragraph, not the Venus flytrap." },
          { optionId: 'C', type: "Partially true", why: "Electrical signals are mentioned in the last paragraph, but they are not the key point of the Venus flytrap example." },
        ],
        vocabNotes: ["trigger hairs trigger hairs (the sensory structures of the Venus flytrap)", "habituation n. habituation"],
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
        analysis: "The last paragraph's \"remains controversial but signals a paradigm shift\" directly corresponds to C.",
        distractors: [
          { optionId: 'D', type: "Over-inference", why: "The article emphasizes that there is scientific evidence (electrical signals, chemical messengers, etc.), not pure metaphor." },
        ],
        vocabNotes: ["paradigm shift paradigm shift", "cognition n. cognition"],
        score: 2,
      },
    ],
    tips: ["Note the argumentative structure in which the author cites multiple pieces of experimental evidence to support the central argument.", "Pay attention to the attitude toward controversial terms in the last paragraph — this is often set as an author's attitude question."],
    vocabNotes: ["botanical adj. botanical", "subterranean adj. subterranean", "kin n. kin, same kind", "emergent adj. emergent", "hydraulic adj. hydraulic"],
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
      { id: 'n3-a1', type: 'claim', text: 'the first study to directly link their presence to severe cardiovascular outcomes', note: "Core new finding: the first direct causal link between microplastics and cardiovascular disease" },
      { id: 'n3-a2', type: 'evidence', text: '4.5 times more likely to suffer a heart attack, stroke, or death', note: "Data support: 4.5-fold risk" },
      { id: 'n3-a3', type: 'keyword', text: 'ubiquity', note: "Key concept: the ubiquity of plastic makes avoidance almost impossible." },
      { id: 'n3-a4', type: 'attitude', text: 'panic is not warranted, but precaution is sensible', note: "Author's attitude: rational and restrained, not fear-mongering" },
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
        analysis: "The end of the first paragraph plus the first sentence of the second paragraph — it had been detected before, but this is \"the first study to directly link their presence to severe cardiovascular outcomes\".",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "It is not the first detection (they had already been found in lungs, breast milk, and the placenta), but the first establishment of a causal link." },
          { optionId: 'C', type: "Unsupported claim", why: "The article never mentions cancer." },
        ],
        vocabNotes: ["landmark adj. landmark", "carotid artery carotid artery", "placental adj. placental"],
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
        analysis: "The second paragraph lists three major pathways: ingestion, inhalation, and dermal absorption. Blood transfusion is not mentioned.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "A corresponds to ingestion (food and water)." },
        ],
        vocabNotes: ["ingestion n. ingestion", "inhalation n. inhalation", "dermal adj. dermal"],
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
        analysis: "The last paragraph's \"redesigning materials at the chemical level to ensure biodegradability\" directly corresponds to C.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "The article says individual behaviour is a practical step but not a longer-term solution." },
        ],
        vocabNotes: ["biodegradability n. biodegradability", "warrant v. to make ... necessary"],
        score: 2,
      },
    ],
    tips: ["For multiple negation questions (NOT mentioned), verify each option against the original text one by one.", "Note the distinction between short-term measures (individual) and long-term solutions (material redesign)."],
    vocabNotes: ["microplastics n. microplastics", "plaque n. (arterial) plaque", "ubiquity n. ubiquity", "polypropylene n. polypropylene", "precaution n. precaution"],
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
      { id: 'n4-a1', type: 'claim', text: 'this war on boredom may be costing us our creativity', note: "Central argument: eliminating boredom may be killing creativity." },
      { id: 'n4-a2', type: 'evidence', text: "participants who were assigned a deliberately boring task — copying numbers from a phone book — subsequently generated significantly more creative ideas", note: "Experimental evidence: creativity increases significantly after boring tasks." },
      { id: 'n4-a3', type: 'keyword', text: 'default mode network', note: "Key concept: the default mode network — spontaneous thinking when the brain is at rest" },
      { id: 'n4-a4', type: 'attitude', text: 'not a Luddite rejection of technology but a deliberate cultivation', note: "Author's attitude: not anti-technology, but conscious cultivation" },
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
        analysis: "The second paragraph clearly states that \"boredom triggers the brain's default mode network\", which corresponds to B.",
        distractors: [
          { optionId: 'A', type: "Unsupported claim", why: "The text does not mention \"working harder\"." },
          { optionId: 'C', type: "Misattribution", why: "dopamine does not appear in this article; it is a concept from another article." },
        ],
        vocabNotes: ["divergent thinking divergent thinking", "hypothesise v. (British spelling) hypothesize"],
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
        analysis: "The third paragraph uses Wordsworth and Jobs as examples to support the idea that \"where novel connections...are forged\".",
        distractors: [
          { optionId: 'D', type: "Partially true", why: "The two famous figures did indeed experience boredom, but the purpose of the citation is to illustrate the relationship between boredom and creativity, not merely to prove that famous people also get bored." },
        ],
        vocabNotes: ["unbidden adj. unbidden, spontaneous", "recollection n. recollection", "tranquillity n. tranquillity"],
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
        analysis: "From the context \"waiting for a bus, standing in a queue, sitting alone with a coffee\", it can be seen that these are fragmentary gaps between structured activities.",
        distractors: [
          { optionId: 'D', type: "Concept substitution", why: "A digital detox is a deliberate act, while interstitial moments are gaps that arise naturally." },
        ],
        vocabNotes: ["interstitial adj. interstitial", "vanishingly adv. almost vanishingly"],
        score: 2,
      },
    ],
    tips: ["Vocabulary inference question: use the concrete examples after the dash (waiting for a bus...) to infer the meaning of the abstract word.", "Note the distinction between the author's claim (cultivation of boredom hygiene) and extreme positions (Luddite rejection)."],
    vocabNotes: ["eradicate v. eradicate", "incubation n. incubation", "Luddite n. one who opposes technological progress", "cultivation n. cultivation", "void n. emptiness"],
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
      { id: 'n5-a1', type: 'claim', text: 'a quieter but potentially more profound revolution is underway: epigenetic editing', note: "Central argument: epigenetic editing may be a more profound change than CRISPR." },
      { id: 'n5-a2', type: 'evidence', text: "reducing cholesterol levels by over 50% for at least six months", note: "Data evidence: a single injection lowers cholesterol by 50%+ for six months." },
      { id: 'n5-a3', type: 'keyword', text: 'reversibility', note: "Key advantage: reversibility — it does not change the DNA sequence." },
      { id: 'n5-a4', type: 'attitude', text: 'the next chapter of genetic medicine will be written not in the language of cutting but in the language of tuning', note: "Author's outlook: the next era of genetic medicine is \"tuning\" rather than \"cutting\"." },
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
        analysis: "The second paragraph clearly states that \"the underlying DNA sequence remains intact, the edits can...be reversed\".",
        distractors: [
          { optionId: 'C', type: "Over-inference", why: "The article only says it is promising for complex diseases; it does not say it can cure all genetic diseases." },
          { optionId: 'D', type: "Concept substitution", why: "The article clearly says \"road to the clinic remains long\"." },
        ],
        vocabNotes: ["nucleotide n. nucleotide (the basic unit of DNA)", "methyl group methyl group"],
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
        analysis: "The third paragraph uses the MIT study as a concrete case to support the view that it is \"particularly promising for complex diseases\".",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "The study was conducted in mice, not a human safety trial." },
          { optionId: 'C', type: "Over-inference", why: "It lowers it by 50% for six months, not permanently eliminates it." },
        ],
        vocabNotes: ["silence v. (gene) silencing = preventing it from being expressed", "repressive adj. repressive"],
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
        analysis: "The last paragraph's \"Delivery...is still the major bottleneck\" directly corresponds to C.",
        distractors: [
          { optionId: 'A', type: "Unsupported claim", why: "The last paragraph clearly says biotech startups have already raised hundreds of millions of dollars." },
          { optionId: 'B', type: "Misattribution", why: "Ethical issues are the main concern of traditional CRISPR; this article does not list ethics as a major obstacle to epigenetic editing." },
        ],
        vocabNotes: ["bottleneck n. bottleneck", "durability n. durability"],
        score: 2,
      },
    ],
    tips: ["Note the contrast structure: throughout the text, traditional CRISPR (cutting, irreversible) vs. epigenetic editing (tuning, reversible).", "Understand the metaphor: Post-it notes analogize the removability of methyl marks."],
    vocabNotes: ["epigenome n. epigenome", "CRISPR n. gene-editing technology", "methylation n. methylation", "dysregulated adj. dysregulated", "neurodegenerative adj. neurodegenerative"],
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
      { id: 'n6-a1', type: 'claim', text: 'narrative is not a cultural luxury but a fundamental operating system of the human mind', note: "Central argument: narrative is not a cultural luxury, but the fundamental operating system of the human mind." },
      { id: 'n6-a2', type: 'evidence', text: "subjects in a classic psychology experiment spontaneously narrated stories about the dots", note: "Experimental evidence: The brain automatically imposes narrative structure on chaos" },
      { id: 'n6-a3', type: 'keyword', text: 'shared narratives', note: "Key concept: Shared narratives — the mechanism that enables strangers to coordinate behavior" },
      { id: 'n6-a4', type: 'attitude', text: "This distinction may prove to be one of the enduring boundaries between human and machine cognition: not the ability to tell a story, but the need to.", note: "Author's attitude: The need for narrative may be the ultimate boundary of human-machine cognition" },
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
        analysis: "The second paragraph \"The brain imposes narrative structure on chaos automatically\" directly corresponds to B.",
        distractors: [
          { optionId: 'D', type: "Concept substitution", why: "Experiments show that narrative is automatic rather than learned" },
        ],
        vocabNotes: ["spontaneously adv. spontaneously", "neuroimaging n. neuroimaging"],
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
        analysis: "The third paragraph \"Stories are what bridge the gap\" + \"enable millions of strangers to coordinate\" corresponds to B.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "Haidt's metaphor is 90% chimpanzee + 10% bee; stories help us transcend the selfish part of the chimpanzee" },
        ],
        vocabNotes: ["coordinated action coordinated action", "constitution n. constitution"],
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
        analysis: "The final paragraph \"not the ability to tell a story, but the need to\" — the key distinction is not ability but need.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "The final paragraph explicitly says LLMs \"generate grammatically perfect stories\"" },
        ],
        vocabNotes: ["catharsis n. emotional release, purification", "enduring adj. lasting"],
        score: 2,
      },
    ],
    tips: ["Note the AI contrast in the final paragraph — often used for author's view/attitude questions", "Understand Haidt's \"90% chimpanzee + 10% bee\" metaphor: individual selfishness vs. collective cooperation"],
    vocabNotes: ["cognitive adj. cognitive", "evolutionary adj. evolutionary", "catharsis n. emotional release", "enduring adj. lasting"],
  },
]
