// 随机事件场景
import type { Scene } from "../types";

export const eventScenes: Record<string, Scene> = {
  evt_hiker: {
    id: "evt_hiker",
    text: "浓雾中，你隐约听到前方有微弱的呼救声。循着声音走近，一个瑟瑟发抖的身影蜷缩在岩石后。那是个年轻的驴友，眼神涣散，嘴唇冻得发紫。他说他和队友走散了，水也没了。",
    roleText: {
      doctor:
        "通过面色和反应，你一眼就判断出他处于早期失温状态。瞳孔轻微放大，意识虽然清醒但反应迟钝。如果不马上处理，等到核心体温进一步下降，神仙也救不了。",
      veteran:
        "这种菜鸟你见多了。没经验、没装备、没体能，典型的“三无人员”。在战场上，这种人是累赘；但在山里，他是一条命。",
    },
    bg: "evt_rescue_hiker",
    choices: [
      {
        text: "给他半瓶热水",
        cost: { hunger: 10, sanity: -10 },
        target: "node_evt_hiker_share_feedback",
      },
      {
        text: "自身难保，狠心离开",
        cost: { sanity: 10 },
        target: "node_evt_hiker_leave_feedback",
      },
      {
        text: "尝试帮他联系救援",
        cost: { hp: 20, hunger: 20, sanity: -5 },
        target: "node_evt_hiker_help_feedback",
      },
      {
        text: "[医生] 实施专业急救",
        requiredRole: "doctor",
        cost: { hunger: 5, sanity: -20 },
        target: "node_evt_hiker_doctor_feedback",
      },
    ],
  },

  node_evt_hiker_share_feedback: {
    id: "node_evt_hiker_share_feedback",
    text: "你递给他半瓶珍贵的热水。看着他贪婪地吞咽，喉结剧烈上下滚动，眼里的光慢慢聚了起来。在死亡边缘，一口水就是一条命。虽然你的物资少了，但你觉得背包轻了一些。\n(状态反馈：饱食度 -10，理智 +10)",
    bg: "evt_rescue_hiker",
    choices: [
      {
        text: "告别继续赶路",
        target: "resume",
      },
    ],
  },

  node_evt_hiker_leave_feedback: {
    id: "node_evt_hiker_leave_feedback",
    text: "你拉低了帽檐，假装没听见他的哀求，快步走过。风声很大，你想用它掩盖身后的呼救声，但那个声音像针一样扎在你的良心上。在生死面前，自私是本能，也是罪过。\n(状态反馈：理智 -10)",
    bg: "evt_rescue_hiker",
    choices: [
      {
        text: "逃离般的离开",
        target: "resume",
      },
    ],
  },

  node_evt_hiker_help_feedback: {
    id: "node_evt_hiker_help_feedback",
    text: "你决定不再赶路，陪他在风雪中等待救援。寒风带走了你大量的热量，你也开始不受控制地发抖。好在，几个小时后救援队终于赶到。看着他被抬上担架，你瘫坐在地上，笑了。\n(状态反馈：生命值 -20，饱食度 -20，理智 +5)",
    bg: "evt_rescue_hiker",
    choices: [
      {
        text: "默默离开",
        target: "resume",
      },
    ],
  },

  node_evt_hiker_doctor_feedback: {
    id: "node_evt_hiker_doctor_feedback",
    text: "职业本能接管了身体。你迅速扒掉他湿透的外套，用太空毯裹紧，喂食葡萄糖凝胶。一系列操作行云流水。半小时后，他的各项体征趋于平稳。你救回来的不是一个人，而是一个家庭。\n(状态反馈：饱食度 -5，理智 +20)",
    bg: "evt_rescue_hiker",
    choices: [
      {
        text: "深藏功与名",
        target: "resume",
      },
    ],
  },
  evt_tent: {
    id: "evt_tent",
    text: "路边的碎石上，孤零零地立着一顶橙色帐篷。帐篷外帐已经有些褪色，风吹过时发出哗啦啦的响声。这里不该有营地，周围也没有人声。",
    roleText: {
      student:
        "这场景怎么看都像恐怖片里的开头。你想起网上的那些关于鳌太的诡异传说，后背一阵发凉。",
      veteran:
        "看这帐篷的打地钉方式，是个老手。但是帐篷裙边压得不够实，如果是遭遇暴风雪，可能会被掀翻。有点不对劲。",
    },
    bg: "evt_abandoned_tent",
    choices: [
      {
        text: "壮着胆子拉开查看",
        target: "evt_tent_result",
        cost: { sanity: 5 },
      },
      {
        text: "多一事不如少一事，快走",
        target: "node_evt_tent_leave_feedback",
      },
    ],
  },

  node_evt_tent_leave_feedback: {
    id: "node_evt_tent_leave_feedback",
    text: "在这个地方，过剩的好奇心往往意味着危险。你选择相信直觉，绕开了那顶诡异的帐篷。有时候，不知道真相反而是一种幸福。\n(状态反馈：无变化)",
    bg: "evt_abandoned_tent",
    choices: [
      {
        text: "匆匆走过",
        target: "resume",
      },
    ],
  },
  evt_tent_result: {
    id: "evt_tent_result",
    text: "帐篷里空无一人，只有一些散落的气罐和睡袋。看来主人已经离开许久了。你捡起了一些可用的物资。",
    bg: "loc_camp",
    choices: [{ text: "获得物资", target: "resume", action: "loot_supplies" }],
  },
  evt_storm: {
    id: "evt_storm",
    text: "天色瞬间暗了下来，气温呈断崖式下跌。狂风卷着冰粒横扫而过，能见度降到了零。即使你穿着冲锋衣，刺骨的寒意依然穿透了身体。",
    roleText: {
      geologist:
        "这是典型的更迭锋面过境。看这云层的厚度和移动速度，这场暴风雪至少会持续6个小时。现在的风速已经超过了8级。",
      veteran:
        "这种白毛风是最致命的。一旦停下来，体温流失速度会是平常的五倍。必须立刻找掩体，或者在此地挖掘雪洞。",
    },
    bg: "bg_storm",
    choices: [
      {
        text: "不管不顾，强行突围",
        cost: { hp: 40, hunger: 20, sanity: 15 },
        target: "node_evt_storm_force_feedback",
      },
      {
        text: "找块巨石背风扎营",
        cost: { hunger: 40, sanity: 5 },
        target: "node_evt_storm_camp_feedback",
      },
      { text: "绝望中尝试拨打SOS", action: "sos" },
    ],
  },

  node_evt_storm_force_feedback: {
    id: "node_evt_storm_force_feedback",
    text: "你选择了和老天爷硬刚。每迈出一步都要用尽全身力气。好几次你被狂风掀翻在地，又挣扎着爬起来。当你终于走出风圈时，眉毛和睫毛上都结满了冰碴。\n(状态反馈：生命值 -40，饱食度 -20，理智 -15)",
    bg: "bg_storm",
    choices: [
      {
        text: "命大，继续走",
        target: "resume",
      },
    ],
  },

  node_evt_storm_camp_feedback: {
    id: "node_evt_storm_camp_feedback",
    text: "你迅速躲到一块巨石后面，用最快的速度搭好帐篷钻了进去。外面风声鹤唳，像有无数恶鬼在咆哮。你抱着膝盖，把头埋在两腿之间，祈祷帐篷不要被吹走。\n(状态反馈：饱食度 -40，理智 -5)",
    bg: "bg_storm",
    choices: [
      {
        text: "风停了，撤收装备",
        target: "resume",
      },
    ],
  },

  node_sos_fail: {
    id: "node_sos_fail",
    text: "求救失败。电话那头只有嘈杂的电流声。在这种恶劣天气和地形下，信号很难接通。即使接通，直升机也无法在风雪中起飞。",
    bg: "bg_storm",
    choices: [{ text: "收起电话，另寻出路", target: "resume" }],
  },
  evt_ranger: {
    id: "evt_ranger",
    text: "前方垭口隐约有几个人影。是保护区的巡山队！鳌太线早已全线封禁，抓住就是行政拘留加罚款。你现在的位置很尴尬，似乎被看见了。",
    roleText: {
      student:
        "完了完了，要是被抓了，学校可能会给处分，档案里也会留下一笔。这比遇上野兽还可怕。",
    },
    bg: "evt_ranger_patrol",
    choices: [
      { text: "老实认罚，配合执法", target: "end_caught" },
      {
        text: "趁着云雾遮挡，钻进树林跑！",
        cost: { hp: 30, hunger: 30, sanity: 15 },
        target: "node_evt_ranger_evade_feedback",
      },
    ],
  },

  node_evt_ranger_evade_feedback: {
    id: "node_evt_ranger_evade_feedback",
    text: "你像受惊的野兽一样钻进密林，在没有路的地方强行穿梭。荆棘划破了皮肤，跌跌撞撞跑了几个小时，才敢停下来喘气。虽然逃过了处罚，但身体已经快散架了。\n(状态反馈：生命值 -30，饱食度 -30，理智 -15)",
    bg: "evt_ranger_patrol",
    choices: [
      {
        text: "惊魂未定",
        target: "resume",
      },
    ],
  },
  evt_body: {
    id: "evt_body",
    text: "在一块不起眼的石头缝里，你看到了一抹鲜艳的冲锋衣颜色。走近一看，是一具已经风干的遗体。他蜷缩着，衣衫单薄，脸上甚至带着诡异的微笑——这是典型的“反常脱衣”现象。",
    roleText: {
      doctor:
        "反常脱衣... 这是体温调节中枢失效的标志。大脑产生热的幻觉，死者在最后时刻反而觉得热，脱掉了救命的衣服。",
      photographer:
        "死亡在这里如此直白。你没有举起相机，这是一种亵渎。你只是静静地注视着他，仿佛看到了未来的自己。",
    },
    bg: "evt_frozen_body",
    choices: [
      {
        text: "为了生存，搜寻遗物",
        action: "loot_supplies",
        target: "node_evt_body_loot_feedback",
      },
      {
        text: "致敬逝者，默哀离开",
        cost: { hunger: 5, sanity: -10 },
        target: "node_evt_body_mourn_feedback",
      },
    ],
  },

  node_evt_body_loot_feedback: {
    id: "node_evt_body_loot_feedback",
    text: "你颤抖着手翻找他的背包，找到了一些压缩饼干和燃料。触碰到冰冷僵硬的身体时，你感到一阵恶心和罪恶感。为了活下去，你只能这么做。\n(状态反馈：获得物资)",
    bg: "evt_frozen_body",
    choices: [
      {
        text: "背负罪恶感离开",
        target: "resume",
      },
    ],
  },

  node_evt_body_mourn_feedback: {
    id: "node_evt_body_mourn_feedback",
    text: "你拿出一点干粮放在他身边，深深鞠了一躬。愿逝者安息。虽然什么都没得到，但你守住了作为人的底线，内心感到一丝平静。\n(状态反馈：理智 +10)",
    bg: "evt_frozen_body",
    choices: [
      {
        text: "怀着敬畏之心离开",
        target: "resume",
      },
    ],
  },
  evt_takin: {
    id: "evt_takin",
    text: "一头体型像推土机一样的秦岭羚牛挡在了必经之路上。它金毛闪亮，眼睛血红，正死死盯着你，鼻孔里喷着粗气。这是山里的霸主。",
    roleText: {
      runner:
        "不能背对它跑，也不能盯着它的眼睛。慢慢后退，保持距离，寻找爬树或者爬石头的机会。比爆发力，你绝对输。",
    },
    bg: "evt_takin_beast",
    choices: [
      {
        text: "屏住呼吸，原地不动",
        cost: { hunger: 20, sanity: -5 },
        target: "node_evt_takin_wait_feedback",
      },
      {
        text: "大声驱赶",
        cost: { hp: 50, sanity: 10 },
        target: "node_evt_takin_scare_feedback",
      },
    ],
  },

  node_evt_takin_wait_feedback: {
    id: "node_evt_takin_wait_feedback",
    text: "你像一尊雕塑一样站了半个小时，大气都不敢出。直到羚牛慢悠悠地啃完草离开，你才敢通过。腿都站麻了。\n(状态反馈：饱食度 -20，理智 +5)",
    bg: "evt_takin_beast",
    choices: [
      {
        text: "松了一口气",
        target: "resume",
      },
    ],
  },

  node_evt_takin_scare_feedback: {
    id: "node_evt_takin_scare_feedback",
    text: "你挥舞登山杖大喊试图吓跑它。羚牛被激怒了，向你发起了冲锋！你被顶飞出去，重重摔在石头上。好在它没有补刀，扬长而去。\n(状态反馈：生命值 -50，理智 -10)",
    bg: "evt_takin_beast",
    choices: [
      {
        text: "痛苦地爬起来",
        target: "resume",
      },
    ],
  },
  evt_hallucination_music: {
    id: "evt_hallucination_music",
    text: "恍惚中，风声似乎变了调子。你听到了一阵高亢激昂的秦腔，锣鼓喧天。你停下脚步，那声音又消失了；一走动，声音又响起来。在这海拔3000米的无人区，哪来的戏班子？",
    roleText: {
      student:
        "你想起宿舍老三讲过的鬼故事，头皮发麻。但这声音听起来莫名地亲切，像是小时候在大集上听过的。",
      poet: "这大概就是“大音希声”吧。山风穿过石缝，奏响了天地间的乐章。你愿意相信这是山神在为你送行。",
    },
    bg: "evt_phantom_opera",
    choices: [
      {
        text: "停下来，沉浸其中",
        cost: { sanity: -10, hunger: 5 },
        target: "node_evt_music_listen_feedback",
      },
      {
        text: "狠狠掐自己一下，清醒点！",
        cost: { sanity: 5, hp: 2 },
        target: "node_evt_music_wake_feedback",
      },
    ],
  },

  node_evt_music_listen_feedback: {
    id: "node_evt_music_listen_feedback",
    text: "你找了块石头坐下，闭上眼睛。那秦腔愈发清晰，仿佛就在耳边。悲凉、苍劲，每一个音符都敲击着你的灵魂。不知过了多久，声音渐渐停歇，你感到前所未有的平静。\n(状态反馈：理智 +10，饱食度 -5)",
    bg: "evt_phantom_opera",
    choices: [
      {
        text: "如梦初醒，继续赶路",
        target: "resume",
      },
    ],
  },

  node_evt_music_wake_feedback: {
    id: "node_evt_music_wake_feedback",
    text: "剧烈的疼痛让你瞬间从幻觉中惊醒。风还是那个风，石头还是那个石头。刚才那是典型的高原缺氧幻觉，如果不及时醒来，可能就永远睡过去了。\n(状态反馈：理智 -5，生命值 -2)",
    bg: "evt_phantom_opera",
    choices: [
      {
        text: "惊出一身冷汗",
        target: "resume",
      },
    ],
  },
  evt_gear_failure: {
    id: "evt_gear_failure",
    text: "走着走着，你突然觉得脚感不对。低头一看，心里“咯噔”一下——登山鞋的鞋底像鳄鱼嘴一样张开了。这是长线徒步中最令人崩溃的装备故障。",
    roleText: {
      gearhead:
        "虽然是Vibram大底，但也经不起这种强度的折磨。幸好你随身带了大力马强度的求生绳，修补这个不在话下。",
    },
    bg: "evt_broken_shoe",
    choices: [
      {
        text: "用求生绳做应急捆绑",
        cost: { hunger: 10 },
        target: "node_evt_gear_bind_feedback",
      },
      {
        text: "懒得管，拖着鞋走 (极易崴脚)",
        cost: { hp: 10, hunger: 10 },
        target: "node_evt_gear_drag_feedback",
      },
    ],
  },

  node_evt_gear_bind_feedback: {
    id: "node_evt_gear_bind_feedback",
    text: "你卸下背包，找了个避风处蹲下。用求生绳在鞋底缠了“8”字扣，每一圈都勒得死死的。虽然样子像个粽子，走起路以此有点硌脚，但至少安全了。\n(状态反馈：饱食度 -10)",
    bg: "evt_broken_shoe",
    choices: [
      {
        text: "丑是丑了点，能用就行",
        target: "resume",
      },
    ],
  },

  node_evt_gear_drag_feedback: {
    id: "node_evt_gear_drag_feedback",
    text: "你心烦意乱，不想停下来处理。结果没走两步，鞋底被石头绊住，脚踝猛地扭了一下。钻心的疼痛让你不得不停下来。早知今日，何必当初。\n(状态反馈：生命值 -10，饱食度 -10)",
    bg: "evt_broken_shoe",
    choices: [
      {
        text: "一瘸一拐地继续走",
        target: "resume",
      },
    ],
  },
  evt_trail_angel: {
    id: "evt_trail_angel",
    text: "在一块大石头下面，你发现了一个塑料瓶。瓶身很干净，里面装满了清澈的水。瓶身上用记号笔写着：“水神赐予后来人”。",
    roleText: {
      photographer:
        "这瓶水静静地立在那里，像一座微缩的纪念碑。你透过瓶身看过去，变形的景色仿佛变得温柔了起来。",
    },
    bg: "evt_water_bottle",
    choices: [
      {
        text: "感激地喝掉",
        cost: { hunger: -10, sanity: -5 },
        target: "node_evt_angel_drink_feedback",
      },
      {
        text: "我不缺水，留给更需要的人",
        cost: { sanity: -15 }, // Karma boost
        target: "node_evt_angel_leave_feedback",
      },
    ],
  },

  node_evt_angel_drink_feedback: {
    id: "node_evt_angel_drink_feedback",
    text: "你拧开瓶盖，水是甜的。你不知道是谁留下的，但这瓶水确实救了你的急。你在心里默默说了声谢谢，把空瓶子收进了垃圾袋。\n(状态反馈：饱食度 +10，理智 +5)",
    bg: "evt_water_bottle",
    choices: [
      {
        text: "满血复活",
        target: "resume",
      },
    ],
  },

  node_evt_angel_leave_feedback: {
    id: "node_evt_angel_leave_feedback",
    text: "你把水瓶放回原处，又加固了几块石头防止被风吹走。也许后面有一个比你更绝望的人正在赶来。这种“薪火相传”的感觉让你觉得不仅仅是自己在战斗。\n(状态反馈：理智 +15)",
    bg: "evt_water_bottle",
    choices: [
      {
        text: "带着高尚的情操离开",
        target: "resume",
      },
    ],
  },
  evt_lightning: {
    id: "evt_lightning",
    text: "突然，你感觉头发全部竖了起来，甚至发出了滋滋的声响。空气中充满了电荷的味道。这是雷击的前兆！几秒钟内必须做出反应！",
    roleText: {
      geologist:
        "尖端放电现象！这里岩石含铁量高，简直就是天然的引雷针。快！扔掉所有金属！",
    },
    bg: "evt_lightning_hair",
    choices: [
      {
        text: "扔掉登山杖，抱头蹲下",
        target: "node_evt_lightning_squat_feedback",
      },
      {
        text: "惊慌失措地狂奔",
        cost: { hp: 50, sanity: 10 },
        target: "node_evt_lightning_run_feedback",
      },
    ],
  },

  node_evt_lightning_squat_feedback: {
    id: "node_evt_lightning_squat_feedback",
    text: "你把登山杖扔得远远的，像个圆球一样蹲在低洼处，屏住呼吸。在此起彼伏的雷声中，你觉得自己像只渺小的蚂蚁。万幸，雷电没有选中你。\n(状态反馈：无生命危险)",
    bg: "evt_lightning_hair",
    choices: [
      {
        text: "腿都软了，等待云团飘过",
        target: "resume",
      },
    ],
  },

  node_evt_lightning_run_feedback: {
    id: "node_evt_lightning_run_feedback",
    text: "恐惧让你失去了理智，你在雷区狂奔。一道闪电在你身边炸响，巨大的冲击波把你掀翻在地。你虽然没死，但被震得七荤八素，耳朵嗡嗡作响。\n(状态反馈：生命值 -50，理智 -10)",
    bg: "evt_lightning_hair",
    choices: [
      {
        text: "踉跄着爬起来",
        target: "resume",
      },
    ],
  },
  evt_wild_boar: {
    id: "evt_wild_boar",
    text: "前方的箭竹林里传来巨大的“哗啦”声，似乎有庞然大物在穿行。可能是野猪，也可能是黑熊。",
    bg: "evt_wild_boar_shadow",
    choices: [
      {
        text: "敲击登山杖制造噪音",
        target: "node_evt_boar_noise_feedback",
      },
      {
        text: "屏住呼吸，悄悄通过",
        cost: { sanity: 5 },
        target: "node_evt_boar_quiet_feedback",
      },
    ],
  },

  node_evt_boar_noise_feedback: {
    id: "node_evt_boar_noise_feedback",
    text: "你用力敲击登山杖，并大声呵斥。那声音停顿了一下，随后向远处跑去。野兽通常怕人，虚张声势果然管用。\n(状态反馈：危机解除)",
    bg: "evt_wild_boar_shadow",
    choices: [
      {
        text: "继续赶路",
        target: "resume",
      },
    ],
  },

  node_evt_boar_quiet_feedback: {
    id: "node_evt_boar_quiet_feedback",
    text: "你大气都不敢出，蹑手蹑脚地从旁边绕过。每一次心跳声在寂静的林子里都显得震耳欲聋。好在并没有惊动它。\n(状态反馈：理智 -5)",
    bg: "evt_wild_boar_shadow",
    choices: [
      {
        text: "如释重负",
        target: "resume",
      },
    ],
  },
  // [NEW] Event: Thin Ice
  evt_thin_ice: {
    id: "evt_thin_ice",
    text: "前方的一条山涧结了冰，这是必经之路。但冰面看起来很薄，如果背着太重的东西，可能会有危险。",
    bg: "evt_thin_ice",
    choices: [
      {
        text: "如履薄冰地通过 (高负重极险)",
        action: "check_ice_risk", // New action
      },
      {
        text: "扔掉一些重物再过",
        action: "discard_heavy", // New action
      },
      {
        text: "绕路 (消耗大量时间)",
        cost: { hunger: 30, hp: 10 },
        target: "node_evt_ice_detour_feedback",
      },
    ],
  },
  node_evt_ice_success: {
    id: "node_evt_ice_success",
    text: "冰面发出了令人牙酸的“嘎吱”声，你屏住呼吸，尽量放轻脚步。好在有惊无险，你安全到达了对岸。\n(状态反馈：安全通过)",
    bg: "evt_thin_ice",
    choices: [{ text: "继续前行", target: "resume" }],
  },
  node_evt_ice_fail: {
    id: "node_evt_ice_fail",
    text: "“咔嚓”一声，脚下的冰面突然碎裂！你掉进了刺骨的冰水中。虽然挣扎着爬了上来，但全身湿透，体温急剧下降。\n(状态反馈：生命值 -40，理智 -20)",
    bg: "evt_thin_ice",
    choices: [{ text: "瑟瑟发抖地爬起来", target: "resume" }], // cost applied in action
  },
  node_evt_ice_discard_feedback: {
    id: "node_evt_ice_discard_feedback",
    text: "你忍痛将背包里最重的几样东西留在了岸边。身轻如燕的你顺利通过了冰面。活着比什么都重要。\n(状态反馈：失去随机物品)",
    bg: "evt_thin_ice",
    choices: [{ text: "含泪告别物资", target: "resume" }],
  },
  node_evt_ice_detour_feedback: {
    id: "node_evt_ice_detour_feedback",
    text: "为了安全，你选择了绕过这段冰面。这多花了你两个小时，还在乱石堆里磨破了皮，但至少没有掉进水里。\n(状态反馈：饱食度 -30，生命值 -10)",
    bg: "evt_thin_ice",
    choices: [{ text: "疲惫地回到主路", target: "resume" }],
  },
  // [NEW] Event: Sheltered Cave (Rest Stop)
  evt_shelter_cave: {
    id: "evt_shelter_cave",
    text: "你在巨石下方发现了一个干燥避风的岩洞。这里没有积雪，温度也比外面高不少。是个难得的天然庇护所。",
    bg: "evt_shelter_cave", // Assuming we use a generic bg or create one later
    choices: [
      {
        text: "深度休整 (生火做饭睡一觉)",
        cost: { hunger: 30 }, // High hunger cost
        target: "node_evt_cave_sleep_feedback",
      },
      {
        text: "小憩片刻 (喝口水缓口气)",
        cost: { hunger: 5 },
        target: "node_evt_cave_rest_feedback",
      },
      {
        text: "不休息，趁天色早继续赶路",
        target: "node_evt_cave_leave_feedback",
      },
    ],
  },
  node_evt_cave_sleep_feedback: {
    id: "node_evt_cave_sleep_feedback",
    text: "你煮了一锅热腾腾的面条吃下，然后钻进睡袋睡了一个小时。醒来时，体能和精神都恢复到了极佳状态。\n(状态反馈：生命值 +10，理智 +20)",
    bg: "evt_shelter_cave",
    choices: [
      {
        text: "生龙活虎地出发",
        // Logic for healing is handled by negative cost in scene definition?
        // Wait, current system handles positive cost as deduction.
        // I need to use negative values for gain?
        // Let's check `game.ts` `applyCost`.
        // `applyCost` logic: `this.status.hp -= cost.hp || 0;`
        // So `cost: { hp: -10 }` means `hp -= -10` => `hp += 10`.
        // Yes.
        cost: { hp: -10, sanity: -20 },
        target: "resume",
      },
    ],
  },
  node_evt_cave_rest_feedback: {
    id: "node_evt_cave_rest_feedback",
    text: "你卸下背包，靠在岩壁上休息了片刻，吃了一块巧克力。紧绷的神经稍微放松了一些。\n(状态反馈：理智 +5)",
    bg: "evt_shelter_cave",
    choices: [
      {
        text: "起身出发",
        cost: { sanity: -5 },
        target: "resume",
      },
    ],
  },
  node_evt_cave_leave_feedback: {
    id: "node_evt_cave_leave_feedback",
    text: "你担心天气变化，决定不在此停留。虽然身体很累，但你的意志力推着你继续向前。\n(状态反馈：无)",
    bg: "evt_shelter_cave",
    choices: [{ text: "继续赶路", target: "resume" }],
  },
};

export const randomEventIds = [
  "evt_hiker",
  "evt_storm",
  "evt_ranger",
  "evt_body",
  "evt_takin",
  "evt_hallucination_music",
  "evt_gear_failure",
  "evt_trail_angel",
  "evt_lightning",
  "evt_wild_boar",
  "evt_thin_ice", // [NEW]
  "evt_shelter_cave", // [NEW]
];
