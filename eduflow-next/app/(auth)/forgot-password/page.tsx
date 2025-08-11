"use client"
import Link from 'next/link'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

const schema = z.object({ email: z.string().email('Enter a valid email') })
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const onSubmit = async () => { await new Promise(r => setTimeout(r, 400)) }
  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold">Reset password</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="text-sm text-white/80" htmlFor="email">Email</label>
            <input id="email" className="focus-ring mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" type="email" required aria-invalid={!!errors.email} {...register('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-400" role="alert">{errors.email.message}</p>}
          </div>
          <Button className="w-full" disabled={isSubmitting}>{isSubmitting ? 'Sending…' : 'Send reset link'}</Button>
          {isSubmitSuccessful && <p className="text-sm text-green-300">If that email exists, we sent a reset link.</p>}
        </form>
        <p className="mt-4 text-sm text-white/60"><Link className="underline" href="/sign-in">Back to sign in</Link></p>
      </div>
    </AppShell>
  )
}
