import type { Question } from '../../types'

/* Short task requirements are restated; all reference responses and notes are original. */
function task(year: number, paper: 'English I' | 'English II', title: string, sourceName: string, sourceUrl: string,
  context: string, prompt: string, response: string, tips: string[]): Question {
  return {
    id: `past-${year}-${paper === 'English I' ? 'i' : 'ii'}-writing-a`,
    type: 'writing', source: 'builtin', sourceLabel: `${year} ${paper} · Past exam`,
    title: `Writing A · ${title}`, suggestedMinutes: 15, targetWords: 100,
    provenance: {
      kind: 'past-exam', year, paper, section: 'Writing A', sourceName, sourceUrl,
      note: 'Verified past exam task, with directions restated for practice. The reference response and study notes are original, not an official answer key. Details added in the sample response are illustrative.',
    },
    figureDescription: context,
    writingPrompt: `${prompt} Write about 100 words. Use Li Ming as your name rather than your real name. Do not include an address.`,
    items: [], referenceEssay: response,
    tips: [...tips, 'Check that every requested point is covered. The sample is one possible response, not a text to memorize.'],
  }
}

export const pastExamQuestions: Question[] = [
  task(2022, 'English II', 'Invite students to a campus food festival', 'Kaoyan.cn paper archive',
    'https://static.kaoyan.cn/file/question/2022/08/31/c3829db9eedc2eefeb6e71f449349b11.pdf#page=13',
    'You are organizing a food festival on your university campus.',
    'Write an email to the international students at your university. Introduce the festival and invite them to take part.',
    `Dear fellow students,

I am writing to invite you to our campus food festival next Friday afternoon in the student activity center. The event will bring students together to share dishes and the stories behind them.

You can taste regional specialties, watch cooking demonstrations, and exchange simple recipes. We would also welcome a dish from your home country, although bringing food is entirely optional. Please tell us by Tuesday whether you would like to attend so that we can prepare enough tables and tasting plates.

I hope you will join us for an enjoyable afternoon of food and conversation.

Best wishes,
Li Ming`,
    ['Introduce the event before inviting participation.', 'Use a welcoming tone and make the requested response clear.']),

  task(2023, 'English I', 'Recruit a student research assistant', 'New Oriental exam review',
    'https://kaoyan.xdf.cn/202312/13553027.html',
    'Professor Smith needs one student to assist with a research project about sports activities on campus.',
    'Write a recruitment notice. Describe the assistant\'s responsibilities and the qualifications required.',
    `Notice

A student assistant is needed for Professor Smith's research project on campus sports activities. The assistant will help recruit interview participants, record survey responses, and organize the collected information. The work requires two free afternoons each week during the coming month.

Applicants should communicate clearly, handle basic spreadsheet tasks, and respect participants' privacy. An interest in student sports would be helpful, but previous research experience is not essential. Training will be provided before the project begins.

Interested students should send a brief introduction and their weekly availability to Professor Smith's office by Friday. Shortlisted applicants will be invited to an interview.

Li Ming`,
    ['Use a notice heading and an institutional tone rather than an email greeting.', 'Separate duties, qualifications, and application instructions.']),

  task(2024, 'English I', 'Help Paul prepare an oral report', 'AC Wiki scanned paper archive',
    'https://ac-wiki.org/general-skills/study/assets/2024-201.pdf#page=14',
    'Paul, an international student, has emailed you. His class requires an oral report about an ancient Chinese scientist, and he wants advice on preparing it.',
    'Reply to Paul with practical advice for preparing his oral report.',
    `Dear Paul,

For your report, I suggest choosing Shen Kuo and concentrating on one contribution rather than listing everything he achieved. A clear example will be easier for your classmates to remember.

Start with a reliable introductory source, then check the key dates and terms against a second reference. Organize your talk into a short introduction, an explanation of the contribution, and a conclusion about its importance. A simple illustration could help explain unfamiliar ideas. Finally, rehearse aloud with a timer and ask a friend which parts need clarification.

I would be happy to listen to your practice presentation.

Best wishes,
Li Ming`,
    ['Answer the request for preparation advice rather than writing the report itself.', 'Give concrete steps for choosing, researching, organizing, and rehearsing.']),

  task(2024, 'English II', 'Plan a survey of historic houses', 'English Exam task archive',
    'https://english-exam.lazynote.cn/kaoyan/sections/2024-english-two/section-iv-part-a/',
    'You and Jack intend to investigate how old houses are protected in an ancient town.',
    'Email Jack to explain your proposed survey plan and ask for his opinion.',
    `Dear Jack,

Here is my proposed plan for our survey of historic houses. Before visiting the town, we could mark several buildings on a map and read the local preservation guidelines. This would help us compare houses consistently.

During the visit, I suggest recording each building's condition, current use, and signs of recent repair. We should ask residents for permission before taking photographs or conducting interviews. Afterwards, we can compare our notes and prepare a short report identifying practical protection measures.

Would this approach work for you? Please suggest any changes, especially to the information we should collect.

Best wishes,
Li Ming`,
    ['Present a workable plan with preparation, fieldwork, and follow-up.', 'Explicitly ask for Jack\'s opinion; a plan alone leaves the task incomplete.']),

  task(2025, 'English I', 'Explain a craft demonstration to Paul', 'English Exam task archive',
    'https://english-exam.lazynote.cn/kaoyan/sections/2025-english-one/section3-part-a/',
    'Your classmate Paul heard that you invited young craftspeople to demonstrate innovative craft-making on campus. He asks what they will show and how he can help prepare.',
    'Reply to Paul. Explain the planned demonstrations and suggest how he could help with the preparations.',
    `Dear Paul,

Thank you for offering to help with the craft demonstration. The young craftspeople will show how traditional skills can produce useful modern objects. One guest will weave bamboo into desk organizers, while another will combine embroidery with fabric recovered from old clothes.

Could you help arrange the worktables and prepare English labels for the materials? Your language skills would make the demonstrations easier for our international classmates to follow. We also need someone to check the registration list before the event starts.

Please let me know which task you would prefer. I can send you the schedule tomorrow.

Best wishes,
Li Ming`,
    ['Respond to both questions in the incoming email.', 'Match the suggested help to a specific preparation need.']),

  task(2025, 'English II', 'Invite John to perform in a short play', 'New Oriental Online published paper',
    'https://kaoyan.koolearn.com/20250103/1795515.html',
    'You are planning a short play adapted from a classic Chinese novel.',
    'Write an email to your friend John. Introduce the play and invite him to take part.',
    `Dear John,

Our drama group is preparing a short adaptation of Journey to the West, and I would love you to join us. The play follows the travelers as they overcome a difficulty by working together. We will perform it in English at next month's student arts evening.

I think you would enjoy playing the narrator, who connects the scenes and helps the audience follow the story. Rehearsals will take place twice a week, and we can adjust the schedule around your classes. No previous acting experience is required.

Would you be interested? I can bring the script when we meet tomorrow.

Best wishes,
Li Ming`,
    ['Name a classic novel and briefly explain the adaptation.', 'Include a direct invitation, supported by a suitable role or practical arrangement.']),

  task(2026, 'English I', 'Tell Paul about handwritten family letters', 'Qihang published paper and analysis',
    'https://aged-jixun-cdn.iqihang.com/2025/1221/20251221052326101.pdf#page=18',
    'Paul was moved by the Chinese families\' handwritten letters you posted online yesterday. He asks for more information and wonders whether he can see the letters on public display.',
    'Reply to Paul with more information about the letters and explain whether and where they can be viewed in person.',
    `Dear Paul,

I am glad the handwritten family letters interested you. They describe everyday concerns, including work, education, and the hope of meeting relatives again. Their personal details help us understand experiences that broad historical accounts can overlook.

The letters I shared are part of a public display at our university archive this week. Visitors can see selected originals alongside readable transcriptions, while fragile pages are represented by copies. The display is open on Saturday afternoon, and admission is free.

If you would like to go, I can meet you at the archive entrance and introduce the collection.

Best wishes,
Li Ming`,
    ['Provide background and answer the public-display question directly.', 'Exhibition details in the reference response are invented examples, not facts stated in the exam prompt.']),

  task(2026, 'English II', 'Respond to Jack\'s family travel video', 'Kaoyan.cn paper archive',
    'https://static.kaoyan.cn/file/question/2025/12/27/73ddc93ef0849e1c5809476a040e9eec.pdf#page=21',
    'Your friend Jack has shared a video about his family\'s travels in China.',
    'Email Jack to express your feelings about the video and your wish to learn more about the trip.',
    `Dear Jack,

Thank you for sharing your family's travel video. I enjoyed its lively atmosphere and the way it included ordinary moments between the major sights. Watching your family explore unfamiliar places together made the journey feel personal and memorable.

I would love to hear more about the trip. Which place surprised you most, and did any encounter change your expectations? I am also curious about how you chose the route and what your family would recommend to a first-time visitor.

If you have time this weekend, perhaps we could talk over a video call. I look forward to hearing the stories behind the images.

Best wishes,
Li Ming`,
    ['Express a personal response before asking focused follow-up questions.', 'Request more information rather than only praising the video.']),
]
