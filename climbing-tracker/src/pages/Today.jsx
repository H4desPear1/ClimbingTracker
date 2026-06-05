import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { format, isToday } from 'date-fns'
import { supabase } from '../lib/supabase'
import { WEEK_SCHEDULE, SESSION_TYPES } from '../lib/constants'
import { useSessions, useStats } from '../hooks/useData'

function getThisWeekDay() {
  const d = new Date().getDay() // 0=Sun
  const idx = d === 0 ? 6 : d - 1 // Mon=0
  return WEEK_SCHEDULE[idx]
}

export default function TodayPage() {
  const today = getThisWeekDay()
  const sessionType = SESSION_TYPES[today.type]
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const { sessions } = useSessions(14)
  const { stats } = useStats()

  const todaySession = sessions.find(s => s.date === todayStr)

  const weekDays = WEEK_SCHEDULE.map((d, i) => {
    const date = new Date()
    const currentDay = date.getDay() === 0 ? 6 : date.getDay() - 1
    const diff = i - currentDay
    const dayDate = new Date()
    dayDate.setDate(date.getDate() + diff)
    const dateStr = format(dayDate, 'yyyy-MM-dd')
    const session = sessions.find(s => s.date === dateStr)
    return { ...d, dateStr, session, isToday: diff === 0 }
  })

  return (
    <div className="page">
      {/* Header */}
      <div style={{ padding: '32px 16px 0', borderBottom: '1px solid var(--border)', paddingBottom: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
          {format(new Date(), 'EEEE, MMMM d')}
        </div>
        <h1 style={{ fontSize: 36, lineHeight: 1 }}>Today's<br />
          <span style={{ color: sessionType.color }}>Session</span>
        </h1>
      </div>

      {/* Today Card */}
      <div style={{ padding: '16px' }}>
        <div className="card" style={{ borderLeft: `3px solid ${sessionType.color}`, position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <span className="tag" style={{ background: `${sessionType.color}20`, color: sessionType.color, marginBottom: 10, display: 'inline-block' }}>
                {today.type}
              </span>
              <h2 style={{ fontSize: 28, lineHeight: 1.1 }}>{sessionType.label}</h2>
              <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 6 }}>{today.day}</p>
            </div>
            <div style={{ fontSize: 40, opacity: 0.3 }}>{sessionType.icon}</div>
          </div>

          {todaySession?.completed ? (
            <div style={{ marginTop: 16, padding: '10px 14px', background: '#6a994e20', borderRadius: 'var(--radius)', color: '#6a994e', fontSize: 13 }}>
              ✓ Session logged — great work
            </div>
          ) : (
            <Link
              to={`/log?type=${today.type}&day=${today.day}`}
              className="btn btn-primary btn-full"
              style={{ marginTop: 16, textDecoration: 'none' }}
            >
              Log This Session
            </Link>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      {stats && (
        <div style={{ padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[
              { label: 'Streak', value: `${stats.streak}d`, color: 'var(--red)' },
              { label: 'This Week', value: `${stats.thisWeek}/6`, color: 'var(--teal)' },
              { label: 'Total', value: stats.totalSessions, color: 'var(--gold)' },
            ].map(({ label, value, color }) => (
              <div key={label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color }}>{value}</div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--muted)', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Week Strip */}
      <div className="section-header">This Week</div>
      <div style={{ padding: '0 16px', display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
        {weekDays.map((d) => {
          const t = SESSION_TYPES[d.type]
          const done = d.session?.completed
          const past = new Date(d.dateStr) < new Date(format(new Date(), 'yyyy-MM-dd'))
          return (
            <div
              key={d.day}
              style={{
                background: d.isToday ? `${t.color}20` : 'var(--bg2)',
                border: `1px solid ${d.isToday ? t.color : 'var(--border)'}`,
                borderRadius: 'var(--radius)',
                padding: '8px 4px',
                textAlign: 'center',
              }}
            >
              <div style={{ fontSize: 9, letterSpacing: 1, color: d.isToday ? t.color : 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>
                {d.day.slice(0, 2)}
              </div>
              <div style={{ fontSize: 16 }}>
                {done ? '✓' : past && d.type !== 'rest' ? '·' : t.icon}
              </div>
              <div style={{ fontSize: 9, color: done ? '#6a994e' : past && d.type !== 'rest' ? '#e84a2e' : 'var(--muted)', marginTop: 3 }}>
                {done ? 'done' : past && d.type !== 'rest' ? 'miss' : ''}
              </div>
            </div>
          )
        })}
      </div>

      {/* Recent Sessions */}
      {sessions.filter(s => s.completed).length > 0 && (
        <>
          <div className="section-header">Recent Sessions</div>
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {sessions.filter(s => s.completed).slice(0, 4).map(s => {
              const t = SESSION_TYPES[s.session_type] || SESSION_TYPES.hard
              return (
                <Link key={s.id} to={`/session/${s.id}`} style={{ textDecoration: 'none' }}>
                  <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ width: 36, height: 36, background: `${t.color}20`, borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, color: t.color, flexShrink: 0 }}>
                      {t.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 500 }}>{t.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{format(new Date(s.date + 'T12:00:00'), 'MMM d')}</div>
                    </div>
                    {s.overall_feel && (
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                        {'★'.repeat(s.overall_feel)}{'☆'.repeat(5 - s.overall_feel)}
                      </div>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
