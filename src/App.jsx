import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  ArrowRight, Heart, Shield, Brain, Phone, Users, Check,
  ChevronDown, Menu, X as XIcon, Loader2, Zap, Clock,
  Activity, Watch, Mic, Bell, Lock, AlertTriangle, Star
} from 'lucide-react'
import Lottie from 'lottie-react'
import HeartRateGraph from './components/HeartRateGraph'
import { armySoldierJson, mayaJson, sadMayaJson } from './assets'
import emailjs from '@emailjs/browser'

// ─── EmailJS ─────────────────────────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = 'service_hy3c9ul'
const EMAILJS_TEMPLATE_ID = 'template_24pqa27'
const EMAILJS_PUBLIC_KEY  = '4_pikunbm8l1NO-4C'

// ─── Demo data (English) ──────────────────────────────────────────────────────
const demoPersonas = {
  david: { name: 'David', label: 'Combat Veteran', type: 'soldier', animIdle: armySoldierJson, animPanic: armySoldierJson, isMale: true },
  maya:  { name: 'Maya',  label: 'Trauma Survivor', type: 'student', animIdle: mayaJson, animPanic: sadMayaJson, isMale: false },
}

const groundingScript = [
  { q: 'Name 5 things you can see right now',          a: 'A tree. A car. A building. A streetlight. A bench.' },
  { q: 'Name 4 things you can physically feel',        a: 'My feet on the ground. The fabric of my shirt. The air on my skin. My phone in my hand.' },
  { q: 'Name 3 things you can hear',                   a: 'Wind. A distant siren. Someone talking nearby.' },
  { q: 'Name 2 things you can smell',                  a: 'Fresh air. My coffee.' },
  { q: 'Name 1 thing you can taste',                   a: 'The lingering taste of coffee.' },
]

const faqs = [
  { q: 'Which Garmin devices are supported?', a: 'Guardian works with any Garmin running or fitness watch that supports the Connect IQ platform (API ≥ 3.0), including the Forerunner, Fenix, and Vivoactive series.' },
  { q: 'Does it work if I\'m offline?', a: 'Yes. The app has a local detection engine that recognizes distress signals and runs calming exercises without an internet connection. Sessions sync when connectivity returns.' },
  { q: 'Is my data private?', a: 'Absolutely. All biometric data is encrypted in transit (TLS 1.3) and at rest (AES-256). Only anonymous identifiers are stored — your name and personal information never appear in our logs.' },
  { q: 'Do I need to do anything when a distress episode starts?', a: 'No — that\'s the point. The app detects physiological signs of distress (heart rate spike + HRV drop) and launches a calming support session automatically. You don\'t need to tap, swipe, or think.' },
  { q: 'Can my care team see my sessions?', a: 'Only if you choose to share. You control access via a personal code. Your counselor or support person sees session summaries, HR logs, and transcripts — nothing else.' },
  { q: 'When will Guardian be available?', a: 'We are currently in closed beta with early users and wellness professionals. Spots open soon. Join the waitlist and we\'ll reach out as soon as one is available.' },
]

// ─── Framer helpers ───────────────────────────────────────────────────────────
const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } } }
const stagger = { show: { transition: { staggerChildren: 0.12 } } }

function FadeSection({ children, className = '' }) {
  const ref  = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div ref={ref} variants={fadeUp} initial="hidden" animate={inView ? 'show' : 'hidden'} className={className}>
      {children}
    </motion.div>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [scrolled, setScrolled]     = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const demoRef  = useRef(null)
  const ctaRef   = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollTo = (ref) => { ref.current?.scrollIntoView({ behavior: 'smooth' }); setMobileMenu(false) }

  return (
    <div className="min-h-screen bg-white font-heebo overflow-x-hidden">
      <Nav scrolled={scrolled} mobileMenu={mobileMenu} setMobileMenu={setMobileMenu}
           onDemo={() => scrollTo(demoRef)} onCTA={() => scrollTo(ctaRef)} />
      <HeroSection onDemo={() => scrollTo(demoRef)} onCTA={() => scrollTo(ctaRef)} />
      <StatsBar />
      <ProblemSection />
      <SolutionSection />
      <div ref={demoRef}><DemoSection /></div>
      <HowItWorksSection />
      <FeaturesSection />
      <ForWhoSection />
      <div ref={ctaRef}><CTASection /></div>
      <FAQSection />
      <Footer onDemo={() => scrollTo(demoRef)} onCTA={() => scrollTo(ctaRef)} />
    </div>
  )
}

