'use client'

import { useState } from 'react'
import { Mail, Lock } from 'lucide-react'
import { fieldClass } from '@/lib/utils'


export function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)

  function handleSubmit(e) {
    e.preventDefault()

    setError(false)
    setSuccess(false)

    // handle sign in logic here

    
  }



  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <p className="text-center text-xs text-red-500">
          Invalid credentials. Please try again.
        </p>
      )}

      {success && (
        <p className="text-center text-xs text-zinc-400">
          Signed in successfully.
        </p>
      )}

      {/* Email */}
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value)
            setError(false)
          }}
          className={fieldClass(error)}
          required
          autoComplete="email"
        />
      </div>

      {/* Password */}
      <div className="relative">
        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(false)
          }}
          className={fieldClass(error)}
          required
          autoComplete="current-password"
        />
      </div>

      <button
        type="submit"
        className="mt-2 w-full border border-white bg-white py-2.5 text-sm font-semibold tracking-tighter text-black transition-all duration-300 hover:bg-white hover:shadow-[0_0_18px_4px_rgba(255,255,255,0.35)] focus:outline-none"
      >
        Sign In
      </button>

    </form>
  )
}