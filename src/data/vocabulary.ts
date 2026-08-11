import type { VocabItem } from '../types'

/**
 * 内置熟词僻义词库（50 词）
 * 聚焦：一词多义 · 生僻义 · 圣经文化词汇 · GRE 高频
 */
const rawVocabulary: Omit<VocabItem, 'builtin'>[] = [
  // ══════ 一、一词多义 · 动词僻义 ══════
  { id: 'v-01', word: 'address', partOfSpeech: 'v.', meanings: ['v. 处理、解决（address a problem）', 'v. 向…致辞（address the audience）', 'n. 地址；演讲'], example: 'The government must address the widening gap between rich and poor.', note: '阅读中 90% 是"处理"义；作名词表"演讲"也常见。' },
  { id: 'v-02', word: 'assume', partOfSpeech: 'v.', meanings: ['v. 假定、想当然', 'v. 承担（assume responsibility）', 'v. 呈现、具有（assume a new form）'], example: 'We assumed the data was accurate — a mistake that cost us dearly.', note: '考点：作者先写人们"assume A"，再转折说其实是 B。' },
  { id: 'v-03', word: 'compound', partOfSpeech: 'v.', meanings: ['n. 化合物；围院', 'v. 加剧、使恶化（compound the problem）', 'adj. 复合的'], example: 'The drought compounded the region\'s food shortages.', note: '作"加剧"解是 GRE 级僻义，完形高频。' },
  { id: 'v-04', word: 'weather', partOfSpeech: 'v.', meanings: ['n. 天气', 'v. 经受住、平安度过（weather the storm/crisis）'], example: 'Small firms proved better at weathering the economic downturn.', note: 'weather the storm = 渡过难关，完形高频。' },
  { id: 'v-05', word: 'harbor', partOfSpeech: 'v.', meanings: ['n. 港口、港湾', 'v. 怀有、心怀（harbor doubts/resentment/ambition）', 'v. 庇护、窝藏'], example: 'Many investors harbor deep misgivings about the company\'s forecasts.', note: 'harbor 从"港湾"引申为"心中藏着"，非常形象。' },
  { id: 'v-06', word: 'broker', partOfSpeech: 'v.', meanings: ['n. 经纪人、掮客', 'v. 斡旋、安排、促成（broker a deal / peace agreement）'], example: 'The UN brokered a ceasefire between the warring factions.', note: '作动词表"促成协议"，经济/外交类文章高频。' },
  { id: 'v-07', word: 'afford', partOfSpeech: 'v.', meanings: ['v. 买得起、负担得起', 'v. 提供、给予（afford sb sth / afford a view）'], example: 'The tower affords a panoramic view of the entire city.', note: 'afford = provide（僻义），不可译"买得起"。' },
  { id: 'v-08', word: 'register', partOfSpeech: 'v.', meanings: ['v. 登记、注册', 'v. 显示、记录到（register an increase）', 'v. 意识到（sth fails to register）'], example: 'The thermometer registered 42°C — a record for the city.', note: '科学/经济类文本常见：GPS did not register the change。' },

  // ══════ 二、一词多义 · 名词僻义 ══════
  { id: 'v-09', word: 'means', partOfSpeech: 'n.', meanings: ['n. 方法、手段（by means of）', 'n. 财力、财富（a man of means / lack of means）'], example: 'The project was abandoned for lack of means.', note: '"lack of means" = 缺钱。means 单复数同形。' },
  { id: 'v-10', word: 'returns', partOfSpeech: 'n.', meanings: ['n. 返回', 'n. 收益、回报（diminishing returns / return on investment）', 'n. 选举结果（election returns）'], example: 'Further investment yielded diminishing returns.', note: 'diminishing returns = 边际收益递减，经济类阅读必备。' },
  { id: 'v-11', word: 'bill', partOfSpeech: 'n.', meanings: ['n. 账单', 'n. 法案（pass a bill）', 'n. 钞票（a dollar bill）', 'n. 鸟喙'], example: 'The bill, if passed, would sharply restrict data collection.', note: '新闻/政治类文章"bill"几乎都是"法案"。' },
  { id: 'v-12', word: 'ground', partOfSpeech: 'n.', meanings: ['n. 地面', 'n. 理由、依据（on the grounds that / on moral grounds）'], example: 'The appeal was rejected on the grounds that it was filed too late.', note: 'on the grounds that = because。法律/论说文高频。' },
  { id: 'v-13', word: 'fabric', partOfSpeech: 'n.', meanings: ['n. 织物、布料', 'n. 结构、基础（the fabric of society / the very fabric of）'], example: 'The scandal threatened the very fabric of democratic institutions.', note: 'the fabric of society = 社会结构。抽象化用法。' },
  { id: 'v-14', word: 'body', partOfSpeech: 'n.', meanings: ['n. 身体', 'n. 机构、团体（a regulatory body）', 'n. 大量（a body of evidence / a growing body of research）'], example: 'A growing body of evidence links sleep deprivation to metabolic disease.', note: 'a body of = 大量的（body 无"身体"义）。' },
  { id: 'v-15', word: 'character', partOfSpeech: 'n.', meanings: ['n. 性格；人物角色', 'n. 特征、性质（in character / the character of sth）'], example: 'The changes altered the very character of the neighbourhood.', note: 'character 表"性质"时不可译"性格"。' },

  // ══════ 三、圣经与文化词汇 ══════
  { id: 'v-16', word: 'exodus', partOfSpeech: 'n.', meanings: ['n. （圣经）出埃及记', 'n. 大批离去、大规模迁徙（a mass exodus）'], example: 'The pandemic triggered an exodus of families from city centers to suburbs.', note: '源出《出埃及记》摩西带领以色列人逃离埃及。新闻高频词。' },
  { id: 'v-17', word: 'scapegoat', partOfSpeech: 'n.', meanings: ['n. 替罪羊、代人受过者', 'v. 使…成为替罪羊'], example: 'The CEO became the scapegoat for decades of institutional failure.', note: '源出《利未记》：祭司把手按在羊头上，象征将罪转移给羊并放逐旷野。' },
  { id: 'v-18', word: 'jubilee', partOfSpeech: 'n.', meanings: ['n. 禧年（圣经：每 50 年的豁免与安息年）', 'n. 周年庆典、 jubilation（欢庆）'], example: 'The diamond jubilee celebrations drew crowds of over a million.', note: '源出《利未记》25 章：每 50 年释放奴隶、归还土地。现多指重要周年（silver/golden/diamond jubilee）。' },
  { id: 'v-19', word: 'armageddon', partOfSpeech: 'n.', meanings: ['n. （圣经）哈米吉多顿 — 末世决战之地', 'n. 世界末日般的大灾难、终极对决'], example: 'Climate scientists warn that without drastic action we are heading toward an environmental armageddon.', note: '源出《启示录》16:16。现泛指"灾难性终极冲突"。' },
  { id: 'v-20', word: 'covenant', partOfSpeech: 'n.', meanings: ['n. （圣经）圣约、盟约（God\'s covenant with Abraham）', 'n. 正式契约、具有约束力的承诺'], example: 'The treaty established a covenant between the two nations to share water resources.', note: '圣经核心概念：上帝与人的"约"。法律/外交语境中表"庄严契约"。' },
  { id: 'v-21', word: 'prodigal', partOfSpeech: 'adj.', meanings: ['adj. 挥霍的、浪费的', 'n. 浪子（the prodigal son）'], example: 'His prodigal spending habits eventually led the company to bankruptcy.', note: '源出《路加福音》15 章"浪子回头"（the prodigal son returns）。prodigal = wasteful。' },
  { id: 'v-22', word: 'deluge', partOfSpeech: 'n.', meanings: ['n. （圣经）大洪水（the Deluge / Noah\'s flood）', 'n. 暴雨；洪水般涌来的大量事物（a deluge of complaints）'], example: 'The company received a deluge of complaints after the price hike was announced.', note: '源出《创世纪》诺亚方舟故事。a deluge of = 大量涌来的。' },
  { id: 'v-23', word: 'epistle', partOfSpeech: 'n.', meanings: ['n. （圣经）使徒书信', 'n. 正式长信、书信体文章'], example: 'His resignation letter read more like a philosophical epistle than a farewell note.', note: '新约中保罗等使徒写给教会的书信。现泛指长篇正式书信。' },
  { id: 'v-24', word: 'behemoth', partOfSpeech: 'n.', meanings: ['n. （圣经）巨兽比希摩斯', 'n. 庞然大物、超级巨头（corporate behemoth）'], example: 'The tech behemoth now controls over 60% of the global search market.', note: '源出《约伯记》40 章。反义词 leviathan（海中巨兽利维坦）也常见。' },
  { id: 'v-25', word: 'manna', partOfSpeech: 'n.', meanings: ['n. （圣经）吗哪 — 上帝赐予以色列人的天降食物', 'n. 意外之财、从天而降的好东西'], example: 'For tech startups, venture capital can feel like manna from heaven.', note: '源出《出埃及记》16 章。manna from heaven = 天降馅饼。' },
  { id: 'v-26', word: 'pentecost', partOfSpeech: 'n.', meanings: ['n. 五旬节（圣灵降临节）', 'n. （泛指）属灵复兴、大规模的精神觉醒'], example: 'The movement spread with pentecostal fervor across the continent.', note: '源出《使徒行传》2 章。衍生词 pentecostal（五旬节派的）。' },
  { id: 'v-27', word: 'pharisee', partOfSpeech: 'n.', meanings: ['n. （圣经）法利赛人', 'n. 伪善者、自以为义的人'], example: 'He was dismissed as a modern-day pharisee — preaching morality while practicing corruption.', note: '新约中耶稣常批评法利赛人的假冒为善。现泛指道貌岸然之人。' },
  { id: 'v-28', word: 'original sin', partOfSpeech: 'n.', meanings: ['n. （神学）原罪', 'n. 先天缺陷、与生俱来的根本问题'], example: 'Critics argue that the algorithm\'s original sin was being trained on biased data.', note: '源出《创世纪》亚当夏娃。在评论/社论中常比喻根本性先天缺陷。' },

  // ══════ 四、看似简单实则大坑的词 ══════
  { id: 'v-29', word: 'subject', partOfSpeech: 'adj.', meanings: ['n. 学科；主题；受试者', 'adj. 易受…的、受制于…的（be subject to）', 'v. 使遭受（be subjected to）'], example: 'Gig workers are subject to constant scheduling changes without notice.', note: 'be subject to（易受）= 处于…之下 / be subjected to（被施加）= 被迫遭受。两个搭配都高频。' },
  { id: 'v-30', word: 'save', partOfSpeech: 'prep.', meanings: ['v. 拯救；储蓄；保存', 'prep. 除…之外（= except）', 'conj. 要不是'], example: 'All the defendants were convicted, save one.', note: 'save = except 是 GRE 级僻义，阅读中出现时极易误读。' },
  { id: 'v-31', word: 'wanting', partOfSpeech: 'adj.', meanings: ['adj. 缺乏的、不足的（be wanting in sth）'], example: 'The report was found wanting in both evidence and clarity.', note: 'wanting ≠ 想要。be found wanting = 被发现不足。' },
  { id: 'v-32', word: 'telling', partOfSpeech: 'adj.', meanings: ['v. 告诉', 'adj. 有说服力的、能说明问题的（a telling example / a telling remark）'], example: 'The most telling statistic was that 70% of participants dropped out before the third week.', note: 'telling 作 adj. 表"有力地揭示真相的"。' },
  { id: 'v-33', word: 'engaged', partOfSpeech: 'adj.', meanings: ['adj. 订婚的', 'adj. 忙于…的、从事…的（be engaged in）', 'adj. 投入的、积极参与的'], example: 'The researchers are engaged in a long-term study of climate adaptation.', note: 'be engaged in = be involved in。不是"订婚"！' },
  { id: 'v-34', word: 'nice', partOfSpeech: 'adj.', meanings: ['adj. 好的、友好的', 'adj. 精细的、微妙的（a nice distinction）'], example: 'The argument depends on a nice distinction between correlation and causation.', note: 'nice 表"精细的、微妙的"是 18 世纪旧义，学术文本偶见。' },
  { id: 'v-35', word: 'curious', partOfSpeech: 'adj.', meanings: ['adj. 好奇的', 'adj. 奇怪的、不同寻常的（a curious fact）'], example: 'A curious pattern emerged: patients who slept less reported feeling fine.', note: 'curious = strange/odd（僻义），科学写作常用。"A curious finding..."' },
  { id: 'v-36', word: 'count', partOfSpeech: 'v.', meanings: ['v. 数数', 'v. 重要、有价值（What counts is... / Every second counts.）'], example: 'It is not how much you know but what you do with it that counts.', note: 'count = matter（重要）。What counts = 重要的事。' },

  // ══════ 五、学术论文/外刊高频动词 ══════
  { id: 'v-37', word: 'contend', partOfSpeech: 'v.', meanings: ['v. 竞争、争夺（contend with）', 'v. 主张、坚决认为（contend that）'], example: 'Some scholars contend that the Industrial Revolution began decades earlier than textbooks claim.', note: 'contend that = argue strongly。观点题信号词。' },
  { id: 'v-38', word: 'maintain', partOfSpeech: 'v.', meanings: ['v. 维持、保持', 'v. 坚持认为（maintain that）', 'v. 供养、赡养'], example: 'The company maintains that its product is safe, despite mounting evidence to the contrary.', note: 'maintain that = 坚持主张（即使证据不利）。' },
  { id: 'v-39', word: 'observe', partOfSpeech: 'v.', meanings: ['v. 观察', 'v. 评述、评论（observe that）', 'v. 遵守（observe the rules）'], example: 'As one historian observed, "revolutions are rarely revolutionary in the way their authors intend."', note: 'observe that = remark/comment（正式评述）。' },
  { id: 'v-40', word: 'entail', partOfSpeech: 'v.', meanings: ['v. 使…成为必需、必然导致（entail doing sth）'], example: 'The reform entails retraining a large proportion of the existing workforce.', note: 'entail = necessarily involve。GRE 级动词，阅读必会。' },

  // ══════ 六、高级抽象名词 ══════
  { id: 'v-41', word: 'resilience', partOfSpeech: 'n.', meanings: ['n. 韧性、复原力、弹性', 'n. （生态/心理/经济）抗压恢复能力'], example: 'The resilience of the community after the disaster astonished aid workers.', note: '源自拉丁语 resilire（弹回）。心理学/生态学/经济学共用词。' },
  { id: 'v-42', word: 'hubris', partOfSpeech: 'n.', meanings: ['n. 傲慢、狂妄自大（尤指导致覆灭的过度自负）'], example: 'The board\'s hubris — believing they were too big to fail — proved to be their undoing.', note: '源自古希腊悲剧：hubris（傲慢）→ nemesis（报应）。GRE 级词汇。' },
  { id: 'v-43', word: 'catharsis', partOfSpeech: 'n.', meanings: ['n. 情感宣泄、净化', 'n. （亚里士多德诗学）悲剧通过恐惧与怜悯达到的情感净化'], example: 'Writing about the trauma became a form of catharsis for many survivors.', note: '源出亚里士多德《诗学》。cathartic（adj.）= 有宣泄作用的。' },
  { id: 'v-44', word: 'zeitgeist', partOfSpeech: 'n.', meanings: ['n. 时代精神、时代思潮'], example: 'The startup\'s pitch captured the zeitgeist of post-pandemic remote work perfectly.', note: '德语借词：Zeit（时代）+ Geist（精神）。外刊高频。' },
  { id: 'v-45', word: 'dystopia', partOfSpeech: 'n.', meanings: ['n. 反乌托邦、敌托邦', 'n. 极糟糕的社会状态'], example: 'The novel depicts a surveillance dystopia where privacy no longer exists.', note: 'dys-（坏的）+ topos（地方）= 坏地方。反义词：utopia（乌托邦）。' },

  // ══════ 七、有趣的形容词 ══════
  { id: 'v-46', word: 'visceral', partOfSpeech: 'adj.', meanings: ['adj. 内脏的', 'adj. 发自内心深处的、本能的（a visceral reaction）'], example: 'Her response to the artwork was visceral — she wept without knowing why.', note: '源自拉丁语 viscera（内脏）。形容"直觉层面而非理性层面"的反应。' },
  { id: 'v-47', word: 'Kafkaesque', partOfSpeech: 'adj.', meanings: ['adj. 卡夫卡式的：荒诞、压抑、官僚迷宫般的'], example: 'The visa application process was so Kafkaesque that many applicants simply gave up.', note: '源自弗兰茨·卡夫卡（《审判》《城堡》）。形容无意义且无法逃脱的官僚噩梦。' },
  { id: 'v-48', word: 'Orwellian', partOfSpeech: 'adj.', meanings: ['adj. 奥威尔式的：极权主义、监控、思想控制的'], example: 'Critics described the new surveillance law as Orwellian in its scope and secrecy.', note: '源自乔治·奥威尔（《1984》）。形容以"安全"之名行控制之实的政权。' },
  { id: 'v-49', word: 'Machiavellian', partOfSpeech: 'adj.', meanings: ['adj. 马基雅维利式的：为达目的不择手段的、权谋算计的'], example: 'His Machiavellian rise to power involved betraying every ally he had ever made.', note: '源自尼可罗·马基雅维利（《君主论》）。形容冷酷算计的政治手腕。' },
  { id: 'v-50', word: 'promethean', partOfSpeech: 'adj.', meanings: ['adj. 普罗米修斯式的：大胆创造、挑战诸神般勇气的'], example: 'The project was a Promethean undertaking — to map the entire human genome in under a decade.', note: '源自希腊神话：普罗米修斯盗火给人类。形容挑战极限的大胆创新。' },
]

export const builtinVocabulary: VocabItem[] = rawVocabulary.map((v) => ({ ...v, builtin: true }))
