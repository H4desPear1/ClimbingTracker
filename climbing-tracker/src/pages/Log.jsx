import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { format } from 'date-fns'
import { supabase } from '../lib/supabase'
import { GRADES, BOARDS, SESSION_TYPES, STRENGTH_EXERCISES } from '../lib/constants'
import { PROGRAM_DAYS } from '../lib/program'

function StarRating({ value, onChange, label }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <div className="stars">
        {[1, 2, 3, 4, 5].map(n => (
          <button
            key={n}
            type="button"
            className={`star ${n <= value ? 'active' : ''}`}
            onClick={() => onChange(n)}
          >
            {n <= value ? '★' : '☆'}
          </button>
        ))}
      </div>
    </div>
  )
}

function ProblemRow({ problem, onUpdate, onRemove }) {
  return (
    <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 10 }}>
      <div className="form-row" style={{ marginBottom: 10 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Grade</label>
          <select value={problem.grade} onChange={e => onUpdate({ ...problem, grade: e.target.value })}>
            {GRADES.map(g => <option key={g}>{g}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Board</label>
          <select value={problem.board} onChange={e => onUpdate({ ...problem, board: e.target.value })}>
            {BOARDS.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>
      </div>
      <div className="form-row" style={{ marginBottom: 10 }}>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Attempts</label>
          <input
            type="number" min="1"
            value={problem.attempts}
            onChange={e => onUpdate({ ...problem, attempts: parseInt(e.target.value) || 1 })}
          />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Sent?</label>
          <button
            type="button"
            style={{
              width: '100%', padding: '10px', borderRadius: 'var(--radius)',
              border: `1px solid ${problem.sent ? 'var(--teal)' : 'var(--border)'}`,
              background: problem.sent ? 'var(--teal)20' : 'var(--bg3)',
              color: problem.sent ? 'var(--teal)' : 'var(--muted)',
              fontSize: 14, cursor: 'pointer',
            }}
            onClick={() => onUpdate({ ...problem, sent: !problem.sent })}
          >
            {problem.sent ? '✓ Sent' : 'Not yet'}
          </button>
        </div>
      </div>
      <input
        placeholder="Notes (optional)"
        value={problem.notes || ''}
        onChange={e => onUpdate({ ...problem, notes: e.target.value })}
        style={{ marginBottom: 8 }}
      />
      <button type="button" onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, padding: 0 }}>
        Remove
      </button>
    </div>
  )
}

function StrengthRow({ log, onUpdate, onRemove }) {
  return (
    <div style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: 12, marginBottom: 10 }}>
      <div className="form-group">
        <label>Exercise</label>
        <select value={log.exercise} onChange={e => onUpdate({ ...log, exercise: e.target.value })}>
          {STRENGTH_EXERCISES.map(e => <option key={e}>{e}</option>)}
        </select>
      </div>
      <div className="form-row">
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Sets</label>
          <input type="number" min="1" value={log.sets || ''} onChange={e => onUpdate({ ...log, sets: parseInt(e.target.value) || null })} />
        </div>
        <div className="form-group" style={{ marginBottom: 0 }}>
          <label>Reps</label>
          <input type="number" min="1" value={log.reps || ''} onChange={e => onUpdate({ ...log, reps: parseInt(e.target.value) || null })} />
        </div>
      </div>
      {(log.exercise === 'Dead Hang' || log.exercise === 'One-Arm Hang') && (
        <div className="form-row" style={{ marginTop: 10 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Hang Seconds</label>
            <input type="number" min="1" value={log.hang_seconds || ''} onChange={e => onUpdate({ ...log, hang_seconds: parseInt(e.target.value) || null })} />
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label>Edge (mm)</label>
            <input type="number" min="5" value={log.edge_mm || ''} onChange={e => onUpdate({ ...log, edge_mm: parseInt(e.target.value) || null })} />
          </div>
        </div>
      )}
      <input
        placeholder="Notes (optional)"
        value={log.notes || ''}
        onChange={e => onUpdate({ ...log, notes: e.target.value })}
        style={{ marginTop: 10 }}
      />
      <button type="button" onClick={onRemove} style={{ background: 'none', border: 'none', color: 'var(--muted)', fontSize: 12, padding: 0, marginTop: 8 }}>
        Remove
      </button>
    </div>
  )
}

function PlanReference({ program, sessionType }) {
  const [open, setOpen] = useState(false)
  if (!program) return null

  return (
    <div style={{ marginBottom: 16, borderRadius: 'var(--radius)', border: `1px solid ${sessionType.color}33`, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', background: `${sessionType.color}0d`, border: 'none',
          padding: '12px 14px', display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 18, color: sessionType.color }}>{sessionType.icon}</span>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: sessionType.color, letterSpacing: 0.5 }}>
              Today's Plan
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 1 }}>
              {program.focus} · {program.duration}
            </div>
          </div>
        </div>
        <span style={{
          fontSize: 16, color: 'var(--muted)', transition: 'transform 0.2s',
          transform: open ? 'rotate(45deg)' : 'none',
        }}>+</span>
      </button>

      {open && (
        <div style={{ padding: '0 14px 14px', background: 'var(--bg2)' }}>
          {/* Warmup */}
          {program.warmup.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Warm-Up</div>
              <ul style={{ paddingLeft: 16, margin: 0 }}>
                {program.warmup.map((w, i) => (
                  <li key={i} style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.8 }}>{w}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Work */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Main Work</div>
            {program.mainWork.map((item, i) => (
              <div key={i} style={{
                borderLeft: `2px solid ${sessionType.color}`,
                paddingLeft: 10, marginBottom: 10,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{item.name}</div>
                  {item.sets && (
                    <span style={{
                      fontSize: 10, color: sessionType.color, background: `${sessionType.color}15`,
                      padding: '1px 6px', borderRadius: 2, flexShrink: 0, letterSpacing: 0.5,
                    }}>{item.sets}</span>
                  )}
                </div>
                <p style={{ color: 'var(--muted)', fontSize: 12, lineHeight: 1.6, marginTop: 4, marginBottom: 0 }}>{item.detail}</p>
                {item.focus && (
                  <div style={{ marginTop: 5, fontSize: 11, color: '#555', fontStyle: 'italic', lineHeight: 1.5 }}>
                    → {item.focus}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Drills */}
          {program.drills.length > 0 && (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 6 }}>Drills</div>
              {program.drills.map((d, i) => (
                <div key={i} style={{ marginBottom: 6 }}>
                  <div style={{ fontSize: 12, color: 'var(--text)', fontWeight: 500 }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{d.detail}</div>
                </div>
              ))}
            </div>
          )}

          {/* Cooldown */}
          {program.cooldown && (
            <div style={{ marginTop: 10, padding: '8px 10px', background: 'var(--bg3)', borderRadius: 4 }}>
              <div style={{ fontSize: 10, letterSpacing: 3, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 4 }}>Cool-Down</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{program.cooldown}</div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

const newProblem = () => ({ id: Date.now(), grade: 'V4', board: 'Main Wall', attempts: 1, sent: false, notes: '' })
const newStrength = () => ({ id: Date.now(), exercise: 'Dead Hang', sets: 5, reps: null, hang_seconds: 10, edge_mm: 20, notes: '' })

export default function LogPage() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [saving, setSaving] = useState(false)
  const [tab, setTab] = useState('session')

  const dayName = params.get('day') || ''
  const sessionTypeKey = params.get('type') || 'hard'
  const program = PROGRAM_DAYS.find(d => d.day === dayName) || null
  const sessionType = SESSION_TYPES[sessionTypeKey]

  const [form, setForm] = useState({
    date: format(new Date(), 'yyyy-MM-dd'),
    day_name: dayName,
    session_type: sessionTypeKey,
    overall_feel: 0,
    energy: 0,
    duration_minutes: '',
    notes: '',
  })

  const [problems, setProblems] = useState([])
  const [strengthLogs, setStrengthLogs] = useState([])

  async function handleSave() {
    setSaving(true)
    try {
      const { data: session, error } = await supabase.from('sessions').insert({
        date: form.date,
        day_name: form.day_name,
        session_type: form.session_type,
        completed: true,
        overall_feel: form.overall_feel || null,
        energy: form.energy || null,
        duration_minutes: form.duration_minutes ? parseInt(form.duration_minutes) : null,
        notes: form.notes || null,
      }).select().single()

      if (error) throw error

      if (problems.length > 0) {
        await supabase.from('problems').insert(
          problems.map(({ id, ...p }) => ({ ...p, session_id: session.id }))
        )
      }

      if (strengthLogs.length > 0) {
        await supabase.from('strength_logs').insert(
          strengthLogs.map(({ id, ...l }) => ({ ...l, session_id: session.id }))
        )
      }

      navigate(`/session/${session.id}`)
    } catch (e) {
      alert('Error saving: ' + e.message)
    }
    setSaving(false)
  }

  const currentSessionType = SESSION_TYPES[form.session_type]
  const tabs = ['session', 'problems', 'strength']

  return (
    <div className="page">
      <div style={{ padding: '28px 16px 0', borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: currentSessionType?.color, textTransform: 'uppercase', marginBottom: 6 }}>
          Log Session
        </div>
        <h1 style={{ fontSize: 30 }}>Record<br />Your Work</h1>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {tabs.map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              flex: 1, padding: '12px 4px', background: 'none',
              border: 'none', borderBottom: tab === t ? `2px solid var(--red)` : '2px solid transparent',
              color: tab === t ? 'var(--text)' : 'var(--muted)',
              fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
              marginBottom: -1,
            }}
          >
            {t === 'session' ? 'Session' : t === 'problems' ? `Problems (${problems.length})` : `Strength (${strengthLogs.length})`}
          </button>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {/* Plan reference — shown on all tabs */}
        <PlanReference program={program} sessionType={sessionType || currentSessionType} />

        {/* Session Tab */}
        {tab === 'session' && (
          <>
            <div className="form-row">
              <div className="form-group">
                <label>Date</label>
                <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
              </div>
              <div className="form-group">
                <label>Duration (min)</label>
                <input type="number" placeholder="90" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} />
              </div>
            </div>

            <div className="form-group">
              <label>Session Type</label>
              <select value={form.session_type} onChange={e => setForm({ ...form, session_type: e.target.value })}>
                {Object.entries(SESSION_TYPES).map(([k, v]) => (
                  <option key={k} value={k}>{v.label}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Day</label>
              <input placeholder="Monday" value={form.day_name} onChange={e => setForm({ ...form, day_name: e.target.value })} />
            </div>

            <StarRating label="Overall Feel" value={form.overall_feel} onChange={v => setForm({ ...form, overall_feel: v })} />
            <StarRating label="Energy Level" value={form.energy} onChange={v => setForm({ ...form, energy: v })} />

            <div className="form-group">
              <label>Notes</label>
              <textarea
                rows={4} placeholder="How'd it go? Any breakthroughs, struggles, things to remember..."
                value={form.notes}
                onChange={e => setForm({ ...form, notes: e.target.value })}
                style={{ resize: 'vertical' }}
              />
            </div>
          </>
        )}

        {/* Problems Tab */}
        {tab === 'problems' && (
          <>
            {problems.map((p, i) => (
              <ProblemRow
                key={p.id}
                problem={p}
                onUpdate={updated => setProblems(problems.map((x, j) => j === i ? updated : x))}
                onRemove={() => setProblems(problems.filter((_, j) => j !== i))}
              />
            ))}
            <button
              type="button"
              className="btn btn-ghost btn-full"
              onClick={() => setProblems([...problems, newProblem()])}
              style={{ marginBottom: 8 }}
            >
              + Add Problem
            </button>
          </>
        )}

        {/* Strength Tab */}
        {tab === 'strength' && (
          <>
            {strengthLogs.map((l, i) => (
              <StrengthRow
                key={l.id}
                log={l}
                onUpdate={updated => setStrengthLogs(strengthLogs.map((x, j) => j === i ? updated : x))}
                onRemove={() => setStrengthLogs(strengthLogs.filter((_, j) => j !== i))}
              />
            ))}
            <button
              type="button"
              className="btn btn-ghost btn-full"
              onClick={() => setStrengthLogs([...strengthLogs, newStrength()])}
              style={{ marginBottom: 8 }}
            >
              + Add Exercise
            </button>
          </>
        )}

        <button
          className="btn btn-primary btn-full"
          style={{ marginTop: 16 }}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Saving...' : 'Save Session'}
        </button>
      </div>
    </div>
  )
}
