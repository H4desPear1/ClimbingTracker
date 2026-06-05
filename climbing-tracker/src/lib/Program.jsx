import { useState } from 'react'
import { PROGRAM_DAYS, PRINCIPLES } from '../lib/program'
import { SESSION_TYPES } from '../lib/constants'

function Collapsible({ title, children, open, onToggle, accent }) {
  return (
    <div style={{ marginBottom: 8, background: 'var(--bg3)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', background: 'none', border: 'none',
          padding: '12px 14px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', cursor: 'pointer',
          fontSize: 10, letterSpacing: 3, textTransform: 'uppercase',
          color: accent || 'var(--muted)',
        }}
      >
        <span>{title}</span>
        <span style={{
          fontSize: 16, color: 'var(--muted)', transition: 'transform 0.2s',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </button>
      {open && <div style={{ padding: '0 14px 14px' }}>{children}</div>}
    </div>
  )
}

export default function ProgramPage() {
  const [selectedDay, setSelectedDay] = useState(() => {
    const d = new Date().getDay()
    return d === 0 ? 6 : d - 1
  })
  const [expandedSection, setExpandedSection] = useState(null)

  const day = PROGRAM_DAYS[selectedDay]
  const sessionType = SESSION_TYPES[day.type]

  function toggle(key) {
    setExpandedSection(s => s === key ? null : key)
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{ padding: '32px 16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
          6-Day Training Program
        </div>
        <h1 style={{ fontSize: 36, lineHeight: 1.05 }}>
          V5 → V7+<br />
          <span style={{ color: 'var(--red)' }}>Program</span>
        </h1>
        <p style={{ color: 'var(--muted)', marginTop: 10, fontSize: 13, lineHeight: 1.6 }}>
          Body tension, footwork, and tendon-safe progression.
        </p>
        <div style={{ display: 'flex', gap: 20, marginTop: 14, flexWrap: 'wrap' }}>
          {[['Focus', 'Body Tension + Footwork'], ['Timeline', 'V6–V7 in 3–4 months']].map(([k, v]) => (
            <div key={k}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--muted)', textTransform: 'uppercase' }}>{k}</div>
              <div style={{ fontSize: 13, color: 'var(--text)', marginTop: 2 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Day Selector */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
        borderBottom: '1px solid var(--border)',
      }}>
        {PROGRAM_DAYS.map((d, i) => {
          const t = SESSION_TYPES[d.type]
          return (
            <button
              key={d.day}
              onClick={() => { setSelectedDay(i); setExpandedSection(null) }}
              style={{
                background: selectedDay === i ? 'var(--bg3)' : 'transparent',
                border: 'none',
                borderBottom: selectedDay === i ? `2px solid ${t.color}` : '2px solid transparent',
                color: selectedDay === i ? 'var(--text)' : 'var(--muted)',
                padding: '14px 4px',
                cursor: 'pointer',
                fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ fontSize: 16, marginBottom: 4 }}>{t.icon}</div>
              <div>{d.day.slice(0, 3)}</div>
            </button>
          )
        })}
      </div>

      {/* Day Content */}
      <div style={{ padding: '24px 16px 0' }}>
        {/* Day Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: 3, color: sessionType.color, textTransform: 'uppercase', marginBottom: 6 }}>
              {day.day} · {day.type}
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 600, margin: 0 }}>{day.label}</h2>
            <div style={{ color: 'var(--muted)', marginTop: 4, fontSize: 13 }}>{day.focus}</div>
          </div>
          <div style={{
            background: 'var(--bg3)', border: `1px solid ${sessionType.color}33`,
            borderRadius: 'var(--radius)', padding: '8px 14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--muted)', textTransform: 'uppercase' }}>Duration</div>
            <div style={{ fontSize: 18, color: sessionType.color, marginTop: 2, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 600 }}>{day.duration}</div>
          </div>
        </div>

        {/* Warmup */}
        {day.warmup.length > 0 && (
          <Collapsible
            title="Warm-Up"
            accent={sessionType.color}
            open={expandedSection === 'warmup'}
            onToggle={() => toggle('warmup')}
          >
            <ul style={{ margin: 0, paddingLeft: 16 }}>
              {day.warmup.map((w, i) => (
                <li key={i} style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.8 }}>{w}</li>
              ))}
            </ul>
          </Collapsible>
        )}

        {/* Main Work */}
        {day.mainWork.map((item, i) => (
          <div
            key={i}
            style={{
              borderLeft: `3px solid ${sessionType.color}`,
              paddingLeft: 14, marginBottom: 16,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0 }}>{item.name}</h3>
              {item.sets && (
                <span style={{
                  fontSize: 10, letterSpacing: 1, textTransform: 'uppercase',
                  color: sessionType.color, background: `${sessionType.color}15`,
                  padding: '2px 8px', borderRadius: 2,
                }}>{item.sets}</span>
              )}
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 13, lineHeight: 1.7, marginTop: 6, marginBottom: 6 }}>{item.detail}</p>
            {item.focus && (
              <div style={{
                background: 'var(--bg3)', borderLeft: '2px solid var(--faint)',
                padding: '7px 10px', fontSize: 12, color: '#666',
                fontStyle: 'italic', lineHeight: 1.6,
              }}>
                {item.focus}
              </div>
            )}
          </div>
        ))}

        {/* Drills */}
        {day.drills.length > 0 && (
          <Collapsible
            title="Supplemental Drills"
            open={expandedSection === 'drills'}
            onToggle={() => toggle('drills')}
          >
            {day.drills.map((d, i) => (
              <div key={i} style={{ marginBottom: i < day.drills.length - 1 ? 12 : 0 }}>
                <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{d.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3 }}>{d.detail}</div>
              </div>
            ))}
          </Collapsible>
        )}

        {/* Cooldown */}
        {day.cooldown && (
          <div style={{ marginBottom: 24, padding: '12px 14px', background: 'var(--bg3)', borderRadius: 'var(--radius)' }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Cool-Down</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{day.cooldown}</div>
          </div>
        )}
      </div>

      {/* Principles */}
      <div style={{ padding: '0 16px' }}>
        <div className="section-header" style={{ paddingLeft: 0 }}>Core Principles</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 16 }}>
          {PRINCIPLES.map((p, i) => (
            <div
              key={i}
              style={{
                background: 'var(--bg2)', border: '1px solid var(--border)',
                padding: '14px 16px', borderRadius: 'var(--radius)',
              }}
            >
              <div style={{ fontSize: 13, color: 'var(--text)', marginBottom: 6, fontWeight: 600 }}>{p.title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>{p.body}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
