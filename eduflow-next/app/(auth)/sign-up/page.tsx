"use client"
import Link from 'next/link'
import { AppShell } from '@/components/layout/app-shell'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
import { auth, googleProvider } from '@/lib/firebase'

const schema = z.object({
  name: z.string().min(2, 'Enter your name'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})
type FormData = z.infer<typeof schema>

export default function SignUpPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })
  const onSubmit = async (data: FormData) => {
  if (!auth) throw new Error('Auth is not configured')
  const cred = await createUserWithEmailAndPassword(auth, data.email, data.password)
    if (cred.user && data.name) await updateProfile(cred.user, { displayName: data.name })
  }
  return (
    <AppShell>
      <div className="mx-auto max-w-md">
        <h1 className="text-2xl font-semibold">Create your account</h1>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>
            <label className="text-sm text-white/80" htmlFor="name">Name</label>
            <input id="name" className="focus-ring mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" required aria-invalid={!!errors.name} {...register('name')} />
            {errors.name && <p className="mt-1 text-sm text-red-400" role="alert">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm text-white/80" htmlFor="email">Email</label>
            <input id="email" className="focus-ring mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" type="email" required aria-invalid={!!errors.email} {...register('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-400" role="alert">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm text-white/80" htmlFor="password">Password</label>
            <input id="password" className="focus-ring mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2" type="password" required aria-invalid={!!errors.password} {...register('password')} />
            {errors.password && <p className="mt-1 text-sm text-red-400" role="alert">{errors.password.message}</p>}
          </div>
          <Button className="w-full" disabled={isSubmitting || !auth}>{isSubmitting ? 'Creating…' : 'Create account'}</Button>
        </form>
        <div className="mt-4 grid gap-2">
          <button onClick={async()=>{ if(!auth||!googleProvider) return; await signInWithPopup(auth, googleProvider) }} className="rounded-xl border border-white/10 bg-white/5 px-4 py-2" disabled={!auth || !googleProvider}>Continue with Google</button>
          <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2">Continue with GitHub</button>
        </div>
        <p className="mt-4 text-sm text-white/60">Already have an account? <Link className="underline" href="/sign-in">Sign in</Link></p>
      </div>
    </AppShell>
  )
}
