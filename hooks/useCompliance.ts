// hooks/useCompliance.ts
// Data-fetching hooks — swap mock data for real API calls by uncommenting the axios lines

import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'

// ── Generic fetch hook ────────────────────────────────────────────────────

export function useFetch<T>(
  fetchFn: () => Promise<{ data: T }>,
  deps: unknown[] = []
) {
  const [data, setData]       = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetchFn()
      setData(res.data)
    } catch (e: unknown) {
      const msg = (e as Error)?.message || 'Failed to load data'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }, deps)

  useEffect(() => { load() }, [load])
  return { data, loading, error, refetch: load }
}

// ── Mutation hook ─────────────────────────────────────────────────────────

export function useMutation<TInput, TOutput>(
  mutateFn: (input: TInput) => Promise<{ data: TOutput }>,
  options?: { onSuccess?: (data: TOutput) => void; successMessage?: string }
) {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState<string | null>(null)

  async function mutate(input: TInput): Promise<TOutput | null> {
    setLoading(true)
    setError(null)
    try {
      const res = await mutateFn(input)
      if (options?.successMessage) toast.success(options.successMessage)
      options?.onSuccess?.(res.data)
      return res.data
    } catch (e: unknown) {
      const msg = (e as Error)?.message || 'Operation failed'
      setError(msg)
      toast.error(msg)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { mutate, loading, error }
}

// ── Countdown timer hook ──────────────────────────────────────────────────

export function useCountdown(targetDate: string | undefined) {
  const [remaining, setRemaining] = useState<{ hours: number; minutes: number; seconds: number } | null>(null)

  useEffect(() => {
    if (!targetDate) return

    function calc() {
      const diff = new Date(targetDate!).getTime() - Date.now()
      if (diff <= 0) { setRemaining({ hours: 0, minutes: 0, seconds: 0 }); return }
      const h = Math.floor(diff / 3600000)
      const m = Math.floor((diff % 3600000) / 60000)
      const s = Math.floor((diff % 60000) / 1000)
      setRemaining({ hours: h, minutes: m, seconds: s })
    }

    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [targetDate])

  return remaining
}

// ── SLA clock hook ────────────────────────────────────────────────────────

export function useSLAClock(dueDate: string | undefined) {
  const countdown = useCountdown(dueDate)

  if (!dueDate || !countdown) return { label: '—', status: 'safe' as const, pct: 0 }

  const totalHours = 720 // 30 days DSR default
  const hoursLeft  = countdown.hours + countdown.minutes / 60
  const pct        = Math.max(0, Math.min(100, ((totalHours - hoursLeft) / totalHours) * 100))

  const label  = hoursLeft <= 0 ? 'OVERDUE'
    : hoursLeft < 24 ? `${countdown.hours}h ${countdown.minutes}m left`
    : `${Math.floor(hoursLeft / 24)}d ${countdown.hours % 24}h left`

  const status = hoursLeft <= 0 ? 'critical' as const
    : hoursLeft < 24 ? 'critical' as const
    : hoursLeft < 72 ? 'warning' as const
    : 'safe' as const

  return { label, status, pct, countdown }
}
