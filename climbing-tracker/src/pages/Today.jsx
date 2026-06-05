import { useState } from 'react'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import { WEEK_SCHEDULE, SESSION_TYPES } from '../lib/constants'
import { PROGRAM_DAYS } from '../lib/program'
import { useSessions, useStats } from '../hooks/useData'

function getThisWeekDay() {
  const d = new Date().getDay() // 0=Sun
  const idx = d === 0 ? 6 : d - 1 // Mon=0
  return WEEK_SCHEDULE[idx]
}

function getProgramDay(dayName) {
  return PROGRAM_DAYS.find(d => d.day === dayName) || null
}

function Collapsible({ title, accent, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ marginBottom: 8, background: 'var(--bg3)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '12px 14px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', cursor: 'pointer', color: 'var(--muted)',
          fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
        }}
      >
        <span style={{ color: accent || 'var(--muted)' }}>{title}</span>
        <span style={{
          fontSize: 16, transition: 'transform 0.2s',
          transform: open ? 'rotate(45deg)' : 'none',
          color: 'var(--muted)',
        }}>+</span>
      </button>
      {open && <div style={{ padding: '0 14px 14px' }}>{children}</div>}
    </div>
  )
}

export default function TodayPage() {
  const today = getThisWeekDay()
  const sessionType = SESSION_TYPES[today.type]
  const program = getProgramDay(today.day)
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
              {program && (
                <p style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                  {program.focus} · {program.duration}
                </p>
              )}
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

      {/* Today's Plan */}
      {program && today.type !== 'rest' && (
        <>
          <div className="section-header">Today's Plan</div>
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 0 }}>

            {/* Warmup */}
            {program.warmup.length > 0 && (
              <Collapsible title="Warm-Up" accent={sessionType.color}>
                <ul style={{ paddingLeft: 16, margin: 0 }}>
                  {program.warmup.map((w, i) => (
                    <li key={i} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.8 }}>{w}</li>
                  ))}
                </ul>
              </Collapsible>
            )}

            {/* Main Work */}
            {program.mainWork.map((item, i) => (
              <div
                key={i}
                style={{
                  marginBottom: 8,
                  background: 'var(--bg3)',
                  borderRadius: 'var(--radius)',
                  borderLeft: `3px solid ${sessionType.color}`,
                  padding: '12px 14px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{item.name}</div>
                  {item.sets && (
                    <span style={{
                      fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
                      color: sessionType.color, background: `${sessionType.color}15`,
                      padding: '2px 8px', borderRadius: 2, flexShrink: 0,
                    }}>{item.sets}</span>
                  )}
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.6, marginTop: 6, marginBottom: 0 }}>{item.detail}</p>
                {item.focus && (
                  <div style={{
                    marginTop: 8, padding: '6px 10px',
                    background: 'var(--bg2)', borderLeft: '2px solid var(--faint)',
                    fontSize: 12, color: '#666', fontStyle: 'italic', lineHeight: 1.6,
                  }}>
                    {item.focus}
                  </div>
                )}
              </div>
            ))}

            {/* Drills */}
            {program.drills.length > 0 && (
              <Collapsible title="Supplemental Drills" accent={sessionType.color}>
                {program.drills.map((d, i) => (
                  <div key={i} style={{ marginBottom: i < program.drills.length - 1 ? 12 : 0 }}>
                    <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{d.detail}</div>
                  </div>
                ))}
              </Collapsible>
            )}

            {/* Cooldown */}
            {program.cooldown && (
              <div style={{ marginBottom: 8, padding: '12px 14px', background: 'var(--bg3)', borderRadius: 'var(--radius)' }}>
                <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Cool-Down</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{program.cooldown}</div>
              </div>
            )}
          </div>
        </>
      )}

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
