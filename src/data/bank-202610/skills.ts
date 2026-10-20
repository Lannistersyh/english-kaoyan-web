import type { Question } from '../../types'
import { choices, mockProvenance } from './helpers'

const base = { source: 'builtin', sourceLabel: 'Original mock · October 2026', provenance: mockProvenance } as const
type ClozeSpec = [options: [string, string, string, string], correct: 0 | 1 | 2 | 3, analysis: string]
function cloze(number: string, title: string, passage: string, specs: ClozeSpec[]): Question {
  const id = `mock-cloze-202610-${number}`
  return {
    ...base, id, type: 'cloze', title: `Cloze · ${title}`, suggestedMinutes: 15, passage,
    items: choices(id, specs.map(([options, correct, analysis], i) => ({ stem: `Blank ${i + 1}`, options, correct, analysis })), 0.5),
    tips: ['Read the whole passage before filling the blanks.', 'Use grammar, nearby collocations, and the argument across sentences. Each of the 20 blanks is worth 0.5 points.'],
  }
}

export const mockSkillQuestions: Question[] = [
  cloze('01', 'An archive needs more than a scanner',
    `When a local archive began scanning its collection, staff expected online publication to {{1}} interest in the original documents. The first months seemed to support that {{2}}: readers downloaded thousands of pages. Yet download figures did not {{3}} whether those readers understood what they had found. Digital {{4}} had expanded faster than the explanations accompanying it.

{{5}} a physical visitor could ask an archivist about an unfamiliar name, an online reader often encountered the page alone. Without {{6}}, a private joke could be mistaken for a serious statement. The archive {{7}} invited volunteers to write short introductions that would {{8}} selected letters. Each introduction identified the writer, the intended reader, and the circumstances {{9}} which the letter had been produced. The aim was to {{10}} avoidable misunderstandings, not to prescribe a single interpretation.

The project also made its own limits visible. The online collection was {{11}}, {{12}} some fragile documents could not yet be scanned safely. Staff explained that a missing item did not necessarily indicate a gap in the historical record; it might {{13}} reflect a gap in digitization. Readers needed to {{14}} between the archive's holdings and the portion available on a screen.

The archive judged success by informed use {{15}} download totals alone. It checked whether the new introductions were {{16}} and invited readers to {{17}} corrections with supporting evidence. In doing so, it accepted responsibility {{18}} the conditions of access as well as access itself. The central question was no longer simply {{19}} people could see a document, but whether they had enough information to exercise their own {{20}} about it.`, [
      [['interrupt', 'stimulate', 'conceal', 'exhaust'], 1, 'The staff expect publication to increase interest. “Stimulate interest” expresses that positive aim; the other verbs reduce or obstruct it.'],
      [['permission', 'comparison', 'prediction', 'exception'], 2, 'Downloads initially seem to support the expectation stated in sentence 1. That expectation is a prediction, not permission or an exception.'],
      [['reveal', 'manufacture', 'forbid', 'postpone'], 0, 'The figures fail to show understanding. “Reveal whether” means make it known; the other verbs cannot express this evidential relationship.'],
      [['expense', 'absence', 'ownership', 'access'], 3, 'Scanning lets more people see documents. The contrast is between expanded access and insufficient explanation.'],
      [['Unless', 'Whereas', 'Because', 'Once'], 1, 'The sentence contrasts a visitor who can ask staff with an online reader who is alone. “Whereas” introduces that contrast.'],
      [['permission', 'competition', 'context', 'storage'], 2, 'Knowing who wrote a letter and why helps interpret a joke. The missing interpretive background is context.'],
      [['therefore', 'nevertheless', 'otherwise', 'meanwhile'], 0, 'The introductions are a response to the identified problem. “Therefore” states that consequence; “nevertheless” would suggest acting despite it.'],
      [['replace', 'contradict', 'isolate', 'accompany'], 3, 'Introductions are placed alongside selected letters. They accompany the documents rather than replacing or isolating them.'],
      [['beyond', 'under', 'against', 'among'], 1, '“Under the circumstances” describes the situation in which something happens. With a relative clause this becomes “circumstances under which.”'],
      [['reward', 'preserve', 'prevent', 'repeat'], 2, 'The aim is to stop avoidable misunderstandings. Prevent has the required meaning; the others encourage or retain them.'],
      [['selective', 'exhaustive', 'imaginary', 'unrelated'], 0, 'Some documents cannot be scanned, so the online collection contains a selection rather than everything.'],
      [['unless', 'although', 'until', 'because'], 3, 'Fragility explains why some items are missing. “Because” supplies the reason, not a concession or time limit.'],
      [['rarely', 'merely', 'never', 'equally'], 1, 'The sentence contrasts a historical gap with only a digitization gap. “Merely” limits the explanation to the latter.'],
      [['alternate', 'exchange', 'distinguish', 'compete'], 2, '“Distinguish between A and B” means recognize their difference, here all holdings versus the online portion.'],
      [['rather than', 'in addition to', 'as a result of', 'regardless of'], 0, 'The passage replaces totals alone with informed use as the criterion. “Rather than” makes that contrast; totals do not cause informed use.'],
      [['fashionable', 'profitable', 'accidental', 'reliable'], 3, 'Inviting evidence-backed corrections checks the accuracy and trustworthiness of the introductions: their reliability.'],
      [['withdraw', 'request', 'ignore', 'ban'], 1, 'Readers are invited to ask for corrections, supported by evidence. They request them rather than ban or ignore them.'],
      [['with', 'from', 'for', 'by'], 2, 'The established construction is “accept responsibility for” something.'],
      [['whether', 'despite', 'unless', 'during'], 0, '“Whether people could see” introduces the first of two questions. The following “but whether” confirms the parallel structure.'],
      [['attendance', 'possession', 'obedience', 'judgment'], 3, 'Context allows readers to interpret documents independently. “Exercise judgment” is the relevant collocation and concluding idea.'],
    ]),

  cloze('02', 'The timetable between the routes',
    `A fictional transport office received complaints from passengers who changed buses on their way to work. Both routes offered {{1}} departures throughout the day. {{2}}, the published map said little about how their timetables interacted. Two services could run {{3}} often and still produce a long wait if the {{4}} bus left moments before the first one arrived.

The office initially assumed that delays were {{5}} by traffic. It therefore {{6}} the time allowed for each journey. The change did not solve the problem. Passengers still waited {{7}} the next connecting service arrived. As a {{8}}, some abandoned the route even though neither bus was usually full.

Staff then began to {{9}} complete journeys rather than separate routes. Their calculations took waiting time into {{10}}, {{11}} than treating the minutes spent on each bus as the whole journey. {{12}} adding no vehicles, they {{13}} some transfer waits by adjusting departure times. The first improvement came from coordination, not greater capacity.

Other difficulties did {{14}}. A connection could still fail when an arrival time was {{15}}, and a timetable designed around one group might inconvenience another. The office treated its new schedule {{16}} a proposal to be tested. It gathered {{17}} from passengers traveling at different hours and {{18}} the schedule where the results justified a change.

There was no arrangement that made every transfer perfect. The task was to understand each {{19}} openly and choose a service pattern that would {{20}} the public reasonably well. A clear map remained useful, but only a view of the journey as a whole could reveal what it left out.`, [
      [['private', 'empty', 'regular', 'expensive'], 2, 'The problem is not infrequent individual routes but poor coordination. “Regular” describes their apparent orderly service.'],
      [['However', 'Similarly', 'Therefore', 'Indeed'], 0, 'The map looks adequate but omits timetable interaction. “However” introduces the limitation.'],
      [['rarely', 'barely', 'never', 'equally'], 3, '“Equally often” means at the same frequency. Equal frequency does not guarantee convenient transfers.'],
      [['cancelled', 'connecting', 'departed', 'missing'], 1, 'The second bus provides the next part of the trip; it is the connecting bus, even when its timing is inconvenient.'],
      [['rewarded', 'protected', 'caused', 'replaced'], 2, 'The office assumes traffic produces the delays. “Caused by” expresses that proposed cause.'],
      [['extended', 'denied', 'forgot', 'published'], 0, 'Assuming traffic makes trips slower, the office allows more time. “Extended” fits that response.'],
      [['although', 'unless', 'despite', 'until'], 3, 'Waiting continues up to the next service\'s arrival. “Until” introduces that endpoint.'],
      [['contrast', 'consequence', 'condition', 'precaution'], 1, 'Passengers abandon the route because of the continuing waits. “As a consequence” marks the result.'],
      [['conceal', 'separate', 'compare', 'advertise'], 2, 'Staff examine complete journeys against other complete journeys, shifting the unit of comparison from individual routes.'],
      [['account', 'place', 'charge', 'office'], 0, 'The fixed expression “take something into account” means include it when making a judgment.'],
      [['other', 'sooner', 'better', 'rather'], 3, '“Rather than treating” introduces the earlier, narrower alternative to including waiting time.'],
      [['Unless', 'Despite', 'Because', 'Until'], 1, 'Waiting time improves although no vehicles are added. “Despite” takes the following -ing phrase and expresses concession.'],
      [['invented', 'doubled', 'reduced', 'ignored'], 2, 'Adjusting departures improves transfers by shortening waits. The later sentence calls this an improvement.'],
      [['remain', 'vanish', 'expire', 'agree'], 0, 'The next examples describe unresolved difficulties, so some problems remain.'],
      [['irrelevant', 'identical', 'guaranteed', 'uncertain'], 3, 'Unpredictable arrivals can cause a missed connection. A guaranteed time would not explain this difficulty.'],
      [['from', 'as', 'by', 'against'], 1, '“Treat X as Y” expresses how the office regarded the schedule: a proposal to be tested.'],
      [['permission', 'decoration', 'evidence', 'ownership'], 2, 'Passenger experience is collected to test and justify changes. It functions as evidence, not decoration or authorization.'],
      [['revised', 'concealed', 'abolished', 'copied'], 0, 'Where results justify a change, staff revise the schedule. Abolition is stronger than the targeted adjustment described.'],
      [['guarantee', 'shortcut', 'uniformity', 'trade-off'], 3, 'Improving one group\'s transfer may inconvenience another. This exchange of benefits and costs is a trade-off.'],
      [['observe', 'serve', 'avoid', 'replace'], 1, 'A transport pattern should serve the public: meet its needs reasonably well.'],
    ]),

  cloze('03', 'Making a useful handover',
    `In a small fictional engineering team, unfinished tasks tended to {{1}} on the memory of a single person. {{2}} that person went on leave, colleagues spent hours reconstructing decisions. A shared folder contained drawings, but it did not explain the {{3}} questions or why earlier options had been rejected. New staff could only {{4}} that the latest drawing represented a final agreement.

The team discovered that key details had been {{5}}, not intentionally hidden. People had left them out {{6}} they seemed obvious at the time. The gap was {{7}} information that existed somewhere and information another person could actually use.

To address it, the team began to {{8}} record the reasons behind important choices. It did not require a long report after every conversation. {{9}}, each project kept a brief decision log in {{10}} staff noted the question, the chosen option, and any unresolved concern. A colleague then explained the entry back to its author to check that it had been {{11}}.

The team tested the new process {{12}} introducing it across all projects. Feedback allowed staff to {{13}} confusing headings and {{14}} final decisions from temporary suggestions. Repeated entries were {{15}} so that the useful information was easier to find. The aim was a record that could support work {{16}} requiring its original author to be present.

Managers also avoided {{17}} individuals whenever a gap appeared. They asked {{18}} the process made the necessary information easy to record. This kept attention on its {{19}}: helping the next person act responsibly. A successful handover did not preserve every spoken word. It preserved enough reasoning to maintain {{20}} when people changed.`, [
      [['insist', 'depend', 'reflect', 'prevent'], 1, '“Depend on” means rely on. Unfinished work relied on one person\'s memory.'],
      [['Unless', 'Although', 'When', 'Whereas'], 2, 'The absence creates the occasion for colleagues\' reconstruction work. “When” expresses that temporal relationship.'],
      [['remaining', 'resolved', 'irrelevant', 'imaginary'], 0, 'The folder does not identify questions still open. The later log explicitly records unresolved concerns.'],
      [['demonstrate', 'guarantee', 'discover', 'assume'], 3, 'Without explanations, new staff lack evidence and can only make an assumption about final agreement.'],
      [['expanded', 'omitted', 'translated', 'duplicated'], 1, 'The next sentence explains that people left the details out. “Omitted” states that action without implying intentional concealment.'],
      [['although', 'unless', 'because', 'before'], 2, 'Apparent obviousness explains the omission. “Because” supplies the reason.'],
      [['between', 'against', 'beyond', 'through'], 0, 'The sentence contrasts two kinds of information. The construction is “the gap between A and B.”'],
      [['accidentally', 'reluctantly', 'silently', 'deliberately'], 3, 'The new process intentionally records reasons previously left implicit. “Deliberately” describes that purposeful change.'],
      [['Otherwise', 'Instead', 'Nevertheless', 'Similarly'], 1, 'A short log is offered as an alternative to long reports. “Instead” connects those alternatives.'],
      [['whose', 'whom', 'which', 'what'], 2, '“In which” refers back to the decision log. The relative clause says what staff recorded in it.'],
      [['understood', 'abandoned', 'concealed', 'postponed'], 0, 'Explaining an entry back to its author checks comprehension, so “understood” fits the purpose.'],
      [['despite', 'unless', 'after', 'before'], 3, 'The process is tried first, allowing revision before broad introduction.'],
      [['retain', 'revise', 'multiply', 'dismiss'], 1, 'Feedback helps staff improve confusing headings. “Revise” means change them to make them clearer.'],
      [['combine', 'confuse', 'separate', 'replace'], 2, 'Readers need to distinguish settled choices from provisional suggestions. Separating them serves that aim.'],
      [['removed', 'invented', 'repeated', 'expanded'], 0, 'Removing repetition makes the useful material easier to locate. The other options would not explain the stated improvement.'],
      [['through', 'despite', 'within', 'without'], 3, 'The record should work even when its author is absent. “Without requiring” expresses independence from that presence.'],
      [['consulting', 'blaming', 'training', 'thanking'], 1, 'Managers focus on whether the process supports recording, rather than assigning personal fault when gaps occur.'],
      [['despite', 'whereas', 'whether', 'during'], 2, '“Asked whether” introduces an indirect yes-or-no question about the process.'],
      [['purpose', 'expense', 'popularity', 'duration'], 0, 'The colon explains the process\'s aim: enabling the next person to act responsibly.'],
      [['secrecy', 'competition', 'ownership', 'continuity'], 3, 'Preserving reasoning allows work to continue across personnel changes. That is continuity.'],
    ]),

  {
    ...base, id: 'mock-matching-202610-01', type: 'matching', title: 'New Question Types · 7-choose-5 · An oral-history collection', suggestedMinutes: 15,
    passage: `A neighborhood group planned to record memories of a former railway workshop. Its members initially assumed that a recorder and a list of interviewees were enough. Before the first interview, however, they agreed that participants should know how recordings would be stored and used. {{1}} A signed form alone would not replace that conversation.

The volunteers then drafted questions about daily routines. Their first version asked whether working at the railway had been the happiest period of a person's life. {{2}} They replaced it with an invitation to describe an ordinary working day, allowing interviewees to decide which experiences mattered.

During a trial interview, a volunteer encountered a long silence after a question about the workshop's closure. He was tempted to offer an interpretation immediately. {{3}} The pause that followed gave the interviewee time to choose whether and how to continue, rather than accepting the volunteer's suggested account.

After recording, the group prepared transcripts. One place name was difficult to hear, and different volunteers proposed different spellings. {{4}} Guessing would have made the transcript look complete while concealing uncertainty from later readers. The group also checked the surrounding passage with the interviewee where possible.

Finally, participants were offered the chance to review the material before wider release. One person wanted a family detail removed, while another clarified an ambiguous date. {{5}} The project preserved memories by treating the people who shared them as continuing participants, not merely as sources of recordings.`,
    optionPools: { 'oral-history': [
      { id: 'mock-matching-202610-01-a', text: 'They marked the word as uncertain and retained a link to the corresponding moment in the recording.' },
      { id: 'mock-matching-202610-01-b', text: 'That wording already supplied a positive judgment and risked steering the answer.' },
      { id: 'mock-matching-202610-01-c', text: 'The group therefore decided that every recording should be published immediately without further discussion.' },
      { id: 'mock-matching-202610-01-d', text: 'Both requests showed why consent and accuracy needed attention after the microphone had been switched off.' },
      { id: 'mock-matching-202610-01-e', text: 'They explained that a participant could decline a question or restrict public access to part of an interview.' },
      { id: 'mock-matching-202610-01-f', text: 'A railway timetable would have settled every disagreement about a worker\'s private feelings.' },
      { id: 'mock-matching-202610-01-g', text: 'Instead, he waited and reminded the speaker that there was no obligation to discuss a painful subject.' },
    ] },
    items: [
      ['e', 'Participants should know how material is used; the missing sentence specifies their choices. “That conversation” refers back to this explanation.'],
      ['b', '“That wording” refers to the leading question about the happiest period. Its positive assumption explains why the volunteers replace it.'],
      ['g', '“Instead” contrasts waiting with the temptation to supply an interpretation. “The pause that followed” then links directly to waiting.'],
      ['a', 'An uncertain place name requires transparent marking and a recording link. The following warning against guessing explains this decision.'],
      ['d', '“Both requests” refers to removing a family detail and clarifying a date. These illustrate continuing consent and accuracy checks.'],
    ].map(([answer, analysis], i) => ({ id: `mock-matching-202610-01-q${i + 1}`, kind: 'gapfill', optionPoolId: 'oral-history', correctIds: [`mock-matching-202610-01-${answer}`], stem: `Blank ${i + 1}`, analysis, score: 2 })),
    tips: ['Choose five of the seven sentences; use each selected sentence once.', 'Check references such as “that wording,” “instead,” and “both requests” on both sides of a gap.'],
    vocabNotes: ['consent: informed agreement to an action or use of information', 'transcript: a written record of spoken material', 'leading question: a question that encourages a particular answer'],
  },
  {
    ...base, id: 'mock-matching-202610-02', type: 'matching', title: 'New Question Types · Headings · Evaluating a public claim', suggestedMinutes: 15,
    items: [
      ['Before checking a claim, restate it precisely. “The program worked” could mean that attendance increased, costs fell, or participants reported satisfaction. These are different propositions requiring different evidence. Specify the group, the outcome, and the period involved so that the eventual check answers the claim actually being made.', 3, 'The paragraph is about defining what “worked” means before evaluating evidence.'],
      ['A percentage may sound impressive until the starting point is known. An increase from one case to two is a doubling, but it differs in scale from an increase from a thousand to two thousand. Ask for the underlying counts and the comparison being used before deciding what the percentage shows.', 0, 'Underlying counts, starting points, and comparisons establish the numerical baseline.'],
      ['A polished chart may have traveled through several reports before reaching a social-media post. Follow its references back to the original collection of data. Check who gathered the information, how the sample was chosen, and whether the published chart preserves the conditions attached to the original findings.', 5, 'Tracing references to the original collection checks the evidence\'s source and production.'],
      ['If two changes occur together, consider other developments that might explain them. A town may improve its bus service just as a large employer changes working hours. More passengers after the timetable change do not, by themselves, establish how much of the increase the new timetable caused.', 2, 'The competing explanation prevents a temporal association from being treated as demonstrated causation.'],
      ['After evaluating the material, state what it supports and what remains unresolved. A small local example may justify a limited trial without supporting a universal policy. Make the scope of the conclusion match the scope of the evidence, and explain what further information would change your judgment.', 6, 'The paragraph matches the breadth and certainty of a conclusion to the evidence.'],
    ].map(([stem, correct, analysis], i) => {
      const id = `mock-matching-202610-02-q${i + 1}`
      const headings = ['Establish the numerical baseline', 'Judge a claim by its popularity', 'Consider alternative causes', 'Define the proposition', 'Accept every anonymous account', 'Trace the evidence to its source', 'Limit the conclusion to what is supported']
      return { id, kind: 'choice', stem: stem as string, options: headings.map((text, j) => ({ id: `${id}-${j}`, text })), correctIds: [`${id}-${correct}`], analysis: analysis as string, score: 2 }
    }),
    tips: ['Select the heading that captures each whole paragraph, not a single repeated word.', 'There are seven headings for five paragraphs; two headings are unused.'],
    vocabNotes: ['baseline: the initial value or reference used for comparison', 'proposition: a statement that can be examined or evaluated', 'causation: a relationship in which one event produces another'],
  },
  {
    ...base, id: 'mock-matching-202610-03', type: 'matching', title: 'New Question Types · Ordering · Testing a public sign', suggestedMinutes: 15,
    items: [{
      id: 'mock-matching-202610-03-q1', kind: 'reorder', fixedFirstId: '2', score: 10,
      stem: 'Paragraph C is fixed first. Arrange all six paragraphs to form a coherent account.',
      reorderItems: [
        'To address this hesitation, the designers moved the direction arrow beside the destination name and increased the space around it. They left the wording unchanged so that the next trial could test the layout adjustment more clearly.',
        'That improvement supported using the revised layout, but the team did not declare the problem permanently solved. Staff agreed to collect reports after installation, especially from visitors whose needs had not been represented in the small trial.',
        'A public building needed new signs because first-time visitors often entered a staff-only corridor while looking for the service desk. Before ordering replacements, the design team decided to observe how people used the existing signs.',
        'With this revised sign in place, a second group of first-time visitors followed the same route. Fewer stopped at the junction, and more reached the desk without asking for help. The team recorded both measures rather than relying on whether participants liked the design.',
        'During those observations, visitors reached a junction and paused. The sign named the correct destination, but its arrow was separated from the name by several unrelated lines of text. Some people read the words without noticing where to turn.',
        'Those later reports identified another issue: the sign was difficult to see when a queue formed beneath it. The team raised its position and continued monitoring. The exercise had become an ongoing process of adjustment rather than a one-time choice of attractive lettering.',
      ],
      correctIds: ['2', '4', '0', '3', '1', '5'],
      analysis: 'C introduces observation of the old signs. E reports “those observations” and the hesitation. A addresses “this hesitation” with a revised layout. D tests “this revised sign” and reports improvement. B interprets “that improvement” and introduces later reports. F describes “those later reports” and the subsequent adjustment. Correct order: C-E-A-D-B-F.',
    }],
    tips: ['Keep C first and include every other paragraph exactly once.', 'Match the chains: observations → hesitation → revised sign → improvement → later reports.'],
    vocabNotes: ['junction: a place where routes meet or divide', 'layout: the arrangement of text or objects in a space', 'monitoring: regularly checking what happens over time'],
  },
  {
    ...base, id: 'mock-paraphrase-202610-01', type: 'translation', title: 'Paraphrasing · Concession and measurement', suggestedMinutes: 8,
    passage: 'Although the new platform made it easier for residents to report damaged streets, the rise in recorded complaints should not be taken as evidence that the streets had deteriorated, since the change may reflect greater willingness to report problems that had previously gone unrecorded.',
    items: [],
    referenceTranslation: 'The new platform simplified reporting, but an increase in logged complaints does not by itself show that street conditions became worse. It may instead mean that residents are more willing to report existing problems that were not recorded before.',
    translationSteps: [
      { step: 1, zh: 'Identify the concession introduced by “although.” The main clause warns against interpreting a higher complaint count as proof of deterioration. The since-clause offers a possible change in reporting behavior.' },
      { step: 2, zh: 'Use two sentences: first contrast easier reporting with the unjustified inference; then state the alternative explanation. Keep residents as the people whose reporting behavior may have changed.' },
      { step: 3, zh: 'Replace “deteriorated” with “became worse” and “gone unrecorded” with “not recorded before.” Preserve “may”: the alternative explanation is possible, not established.' },
    ],
    tips: ['Retain both the warning against a causal inference and the tentative alternative explanation.', 'Do not claim that street conditions improved or that increased reporting is definitely the cause.'],
    vocabNotes: ['deteriorate: become worse in condition', 'be taken as evidence: be interpreted as support for a claim', 'unrecorded: not included in a written or digital record'],
  },
  {
    ...base, id: 'mock-paraphrase-202610-02', type: 'translation', title: 'Paraphrasing · A condition with limited scope', suggestedMinutes: 8,
    passage: 'Only if the evaluation includes people who stopped using the service, rather than merely those who remained satisfied customers, can the organization determine whether its apparent improvement reflects a better service or simply the disappearance of critical voices from the sample.',
    items: [],
    referenceTranslation: 'To find out whether the service truly improved or whether dissatisfied users were simply missing from the sample, the organization must evaluate former users as well as the satisfied customers who stayed.',
    translationSteps: [
      { step: 1, zh: '“Only if” introduces a necessary condition and triggers inversion: “can the organization determine.” The whether-clause contrasts real improvement with the loss of critical respondents from the sample.' },
      { step: 2, zh: 'Start with the purpose, “To find out whether ...,” then state the requirement with “must.” Contrast former users with satisfied users who remained.' },
      { step: 3, zh: 'Use “truly improved” for an actual service improvement and “missing from the sample” for the disappearance of critical voices. Do not say that including former users guarantees improvement; it is necessary for the evaluation described.' },
    ],
    tips: ['Preserve the necessary condition expressed by “only if.”', 'The sentence questions the interpretation of an apparent improvement; it does not establish that the service worsened.'],
    vocabNotes: ['apparent: seeming to be true but requiring examination', 'sample: the people or items included in an evaluation', 'critical voices: people expressing concerns or negative judgments'],
  },
]
