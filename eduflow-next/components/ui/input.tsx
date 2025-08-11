import * as React from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, label, error, id, ...rest } = props
  const autoId = React.useId()
  const inputId = id ?? autoId
  return (
    <div>
      {label ? (
        <label htmlFor={inputId} className="text-sm text-white/80">
          {label}
        </label>
      ) : null}
      <input
        id={inputId}
        ref={ref}
        className={cn(
          'focus-ring mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 placeholder:text-white/40',
          error && 'border-red-500/60',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error ? (
        <p id={`${inputId}-error`} role="alert" className="mt-1 text-sm text-red-400">
          {error}
        </p>
      ) : null}
    </div>
  )
})
Input.displayName = 'Input'
