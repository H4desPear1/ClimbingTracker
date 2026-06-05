import { Link } from 'react-router-dom'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, getDay } from 'date-fns'
import { useSessions } from '../hooks/useData'
import { SESSION_TYPES } from '../lib/constants'
import { useState } from 'react'

export default function HistoryPage() {
  const { sessions, loading } = useSessions(100)
  const [month, setMonth] = useState(new Date())

  const start = startOfMonth(month)
  const end = endOfMonth(month)
  const days = eachDayOfInterval({ start, end })

  // Pad start
  const startPad = (getDay(start) + 6) % 7 // Mon = 0
  const paddedDays = [...Array(startPad).fill(null), ...days]

  function getSessionForDate(date) {
    const str = format(date, 'yyyy-MM-dd')
    return sessions.find(s => s.date === str)
  }

  const completed = sessions.filter(s => s.completed)

  return (
    <div className="page">
      <div style={{ padding: '28px 16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
          Training History
        </div>
        <h1 style={{ fontSize: 30 }}>Your<br /><span style={{ color: 'var(--red)' }}>Journey</span></h1>
      </div>

      {/* Calendar */}
      <div style={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1))}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, padding: '4px 8px', cursor: 'pointer' }}
          >←</button>
          <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 20, letterSpacing: 1 }}>
            {format(month, 'MMMM yyyy').toUpperCase()}
          </span>
          <button
            onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1))}
            style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 20, padding: '4px 8px', cursor: 'pointer' }}
          >→</button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3, marginBottom: 4 }}>
          {['M','T','W','T','F','S','S'].map((d, i) => (
            <div key={i} style={{ textAlign: 'center', fontSize: 10, color: 'var(--muted)', letterSpacing: 1, padding: '4px 0' }}>{d}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 3 }}>
          {paddedDays.map((date, i) => {
            if (!date) return <div key={`pad-${i}`} />
            const session = getSessionForDate(date)
            const t = session ? SESSION_TYPES[session.session_type] : null
            const isToday = isSameDay(date, new Date())
            return (
              <div
                key={date.toString()}
                style={{
                  aspectRatio: '1',
                  borderRadius: 4,
                  background: session?.completed ? `${t?.color || '#e84a2e'}30` : isToday ? 'var(--bg3)' : 'transparent',
                  border: isToday ? '1px solid var(--faint)' : '1px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12,
                  color: session?.completed ? (t?.color || 'var(--red)') : 'var(--muted)',
                  fontWeight: isToday ? 600 : 400,
                }}
              >
                {format(date, 'd')}
              </div>
            )
          })}
        </div>
      </div>

      {/* Sessions List */}
      <div className="section-header">{completed.length} Sessions Logged</div>

      {loading && <div style={{ padding: 32, color: 'var(--muted)', textAlign: 'center' }}>Loading...</div>}

      <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {completed.map(s => {
          const t = SESSION_TYPES[s.session_type] || SESSION_TYPES.hard
          return (
            <Link key={s.id} to={`/session/${s.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 'var(--radius)',
                  background: `${t.color}20`, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 20, color: t.color, flexShrink: 0,
                }}>
                  {t.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{t.label}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {format(new Date(s.date + 'T12:00:00'), 'EEE MMM d')}
                    {s.duration_minutes && ` · ${s.duration_minutes}min`}
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {s.overall_feel ? (
                    <div style={{ fontSize: 13, color: t.color }}>{'★'.repeat(s.overall_feel)}</div>
                  ) : null}
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>→</div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
