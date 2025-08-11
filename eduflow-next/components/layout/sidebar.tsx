"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bot, MessageSquareText, FileText, ListChecks, Code2, Settings } from 'lucide-react'
import { cn } from '@/lib/cn'

const items = [
  { href: '/dashboard/chat', label: 'AI Chat', icon: Bot },
  { href: '/dashboard/qa', label: 'Q&A', icon: MessageSquareText },
  { href: '/dashboard/summarize', label: 'Summarize', icon: FileText },
  { href: '/dashboard/mcq', label: 'MCQ', icon: ListChecks },
  { href: '/dashboard/code-explainer', label: 'Code', icon: Code2 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  return (
    <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-60 shrink-0 lg:block">
      <nav className="glass h-full rounded-2xl p-3">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname?.startsWith(href)
          return (
            <Link key={href} href={href} className={cn('flex items-center gap-3 rounded-xl px-3 py-2 text-white/80 hover:bg-white/5', active && 'bg-white/10 text-white')}
              aria-current={active ? 'page' : undefined}>
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
