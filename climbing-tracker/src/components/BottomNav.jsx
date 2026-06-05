import { NavLink } from 'react-router-dom'

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
)
const LogIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
)
const StatsIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
  </svg>
)
const ProgramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <line x1="8" y1="14" x2="16" y2="14"/>
    <line x1="8" y1="18" x2="13" y2="18"/>
  </svg>
)

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" end className={({ isActive }) => isActive ? 'active' : ''}>
        <HomeIcon /><span>Today</span>
      </NavLink>
      <NavLink to="/log" className={({ isActive }) => isActive ? 'active' : ''}>
        <LogIcon /><span>Log</span>
      </NavLink>
      <NavLink to="/history" className={({ isActive }) => isActive ? 'active' : ''}>
        <HistoryIcon /><span>History</span>
      </NavLink>
      <NavLink to="/stats" className={({ isActive }) => isActive ? 'active' : ''}>
        <StatsIcon /><span>Stats</span>
      </NavLink>
      <NavLink to="/program" className={({ isActive }) => isActive ? 'active' : ''}>
        <ProgramIcon /><span>Program</span>
      </NavLink>
    </nav>
  )
}