// ─── Nav ──────────────────────────────────────────────────────────────────────
function Nav({ scrolled, mobileMenu, setMobileMenu, onDemo, onCTA }) {
  // Hero is now light — nav text is dark until user scrolls (then dark navy bg kicks in)
  const textClass = scrolled ? 'text-white/80 hover:text-white' : 'text-gray-600 hover:text-gray-900'
  const logoText  = scrolled ? 'text-white' : 'text-gray-900'

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-guardian-navy/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-white/80 backdrop-blur-sm border-b border-gray-100'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-guardian-teal flex items-center justify-center">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <span className={`font-bold text-lg tracking-tight transition-colors ${logoText}`}>Guardian</span>
        </div>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {[['How It Works', null], ['Live Demo', onDemo], ['For Who', null], ['FAQ', null]].map(([label, fn]) => (
            <button key={label} onClick={fn} className={`text-sm font-medium transition-colors ${textClass}`}>
              {label}
            </button>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <button
            onClick={onCTA}
            className="px-5 py-2.5 bg-guardian-teal hover:bg-guardian-teal-light text-white text-sm font-semibold rounded-full transition-all hover:scale-105 active:scale-95 shadow-sm"
          >
            Get Early Access
          </button>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setMobileMenu(v => !v)} className={`md:hidden p-2 ${scrolled ? 'text-white' : 'text-gray-700'}`}>
          {mobileMenu ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className={`md:hidden border-t overflow-hidden ${scrolled ? 'bg-guardian-navy border-white/10' : 'bg-white border-gray-100'}`}
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {['How It Works', 'For Who', 'FAQ'].map(l => (
                <button key={l} className={`text-left text-sm font-medium py-2 ${scrolled ? 'text-white/80' : 'text-gray-700'}`}>{l}</button>
              ))}
              <button onClick={() => { onDemo(); setMobileMenu(false) }} className={`text-left text-sm font-medium py-2 ${scrolled ? 'text-white/80' : 'text-gray-700'}`}>
                Live Demo
              </button>
              <button
                onClick={() => { onCTA(); setMobileMenu(false) }}
                className="mt-2 px-5 py-3 bg-guardian-teal text-white text-sm font-semibold rounded-full"
              >
                Get Early Access
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection({ onDemo, onCTA }) {
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail]         = useState('')
  const [error, setError]         = useState(null)

  const handleQuickSignup = async (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setIsSending(true); setError(null)
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, { user_name: 'Early Access', user_phone: email }, EMAILJS_PUBLIC_KEY)
      setIsSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="relative min-h-screen bg-white flex flex-col justify-center overflow-hidden">
      {/* Soft warm gradient blob — top right */}
      <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,144,164,0.10) 0%, rgba(74,144,164,0.04) 50%, transparent 75%)' }}
      />
      {/* Soft warm gradient blob — bottom left */}
      <div className="absolute -bottom-24 -left-24 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(74,144,164,0.07) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-28 pb-20 grid md:grid-cols-2 gap-12 items-center">
        {/* Left: Copy */}
        <motion.div variants={stagger} initial="hidden" animate="show">
          {/* Eyebrow badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-guardian-teal/30 bg-guardian-teal/8 mb-7">
            <Shield className="w-3.5 h-3.5 text-guardian-teal" />
            <span className="text-guardian-teal text-xs font-semibold tracking-wide">Your 24/7 Mental Health Safety Net</span>
          </motion.div>

          {/* Headline — calm and empathetic */}
          <motion.h1 variants={fadeUp} className="text-4xl md:text-5xl lg:text-[3.4rem] font-bold text-gray-900 leading-[1.1] mb-5">
            You're never{' '}
            <span className="text-guardian-teal">facing it</span>{' '}
            alone.
          </motion.h1>

          <motion.p variants={fadeUp} className="text-gray-500 text-lg md:text-xl leading-relaxed mb-8 max-w-lg">
            Guardian quietly monitors your biometrics around the clock. The moment a mental health crisis is detected, it guides you back to safety —
            {' '}<span className="text-gray-700 font-medium">before you can even think to ask.</span>
          </motion.p>

          {/* Quick signup */}
          <motion.form variants={fadeUp} onSubmit={handleQuickSignup} className="flex flex-col sm:flex-row gap-3 mb-5 max-w-md">
            {isSuccess ? (
              <div className="flex items-center gap-2 text-guardian-teal font-semibold px-5 py-3 bg-guardian-teal/10 rounded-full border border-guardian-teal/20 w-full justify-center">
                <Check className="w-5 h-5" />
                You're on the list — we'll be in touch.
              </div>
            ) : (
              <>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-5 py-3.5 rounded-full bg-white border-2 border-gray-200 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-guardian-teal text-sm transition-colors shadow-sm"
                />
                <button
                  type="submit"
                  disabled={isSending}
                  className="px-6 py-3.5 bg-guardian-teal hover:bg-guardian-teal-light text-white font-semibold text-sm rounded-full transition-all hover:scale-105 active:scale-95 flex items-center gap-2 whitespace-nowrap shadow-md shadow-guardian-teal/20"
                >
                  {isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  Get Early Access
                </button>
              </>
            )}
          </motion.form>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          {/* Trust micro-copy */}
          <motion.div variants={fadeUp} className="flex flex-wrap gap-4 text-sm text-gray-400">
            {['🔒 Privacy First', '🧠 Research-Backed', '📵 Works Offline'].map(t => (
              <span key={t}>{t}</span>
            ))}
          </motion.div>

          {/* Demo link */}
          <motion.button variants={fadeUp} onClick={onDemo}
            className="mt-6 flex items-center gap-2 text-guardian-teal hover:text-guardian-teal-light text-sm font-medium transition-colors group">
            <div className="w-7 h-7 rounded-full border border-guardian-teal/40 group-hover:border-guardian-teal flex items-center justify-center transition-colors">
              <ArrowRight className="w-3.5 h-3.5 rotate-90" />
            </div>
            Watch a live simulation
          </motion.button>
        </motion.div>

        {/* Right: Calm app card */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
          className="hidden md:flex justify-center"
        >
          <PhoneMockupHero />
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 flex flex-col items-center gap-1"
        animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}
      >
        <ChevronDown className="w-5 h-5" />
      </motion.div>
    </section>
  )
}

// Phone mockup — shows calm, protective, reassuring state only
function PhoneMockupHero() {
  // Gentle pulse: BPM breathes slowly between 66-72 to show life without alarm
  const [bpm, setBpm] = useState(68)
  const [breathLabel, setBreathLabel] = useState('Calm')

  useEffect(() => {
    const sequence = [68, 70, 72, 71, 69, 67, 68]
    const labels   = ['Calm', 'Calm', 'Calm', 'Calm', 'Calm', 'Calm', 'Calm']
    let i = 0
    const t = setInterval(() => {
      i = (i + 1) % sequence.length
      setBpm(sequence[i])
      setBreathLabel(labels[i])
    }, 2200)
    return () => clearInterval(t)
  }, [])

  const protectedMessages = [
    "Guardian is watching over you.",
    "All clear — you're protected.",
    "Your safety net is active.",
  ]
  const [msgIdx, setMsgIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setMsgIdx(i => (i + 1) % protectedMessages.length), 3500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="relative">
      {/* Gentle teal glow */}
      <div className="absolute inset-0 rounded-[3rem] blur-3xl opacity-30"
        style={{ background: 'radial-gradient(circle, rgba(74,144,164,0.4), transparent 70%)' }}
      />

      {/* Phone body */}
      <div className="relative w-64 h-[500px] bg-white rounded-[2.5rem] border border-gray-200 overflow-hidden shadow-2xl shadow-gray-200/60">
        {/* Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-100 rounded-full z-10" />

        {/* Screen */}
        <div className="absolute inset-0 bg-gradient-to-b from-white to-clinical-soft">
          {/* App bar */}
          <div className="pt-12 px-5 pb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-guardian-teal flex items-center justify-center">
                <Activity className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-gray-800 font-bold text-sm">Guardian</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-700 text-xs font-semibold">Protected</span>
            </div>
          </div>

          {/* Calm BPM display */}
          <div className="px-5 pb-2">
            <p className="text-gray-400 text-xs mb-1 uppercase tracking-wider">Heart Rate</p>
            <div className="flex items-end gap-1.5">
              <motion.span
                key={bpm}
                initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 0.4 }}
                className="text-5xl font-bold text-guardian-teal"
              >
                {bpm}
              </motion.span>
              <span className="text-gray-400 text-sm mb-2">BPM · {breathLabel}</span>
            </div>
          </div>

          {/* Gentle waveform */}
          <div className="px-4 mb-4">
            <CalmWaveform />
          </div>

          {/* Protected message card */}
          <div className="mx-4 p-4 rounded-2xl bg-guardian-teal/8 border border-guardian-teal/15">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-guardian-teal" />
              <span className="text-guardian-teal font-semibold text-xs">Active Monitoring</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.p
                key={msgIdx}
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="text-gray-600 text-xs leading-relaxed"
              >
                {protectedMessages[msgIdx]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Today's summary */}
          <div className="mx-4 mt-3 p-4 rounded-2xl bg-white border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Today</p>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[['8h', 'Monitored'], ['0', 'Episodes'], ['✓', 'Connected']].map(([v, l]) => (
                <div key={l}>
                  <p className="text-guardian-teal font-bold text-lg leading-none">{v}</p>
                  <p className="text-gray-400 text-xs mt-1">{l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Calm gentle sine wave — no alarm, no spikes
function CalmWaveform() {
  const points = Array.from({ length: 80 }, (_, i) => {
    const x = (i / 79) * 280
    const y = 25 + Math.sin((i / 79) * Math.PI * 6) * 8 + Math.sin((i / 79) * Math.PI * 2) * 4
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="h-14 rounded-xl bg-white border border-gray-100 overflow-hidden px-2 flex items-center">
      <svg viewBox="0 0 280 50" className="w-full h-full" preserveAspectRatio="none">
        <motion.polyline
          points={points}
          fill="none"
          stroke="#4A90A4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.7"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  )
}

// ─── Stats Bar ────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { value: '45s',  label: 'Response within 45 seconds' },
    { value: '24/7', label: 'Tracking' },
  ]
  return (
    <div className="bg-clinical-soft border-y border-guardian-teal/15">
      <div className="py-8 flex justify-center items-center gap-16 md:gap-32 w-full">
        {stats.map(({ value, label }) => (
          <div key={label} className="text-center">
            <p className="text-3xl font-bold text-guardian-teal">{value}</p>
            <p className="text-gray-500 text-sm mt-1">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Problem ──────────────────────────────────────────────────────────────────
function ProblemSection() {
  const ref    = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const problems = [
    { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-400/10', title: 'Zero Warning', body: 'A mental health crisis can hit in seconds — triggered by a smell, a sound, a memory, or nothing at all. There\'s no countdown.' },
    { icon: XIcon,         color: 'text-orange-400', bg: 'bg-orange-400/10', title: 'Alone in the Worst Moment', body: 'In the middle of an episode, your brain\'s prefrontal cortex goes offline. You can\'t think. You can\'t dial. You can\'t ask.' },
    { icon: Clock,         color: 'text-yellow-400', bg: 'bg-yellow-400/10', title: 'Help Arrives Too Late', body: 'Current apps, hotlines, and therapy only work when you\'re calm enough to reach out. Most tools require you to initiate — exactly when you can\'t.' },
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <FadeSection className="text-center mb-16">
          <p className="text-guardian-red text-sm font-bold tracking-widest uppercase mb-3">The Real Problem</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-2xl mx-auto">
            Every mental health tool on the market has the same fatal flaw
          </h2>
          <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">
            They wait for you. Guardian doesn't.
          </p>
        </FadeSection>

        <motion.div
          ref={ref}
          variants={stagger}
          initial="hidden"
          animate={inView ? 'show' : 'hidden'}
          className="grid md:grid-cols-3 gap-8"
        >
          {problems.map(({ icon: Icon, color, bg, title, body }) => (
            <motion.div key={title} variants={fadeUp}
              className="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${bg} rounded-xl flex items-center justify-center mb-5`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Pull quote */}
        <FadeSection className="mt-16">
          <div className="max-w-3xl mx-auto p-8 bg-guardian-navy rounded-2xl text-center">
            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed italic">
              "The problem isn't that people in crisis don't want help. The problem is that help requires them to act — in the exact moment they are least able to."
            </p>
            <p className="text-guardian-teal text-sm font-semibold mt-4 uppercase tracking-wide">— The Guardian Design Principle</p>
          </div>
        </FadeSection>
      </div>
    </section>
  )
}

// ─── Solution ─────────────────────────────────────────────────────────────────
function SolutionSection() {
  const pillars = [
    { icon: Activity, step: '01', title: 'Detect', body: 'Your Garmin streams heart rate and HRV data 24/7 via Bluetooth. The AI watches for the physiological signs of a distress episode — HR spike + HRV drop — even when your phone is locked.' },
    { icon: Zap,      step: '02', title: 'Respond', body: 'The moment distress is confirmed, Guardian wakes your screen, fires a notification, and launches your AI support companion — all within 45 seconds, before you\'ve even registered what\'s happening.' },
    { icon: Brain,    step: '03', title: 'Recover', body: 'Neuro-Anchor, your AI companion, guides you through grounding, box breathing, or sensory exercises — via voice. Your care team can review the session log and HR summary afterward.' },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeSection className="text-center mb-16">
          <p className="text-guardian-teal text-sm font-bold tracking-widest uppercase mb-3">The Solution</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 max-w-2xl mx-auto">
            A system that activates before you can think
          </h2>
          <p className="text-gray-500 text-lg mt-4 max-w-xl mx-auto">
            Three stages. Fully automatic. Research-backed.
          </p>
        </FadeSection>

        <div className="grid md:grid-cols-3 gap-6 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-10 left-1/6 right-1/6 h-px bg-gradient-to-r from-transparent via-guardian-teal/40 to-transparent" />

          {pillars.map(({ icon: Icon, step, title, body }) => (
            <FadeSection key={step} className="relative p-8 rounded-2xl border border-gray-100 bg-white hover:border-guardian-teal/30 hover:shadow-lg transition-all group">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-guardian-teal/10 group-hover:bg-guardian-teal/20 rounded-xl flex items-center justify-center transition-colors">
                  <Icon className="w-6 h-6 text-guardian-teal" />
                </div>
                <span className="text-4xl font-black text-gray-100 select-none">{step}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{body}</p>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Demo Section ─────────────────────────────────────────────────────────────
function DemoSection() {
  const [selectedPersona, setSelectedPersona] = useState(null)
  const [demoState, setDemoState]             = useState('idle') // idle → panic → alert → intervention → calm → done
  const [speechBubble, setSpeechBubble]       = useState(null)
  const [currentBPM, setCurrentBPM]           = useState(72)
  const [groundingIdx, setGroundingIdx]       = useState(0)
  const timersRef = useRef([])

  const clearTimers = () => { timersRef.current.forEach(clearTimeout); timersRef.current = [] }
  const addTimer = (fn, delay) => { const t = setTimeout(fn, delay); timersRef.current.push(t); return t }

  const resetDemo = () => {
    clearTimers()
    setDemoState('idle')
    setSpeechBubble(null)
    setCurrentBPM(72)
    setGroundingIdx(0)
    setSelectedPersona(null)
  }

  const startDemo = (personaKey) => {
    clearTimers()
    setSelectedPersona(personaKey)
    setDemoState('panic')
    setCurrentBPM(142)
    setSpeechBubble(null)

    // Phase 1: panic detected
    addTimer(() => {
      setDemoState('alert')
      setSpeechBubble({ type: 'alert', text: `Panic episode detected — launching intervention in 5 seconds…` })
    }, 1500)

    // Phase 2: intervention starts
    addTimer(() => {
      setDemoState('intervention')
      setSpeechBubble({ type: 'ai', text: `Hi ${demoPersonas[personaKey].name}. I'm here with you. Let's get you grounded. Take a slow breath.` })
    }, 6500)

    // Phase 3: grounding sequence auto-plays
    let t = 10000
    groundingScript.forEach((step, i) => {
      addTimer(() => {
        setGroundingIdx(i)
        setSpeechBubble({ type: 'ai', text: step.q })
      }, t)
      t += 3000
      addTimer(() => setSpeechBubble({ type: 'user', text: step.a }), t)
      t += 2500
    })

    // Phase 4: calming BPM
    addTimer(() => {
      setDemoState('calm')
      setCurrentBPM(90)
    }, 14000)
    addTimer(() => setCurrentBPM(78), 18000)
    addTimer(() => setCurrentBPM(68), 22000)

    // Phase 5: done
    addTimer(() => {
      setDemoState('done')
      setSpeechBubble({ type: 'ai', text: `You did it. You're safe. Your care team can review this session whenever you're ready.` })
    }, t + 1000)
  }

  useEffect(() => () => clearTimers(), [])

  const persona = selectedPersona ? demoPersonas[selectedPersona] : null
  const isPanic  = demoState === 'panic' || demoState === 'alert'
  const isCalming = demoState === 'calm' || demoState === 'done'

  return (
    <section className="py-24 bg-guardian-navy">
      <div className="max-w-7xl mx-auto px-6">
        <FadeSection className="text-center mb-12">
          <p className="text-guardian-teal text-sm font-bold tracking-widest uppercase mb-3">Interactive Demo</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white max-w-2xl mx-auto">
            Watch Guardian respond to a real episode
          </h2>
          <p className="text-white/50 text-lg mt-4 max-w-xl mx-auto">
            Choose a persona. Watch the system detect, respond, and recover — automatically.
          </p>
        </FadeSection>

        <div className="max-w-4xl mx-auto">
          {/* Persona select */}
          {demoState === 'idle' && (
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-2 gap-6 max-w-lg mx-auto"
            >
              {Object.entries(demoPersonas).map(([key, p]) => (
                <motion.button
                  key={key}
                  onClick={() => startDemo(key)}
                  whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
                  className="p-6 rounded-2xl bg-guardian-card border border-white/10 hover:border-guardian-teal/50 hover:bg-guardian-teal/5 transition-all group text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                    <Lottie animationData={p.animIdle} loop autoplay className="w-full h-full" />
                  </div>
                  <p className="text-white font-bold text-lg">{p.name}</p>
                  <p className="text-white/50 text-sm">{p.label}</p>
                  <div className="mt-4 px-4 py-2 rounded-full bg-guardian-teal/10 group-hover:bg-guardian-teal/20 text-guardian-teal text-xs font-semibold transition-colors">
                    Start Simulation →
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Live Demo */}
          {demoState !== 'idle' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              className={`rounded-2xl border overflow-hidden transition-all duration-700 ${
                isPanic ? 'border-red-500/40 bg-red-950/20' : 'border-guardian-teal/30 bg-guardian-card'
              }`}
            >
              {/* Demo header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <motion.div
                    className={`w-3 h-3 rounded-full ${isPanic ? 'bg-red-500' : 'bg-guardian-teal'}`}
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span className="text-white/70 text-sm font-medium">
                    {isPanic ? '⚠ Panic Episode Detected' : isCalming ? '✓ Intervention Active' : '◉ Monitoring'} — {persona?.name}, {persona?.label}
                  </span>
                </div>
                <button onClick={resetDemo} className="text-white/30 hover:text-white/70 text-xs flex items-center gap-1 transition-colors">
                  <XIcon className="w-3 h-3" /> Reset
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-0">
                {/* Left: Character + speech */}
                <div className="p-6 flex flex-col items-center">
                  <motion.div
                    animate={isPanic && !persona?.isMale ? {} : isPanic ? { rotate: [-2, 2, -2, 2, 0], transition: { duration: 1.5, repeat: Infinity } } : {}}
                    className="w-36 h-36 flex items-center justify-center mb-6"
                  >
                    <Lottie
                      animationData={isPanic ? persona?.animPanic : persona?.animIdle}
                      loop autoplay
                      className="w-full h-full"
                    />
                  </motion.div>

                  {/* Speech bubble */}
                  <AnimatePresence mode="wait">
                    {speechBubble && (
                      <motion.div
                        key={speechBubble.text}
                        initial={{ opacity: 0, y: 16, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className={`w-full max-w-xs rounded-2xl px-5 py-4 text-sm leading-relaxed ${
                          speechBubble.type === 'alert'
                            ? 'bg-red-500/20 border border-red-500/40 text-red-200'
                            : speechBubble.type === 'ai'
                            ? 'bg-guardian-teal/20 border border-guardian-teal/30 text-white'
                            : 'bg-white/10 border border-white/20 text-white/80 text-right'
                        }`}
                      >
                        {speechBubble.type === 'ai' && (
                          <p className="text-guardian-teal text-xs font-bold mb-1 flex items-center gap-1">
                            <Brain className="w-3 h-3" /> Neuro-Anchor AI
                          </p>
                        )}
                        {speechBubble.type === 'alert' && (
                          <p className="text-red-400 text-xs font-bold mb-1 flex items-center gap-1">
                            <Bell className="w-3 h-3" /> Guardian
                          </p>
                        )}
                        {speechBubble.type === 'user' && (
                          <p className="text-white/40 text-xs font-bold mb-1">{persona?.name}</p>
                        )}
                        {speechBubble.text}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Right: HR graph */}
                <div className="p-6 flex flex-col gap-4">
                  <div>
                    <p className="text-white/40 text-xs mb-1 uppercase tracking-wider">Heart Rate</p>
                    <p className={`text-4xl font-bold ${isPanic ? 'text-red-400' : 'text-guardian-teal'}`}>
                      {Math.round(currentBPM)} <span className="text-lg text-white/40">BPM</span>
                    </p>
                  </div>
                  <HeartRateGraph bpm={currentBPM} isCalming={isCalming} />

                  {/* Grounding progress */}
                  {demoState === 'intervention' && (
                    <div className="mt-2">
                      <p className="text-white/40 text-xs mb-2 uppercase tracking-wider">Grounding Progress (5-4-3-2-1)</p>
                      <div className="flex gap-1.5">
                        {groundingScript.map((_, i) => (
                          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all duration-500 ${
                            i <= groundingIdx ? 'bg-guardian-teal' : 'bg-white/10'
                          }`} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Done state CTA */}
                  {demoState === 'done' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 p-4 rounded-xl bg-guardian-teal/10 border border-guardian-teal/30">
                      <p className="text-guardian-teal font-bold text-sm mb-1 flex items-center gap-2">
                        <Check className="w-4 h-4" /> Episode resolved
                      </p>
                      <p className="text-white/50 text-xs">HR normalized · Session logged · Therapist notified</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {demoState === 'done' && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="text-center text-white/50 text-sm mt-6">
              This is what Guardian does for real — silently, automatically, every time.
            </motion.p>
          )}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection() {
  const steps = [
    { icon: Watch,    num: '1', title: 'Wear',    body: 'Pair your Garmin watch to the Guardian app. That\'s it. The system runs silently in the background — no buttons, no configuration required during the day.' },
    { icon: Activity, num: '2', title: 'Monitor', body: 'The app tracks heart rate and HRV 24/7 via Bluetooth. Our dual-path detection engine (foreground + background) watches for physiological signs of distress, even when your phone is locked.' },
    { icon: Brain,    num: '3', title: 'Respond', body: 'Distress detected? In 45 seconds your screen wakes up and your AI companion starts talking. No tap needed. No willpower required. The system has already acted before you can ask for help.' },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeSection className="text-center mb-16">
          <p className="text-guardian-teal text-sm font-bold tracking-widest uppercase mb-3">How It Works</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Three steps. Zero effort during a crisis.</h2>
        </FadeSection>

        <div className="grid md:grid-cols-3 gap-8 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-16 left-[calc(16.6%+2rem)] right-[calc(16.6%+2rem)] h-px bg-gradient-to-r from-guardian-teal/20 via-guardian-teal/60 to-guardian-teal/20" />

          {steps.map(({ icon: Icon, num, title, body }) => (
            <FadeSection key={num} className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-guardian-teal/10 border-2 border-guardian-teal/20 mb-6 relative z-10 mx-auto">
                <Icon className="w-7 h-7 text-guardian-teal" />
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-guardian-navy border-2 border-guardian-teal flex items-center justify-center">
                  <span className="text-guardian-teal text-xs font-bold">{num}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-500 leading-relaxed text-sm">{body}</p>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
function FeaturesSection() {
  const features = [
    { icon: Activity, title: 'Real-Time Biometric Monitoring',    body: 'Continuous HR + HRV streaming from your Garmin. Passively tracks your body\'s stress signals around the clock.' },
    { icon: Zap,      title: 'Automatic Distress Detection',       body: 'Dual-path engine watches for physiological signs of distress and acts the moment they\'re confirmed — no manual trigger needed.' },
    { icon: Brain,    title: 'AI Voice Support (Neuro-Anchor)',    body: 'A conversational AI companion guides you through calming techniques via voice. Fully responsive, always available.' },
    { icon: Heart,    title: '5-4-3-2-1 Grounding + Box Breathing', body: 'Three research-backed calming techniques. The app selects the best fit based on what your body is experiencing.' },
    { icon: Bell,     title: 'Emergency Contact Alerts',           body: 'Trusted contacts receive a notification with your status and location during an active episode.' },
    { icon: Users,    title: 'Care Team Dashboard',                body: 'Share session summaries, HR logs, and transcripts with your support team — only if you choose to.' },
    { icon: Shield,   title: 'Privacy-First Security',             body: 'TLS 1.3 in transit, AES-256 at rest. UUID identifiers only. Your personal information never appears in our logs.' },
    { icon: Lock,     title: 'Offline Resilience',                 body: 'Local detection engine + cached audio. Support sessions run even without an internet connection.' },
  ]

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <FadeSection className="text-center mb-16">
          <p className="text-guardian-teal text-sm font-bold tracking-widest uppercase mb-3">Features</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Built for the moments that matter most</h2>
        </FadeSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, body }) => (
            <FadeSection key={title}
              className="p-6 bg-white rounded-2xl border border-gray-100 hover:border-guardian-teal/30 hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-guardian-teal/10 group-hover:bg-guardian-teal/20 flex items-center justify-center mb-4 transition-colors">
                <Icon className="w-5 h-5 text-guardian-teal" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2 text-sm">{title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{body}</p>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── For Who ──────────────────────────────────────────────────────────────────
function ForWhoSection() {
  const audiences = [
    {
      icon: '🎖️', label: 'Combat Veterans & First Responders',
      headline: 'Built for those who\'ve seen the worst',
      points: ['Automatic distress detection — no tapping required', 'Works while driving, working, or sleeping', 'Emergency contact integration for family members', 'Share sessions with your support team or counselor'],
      cta: 'Veterans & First Responders',
    },
    {
      icon: '💙', label: 'Trauma Survivors',
      headline: 'Safety that moves with your life',
      points: ['Gentle, conversational AI — warm and human, not cold', 'Fully private — your care team only sees what you share', 'Customizable voice, language, and calming style', 'Works offline — no cell signal needed'],
      cta: 'Trauma Survivors',
    },
    {
      icon: '🩺', label: 'Mental Health Professionals',
      headline: 'Stay connected to the people you support',
      points: ['Real-time session alerts for users you support', 'Full HR traces and transcripts per episode', 'Onboard users with a simple 5-char code', 'Research-backed calming techniques built in'],
      cta: 'Mental Health Professionals',
    },
  ]

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeSection className="text-center mb-16">
          <p className="text-guardian-teal text-sm font-bold tracking-widest uppercase mb-3">Who It's For</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">One platform. Three ways it saves lives.</h2>
        </FadeSection>

        <div className="grid md:grid-cols-3 gap-8">
          {audiences.map(({ icon, label, headline, points, cta }) => (
            <FadeSection key={label} className="p-8 rounded-2xl border-2 border-gray-100 hover:border-guardian-teal/40 hover:shadow-lg transition-all group">
              <div className="text-4xl mb-4">{icon}</div>
              <p className="text-guardian-teal text-xs font-bold uppercase tracking-wider mb-2">{label}</p>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{headline}</h3>
              <ul className="space-y-3 mb-6">
                {points.map(p => (
                  <li key={p} className="flex items-start gap-2 text-gray-500 text-sm">
                    <Check className="w-4 h-4 text-guardian-teal flex-shrink-0 mt-0.5" />
                    {p}
                  </li>
                ))}
              </ul>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Trust ────────────────────────────────────────────────────────────────────
function TrustSection() {
  const badges = [
    { icon: Shield, label: 'HIPAA Compliant', desc: 'Built to the HIPAA Security Rule. Encrypted end-to-end.' },
    { icon: Lock,   label: 'AES-256 Encryption', desc: 'All health data encrypted at rest and in transit.' },
    { icon: Star,   label: 'Clinician-Designed', desc: 'Intervention protocols reviewed by licensed trauma therapists.' },
    { icon: Watch,  label: 'Garmin Certified', desc: 'Native Connect IQ app. No third-party data brokers.' },
  ]

  return (
    <section className="py-24 bg-guardian-navy">
      <div className="max-w-7xl mx-auto px-6">
        <FadeSection className="text-center mb-12">
          <p className="text-guardian-teal text-sm font-bold tracking-widest uppercase mb-3">Trust & Safety</p>
          <h2 className="text-3xl md:text-4xl font-bold text-white">Medical-grade from the ground up</h2>
          <p className="text-white/50 text-lg mt-4 max-w-xl mx-auto">
            Your patients' most vulnerable moments deserve the highest standard of protection.
          </p>
        </FadeSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {badges.map(({ icon: Icon, label, desc }) => (
            <FadeSection key={label} className="p-6 rounded-2xl bg-guardian-card border border-white/10 text-center hover:border-guardian-teal/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-guardian-teal/15 flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-guardian-teal" />
              </div>
              <h3 className="text-white font-bold mb-2">{label}</h3>
              <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
            </FadeSection>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── CTA / Lead Capture ───────────────────────────────────────────────────────
function CTASection() {
  const [fullName, setFullName]     = useState('')
  const [phone, setPhone]           = useState('')
  const [role, setRole]             = useState('')
  const [isSending, setIsSending]   = useState(false)
  const [isSuccess, setIsSuccess]   = useState(false)
  const [error, setError]           = useState(null)

  const roles = ['Combat Veteran', 'Trauma Survivor', 'Mental Health Professional', 'Caregiver / Family Member', 'Researcher / Clinician', 'Other']

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!fullName.trim() || !phone.trim()) { setError('Please fill in all required fields.'); return }
    setIsSending(true); setError(null)
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        user_name: fullName,
        user_phone: phone,
        selected_persona: role || 'Not specified',
      }, EMAILJS_PUBLIC_KEY)
      setIsSuccess(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-3xl mx-auto px-6">
        <FadeSection className="text-center mb-10">
          <p className="text-guardian-red text-sm font-bold tracking-widest uppercase mb-3">Early Access — Limited Spots</p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Be among the first to use Guardian
          </h2>
          <p className="text-gray-500 text-lg">
            We're opening a closed beta to 200 early adopters — veterans, survivors, and clinicians who want to be part of building the future of mental health care.
          </p>
        </FadeSection>

        {isSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="p-10 bg-white rounded-2xl border-2 border-guardian-teal/30 text-center shadow-lg"
          >
            <div className="w-16 h-16 rounded-full bg-guardian-teal/10 flex items-center justify-center mx-auto mb-6">
              <Check className="w-8 h-8 text-guardian-teal" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">You're on the list.</h3>
            <p className="text-gray-500">We'll reach out personally when your early access spot opens. Thank you for being part of this.</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
          >
            {/* Urgency indicator */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-red-50 rounded-xl border border-red-100">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse flex-shrink-0" />
              <p className="text-red-700 text-sm font-medium">Beta spots are limited — join now to secure your place.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name *</label>
                <input
                  type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-guardian-teal focus:outline-none text-sm transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number *</label>
                <input
                  type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  placeholder="Your phone number"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-guardian-teal focus:outline-none text-sm transition-colors"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">I am a…</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {roles.map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className={`px-3 py-2.5 rounded-lg border text-xs font-medium transition-all ${
                        role === r
                          ? 'border-guardian-teal bg-guardian-teal/10 text-guardian-teal'
                          : 'border-gray-200 text-gray-600 hover:border-guardian-teal/40'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {error && (
                <p className="text-red-500 text-sm bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
              )}

              <button
                type="submit" disabled={isSending}
                className="w-full py-4 bg-guardian-teal hover:bg-guardian-teal-light text-white font-bold text-base rounded-xl transition-all hover:shadow-lg hover:shadow-guardian-teal/20 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                {isSending ? 'Sending…' : 'Request Early Access'}
              </button>

              <p className="text-center text-gray-400 text-xs">
                No spam. No payment. We'll reach out personally when your spot opens.
              </p>
            </form>
          </motion.div>
        )}

        {/* Trust row */}
        <FadeSection className="flex flex-wrap justify-center gap-6 mt-8">
          {[['🔒', 'Your data is yours'], ['🛡️', 'Never sold. Ever.'], ['📞', 'Personal onboarding']].map(([e, t]) => (
            <div key={t} className="flex items-center gap-2 text-gray-500 text-sm">
              <span>{e}</span><span>{t}</span>
            </div>
          ))}
        </FadeSection>
      </div>
    </section>
  )
}

// ─── FAQ ──────────────────────────────────────────────────────────────────────
function FAQSection() {
  const [open, setOpen] = useState(null)
  return (
    <section className="py-24 bg-white">
      <div className="max-w-3xl mx-auto px-6">
        <FadeSection className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Frequently asked questions</h2>
        </FadeSection>
        <div className="space-y-3">
          {faqs.map(({ q, a }, i) => (
            <motion.div key={i} layout
              className={`rounded-xl border transition-all ${open === i ? 'border-guardian-teal/40 shadow-sm' : 'border-gray-100 hover:border-gray-200'}`}>
              <button onClick={() => setOpen(open === i ? null : i)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4">
                <span className="font-semibold text-gray-900 text-sm">{q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-5 text-gray-500 text-sm leading-relaxed">{a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onDemo, onCTA }) {
  return (
    <footer className="bg-guardian-navy border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-guardian-teal flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <span className="text-white font-bold text-lg">Guardian</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              Supportive technology for your mental health. Built for the moments that matter most.
            </p>
            <div className="flex items-center gap-2 mt-4 px-3 py-1.5 bg-guardian-teal/10 rounded-full w-fit border border-guardian-teal/20">
              <Shield className="w-4 h-4 text-guardian-teal" />
              <span className="text-guardian-teal text-xs font-semibold">Privacy First</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4">Product</p>
            <ul className="space-y-2">
              {[['Live Demo', onDemo], ['How It Works', null], ['Features', null]].map(([l, fn]) => (
                <li key={l}>
                  <button onClick={fn} className="text-white/40 hover:text-white/70 text-sm transition-colors">{l}</button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-wider mb-4">Company</p>
            <ul className="space-y-2">
              {['Privacy Policy', 'Terms of Service', 'Contact Us'].map(l => (
                <li key={l}><span className="text-white/40 text-sm">{l}</span></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">© 2026 Guardian. All rights reserved.</p>
          <p className="text-white/20 text-xs">Guardian is a supportive technology tool, not a medical device or substitute for professional mental health care.</p>
        </div>
      </div>
    </footer>
  )
}
