import { useParams, Link } from 'react-router-dom'
import { format } from 'date-fns'
import { useSession } from '../hooks/useData'
import { SESSION_TYPES } from '../lib/constants'

export default function SessionDetail() {
  const { id } = useParams()
  const { session, problems, strengthLogs, loading } = useSession(id)

  if (loading) return <div style={{ padding: 32, color: 'var(--muted)', textAlign: 'center' }}>Loading...</div>
  if (!session) return <div style={{ padding: 32, color: 'var(--muted)', textAlign: 'center' }}>Session not found</div>

  const t = SESSION_TYPES[session.session_type] || SESSION_TYPES.hard
  const sent = problems.filter(p => p.sent)

  return (
    <div className="page">
      <div style={{ padding: '28px 16px 20px', borderBottom: '1px solid var(--border)' }}>
        <Link to="/history" style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none', letterSpacing: 1 }}>
          ← Back
        </Link>
        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <span className="tag" style={{ background: `${t.color}20`, color: t.color, marginBottom: 8, display: 'inline-block' }}>
              {session.session_type}
            </span>
            <h1 style={{ fontSize: 28 }}>{t.label}</h1>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginTop: 4 }}>
              {format(new Date(session.date + 'T12:00:00'), 'EEEE, MMMM d yyyy')}
            </p>
          </div>
          <div style={{ fontSize: 36, opacity: 0.3 }}>{t.icon}</div>
        </div>
      </div>

      {/* Session Stats */}
      <div style={{ padding: 16 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
          {[
            { label: 'Duration', value: session.duration_minutes ? `${session.duration_minutes}m` : '—' },
            { label: 'Feel', value: session.overall_feel ? '★'.repeat(session.overall_feel) : '—' },
            { label: 'Energy', value: session.energy ? '★'.repeat(session.energy) : '—' },
          ].map(({ label, value }) => (
            <div key={label} className="card" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, color: t.color, fontFamily: "'Barlow Condensed', sans-serif" }}>{value}</div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--muted)', textTransform: 'uppercase', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        {session.notes && (
          <div className="card" style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>Notes</div>
            <p style={{ fontSize: 14, lineHeight: 1.7, color: '#ccc' }}>{session.notes}</p>
          </div>
        )}
      </div>

      {/* Problems */}
      {problems.length > 0 && (
        <>
          <div className="section-header">
            Problems — {sent.length}/{problems.length} sent
          </div>
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {problems.map(p => (
              <div key={p.id} className="card" style={{
                display: 'flex', alignItems: 'center', gap: 12,
                borderLeft: `3px solid ${p.sent ? 'var(--teal)' : 'var(--faint)'}`,
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 'var(--radius)',
                  background: p.sent ? 'var(--teal)20' : 'var(--bg3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700,
                  fontSize: 16, color: p.sent ? 'var(--teal)' : 'var(--muted)',
                  flexShrink: 0,
                }}>
                  {p.grade}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14 }}>{p.board}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {p.attempts} attempt{p.attempts !== 1 ? 's' : ''} · {p.sent ? 'Sent ✓' : 'Not sent'}
                  </div>
                  {p.notes && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2, fontStyle: 'italic' }}>{p.notes}</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Strength */}
      {strengthLogs.length > 0 && (
        <>
          <div className="section-header">Strength Work</div>
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {strengthLogs.map(l => (
              <div key={l.id} className="card">
                <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 4 }}>{l.exercise}</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                  {l.sets && `${l.sets} sets`}
                  {l.reps && ` × ${l.reps} reps`}
                  {l.hang_seconds && ` · ${l.hang_seconds}s hang`}
                  {l.edge_mm && ` on ${l.edge_mm}mm`}
                </div>
                {l.notes && <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4, fontStyle: 'italic' }}>{l.notes}</div>}
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ padding: 16 }}>
        <Link to="/log" className="btn btn-ghost btn-full" style={{ textDecoration: 'none', marginTop: 8, display: 'flex' }}>
          Log Another Session
        </Link>
      </div>
    </div>
  )
}
