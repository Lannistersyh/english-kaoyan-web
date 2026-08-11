import type { Pattern } from '../types'

/** 内置功能性句型库：8 类 × 3-5 句，中英对照 */
const rawPatterns: Omit<Pattern, 'builtin'>[] = [
  // ---- 引出话题 ----
  { id: 'p-intro-1', category: 'introduction', en: 'The picture above presents a scene that has become increasingly common in our daily life: …', zh: '上图呈现了一个在我们日常生活中日益常见的场景：……', usage: '图画作文首段开头，描写画面后自然引出话题' },
  { id: 'p-intro-2', category: 'introduction', en: 'In recent years, a growing number of people have come to realise that …, yet the issue has rarely been examined with the seriousness it deserves.', zh: '近年来，越来越多的人开始意识到……，但这一问题却很少得到应有的严肃审视。', usage: '引出社会现象类话题，先扬后抑' },
  { id: 'p-intro-3', category: 'introduction', en: 'What strikes us first about the drawing is not the figures themselves but the attitude they embody.', zh: '这幅画最先打动我们的不是画面中的人物，而是他们所体现的态度。', usage: '强调图画寓意而非画面本身' },
  { id: 'p-intro-4', category: 'introduction', en: 'The scene depicted in the picture is at once familiar and disturbing: …', zh: '图画描绘的场景既熟悉又令人不安：……', usage: '用于讽刺性漫画的开头' },
  // ---- 描述图画 ----
  { id: 'p-desc-1', category: 'describePicture', en: 'As is vividly shown in the picture, a young man is … while his companion …', zh: '如图生动所示，一个年轻人正在……，而他的同伴却……', usage: '描述两人对比型漫画（as is vividly shown 是经典起手式）' },
  { id: 'p-desc-2', category: 'describePicture', en: 'The cartoonist arranges the two scenes in sharp contrast: on the one hand …, on the other …', zh: '漫画家将两个场景并置形成鲜明对比：一方面……，另一方面……', usage: '对比型漫画的对称描写' },
  { id: 'p-desc-3', category: 'describePicture', en: 'Beneath the figure runs a caption reading "…", which points directly to the cartoonist\'s intended message.', zh: '画中人物下方有一行说明文字"……"，它直指漫画家的创作意图。', usage: '点出图画配文（GRE 写作常考图片描述）' },
  { id: 'p-desc-4', category: 'describePicture', en: 'The picture is simple in composition but rich in implication: a single object becomes the vehicle of a profound social observation.', zh: '这幅画构图简单而寓意丰富：一个简单的物件承载了深刻的社会观察。', usage: '概括画面特点，承上启下' },
  // ---- 点明主旨 ----
  { id: 'p-thesis-1', category: 'thesis', en: 'The message the cartoonist intends to convey is that …, and this message is all the more urgent in an age of …', zh: '漫画家想传达的信息是……，而在一个……的时代，这一信息显得尤为紧迫。', usage: '第二段点明寓意（主论点句），并连接时代背景' },
  { id: 'p-thesis-2', category: 'thesis', en: 'Beneath the surface humour lies a serious concern: what the drawing satirises is not an individual failing but a collective mentality.', zh: '在表面的幽默之下隐藏着严肃的关切：漫画所讽刺的不是个人的失误，而是一种集体心态。', usage: '由表及里：从画面讽刺上升到集体心理/社会心态' },
  { id: 'p-thesis-3', category: 'thesis', en: 'It is not too much to say that the issue raised by the picture has become a touchstone of our times.', zh: '可以说，这幅画提出的问题已成为检验我们时代的一块试金石。', usage: '提升论述高度，强调问题的时代意义' },
  { id: 'p-thesis-4', category: 'thesis', en: 'The cartoonist\'s purpose is twofold: to expose a prevailing habit and to provoke reflection on its consequences.', zh: '漫画家的目的有二：揭露一种普遍的习惯，并促使人们反思其后果。', usage: '分点式点明主旨（twofold 结构）' },
  // ---- 举例论证 ----
  { id: 'p-example-1', category: 'example', en: 'A case in point is the experience of …, who …', zh: '一个典型的例子是……的经历，他/她……', usage: '个人事例论证（who 引导定语从句展开细节）' },
  { id: 'p-example-2', category: 'example', en: 'Consider, for instance, the way …, which illustrates precisely the point the cartoon makes.', zh: '试想一下……的情形，它恰好印证了漫画的观点。', usage: '以具体现象佐证' },
  { id: 'p-example-3', category: 'example', en: 'History offers no shortage of evidence: from … to …, the pattern repeats itself whenever …', zh: '历史从不缺少证据：从……到……，每当……这一模式就会重演。', usage: '历史例证（古今对比，提升格局）' },
  { id: 'p-example-4', category: 'example', en: 'Statistics tell a similar story: surveys consistently show that …', zh: '统计数据讲述着相似的故事：调查一再表明……', usage: '数据论证（注意数字需合理，勿编造具体来源）' },
  // ---- 因果分析 ----
  { id: 'p-cause-1', category: 'cause', en: 'Several factors may account for this phenomenon. Chief among them is …, which …', zh: '多种因素可以解释这一现象。其中最主要的是……，它……', usage: '因果分析段开头，分点展开' },
  { id: 'p-cause-2', category: 'cause', en: 'The root cause, however, lies deeper: beneath the immediate triggers there operates a logic of …', zh: '然而，根本原因要深刻得多：在直接的诱因之下，起作用的是……的逻辑。', usage: '从表层原因深入到根本原因' },
  { id: 'p-cause-3', category: 'cause', en: 'It would be misleading, of course, to attribute the problem to any single cause; the truth is that … and … reinforce each other.', zh: '当然，把问题归因于单一原因是有误导性的；事实上，……与……相互强化。', usage: '辩证分析：多因互动（体现论证深度）' },
  // ---- 让步转折 ----
  { id: 'p-concession-1', category: 'concession', en: 'Admittedly, … is not without its defenders, and their arguments deserve a hearing; yet the balance of evidence points the other way.', zh: '诚然，……并非没有辩护者，他们的论点值得一听；但证据的天平指向相反方向。', usage: '让步段：承认对立观点再反驳（展现思辨）' },
  { id: 'p-concession-2', category: 'concession', en: 'Some may argue that …, but such an argument, however plausible at first glance, collapses under closer scrutiny.', zh: '有人可能辩称……，但这种观点无论乍看之下多么貌似有理，在更仔细的审视下都会崩溃。', usage: '反驳型让步（however plausible at first glance 是加分表达）' },
  { id: 'p-concession-3', category: 'concession', en: 'To be fair, the issue admits of no easy answers, and those who caution against hasty remedies are not merely being conservative.', zh: '公平地说，这个问题没有简单的答案，那些警告不要仓促开药方的人也不仅仅是保守。', usage: '对反方表达合理同情（提高论述的公允度）' },
  // ---- 总结 ----
  { id: 'p-conclusion-1', category: 'conclusion', en: 'In the final analysis, what the picture teaches us is less about … than about …', zh: '归根结底，这幅画教给我们的与其说是关于……，不如说是关于……', usage: '总结段升华（less...than... 结构）' },
  { id: 'p-conclusion-2', category: 'conclusion', en: 'The significance of the issue extends well beyond the individual: it bears on the kind of society we are becoming.', zh: '这一问题的重要性远不止于个人：它关系着我们正在成为一个什么样的社会。', usage: '从个人层面上升到社会层面' },
  { id: 'p-conclusion-3', category: 'conclusion', en: 'As the cartoon reminds us, the choice is ultimately ours: we may … , or we may continue to …; the outcome will be measured not in words but in lives.', zh: '正如漫画提醒我们的那样，选择最终在我们自己：我们既可以……，也可以继续……；结果将不用言语衡量，而用生活衡量。', usage: '呼吁式总结（提供选择路径，收束有力）' },
  // ---- 建议 ----
  { id: 'p-suggestion-1', category: 'suggestion', en: 'What is called for, first of all, is a change of attitude: we must … before it is too late.', zh: '首先需要的是态度的转变：我们必须趁早……。', usage: '建议段开头（态度先行）' },
  { id: 'p-suggestion-2', category: 'suggestion', en: 'It is incumbent upon schools, families and the media alike to …', zh: '学校、家庭和媒体都责无旁贷地应当……', usage: '多方主体建议（schools/families/media 三角色）' },
  { id: 'p-suggestion-3', category: 'suggestion', en: 'Practical measures, however, will avail little unless they are backed by sustained effort; in the long run, it is … that makes the real difference.', zh: '然而，除非有持续的努力作支撑，否则具体措施收效甚微；从长远看，真正起作用的正是……。', usage: '从短期措施转向长期努力（强调句收尾）' },
  { id: 'p-suggestion-4', category: 'suggestion', en: 'Individuals can start with small but concrete steps: … ; institutions, for their part, should …', zh: '个人可以从微小而具体的步骤开始：……；机构方面则应……', usage: '个人与机构分层建议（体现结构完整性）' },
]

export const builtinPatterns: Pattern[] = rawPatterns.map((p) => ({ ...p, builtin: true }))
