import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'
import { format } from 'date-fns'

export function useSessions(limit = 30) {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .order('date', { ascending: false })
      .limit(limit)
    setSessions(data || [])
    setLoading(false)
  }, [limit])

  useEffect(() => { fetch() }, [fetch])
  return { sessions, loading, refetch: fetch }
}

export function useSession(id) {
  const [session, setSession] = useState(null)
  const [problems, setProblems] = useState([])
  const [strengthLogs, setStrengthLogs] = useState([])
  const [loading, setLoading] = useState(true)

  const fetch = useCallback(async () => {
    if (!id) return
    setLoading(true)
    const [{ data: s }, { data: p }, { data: sl }] = await Promise.all([
      supabase.from('sessions').select('*').eq('id', id).single(),
      supabase.from('problems').select('*').eq('session_id', id).order('created_at'),
      supabase.from('strength_logs').select('*').eq('session_id', id).order('created_at'),
    ])
    setSession(s)
    setProblems(p || [])
    setStrengthLogs(sl || [])
    setLoading(false)
  }, [id])

  useEffect(() => { fetch() }, [fetch])
  return { session, problems, strengthLogs, loading, refetch: fetch }
}

export function useStats() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const [{ data: sessions }, { data: problems }, { data: strength }] = await Promise.all([
        supabase.from('sessions').select('*').order('date', { ascending: false }),
        supabase.from('problems').select('*').order('created_at', { ascending: false }),
        supabase.from('strength_logs').select('*').order('created_at', { ascending: false }),
      ])

      // Grade pyramid
      const gradeCounts = {}
      ;(problems || []).forEach(p => {
        if (!gradeCounts[p.grade]) gradeCounts[p.grade] = { attempts: 0, sent: 0 }
        gradeCounts[p.grade].attempts += p.attempts || 1
        if (p.sent) gradeCounts[p.grade].sent += 1
      })

      // Streak
      const completedDates = new Set(
        (sessions || []).filter(s => s.completed).map(s => s.date)
      )
      let streak = 0
      let d = new Date()
      while (completedDates.has(format(d, 'yyyy-MM-dd'))) {
        streak++
        d.setDate(d.getDate() - 1)
      }

      // Sessions this week
      const weekStart = new Date()
      weekStart.setDate(weekStart.getDate() - weekStart.getDay())
      const thisWeek = (sessions || []).filter(s =>
        s.completed && new Date(s.date) >= weekStart
      ).length

      // Hang time progress (last 10 dead hangs)
      const hangLogs = (strength || [])
        .filter(s => s.exercise === 'Dead Hang')
        .slice(0, 10)
        .reverse()

      setStats({ gradeCounts, streak, thisWeek, hangLogs, totalSessions: sessions?.length || 0 })
      setLoading(false)
    }
    fetch()
  }, [])

  return { stats, loading }
}
