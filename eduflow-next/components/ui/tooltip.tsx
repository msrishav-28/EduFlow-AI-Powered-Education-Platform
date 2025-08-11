"use client"

import * as TooltipPrimitives from '@radix-ui/react-tooltip'

export function Tooltip({ content, children }: { content: string; children: React.ReactNode }) {
  return (
    <TooltipPrimitives.Provider>
      <TooltipPrimitives.Root>
        <TooltipPrimitives.Trigger asChild>{children}</TooltipPrimitives.Trigger>
        <TooltipPrimitives.Portal>
          <TooltipPrimitives.Content className="rounded-md bg-black/90 px-2 py-1 text-xs text-white shadow-soft" sideOffset={6}>
            {content}
            <TooltipPrimitives.Arrow className="fill-black/90" />
          </TooltipPrimitives.Content>
        </TooltipPrimitives.Portal>
      </TooltipPrimitives.Root>
    </TooltipPrimitives.Provider>
  )
}
