"use client"

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Bot, BrainCircuit, MessageSquareText, Sparkles } from 'lucide-react'

export function MotionLanding() {
  return (
    <main className="min-h-screen">
      <Hero />
      <Features />
  <Testimonials />
  <Pricing />
      <Footer />
    </main>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return <section className="relative mx-auto max-w-7xl px-6 py-20 lg:py-28">{children}</section>
}

function Gradient() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-r from-primary-500/20 via-accent/20 to-primary-500/20 blur-3xl" />
    </div>
  )
}

function Hero() {
  return (
    <Shell>
      <Gradient />
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
              <Sparkles className="h-4 w-4 text-accent" /> Premium AI tutoring for everyone
            </span>
          </motion.div>
          <motion.h1
            className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05, duration: 0.6 }}
          >
            EduFlow — Learn faster with hybrid AI, built for focus and accessibility
          </motion.h1>
          <motion.p
            className="max-w-xl text-lg text-white/70"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
          >
            A world-class learning workspace that works offline, respects your time, and adapts to you.
          </motion.p>
          <motion.div className="flex flex-wrap gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
            <Link href="/dashboard" className="focus-ring group inline-flex items-center justify-center rounded-xl bg-primary-500 px-5 py-3 font-medium text-white shadow-glow transition hover:scale-[1.02] hover:shadow-glow">
              Get started
              <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" />
            </Link>
            <Link href="#features" className="focus-ring inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-5 py-3 font-medium text-white/90 hover:bg-white/10">
              Explore features
            </Link>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1, duration: 0.6 }}
          className="glass relative rounded-2xl p-4">
          <div className="aspect-video w-full rounded-xl bg-black/40 p-4">
            {/* Placeholder for interactive AI demo */}
            <div className="grid h-full place-items-center text-white/60">Interactive AI demo coming soon</div>
          </div>
        </motion.div>
      </div>
    </Shell>
  )
}

function Features() {
  const items = [
    { icon: Bot, title: 'AI Chatbot', desc: 'Chat with streaming responses, markdown, and code highlighting.' },
    { icon: MessageSquareText, title: 'Question Answering', desc: 'Ask anything and get concise, cited answers.' },
    { icon: BrainCircuit, title: 'MCQ Generator', desc: 'Create practice questions from any text.' },
  ]
  return (
    <Shell>
      <div id="features" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ icon: Icon, title, desc }) => (
          <motion.div key={title} whileHover={{ y: -2 }} className="glass rounded-2xl p-6">
            <Icon className="h-6 w-6 text-accent" />
            <h3 className="mt-4 font-medium">{title}</h3>
            <p className="mt-2 text-white/70">{desc}</p>
          </motion.div>
        ))}
      </div>
    </Shell>
  )
}

function Testimonials() {
  const items = [
    { quote: 'EduFlow feels like magic. It keeps me in flow.', author: 'Asha, CS Undergrad' },
    { quote: 'The best study assistant I have used. Offline support is clutch.', author: 'Leo, Medical Student' },
    { quote: 'Calm design + powerful AI. It respects my focus.', author: 'Maya, Bootcamp Grad' },
  ]
  const [idx, setIdx] = React.useState(0)
  React.useEffect(() => {
    const id = setInterval(() => setIdx((i) => (i + 1) % items.length), 4000)
    return () => clearInterval(id)
  }, [items.length])
  return (
    <Shell>
      <div className="glass relative overflow-hidden rounded-2xl p-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-lg text-white/90">“{items[idx].quote}”</p>
            <p className="mt-2 text-white/60">— {items[idx].author}</p>
          </motion.div>
        </AnimatePresence>
      </div>
    </Shell>
  )
}

function Pricing() {
  const [yearly, setYearly] = React.useState(true)
  const plans = [
    { name: 'Free', priceM: 0, features: ['Basic AI chat', 'Limited prompts'] },
    { name: 'Pro', priceM: 12, features: ['Unlimited chat', 'Summarizer', 'Q&A', 'MCQ'] },
    { name: 'Team', priceM: 20, features: ['All Pro', 'Team workspaces'] },
  ]
  return (
    <Shell>
      <div className="mb-4 flex items-center justify-center gap-3">
        <span className={!yearly ? 'text-white' : 'text-white/60'}>Monthly</span>
        <button onClick={() => setYearly((v) => !v)} aria-label="Toggle billing" className="focus-ring rounded-full border border-white/10 bg-white/5 px-2 py-1">
          <span className={`inline-block rounded-full bg-primary-500 px-3 py-1 text-xs text-white transition ${yearly ? 'translate-x-12' : ''}`}>{yearly ? 'Yearly -20%' : 'Monthly'}</span>
        </button>
        <span className={yearly ? 'text-white' : 'text-white/60'}>Yearly</span>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((p, i) => {
          const price = yearly ? Math.round(p.priceM * 12 * 0.8) : p.priceM
          const badge = i === 1
          return (
            <div key={p.name} className={`glass relative rounded-2xl p-6 ${badge ? 'ring-2 ring-primary-500' : ''}`}>
              {badge && <span className="absolute right-4 top-4 rounded-full bg-primary-500/20 px-2 py-1 text-xs text-primary-300">Popular</span>}
              <h3 className="font-medium">{p.name}</h3>
              <div className="mt-2 text-3xl font-semibold">${price}<span className="text-base font-normal text-white/60">/{yearly ? 'yr' : 'mo'}</span></div>
              <ul className="mt-4 space-y-2 text-white/80">
                {p.features.map((f) => (<li key={f}>• {f}</li>))}
              </ul>
              <button className="mt-6 w-full rounded-xl bg-primary-500 px-4 py-2 font-medium text-white hover:scale-[1.02] focus-ring">Choose {p.name}</button>
            </div>
          )
        })}
      </div>
    </Shell>
  )
}

function Footer() {
  return (
    <Shell>
      <div className="grid gap-6 border-t border-white/10 pt-8 md:grid-cols-2">
        <div>
          <p className="text-white/60">© {new Date().getFullYear()} EduFlow</p>
          <div className="mt-3 flex items-center gap-5 text-white/70">
            <Link href="/support">Support</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </div>
        </div>
        <form className="justify-self-end">
          <label className="sr-only" htmlFor="newsletter">Email</label>
          <div className="flex gap-2">
            <input id="newsletter" placeholder="Join our newsletter" className="focus-ring rounded-xl border border-white/10 bg-white/5 px-3 py-2" />
            <button className="rounded-xl bg-primary-500 px-4 py-2">Subscribe</button>
          </div>
        </form>
      </div>
    </Shell>
  )
}
