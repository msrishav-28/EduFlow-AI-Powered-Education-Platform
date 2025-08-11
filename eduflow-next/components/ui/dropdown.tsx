"use client"

import * as DropdownMenu from '@radix-ui/react-dropdown-menu'

export function KebabMenu({ items }: { items: Array<{ label: string; onSelect: () => void }> }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button aria-label="Open menu" className="rounded-xl p-2 hover:bg-white/5 focus-ring">⋮</button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content className="glass rounded-xl p-1">
        {items.map((it) => (
          <DropdownMenu.Item key={it.label} className="cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-white/5" onSelect={it.onSelect}>
            {it.label}
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
