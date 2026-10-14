import type { Question } from '../types'

/* * Philosophy of science · Cybernetics · Information theory · History and philosophy
 * 20 in-depth reading materials (Borges style: short, precise, full of philosophical tension) */

export const sciencePhilosophyArticles: Question[] = [
  // ════════════════════════════════════════════════════════
  // 1. The Borges-style map
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
      { id: 'sp1-a1', type: 'claim', text: 'a perfect map is not merely useless but dangerous', note: "Core argument: a perfect map is not only useless but dangerous" },
      { id: 'sp1-a2', type: 'evidence', text: 'The 2008 financial crisis was, in part, a crisis of mistaken cartography', note: "Historical evidence: the 2008 financial crisis was a consequence of mistaking the map for the territory" },
      { id: 'sp1-a3', type: 'keyword', text: 'the map is not the territory', note: "Key concept: Korzybski's famous saying — the map is not the territory" },
      { id: 'sp1-a4', type: 'attitude', text: 'The most dangerous map is the one we forget is a map', note: "Author's attitude: the most dangerous map is the one we forget is a map" },
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
        analysis: "The third paragraph explicitly states 'the purpose of a map is to compress reality, to strip away irrelevant detail so that the relevant patterns become visible,' corresponding to B.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "A 1:1 map is precisely what the article criticizes; replicating reality is not the purpose of a map." },
          { optionId: 'D', type: "Over-inference", why: "The article says model outputs are 'informed guesses,' not certainties." },
        ],
        vocabNotes: ["cartography n. the study or practice of making maps", "abstraction n. the act of abstracting"],
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
        analysis: "The fourth paragraph: 'risk models...were treated not as maps but as the terrain itself' — the crisis example illustrates the danger of equating models with reality.",
        distractors: [
          { optionId: 'C', type: "Misattribution", why: "Climate models appear in this paragraph as another example, not as the argument about the financial crisis." },
        ],
        vocabNotes: ["proliferating adj. rapidly increasing", "lossy adj. involving loss (a compression term)"],
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
        analysis: "The author acknowledges the 'seduction' of digital twins but immediately warns of their danger with Borges's fable. This attitude is 'cautious appreciation + philosophical warning.'",
        distractors: [
          { optionId: 'A', type: "Partially true", why: "The author does mention the appeal of the technology, but the overall tone is cautionary." },
        ],
        vocabNotes: ["seduction n. temptation, attraction", "colossus n. a giant statue, a huge thing"],
        score: 2,
      },
    ],
    tips: ["Note the analogical structure between Borges's fable and modern technology (digital twins).", "Understand how the philosophical pair 'map vs territory' runs through the whole text."],
    vocabNotes: ["cartography n. the study or practice of making maps", "paradox n. a self-contradictory statement or situation", "proliferating adj. rapidly increasing", "abstraction n. the act of abstracting", "lossy adj. involving loss"],
  },

  // ════════════════════════════════════════════════════════
  // 2. Cybernetics: the science of control
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
      { id: 'sp2-a1', type: 'claim', text: 'control is not about power but about information', note: "Core argument: The essence of control is information, not power." },
      { id: 'sp2-a2', type: 'evidence', text: 'a steam engine governor does not "know" physics; it merely senses', note: "Evidence: The thermostat analogy — control does not require \"understanding\", only feedback." },
      { id: 'sp2-a3', type: 'attitude', text: 'the science of control ultimately revealed the limits of control', note: "Author's attitude: Cybernetics ultimately revealed the limits of control." },
      { id: 'sp2-a4', type: 'keyword', text: 'feedback', note: "Key concept: Feedback — the core mechanism of cybernetics." },
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
        analysis: "The last sentence of the first paragraph, \"All were systems that used feedback — information about the gap between desired and actual states — to correct their behaviour\", directly corresponds to B.",
        distractors: [
          { optionId: 'C', type: "Concept substitution", why: "The article explicitly denies centralised command — \"not a commander issuing orders\"." },
          { optionId: 'D', type: "Unsupported claim", why: "The cybernetics of 1948 did not involve digital information." },
        ],
        vocabNotes: ["feedback n. feedback", "servomechanism n. servomechanism"],
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
        analysis: "In the third paragraph, Wiener warns that \"a society obsessed with control and efficiency would treat its citizens as components\" — the danger of applying cybernetic thinking to human society.",
        distractors: [
          { optionId: 'A', type: "Over-inference", why: "The author is not celebrating technological progress, but warning about its consequences." },
        ],
        vocabNotes: ["quantification n. quantification", "algorithmic governance algorithmic governance"],
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
        analysis: "The first sentence of the last paragraph, \"cybernetics, the science of control, ultimately revealed the limits of control\" — cybernetics itself revealed the limits of control, and this is the irony.",
        distractors: [
          { optionId: 'D', type: "Unsupported claim", why: "The article never compares the complexity of a thermostat and a brain." },
        ],
        vocabNotes: ["vasodilation n. vasodilation", "distributed adj. distributed"],
        score: 2,
      },
    ],
    tips: ["Note the argument structure throughout the text: theory proposed → engineering application → social warning → paradox revealed.", "Feedback is the core concept running through the whole text; note its meaning in different contexts."],
    vocabNotes: ["cybernetics n. cybernetics", "feedback n. feedback", "servomechanism n. servomechanism", "vasodilation n. vasodilation", "quantification n. quantification"],
  },

  // ════════════════════════════════════════════════════════
  // 3. Entropy and the arrow of time
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
      { id: 'sp3-a1', type: 'claim', text: 'time has a direction because of entropy, not because the laws of physics are asymmetric', note: "Core argument: The direction of time comes from entropy, not from an asymmetry in physical laws." },
      { id: 'sp3-a2', type: 'evidence', text: 'Newton\'s mechanics, Maxwell\'s electromagnetism — are perfectly time-symmetric', note: "Evidence: The laws of classical physics themselves are time-symmetric." },
      { id: 'sp3-a3', type: 'keyword', text: 'Past Hypothesis', note: "Key concept: The Past Hypothesis — why the Big Bang was a low-entropy state." },
      { id: 'sp3-a4', type: 'attitude', text: 'No one knows why', note: "Author's attitude: Frankly acknowledging unsolved mysteries." },
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
        analysis: "The first paragraph uses a falling teacup to introduce the core paradox: physical laws are time-symmetric, but real time has a direction. This corresponds to B.",
        distractors: [
          { optionId: 'A', type: "Unsupported claim", why: "The article does not involve a comparison between quantum mechanics and classical physics." },
          { optionId: 'C', type: "Over-inference", why: "The shattered teacup is only an introduction, not the focus of discussion." },
        ],
        vocabNotes: ["time-symmetric adj. time-symmetric", "thermodynamic adj. thermodynamic"],
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
        analysis: "The end of the third paragraph, \"both describe the tendency of systems to move from ordered states to disordered ones\", directly corresponds to B.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "Shannon borrowed Clausius's terminology, but the two are not the same person." },
        ],
        vocabNotes: ["dispersal n. dispersal, diffusion", "microscopic adj. microscopic"],
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
        analysis: "The last paragraph, \"the Past Hypothesis — the observation that the Big Bang was a moment of almost miraculous order\", directly defines it.",
        distractors: [
          { optionId: 'D', type: "Misattribution", why: "Heat death is the final state of the universe; the Past Hypothesis discusses the initial state of the universe." },
        ],
        vocabNotes: ["hypothesis n. hypothesis", "initial conditions initial conditions"],
        score: 2,
      },
    ],
    tips: ["Note the timeline throughout the text: 1865 Clausius → 1948 Shannon → the Big Bang.", "Understand the core tension between \"time-symmetric laws\" and \"a reality in which time has a direction\"."],
    vocabNotes: ["entropy n. entropy", "thermodynamics n. thermodynamics", "dispersal n. dispersal", "exquisite adj. exquisite", "miraculous adj. miraculous"],
  },

  // ════════════════════════════════════════════════════════
  // 4. Gödel: why mathematics cannot prove its own completeness
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
      { id: 'sp4-a1', type: 'claim', text: 'in any formal system powerful enough to describe basic arithmetic, there will always be true statements that cannot be proved', note: "The core statement of Gödel's incompleteness theorems." },
      { id: 'sp4-a2', type: 'evidence', text: 'This statement cannot be proved within this system', note: "Self-referential construction: the key technique in Gödel's proof." },
      { id: 'sp4-a3', type: 'keyword', text: 'self-reference', note: "Key concept: Self-reference — the core mechanism of Gödel's proof." },
      { id: 'sp4-a4', type: 'attitude', text: 'Godel liberated mathematics from the illusion of completeness', note: "Author's attitude: Incompleteness is not despair, but liberation." },
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
        analysis: "The second paragraph, \"a mathematical statement that essentially says: This statement cannot be proved within this system\" — a self-referential unprovable statement.",
        distractors: [
          { optionId: 'A', type: "Unsupported claim", why: "Gödel's theorem does not involve computational complexity." },
          { optionId: 'C', type: "Concept substitution", why: "It is not a contradiction with arithmetic axioms, but rather that the system cannot prove its own consistency." },
        ],
        vocabNotes: ["self-reference n. self-reference", "inconsistent adj. inconsistent"],
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
        analysis: "The third paragraph, \"Turing later showed a computational analogue: there are problems that no algorithm can solve\" — Turing transformed incompleteness into computational unsolvability.",
        distractors: [
          { optionId: 'C', type: "Concept substitution", why: "The article says precisely the opposite: some problems can never be solved by algorithms." },
        ],
        vocabNotes: ["analogue n. analogue", "algorithm n. algorithm"],
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
        analysis: "The last paragraph, \"any mathematical system must leave some truths uncharted\" — just as a map must be smaller than the territory, a mathematical system must necessarily have omissions.",
        distractors: [
          { optionId: 'A', type: "Over-inference", why: "Borges's map analogy is not about \"the impracticality of large projects\", but about \"the inherent limitations of representational systems\"." },
        ],
        vocabNotes: ["liberated v. liberated", "uncharted adj. uncharted, unknown"],
        score: 2,
      },
    ],
    tips: ["Understanding self-reference is the key mechanism of the whole text.", "Note the extension of the argument from Gödel to Turing: from mathematics to computation."],
    vocabNotes: ["incompleteness n. incompleteness", "axiom n. axiom", "self-reference n. self-reference", "algorithm n. algorithm", "uncharted adj. unknown"],
  },

  // ════════════════════════════════════════════════════════
  // 5. Kuhn: the structure of scientific revolutions
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
      { id: 'sp5-a1', type: 'claim', text: 'science does not progress by accumulation but by revolution', note: "Core argument: Science is not gradual accumulation but revolutionary paradigm shifts." },
      { id: 'sp5-a2', type: 'evidence', text: 'Copernicus replaced Ptolemy. Einstein replaced Newton', note: "Historical evidence: Examples of scientific revolutions." },
      { id: 'sp5-a3', type: 'keyword', text: 'paradigm shift', note: "Key concept: Paradigm shift." },
      { id: 'sp5-a4', type: 'attitude', text: 'We all operate within paradigms — frameworks so familiar that we forget they are frameworks at all', note: "Author's attitude: Paradigms are everywhere, but we often fail to notice them." },
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
        analysis: "The second paragraph, \"Normal science...operates within an existing paradigm, solving puzzles that the paradigm defines\", directly corresponds to B.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "Revolutionary discoveries are a feature of paradigm shifts, not of normal science." },
        ],
        vocabNotes: ["paradigm n. paradigm", "anomaly n. anomaly"],
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
        analysis: "The fourth paragraph, Popper \"objected that Kuhn's account made science seem irrational — a matter of fashion and sociology rather than logic and evidence\", directly corresponds to B.",
        distractors: [
          { optionId: 'C', type: "Over-inference", why: "Kuhn never claimed that all paradigms are equally valid." },
        ],
        vocabNotes: ["irrational adj. irrational", "adherent n. adherent, follower"],
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
        analysis: "The last paragraph, \"Paradigm shifts occur not only in physics and biology but in economics, psychology, and even everyday reasoning\" — paradigms exist in everyday thinking.",
        distractors: [
          { optionId: 'D', type: "Concept substitution", why: "Kuhn's view is precisely that science does not always \"progress\", but rather undergoes paradigm shifts." },
        ],
        vocabNotes: ["defect v. defect, switch allegiance", "critical mass critical mass"],
        score: 2,
      },
    ],
    tips: ["Note the structure of the philosophical debate between Kuhn and Popper.", "Understand that \"paradigm\" is not just a theory, but an entire worldview."],
    vocabNotes: ["paradigm n. paradigm", "anomaly n. anomaly", "revolution n. revolution", "adherent n. follower", "arbitrary adj. arbitrary"],
  },

  // ════════════════════════════════════════════════════════
  // 6. Heisenberg: observation changes the observed
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
      { id: 'sp6-a1', type: 'claim', text: 'This is not a limitation of instruments — it is a feature of reality', note: "Core argument: Uncertainty is a feature of reality, not a limitation of observation." },
      { id: 'sp6-a2', type: 'evidence', text: 'To observe an electron, you must bounce something off it', note: "Physical explanation: Observation necessarily disturbs the observed object." },
      { id: 'sp6-a3', type: 'keyword', text: 'Laplacean determinism', note: "Key concept: Laplacean determinism — the classical physical ideal of determinism." },
      { id: 'sp6-a4', type: 'attitude', text: 'the universe is not a clock but a casino', note: "Author's attitude: The universe is not a clock but a casino." },
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
        analysis: "The second paragraph uses the billiard ball analogy to explain \"The collision tells you where the ball was, but it also knocks it to a new position\" — observation necessarily disturbs the observed object.",
        distractors: [
          { optionId: 'A', type: "Unsupported claim", why: "The article does not discuss wave-particle duality." },
          { optionId: 'C', type: "Over-inference", why: "The analogy is meant to explain the uncertainty principle, not to compare physical theories." },
        ],
        vocabNotes: ["momentum n. momentum", "photon n. photon"],
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
        analysis: "The third paragraph, \"It does not say that we cannot know everything...It says that certain pairs of properties do not simultaneously possess precise values\" — uncertainty is about reality itself, not about the limits of our knowledge.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "The article does not say it is limited to subatomic particles." },
        ],
        vocabNotes: ["indeterminate adj. indeterminate", "Laplacean determinism Laplacean determinism"],
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
        analysis: "The clock metaphor implies determinism (precise predictability), while the casino metaphor implies intrinsic randomness. The last paragraph, \"Uncertainty is woven into the fabric of reality\", corresponds to C.",
        distractors: [
          { optionId: 'A', type: "Surface reading", why: "Casino is a metaphor; it does not mean physics is based on gambling." },
        ],
        vocabNotes: ["clockwork mechanism clockwork mechanism", "casino n. casino"],
        score: 2,
      },
    ],
    tips: ["Understand the physical meaning of the billiard ball analogy: the disturbance caused by the act of observation itself.", "Note the author's argumentative method of correcting common misunderstandings."],
    vocabNotes: ["uncertainty n. uncertainty", "momentum n. momentum", "photon n. photon", "determinism n. determinism", "indeterminate adj. indeterminate"],
  },

  // ════════════════════════════════════════════════════════
  // 7. Turing: can machines think?
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
      { id: 'sp7-a1', type: 'claim', text: 'Turing replaced the metaphysical question with an operational one', note: "Core argument: Turing transformed a metaphysical question into an engineering problem." },
      { id: 'sp7-a2', type: 'evidence', text: 'John Searle\'s famous "Chinese Room" thought experiment', note: "Counter-evidence: Searle's Chinese Room argument" },
      { id: 'sp7-a3', type: 'keyword', text: 'imitation game', note: "Key concept: imitation game — the original name of the Turing Test" },
      { id: 'sp7-a4', type: 'attitude', text: 'the line between imitation and understanding has never been blurrier', note: "Author's attitude: the boundary between imitation and understanding has never been so blurred" },
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
        analysis: "Paragraph 1 \"Rather than grappling with...defining thinking, Turing proposed a practical test\" — replacing the definitional problem with a behavioral test.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "Turing precisely avoided the problem of defining thinking exactly" },
        ],
        vocabNotes: ["interrogator n. questioner, one who asks questions", "imitation n. imitation"],
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
        analysis: "Paragraph 2 \"The room produces perfect Chinese responses, but no comprehension exists inside\" — correct output does not equal understanding.",
        distractors: [
          { optionId: 'C', type: "Unsupported claim", why: "Searle is discussing the problem of understanding, not the difficulty of the test" },
        ],
        vocabNotes: ["conflation n. the act of confusing two things", "comprehension n. understanding"],
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
        analysis: "Final paragraph \"if a machine's behaviour is indistinguishable from thinking, does it matter whether it really thinks?\" — whether behavioral equivalence equals thinking.",
        distractors: [
          { optionId: 'A', type: "Over-inference", why: "Turing's question is not \"how to build a conscious machine\" but \"whether behavior is sufficient to define thinking\"" },
        ],
        vocabNotes: ["indistinguishable adj. impossible to tell apart", "benchmark n. a standard for comparison"],
        score: 2,
      },
    ],
    tips: ["Understand the structure of the philosophical debate between Turing and Searle", "Note the author's evaluation of the Turing Test: from philosophical thought experiment to engineering benchmark"],
    vocabNotes: ["imitation n. imitation", "comprehension n. understanding", "metaphysical adj. relating to metaphysics", "operational adj. relating to operation", "indistinguishable adj. impossible to tell apart"],
  },

  // ════════════════════════════════════════════════════════
  // 8. Bateson: information is difference
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
      { id: 'sp8-a1', type: 'claim', text: 'Information is a difference that makes a difference', note: "Bateson's classic definition of information" },
      { id: 'sp8-a2', type: 'evidence', text: 'a random noise pattern and Shakespeare\'s sonnets carry the same amount of Shannon information', note: "Limitation of Shannon's information theory: it does not distinguish meaningful from meaningless information" },
      { id: 'sp8-a3', type: 'keyword', text: 'a difference that makes a difference', note: "Bateson's core concept" },
      { id: 'sp8-a4', type: 'attitude', text: 'perhaps it processes information without ever encountering meaning', note: "Author's attitude: maintaining openness to the question of meaning in AI" },
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
        analysis: "Paragraph 2 \"Bateson's formulation adds a crucial qualification: information must make a difference — it must change the behaviour of the receiving system\" directly corresponds to B.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "Bateson's definition is less mathematically precise than Shannon's, but more conceptual" },
          { optionId: 'C', type: "Over-inference", why: "Bateson uses a thermostat as an example to show that information is not limited to living organisms" },
        ],
        vocabNotes: ["formulation n. expression, the act of formulating", "qualification n. a limiting condition"],
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
        analysis: "Paragraph 4 \"the organism's nervous system is structured to detect certain differences\" — a frog's eye only sees moving dots, showing that organisms only detect differences relevant to their survival.",
        distractors: [
          { optionId: 'D', type: "Concept substitution", why: "The article emphasizes that different species perceive different worlds, not the same reality" },
        ],
        vocabNotes: ["differentially adv. in a differential manner", "gradient n. a gradient"],
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
        analysis: "Final paragraph \"does the output make a difference to the model itself?\" — whether AI truly \"receives\" information or merely pattern-matches.",
        distractors: [
          { optionId: 'A', type: "Over-inference", why: "The amount of information processed is not Bateson's concern" },
        ],
        vocabNotes: ["token n. token (AI term)", "capacity n. ability"],
        score: 2,
      },
    ],
    tips: ["Understand the three layers of Bateson's definition: difference → makes a difference to the receiving system → relational", "Note how the frog/bat examples support \"information is relational\""],
    vocabNotes: ["cybernetician n. a scholar of cybernetics", "formulation n. expression", "differential adj. relating to difference", "gradient n. a gradient", "token n. token"],
  },

  // ════════════════════════════════════════════════════════
  // 9. Game theory: the mathematics of strategic dilemmas
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
      { id: 'sp9-a1', type: 'claim', text: 'individual rationality leads to collective disaster', note: "Core argument: individual rationality leads to collective disaster — the paradox of game theory" },
      { id: 'sp9-a2', type: 'evidence', text: 'Climate negotiations are a multi-player Prisoner\'s Dilemma', note: "Real-world evidence: climate negotiations are a multi-party prisoner's dilemma" },
      { id: 'sp9-a3', type: 'keyword', text: 'Nash equilibrium', note: "Key concept: Nash equilibrium" },
      { id: 'sp9-a4', type: 'attitude', text: 'the man who mathematically formalised rationality spent decades unable to distinguish reason from delusion', note: "Author's attitude: the irony of Nash's personal tragedy and his theory" },
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
        analysis: "Paragraph 1 \"a set of strategies where no player can improve their outcome by unilaterally changing their own\" directly defines Nash equilibrium.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "Nash equilibrium does not necessarily maximize total welfare (in the prisoner's dilemma, mutual defection is an equilibrium but not optimal)" },
          { optionId: 'C', type: "Concept substitution", why: "In the prisoner's dilemma, neither party prefers the equilibrium outcome" },
        ],
        vocabNotes: ["equilibrium n. equilibrium", "unilaterally adv. on one's own, without others"],
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
        analysis: "Paragraph 3 \"Individual rationality leads to collective disaster\" — individually rational choices lead to collectively suboptimal outcomes.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "Cooperation is the better outcome, but not the \"rational\" choice (rationality leads to mutual betrayal)" },
        ],
        vocabNotes: ["betray v. to betray", "paradoxically adv. in a contradictory manner"],
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
        analysis: "Final paragraph \"The man who mathematically formalised rationality spent decades unable to distinguish reason from delusion\" — the irony of Nash's personal tragedy and his theory.",
        distractors: [
          { optionId: 'A', type: "Unsupported claim", why: "The author explicitly affirms Nash's Nobel Prize-winning contribution" },
        ],
        vocabNotes: ["schizophrenia n. schizophrenia", "poignant adj. evoking a keen sense of sadness"],
        score: 2,
      },
    ],
    tips: ["Understand the core paradox of the prisoner's dilemma: individual optimum ≠ collective optimum", "Note the ironic contrast between Nash's personal experience and game theory"],
    vocabNotes: ["equilibrium n. equilibrium", "unilaterally adv. on one's own, without others", "paradoxically adv. in a contradictory manner", "poignant adj. evoking a keen sense of sadness", "counterintuitive adj. contrary to intuition"],
  },

  // ════════════════════════════════════════════════════════
  // 10. Schrödinger: what is life?
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
      { id: 'sp10-a1', type: 'claim', text: 'living systems are not closed but open: they continuously import order from their environment', note: "Core argument: life counteracts entropy increase by importing ordered energy" },
      { id: 'sp10-a2', type: 'evidence', text: 'Francis Crick explicitly credited Schrödinger with inspiring his move from physics to biology', note: "Historical evidence: Schrödinger inspired the discoverers of DNA" },
      { id: 'sp10-a3', type: 'keyword', text: 'aperiodic crystal', note: "Key concept: aperiodic crystal — Schrödinger's prediction of gene structure" },
      { id: 'sp10-a4', type: 'attitude', text: 'life is a process of importing order to combat entropy', note: "Author's attitude: life is a process of importing order to counteract entropy" },
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
        analysis: "Paragraph 3 \"Living systems...are not closed but open: they continuously import order from their environment and export disorder\" directly corresponds to C.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "Schrödinger explicitly says life does not violate the second law of thermodynamics, but locally reduces entropy by importing ordered energy" },
        ],
        vocabNotes: ["negentropy n. negative entropy", "eddy n. a whirlpool"],
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
        analysis: "Paragraph 5 \"the gene must be an aperiodic crystal — a molecule with a non-repeating structure that carries information\" directly corresponds to B.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "It is aperiodic, not simple repeating" },
        ],
        vocabNotes: ["aperiodic adj. not periodic", "fidelity n. faithfulness"],
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
        analysis: "Paragraph 4 The example of Crick and Watson shows that interdisciplinary thinking (physics → biology) drove the discovery of DNA.",
        distractors: [
          { optionId: 'A', type: "Over-inference", why: "The article is not comparing the importance of physics and biology" },
        ],
        vocabNotes: ["electrifying adj. thrilling, exciting", "interdisciplinary adj. involving multiple disciplines"],
        score: 2,
      },
    ],
    tips: ["Understand Schrödinger's core analogy: life = a locally ordered system that counteracts entropy increase", "Note the predictive power of the aperiodic crystal concept for the discovery of DNA"],
    vocabNotes: ["entropy n. entropy", "negentropy n. negative entropy", "aperiodic adj. not periodic", "fidelity n. faithfulness", "electrifying adj. thrilling, exciting"],
  },

  // ════════════════════════════════════════════════════════
  // 11. Popper: if it cannot be falsified, it is not science
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
      { id: 'sp11-a1', type: 'claim', text: 'A theory is scientific not if it can be confirmed but if it can be refuted', note: "Core argument: the criterion for a scientific theory is falsifiability, not verifiability" },
      { id: 'sp11-a2', type: 'evidence', text: 'Einstein\'s general relativity...made specific, risky predictions', note: "Positive evidence: the falsifiability of Einstein's theory" },
      { id: 'sp11-a3', type: 'keyword', text: 'falsification', note: "Key concept: falsification — Popper's core criterion" },
      { id: 'sp11-a4', type: 'attitude', text: 'Every scientific truth carries an invisible asterisk: pending refutation', note: "Author's attitude: all scientific truths carry an invisible asterisk of \"yet to be falsified\"" },
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
        analysis: "Paragraph 1 \"Psychoanalysis...could explain any human behaviour...and neither could ever be disproved\" — it cannot be falsified.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "Psychoanalysis is indeed based on observation; the problem is that it can explain everything, and no observation can refute it" },
        ],
        vocabNotes: ["sublimation n. sublimation (psychological term)", "demarcation n. demarcation"],
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
        analysis: "Paragraph 3 \"Scientists do not abandon theories at the first failed prediction. They adjust auxiliary hypotheses\" — real scientific practice does not follow strict falsification.",
        distractors: [
          { optionId: 'D', type: "Concept substitution", why: "The criticism is not that Popper's criterion is too loose, but that it is too strict (it does not match actual scientific practice)" },
        ],
        vocabNotes: ["auxiliary adj. supplementary", "heuristic n. a heuristic method"],
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
        analysis: "Final paragraph \"We never prove a theory true; we merely fail to prove it false — so far\" — scientific knowledge is always provisional.",
        distractors: [
          { optionId: 'A', type: "Over-inference", why: "Provisional does not mean unreliable; it only means there is a possibility of being falsified" },
        ],
        vocabNotes: ["provisional adj. temporary", "refutation n. refutation, falsification"],
        score: 2,
      },
    ],
    tips: ["Understand Popper's core distinction: falsifiable vs unfalsifiable", "Note the author's argument expands from logic → history → everyday application"],
    vocabNotes: ["falsification n. falsification", "demarcation n. demarcation", "heuristic n. heuristic", "provisional adj. temporary", "refutation n. refutation"],
  },

  // ════════════════════════════════════════════════════════
  // 12. McLuhan: the medium is the message
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
      { id: 'sp12-a1', type: 'claim', text: 'the medium through which information travels shapes human consciousness more profoundly than the information itself', note: "Core argument: the medium's influence on human consciousness is deeper than the information itself" },
      { id: 'sp12-a2', type: 'evidence', text: 'The printing press did not merely deliver books; it created the habit of linear, sequential thinking', note: "Evidence: printing created linear habits of thought" },
      { id: 'sp12-a3', type: 'keyword', text: 'global village', note: "Key concept: global village — McLuhan's prophecy of the internet age" },
      { id: 'sp12-a4', type: 'attitude', text: 'this village would not be a peaceful utopia but a place of intense tribal conflict', note: "Author's attitude: the global village is not a utopia, but a place of tribal conflict" },
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
        analysis: "Paragraph 2 \"Television...restructured attention spans, political discourse, and the boundary between public and private life\" — the medium's influence lies in reshaping patterns of human behavior.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "This is exactly the view McLuhan opposed — content is not the most important thing" },
        ],
        vocabNotes: ["discourse n. discourse, discussion", "linear adj. linear"],
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
        analysis: "Final paragraph \"instant communication revives the emotional intensity of pre-literate oral culture\" — distance shrinks but conflict intensifies.",
        distractors: [
          { optionId: 'A', type: "Opposite meaning", why: "McLuhan explicitly says the global village is \"not a peaceful utopia\"" },
        ],
        vocabNotes: ["tribal adj. relating to a tribe", "utopia n. an ideal society"],
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
        analysis: "Paragraph 3 \"Cool media...leave gaps that the audience must actively fill\" — cool media require more participation.",
        distractors: [
          { optionId: 'A', type: "Literal misreading", why: "hot/cool is a metaphor, not actual temperature" },
        ],
        vocabNotes: ["participation n. involvement", "paradoxically adv. in a contradictory manner"],
        score: 2,
      },
    ],
    tips: ["Understand McLuhan's core metaphor: media ≠ container, but shaping force", "Note that the definition of hot/cool media is counterintuitive"],
    vocabNotes: ["medium n. medium", "discourse n. discourse", "tribal adj. relating to a tribe", "utopia n. an ideal society", "participation n. involvement"],
  },

  // ════════════════════════════════════════════════════════
  // 13. Foucault: the panopticon
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
      { id: 'sp13-a1', type: 'claim', text: 'the Panopticon represented a fundamental shift in how power operates', note: "Core argument: the panopticon represents a fundamental shift in how power operates" },
      { id: 'sp13-a2', type: 'evidence', text: 'The public execution gave way to the prison, where punishment became invisible, administrative, and continuous', note: "Evidence: the shift from public execution to invisible prison" },
      { id: 'sp13-a3', type: 'keyword', text: 'disciplinary power', note: "Key concept: disciplinary power — operates through internalized surveillance" },
      { id: 'sp13-a4', type: 'attitude', text: 'the most effective power is the kind you don\'t notice — the kind you enforce upon yourself', note: "Author's attitude: the most effective power is the power you exert over yourself" },
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
        analysis: "Paragraph 1 \"surveillance became self-enforcing — prisoners, uncertain of the watcher's gaze, would regulate their own behaviour\" — uncertainty makes surveillance self-enforcing.",
        distractors: [
          { optionId: 'A', type: "Unsupported claim", why: "The design emphasis is that prisoners are watched by the central tower, not that prisoners watch each other" },
        ],
        vocabNotes: ["enforce v. to enforce", "inmate n. prisoner"],
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
        analysis: "Paragraph 2 \"Modern power...is disciplinary: it operates through internalised surveillance, routine examination, and the constant possibility of being watched\" — disciplinary power operates through internalization.",
        distractors: [
          { optionId: 'A', type: "Opposite meaning", why: "This is a feature of pre-modern power, not modern power" },
        ],
        vocabNotes: ["disciplinary adj. disciplinary", "sovereign adj. sovereign", "normalise v. to normalize"],
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
        analysis: "Paragraph 4 \"we curate our behaviour for an imagined audience of followers, performing normalcy without anyone needing to watch from a tower\" — users self-censor for an imagined audience.",
        distractors: [
          { optionId: 'A', type: "Over-specific claim", why: "The panopticon logic of social media is psychological, not physical cameras" },
        ],
        vocabNotes: ["curate v. to curate", "algorithmic adj. algorithmic"],
        score: 2,
      },
    ],
    tips: ["Understand Foucault's core distinction: pre-modern power = display, modern power = internalized surveillance", "Note the extension of panopticon logic into the digital age"],
    vocabNotes: ["panopticon n. panopticon", "disciplinary adj. disciplinary", "surveillance n. surveillance", "normalise v. to normalize", "internalise v. to internalize"],
  },

  // ════════════════════════════════════════════════════════
  // 14. Heidegger: the question concerning technology
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
      { id: 'sp14-a1', type: 'claim', text: 'Modern technology enframes the world as standing reserve — resources to be ordered, optimised, and exploited', note: "Core argument: modern technology frames the world as standing reserve" },
      { id: 'sp14-a2', type: 'evidence', text: 'A windmill works with the wind; a hydroelectric dam transforms the Rhine into a standing reserve', note: "Comparative evidence: windmill vs hydroelectric dam" },
      { id: 'sp14-a3', type: 'keyword', text: 'enframing', note: "Key concept: enframing — Heidegger's description of the essence of modern technology" },
      { id: 'sp14-a4', type: 'attitude', text: 'the essence of technology is nothing technological', note: "Author's attitude: the essence of technology is not technological" },
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
        analysis: "Paragraph 2 \"the river ceases to be a river and becomes a power source...is not merely technical but ontological\" — technology changes the mode of being of things.",
        distractors: [
          { optionId: 'D', type: "Over-specific claim", why: "Heidegger is concerned not with environmental issues but with ontological issues" },
        ],
        vocabNotes: ["ontological adj. ontological", "harness v. to harness"],
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
        analysis: "Paragraph 4 \"It is a way of seeing that reduces everything to calculable, optimisable resources\" — enframing is a way of seeing that reduces everything to calculable resources.",
        distractors: [
          { optionId: 'A', type: "Literal misreading", why: "enframing is not a physical frame, but an ontological framing" },
        ],
        vocabNotes: ["standing reserve n. standing reserve", "releasement n. releasement"],
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
        analysis: "Paragraph 4 \"The antidote...is not to reject technology but to cultivate a different relationship with Being — through art, through wonder\" — not to reject technology, but to change the relationship.",
        distractors: [
          { optionId: 'A', type: "Opposite meaning", why: "Heidegger explicitly says \"not to reject technology\"" },
        ],
        vocabNotes: ["antidote n. antidote", "touchstone n. touchstone"],
        score: 2,
      },
    ],
    tips: ["Understand Heidegger's core distinction: ancient technology = cooperation, modern technology = enframing", "Note that \"enframing\" is not a physical frame, but an ontological framing"],
    vocabNotes: ["ontological adj. ontological", "enframing n. enframing", "standing reserve n. standing reserve", "releasement n. releasement", "touchstone n. touchstone"],
  },

  // ════════════════════════════════════════════════════════
  // 15. Hannah Arendt: the banality of evil
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
      { id: 'sp15-a1', type: 'claim', text: 'the most terrible evil does not require terrible people. It requires ordinary people who stop thinking', note: "Core argument: the greatest evil does not require terrible people, only ordinary people who stop thinking" },
      { id: 'sp15-a2', type: 'evidence', text: 'Eichmann was not a sadist or a fanatic. He was a careerist — a man who followed orders', note: "Evidence: Eichmann was not a pervert, just a bureaucrat" },
      { id: 'sp15-a3', type: 'keyword', text: 'banality of evil', note: "Key concept: the banality of evil — Arendt's core contribution" },
      { id: 'sp15-a4', type: 'attitude', text: 'evil does not always look evil. Sometimes it looks like efficiency, like compliance', note: "Author's attitude: evil does not necessarily look like evil; sometimes it looks like efficiency and obedience" },
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
        analysis: "Paragraph 2 \"Eichmann was not a sadist or a fanatic. He was a careerist...terribly and terrifyingly normal\" — what shocked Arendt was his ordinariness.",
        distractors: [
          { optionId: 'A', type: "Unsupported claim", why: "What shocked Arendt was not the lack of remorse, but the lack of malice" },
        ],
        vocabNotes: ["banality n. banality", "careerist n. careerist"],
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
        analysis: "Paragraph 3 \"the most terrible evil does not require terrible people. It requires ordinary people who stop thinking\" — the core meaning of the banality of evil.",
        distractors: [
          { optionId: 'D', type: "Over-inference", why: "Arendt is not downplaying the Holocaust, but analyzing the conditions under which it occurred" },
        ],
        vocabNotes: ["cliché n. cliché", "bureaucratic adj. bureaucratic"],
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
        analysis: "Paragraph 4 \"modern bureaucracy creates conditions in which responsibility is diffused across an entire system\" — bureaucracy diffuses responsibility.",
        distractors: [
          { optionId: 'A', type: "Opposite meaning", why: "Arendt's view is the opposite — a clear chain of command does not prevent evil" },
        ],
        vocabNotes: ["diffuse v. to diffuse", "totalitarianism n. totalitarianism"],
        score: 2,
      },
    ],
    tips: ["Understand Arendt's core distinction: evil does not require malice, only thoughtlessness", "Note that \"the banality of evil\" is not excusing Eichmann, but analyzing the conditions under which evil occurs"],
    vocabNotes: ["banality n. banality", "careerist n. careerist", "cliché n. cliché", "diffuse v. to diffuse", "totalitarianism n. totalitarianism"],
  },

  // ════════════════════════════════════════════════════════
  // 16. Walter Benjamin: the work of art in the age of mechanical reproduction
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
      { id: 'sp16-a1', type: 'claim', text: 'Mechanical reproduction destroys the aura...What is lost is not the image itself but the ritual and authority that surrounded the original', note: "Core argument: mechanical reproduction destroys not the image, but the ritual and authority of the original" },
      { id: 'sp16-a2', type: 'evidence', text: 'A photograph of the Mona Lisa can be reproduced millions of times...The image becomes ubiquitous', note: "Evidence: the infinite reproduction of photographs of the Mona Lisa" },
      { id: 'sp16-a3', type: 'keyword', text: 'aura', note: "Key concept: aura — Benjamin's description of the uniqueness of the original" },
      { id: 'sp16-a4', type: 'attitude', text: 'Fascism aestheticised politics...Communism should politicise art', note: "Author's attitude: fascism aestheticizes politics; communism should politicize art" },
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
        analysis: "Paragraph 2 \"a sense of distance, authority, and presence that surrounded the original like an invisible halo\" — aura is the original's sense of authority and distance.",
        distractors: [
          { optionId: 'A', type: "Literal misreading", why: "aura is not physical light, but a spiritual dimension" },
        ],
        vocabNotes: ["aura n. aura", "ubiquitous adj. ubiquitous"],
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
        analysis: "Paragraph 4 \"the destruction of aura was democratising\" + final paragraph \"mechanical reproduction made art available for political manipulation\" — both democratization and manipulation.",
        distractors: [
          { optionId: 'A', type: "Opposite meaning", why: "Reproduction makes art cheaper and more widespread, not more expensive" },
        ],
        vocabNotes: ["aestheticise v. to aestheticize", "distraction n. distraction"],
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
        analysis: "Final paragraph \"Fascism...aestheticised politics — turning war and violence into spectacle\" + \"written as fascism swept Europe\" — a warning about fascism's use of mass culture.",
        distractors: [
          { optionId: 'D', type: "Over-inference", why: "Benjamin is not calling for the protection of the original, but analyzing the political impact of reproduction" },
        ],
        vocabNotes: ["manipulation n. manipulation", "spectacle n. spectacle"],
        score: 2,
      },
    ],
    tips: ["Understand Benjamin's core distinction: aura (original) vs reproduction (de-ritualization)", "Note \"political ambiguity\" — the same technology can both democratize and be manipulated"],
    vocabNotes: ["aura n. aura", "ubiquitous adj. ubiquitous", "aestheticise v. to aestheticize", "spectacle n. spectacle", "manipulation n. manipulation"],
  },

  // ════════════════════════════════════════════════════════
  // 17. Zhuangzi dreams of a butterfly: philosophy of mind
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
      { id: 'sp17-a1', type: 'claim', text: 'He didn\'t know if he was Zhuangzi who had dreamt he was a butterfly, or a butterfly dreaming he was Zhuangzi', note: "Core argument: the boundary between self and other is unstable" },
      { id: 'sp17-a2', type: 'evidence', text: 'Descartes would ask a similar question in 1641...but Zhuangzi goes further', note: "Comparative evidence: the similarities and transcendence of Descartes and Zhuangzi" },
      { id: 'sp17-a3', type: 'keyword', text: 'personal identity', note: "Key concept: personal identity — what is the essence of the self" },
      { id: 'sp17-a4', type: 'attitude', text: 'the self is not a thing but a process — not a butterfly or a philosopher, but the dreaming itself', note: "Author's attitude: the self is not a substance, but a process" },
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
        analysis: "Paragraph 2 \"anticipates questions that Western philosophy would not seriously address for two millennia\" — Zhuangzi was two thousand years ahead of the West.",
        distractors: [
          { optionId: 'B', type: "Degree error", why: "Not a few hundred years, but two thousand years" },
        ],
        vocabNotes: ["anticipate v. to anticipate", "millennia n. millennia (plural)"],
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
        analysis: "Paragraph 2 \"Descartes concluded that he could be certain of his own existence; Zhuangzi offers no such certainty\" — Zhuangzi did not even arrive at the certainty of \"I think, therefore I am.\"",
        distractors: [
          { optionId: 'A', type: "Irrelevant option", why: "Writing technique is not a measure of philosophical depth" },
        ],
        vocabNotes: ["cogito ergo sum I think, therefore I am (Latin)"],
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
        analysis: "Final paragraph \"Zhuangzi's genius was to present these insights not as abstract arguments but as a story\" — expressing philosophical insight through story rather than abstract argument.",
        distractors: [
          { optionId: 'A', type: "Opposite meaning", why: "Zhuangzi precisely does not use logical argument, but parable" },
        ],
        vocabNotes: ["anatta n. anatta (Buddhist term)", "transparent adj. transparent"],
        score: 2,
      },
    ],
    tips: ["Understand the core difference between Zhuangzi and Descartes: Descartes found certainty, Zhuangzi did not", "Note the core view of modern philosophy of mind that \"the self is not a substance, but a process\""],
    vocabNotes: ["anticipate v. to anticipate", "millennia n. millennia", "anatta n. anatta", "cogito ergo sum I think, therefore I am", "transparent adj. transparent"],
  },

  // ════════════════════════════════════════════════════════
  // 18. The Ship of Theseus: what makes you you?
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
      { id: 'sp18-a1', type: 'claim', text: 'Identity, Parfit concluded, is not what matters. What matters is survival — the continuation of your experiences, values, and relationships', note: "Core argument: identity does not matter; what matters is continuity" },
      { id: 'sp18-a2', type: 'evidence', text: 'nearly every cell in your body has been replaced', note: "Physical evidence: almost all human body cells are replaced" },
      { id: 'sp18-a3', type: 'keyword', text: 'Ship of Theseus', note: "Key concept: the Ship of Theseus — one of the oldest thought experiments" },
      { id: 'sp18-a4', type: 'attitude', text: 'the question itself is confused. There is no deep fact about whether you are the same person', note: "Author's attitude: the question itself is confused; there is no deep fact about identity" },
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
        analysis: "Paragraph 2 \"it exposes a fundamental problem with our concept of identity\" — the Ship of Theseus reveals the problem of how identity persists through material change.",
        distractors: [
          { optionId: 'A', type: "Literal misreading", why: "It is not about cultural relic preservation, it is about the philosophy of identity." },
        ],
        vocabNotes: ["plank n. a plank", "persist v. to continue to exist"],
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
        analysis: "Paragraph 4 \"if you develop amnesia and forget your childhood entirely, do you cease to be the same person?\" — forgetting seems to destroy identity.",
        distractors: [
          { optionId: 'A', type: "Opposite meaning", why: "The article mentions false memories to show that memory is not always accurate." },
        ],
        vocabNotes: ["amnesia n. amnesia", "psychological adj. psychological"],
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
        analysis: "Final paragraph \"There is only psychological continuity and connectedness, which come in degrees\" — psychological continuity and connectedness, not strict identity.",
        distractors: [
          { optionId: 'A', type: "Concept substitution", why: "Parfit explicitly denies that the physical body is the basis of identity." },
        ],
        vocabNotes: ["metaphysically adv. metaphysically", "continuity n. continuity"],
        score: 2,
      },
    ],
    tips: ["Understand Parfit's core distinction: identity vs survival.", "Note the two-layer dilemma of the thought experiment: the replaced ship vs the reassembled ship."],
    vocabNotes: ["plank n. a plank", "persist v. to continue to exist", "amnesia n. amnesia", "continuity n. continuity", "metaphysically adv. metaphysically"],
  },

  // ════════════════════════════════════════════════════════
  // 19. Bayes: reasoning under uncertainty
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
      { id: 'sp19-a1', type: 'claim', text: 'Bayesian reasoning is not purely objective; it starts with a subjective estimate and revises it', note: "Core argument: Bayesian reasoning starts from subjective priors and then updates." },
      { id: 'sp19-a2', type: 'evidence', text: 'If the disease affects only one in ten thousand people, Bayes\' theorem shows the actual probability is less than 1%', note: "Mathematical evidence: the true positive rate of a rare disease test is far lower than intuition suggests." },
      { id: 'sp19-a3', type: 'keyword', text: 'prior', note: "Key concept: prior probability — a subjective estimate before seeing evidence." },
      { id: 'sp19-a4', type: 'attitude', text: 'the stronger your prior, the less evidence matters', note: "Author's attitude: the stronger the prior, the less important the evidence (both an advantage and a trap)." },
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
        analysis: "Paragraph 2 \"how should we update our beliefs when we encounter new evidence\" + formula P(H|E) = P(E|H) × P(H) / P(E) — the core is updating beliefs based on priors and new evidence.",
        distractors: [
          { optionId: 'A', type: "Opposite meaning", why: "Bayesian reasoning precisely acknowledges that probability is subjective (the prior)." },
        ],
        vocabNotes: ["prior n. prior", "posterior n. posterior"],
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
        analysis: "Paragraph 4 \"if the disease affects only one in ten thousand people\" — an extremely low base rate (prior) causes the true positive rate to be far lower than the test accuracy.",
        distractors: [
          { optionId: 'A', type: "Unsupported claim", why: "The test accuracy is indeed 99%; the problem lies in the base rate." },
        ],
        vocabNotes: ["base rate n. base rate", "diagnostics n. diagnostics"],
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
        analysis: "Paragraph 5 \"When someone is deeply committed to a hypothesis (extremely high prior), no amount of evidence can shift their belief significantly\" — an extremely strong prior makes evidence almost irrelevant.",
        distractors: [
          { optionId: 'A', type: "Irrelevant option", why: "The article is not criticizing the intelligence of conspiracy theorists." },
        ],
        vocabNotes: ["reinterpret v. to reinterpret", "counter-evidence n. counter-evidence"],
        score: 2,
      },
    ],
    tips: ["Understand the core of the Bayesian formula: P(H|E) = P(E|H) × P(H) / P(E).", "Note the dual nature of the prior: it is both the starting point of rationality and a possible source of bias."],
    vocabNotes: ["prior n. prior", "posterior n. posterior", "base rate n. base rate", "diagnostics n. diagnostics", "reinterpret v. to reinterpret"],
  },

  // ════════════════════════════════════════════════════════
  // 20. Taleb: the black swan
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
      { id: 'sp20-a1', type: 'claim', text: 'history is dominated by rare, unpredictable events that we rationalise only after they occur', note: "Core argument: history is dominated by rare, unpredictable events." },
      { id: 'sp20-a2', type: 'evidence', text: 'The fall of the Berlin Wall, the rise of the internet, the 2008 financial crisis — all were black swans', note: "Evidence: the fall of the Berlin Wall, the rise of the Internet, the 2008 financial crisis." },
      { id: 'sp20-a3', type: 'keyword', text: 'black swan', note: "Key concept: black swan — extreme, unpredictable, and rationalized after the fact." },
      { id: 'sp20-a4', type: 'attitude', text: 'the most important events are precisely those we cannot predict', note: "Author's attitude: the most important events are precisely the ones we cannot predict." },
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
        analysis: "Paragraph 2 \"events that were extreme outliers, carried massive impact, and were retrospectively explained as inevitable\" — the three characteristics of a black swan.",
        distractors: [
          { optionId: 'A', type: "Opposite meaning", why: "Black swans are precisely unpredictable." },
        ],
        vocabNotes: ["outlier n. outlier", "retrospectively adv. retrospectively"],
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
        analysis: "Paragraph 4 \"Height, weight, and blood pressure all follow bell curves. But wealth, book sales...belong to extremistan\" — the two worlds follow different distributions.",
        distractors: [
          { optionId: 'A', type: "Opposite meaning", why: "Taleb explicitly says that the bell curve in extremistan is \"not only inaccurate but dangerous.\"" },
        ],
        vocabNotes: ["Gaussian adj. Gaussian", "distribution n. distribution"],
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
        analysis: "Paragraph 5 \"an antifragile system improves...The human immune system, evolution, and the scientific method are all antifragile: they benefit from disorder\" — antifragile systems benefit from disorder.",
        distractors: [
          { optionId: 'B', type: "Concept substitution", why: "robust means unaffected, while antifragile means growing stronger under pressure." },
        ],
        vocabNotes: ["antifragile adj. antifragile", "epistemic adj. epistemic"],
        score: 2,
      },
    ],
    tips: ["Understand Taleb's three-level distinction: fragile → robust → antifragile.", "Note the core difference between mediocristan and extremistan."],
    vocabNotes: ["outlier n. outlier", "retrospectively adv. retrospectively", "antifragile adj. antifragile", "epistemic adj. epistemic", "narrative fallacy n. narrative fallacy"],
  },
]
