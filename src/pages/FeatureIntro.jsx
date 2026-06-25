import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { useNavigate } from 'react-router-dom';

// ─── Reveal animation helper ───────────────────────────────────────────────
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.15 });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─── Data badge ────────────────────────────────────────────────────────────
function DataBadge({ value, label }) {
  return (
    <div className="flex flex-col items-start gap-1 px-5 py-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm min-w-[160px]">
      <span className="text-3xl font-bold text-[#ffdd00] tracking-tight">{value}</span>
      <span className="text-xs text-zinc-400 leading-snug">{label}</span>
    </div>
  );
}

// ─── Pain point card ───────────────────────────────────────────────────────
function PainCard({ icon, title, body }) {
  return (
    <div className="p-5 rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-colors duration-300">
      <div
        className="text-xs font-mono font-bold mb-3"
        style={{ color: '#ffdd00', letterSpacing: '0.05em' }}
      >
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
    </div>
  );
}

// ─── Phase roadmap item ────────────────────────────────────────────────────
function PhaseItem({ phase, label, badge, items, active }) {
  return (
    <div className={`flex-1 p-5 rounded-xl border transition-all duration-300 ${
      active
        ? 'border-[#ffdd00]/40 bg-[#ffdd00]/5'
        : 'border-white/8 bg-white/[0.02]'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
          active
            ? 'border-[#ffdd00]/50 text-[#ffdd00] bg-[#ffdd00]/10'
            : 'border-zinc-700 text-zinc-500 bg-zinc-800/50'
        }`}>
          {phase}
        </span>
        {badge && (
          <span className="text-[10px] bg-[#ffdd00] text-white px-2 py-0.5 rounded-full font-medium">
            {badge}
          </span>
        )}
      </div>
      <h3 className={`text-sm font-semibold mb-3 ${active ? 'text-white' : 'text-zinc-400'}`}>
        {label}
      </h3>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={`mt-[5px] h-1.5 w-1.5 rounded-full flex-shrink-0 ${
              active ? 'bg-[#ffdd00]' : 'bg-zinc-700'
            }`} />
            <span className={`text-xs leading-relaxed ${active ? 'text-zinc-300' : 'text-zinc-600'}`}>
              {item}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Feature bento card ────────────────────────────────────────────────────
function FeatureCard({ tag, title, body, visual, wide = false }) {
  return (
    <div className={`${wide ? 'col-span-1 md:col-span-2' : 'col-span-1'} p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-white/[0.01] flex flex-col gap-4 group hover:border-[#ffdd00]/30 transition-all duration-300`}>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-wider uppercase text-zinc-500 bg-zinc-800/60 px-2 py-1 rounded-md">
          {tag}
        </span>
      </div>
      <div>
        <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">{body}</p>
      </div>
      {visual && (
        <div className="mt-auto rounded-lg bg-zinc-900/60 border border-white/6 p-4">
          {visual}
        </div>
      )}
    </div>
  );
}

// ─── Competitor row ────────────────────────────────────────────────────────
function CompetitorRow({ brand, features, status }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-white/6 last:border-0">
      <div className="w-24 flex-shrink-0">
        <span className="text-sm font-medium text-zinc-300">{brand}</span>
      </div>
      <div className="flex-1">
        <p className="text-xs text-zinc-500 leading-relaxed">{features}</p>
      </div>
      <div className={`flex-shrink-0 text-xs px-2 py-0.5 rounded-full border ${
        status === 'ahead'
          ? 'border-green-500/30 text-green-400 bg-green-500/10'
          : status === 'match'
          ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'
          : 'border-zinc-700 text-zinc-500 bg-zinc-800/50'
      }`}>
        {status === 'ahead' ? '超前' : status === 'match' ? '对标' : '规划中'}
      </div>
    </div>
  );
}

// ─── Tag level visual ──────────────────────────────────────────────────────
function TagLevels() {
  const levels = [
    { label: '消费凭证', color: '#ffdd00', opacity: 1, sub: 'LV.1 最高' },
    { label: '消费后评价', color: '#FF8C33', opacity: 0.85, sub: 'LV.2' },
    { label: '现场拍摄', color: '#FFB266', opacity: 0.65, sub: 'LV.3' },
    { label: '现场评价', color: '#FFD9B3', opacity: 0.45, sub: 'LV.4' },
  ];
  return (
    <div className="flex flex-col gap-2">
      {levels.map((lv, i) => (
        <div key={i} className="flex items-center gap-3">
          <span
            className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
            style={{
              borderColor: `${lv.color}60`,
              color: lv.color,
              backgroundColor: `${lv.color}15`,
              opacity: lv.opacity,
            }}
          >
            {lv.label}
          </span>
          <span className="text-[10px] text-zinc-600">{lv.sub}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Member star visual ────────────────────────────────────────────────────
function MemberBadgeVisual() {
  return (
    <div className="flex items-center gap-2">
      <div className="h-8 w-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
        <span className="text-[10px] font-bold text-black">黑</span>
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-1">
          <span className="text-xs text-yellow-400 font-medium">黑钻会员</span>
          <div className="flex gap-0.5">
            {[1,2,3,4].map(s => (
              <svg key={s} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
        <span className="text-[10px] text-zinc-500">点击查看身份浮层</span>
      </div>
    </div>
  );
}

// ─── Experiment table ──────────────────────────────────────────────────────
function ExperimentTable() {
  const rows = [
    { group: '实验组 A', desc: '会员星级展示 + 屏效优化', traffic: '10%', metrics: ['GTV', '看评率'] },
    { group: '实验组 B', desc: '四级真实性标签 + 真实性弹窗 + 屏效优化', traffic: '10%', metrics: ['GTV', '看评率', '标签点击'] },
    { group: '实验组 C', desc: '全量功能（A+B）', traffic: '10%', metrics: ['GTV', '看评率', '全部'] },
    { group: '对照组', desc: '与线上保持一致', traffic: '20%', metrics: ['基准'] },
    { group: '空白组', desc: '与线上保持一致', traffic: '50%', metrics: ['基准'] },
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-white/10">
            <th className="text-left py-3 pr-4 text-zinc-500 font-medium">实验组</th>
            <th className="text-left py-3 pr-4 text-zinc-500 font-medium">说明</th>
            <th className="text-left py-3 pr-4 text-zinc-500 font-medium">流量</th>
            <th className="text-left py-3 text-zinc-500 font-medium">核心指标</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
              <td className="py-3 pr-4">
                <span className={`font-medium ${i < 3 ? 'text-[#ffdd00]' : 'text-zinc-500'}`}>
                  {row.group}
                </span>
              </td>
              <td className="py-3 pr-4 text-zinc-400">{row.desc}</td>
              <td className="py-3 pr-4">
                <span className={`px-2 py-0.5 rounded-full border text-[10px] ${
                  i < 3
                    ? 'border-[#ffdd00]/30 text-[#ffdd00] bg-[#ffdd00]/10'
                    : 'border-zinc-700 text-zinc-600'
                }`}>
                  {row.traffic}
                </span>
              </td>
              <td className="py-3">
                <div className="flex flex-wrap gap-1">
                  {row.metrics.map((m, j) => (
                    <span key={j} className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">
                      {m}
                    </span>
                  ))}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function FeatureIntro() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-950 text-white" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>

      {/* ─── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-20 pb-24 max-w-6xl mx-auto">
        {/* Background glow */}
        <div
          className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(ellipse, #ffdd00 0%, transparent 70%)' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* PRD tag */}
          <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full border border-[#ffdd00]/30 bg-[#ffdd00]/10">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ffdd00] animate-pulse" />
            <span className="text-xs text-[#ffdd00] font-medium">PRD - 一期方案</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-4 max-w-3xl">
            写评人身份
            <br />
            <span style={{ color: '#ffdd00' }}>标识体系升级</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base text-zinc-400 leading-relaxed mb-8 max-w-xl">
            增强评价区信任感，提升看评率，带动 GTV 转化。
            基于直播场景验证数据，将会员身份感强化方案平移至评价场景。
          </p>

          {/* Data badges */}
          <div className="flex flex-wrap gap-3 mb-10">
            <DataBadge value="+9.94%" label="黑钻 GTV 提升（直播验证）" />
            <DataBadge value="+5.15%" label="服务零售人均实付金额" />
            <DataBadge value="+0.09pp" label="评价消费率提升" />
          </div>

          {/* CTA row */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/demo')}
              className="px-6 py-3 rounded-xl bg-[#ffdd00] text-white text-sm font-semibold hover:bg-[#e55d00] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-orange-900/30"
            >
              查看交互 Demo
            </button>
            <span className="text-xs text-zinc-600">一期改动可视化演示</span>
          </div>
        </motion.div>
      </section>

      <div className="px-6 max-w-6xl mx-auto space-y-20 pb-24">

        {/* ─── 问题背景 ─────────────────────────────────────────────── */}
        <section>
          <Reveal>
            <h2 className="text-2xl font-bold mb-2">当前体系的四大不足</h2>
            <p className="text-sm text-zinc-500 mb-8">
              美团评价区写评人身份标识存在系统性缺陷，导致看评用户信任成本高、决策效率低。
            </p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: '01',
                title: '真实性标注维度单一',
                body: '仅有"消费后评价""回头客"两种基础标识，无法区分消费凭证/消费记录/到店拍摄等不同可信度层次，整体覆盖率不足。',
              },
              {
                icon: '02',
                title: '会员等级无差异化呈现',
                body: '黑金/黑钻用户仅展示等级文字标签，无星级区分度，高阶会员身份价值在评价场景未被充分释放。',
              },
              {
                icon: '03',
                title: '标识不可交互',
                body: '所有标识（会员标签、消费后评价等）均为静态文字展示，用户无法点击了解标识含义，标识的信任传递止步于表面。',
              },
              {
                icon: '04',
                title: '缺少官方真实性背书',
                body: '竞品已建立完整的评价真实性说明体系（抖音"严守真实底线"、大众点评"共同维护真实评价环境"），美团用户对可信度缺乏感知。',
              },
            ].map((card, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <PainCard {...card} />
              </Reveal>
            ))}
          </div>
        </section>

        {/* ─── 分期路线图 ───────────────────────────────────────────── */}
        <section>
          <Reveal>
            <h2 className="text-2xl font-bold mb-2">三期方案规划</h2>
            <p className="text-sm text-zinc-500 mb-8">
              按实现难度和依赖关系分三阶段落地，本期聚焦短期方案。
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col md:flex-row gap-4">
              <PhaseItem
                phase="短期（本期）"
                label="会员星级 + 四级标签 + 真实性弹窗"
                badge="P0 进行中"
                active
                items={[
                  '会员等级增强：黑金/黑钻星级展示',
                  '四级真实性标签体系（消费凭证至现场评价）',
                  '评价真实性说明弹窗（四模块）',
                  '门票场景补全会员标签',
                ]}
              />
              <PhaseItem
                phase="中期（规划）"
                label="评鉴官标签体系 + 评价入口升级"
                items={[
                  '评鉴官认证体系（黑金/黑钻强绑定）',
                  'POI评价入口：3个头像 + XX位评鉴官已评价',
                  '写评价banner文案AB实验',
                  '评鉴官规则入口',
                ]}
              />
              <PhaseItem
                phase="长期（远景）"
                label="达人标签 + 个性化评价分发"
                items={[
                  '25种品类达人标签体系',
                  '场景智能化识别匹配',
                  '个性化评价分发（同一POI不同用户看不同首屏）',
                ]}
              />
            </div>
          </Reveal>
        </section>

        {/* ─── 一期功能详解（Bento）────────────────────────────────── */}
        <section>
          <Reveal>
            <h2 className="text-2xl font-bold mb-2">一期核心功能</h2>
            <p className="text-sm text-zinc-500 mb-8">
              三个功能模块联动，覆盖到餐、服务零售、酒店、门票四大场景。
            </p>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Reveal delay={0.05}>
              <FeatureCard
                tag="会员等级增强"
                title="黑金/黑钻星级展示 + 身份浮层"
                body="在评价列表写评人信息区展示会员星级（如黑钻4星）。点击标签展开浮层，显示头像、昵称、成长值档位、勋章、跳转会员主页。"
                visual={<MemberBadgeVisual />}
              />
            </Reveal>
            <Reveal delay={0.1}>
              <FeatureCard
                tag="四级真实性标签"
                title="细分真实性标签类型，可点击查看详情"
                body="建立消费凭证(LV1) > 消费后评价(LV2) > 现场拍摄(LV3) > 现场评价(LV4) 层级体系。点击可弹窗查看判定依据。"
                visual={<TagLevels />}
              />
            </Reveal>
            <Reveal delay={0.15}>
              <FeatureCard
                tag="评价真实性说明弹窗"
                title='点击「严守评价真实底线」触发半浮层'
                body='弹窗四大模块：真实消费验证身份、严格审查守护真实、客观算分科学公正、全民监督共建真实。底部补充「四类不鼓励评价」规则。'
                visual={
                  <div className="flex flex-col gap-2">
                    {['真实消费 验证身份', '严格审查 守护真实', '客观算分 科学公正', '全民监督 共建真实'].map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-[10px] text-[#ffdd00] font-mono w-4">{String(i+1).padStart(2,'0')}</span>
                        <span className="text-[10px] text-zinc-400">{item}</span>
                      </div>
                    ))}
                  </div>
                }
              />
            </Reveal>
          </div>

          {/* 交互场景说明 */}
          <Reveal delay={0.2}>
            <div className="mt-4 p-5 rounded-xl border border-white/8 bg-white/[0.02]">
              <h4 className="text-sm font-semibold text-zinc-300 mb-3">覆盖场景与展示优先级</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['到餐美食', '服务零售', '酒店预订', '门票/玩乐'].map((scene, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#ffdd00]" />
                    <span className="text-xs text-zinc-400">{scene}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-white/6">
                <p className="text-xs text-zinc-600">
                  标识展示优先级：<span className="text-zinc-400">会员星级</span>
                  {' > '}
                  <span className="text-zinc-400">真实性标签</span>
                  {' > '}
                  <span className="text-zinc-400">消费次数</span>
                  。空间不足时从低优先级开始省略。
                </p>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ─── 竞品对比 ─────────────────────────────────────────────── */}
        <section>
          <Reveal>
            <h2 className="text-2xl font-bold mb-2">竞品参照</h2>
            <p className="text-sm text-zinc-500 mb-8">
              主要竞品均已建立评价身份标识体系，本方案对标并超越。
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <CompetitorRow
                brand="抖音"
                features='四级真实性标注（消费凭证 > 已消费 > 现场评价 > 现场拍摄）+ 评鉴官认证（准入门槛 + 独立筛选tab）+ "严守真实底线"落地页（亿万原声/严格审查/客观算分/全民监督）'
                status="match"
              />
              <CompetitorRow
                brand="大众点评"
                features='四级标注（已上传消费凭证 > 通过大众点评/美团消费 > 打卡后评价 > 免费试评价）+ "共同维护真实评价环境"说明页'
                status="match"
              />
              <CompetitorRow
                brand="京东"
                features='PLUS会员标识（视觉辨识度高）+ 信誉等级弹窗（信誉等级/淘龄/购物经验）+ "x年购物达人"标识'
                status="match"
              />
              <CompetitorRow
                brand="携程"
                features='"真人验榜"（特邀验榜师+x年用户+足迹+验榜次数），从专业维度建立评价权威性'
                status="ahead"
              />
            </div>
          </Reveal>
        </section>

        {/* ─── AB 实验方案 ──────────────────────────────────────────── */}
        <section>
          <Reveal>
            <h2 className="text-2xl font-bold mb-2">AB 实验设计</h2>
            <p className="text-sm text-zinc-500 mb-8">
              访问 POI 评价页时分流，全量用户准入。核心验证指标：GTV、看评率、评价区停留时长。
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
              <ExperimentTable />
              <div className="mt-5 pt-4 border-t border-white/6 grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { label: '实验组 A vs 对照组', desc: '验证会员星级展示对核心指标的提升效果' },
                  { label: '实验组 B vs 对照组', desc: '验证真实性标签优化对核心指标的提升效果' },
                  { label: '实验组 C vs 对照组', desc: '验证全量功能联动效果及最优组合方案' },
                ].map((item, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-xs font-medium text-[#ffdd00]">{item.label}</span>
                    <span className="text-xs text-zinc-600">{item.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

        {/* ─── Bottom CTA ───────────────────────────────────────────── */}
        <section>
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-[#ffdd00]/20 bg-gradient-to-br from-[#ffdd00]/10 via-[#ffdd00]/5 to-transparent p-8 text-center">
              <div
                className="pointer-events-none absolute inset-0 rounded-2xl"
                style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(255,107,0,0.15), transparent 60%)' }}
              />
              <h2 className="text-2xl font-bold mb-3">
                一期改动，完整演示
              </h2>
              <p className="text-sm text-zinc-400 mb-6 max-w-md mx-auto">
                在手机模拟器中，逐步演示改前/改后对比、黑金会员弹窗、四级标签交互全流程。
              </p>
              <button
                onClick={() => navigate('/demo')}
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-[#ffdd00] text-white text-sm font-semibold hover:bg-[#e55d00] active:scale-[0.98] transition-all duration-200 shadow-xl shadow-orange-900/30"
              >
                查看交互 Demo
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </Reveal>
        </section>

      </div>

      {/* ─── Footer ───────────────────────────────────────────────────── */}
      <footer className="border-t border-white/6 px-6 py-6 max-w-6xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 rounded-full" style={{ background: '#ffdd00' }} />
            <span className="text-xs text-zinc-600">美团 · LBS-评价产品</span>
          </div>
          <span className="text-xs text-zinc-700">写评人身份标识体系升级 · PRD v1.0 · 2026-06-23</span>
        </div>
      </footer>

    </div>
  );
}
