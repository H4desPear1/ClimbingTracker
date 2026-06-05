import { useStats } from '../hooks/useData'
import { GRADES } from '../lib/constants'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', padding: '8px 12px', borderRadius: 6, fontSize: 12 }}>
      <div style={{ color: 'var(--muted)', marginBottom: 4 }}>{label}</div>
      {payload.map(p => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey}: {p.value}
        </div>
      ))}
    </div>
  )
}

export default function StatsPage() {
  const { stats, loading } = useStats()

  if (loading) return <div style={{ padding: 32, color: 'var(--muted)', textAlign: 'center' }}>Loading stats...</div>
  if (!stats) return null

  // Build grade pyramid data
  const pyramidData = GRADES
    .map(g => ({
      grade: g,
      attempts: stats.gradeCounts[g]?.attempts || 0,
      sent: stats.gradeCounts[g]?.sent || 0,
    }))
    .filter(d => d.attempts > 0)

  const hangData = stats.hangLogs.map((l, i) => ({
    session: `#${i + 1}`,
    seconds: l.hang_seconds || 0,
    edge: l.edge_mm || 20,
  }))

  return (
    <div className="page">
      <div style={{ padding: '28px 16px 20px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ fontSize: 11, letterSpacing: 3, color: 'var(--muted)', textTransform: 'uppercase', marginBottom: 8 }}>
          Training Analytics
        </div>
        <h1 style={{ fontSize: 30 }}>Your<br /><span style={{ color: 'var(--red)' }}>Progress</span></h1>
      </div>

      {/* Overview */}
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {[
            { label: 'Current Streak', value: `${stats.streak} days`, color: 'var(--red)' },
            { label: 'This Week', value: `${stats.thisWeek} / 6`, color: 'var(--teal)' },
            { label: 'Total Sessions', value: stats.totalSessions, color: 'var(--gold)' },
            { label: 'Problems Logged', value: Object.values(stats.gradeCounts).reduce((a, b) => a + b.attempts, 0), color: 'var(--blue)' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card" style={{ textAlign: 'center', padding: '18px 12px' }}>
              <div style={{ fontSize: 28, fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: 10, letterSpacing: 2, color: 'var(--muted)', textTransform: 'uppercase', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Grade Pyramid */}
      {pyramidData.length > 0 && (
        <>
          <div className="section-header">Grade Pyramid</div>
          <div style={{ padding: '0 16px' }}>
            <div className="card">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={pyramidData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                  <XAxis dataKey="grade" stroke="#444" tick={{ fill: '#666', fontSize: 11 }} />
                  <YAxis stroke="#444" tick={{ fill: '#666', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="attempts" fill="#333" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="sent" fill="#2a9d8f" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
                <div style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, background: '#333', display: 'inline-block', borderRadius: 2 }} />
                  Attempts
                </div>
                <div style={{ fontSize: 11, color: '#2a9d8f', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, background: '#2a9d8f', display: 'inline-block', borderRadius: 2 }} />
                  Sent
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Send Rate by Grade */}
      {pyramidData.length > 0 && (
        <>
          <div className="section-header">Send Rate by Grade</div>
          <div style={{ padding: '0 16px', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pyramidData.reverse().map(({ grade, attempts, sent }) => {
              const rate = attempts > 0 ? Math.round((sent / attempts) * 100) : 0
              return (
                <div key={grade} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 18, fontWeight: 600 }}>{grade}</span>
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{sent}/{attempts} sent · {rate}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${rate}%`, background: rate >= 75 ? 'var(--teal)' : rate >= 40 ? 'var(--gold)' : 'var(--red)', borderRadius: 2, transition: 'width 0.6s' }} />
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}

      {/* Hang Progress */}
      {hangData.length > 1 && (
        <>
          <div className="section-header">Dead Hang Progress</div>
          <div style={{ padding: '0 16px' }}>
            <div className="card">
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 12 }}>Hang duration over last {hangData.length} logs</div>
              <ResponsiveContainer width="100%" height={160}>
                <LineChart data={hangData} margin={{ top: 4, right: 4, bottom: 4, left: -20 }}>
                  <XAxis dataKey="session" stroke="#444" tick={{ fill: '#666', fontSize: 11 }} />
                  <YAxis stroke="#444" tick={{ fill: '#666', fontSize: 11 }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="seconds" stroke="var(--red)" strokeWidth={2} dot={{ fill: 'var(--red)', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </>
      )}

      {pyramidData.length === 0 && hangData.length === 0 && (
        <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>◌</div>
          <div style={{ fontSize: 16 }}>Log some sessions to see your stats</div>
        </div>
      )}

      <div style={{ height: 20 }} />
    </div>
  )
}
