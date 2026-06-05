import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import BottomNav from './components/BottomNav'
import TodayPage from './pages/Today'
import LogPage from './pages/Log'
import HistoryPage from './pages/History'
import StatsPage from './pages/Stats'
import SessionDetail from './pages/SessionDetail'

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: 480, margin: '0 auto', position: 'relative', minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<TodayPage />} />
          <Route path="/log" element={<LogPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/session/:id" element={<SessionDetail />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
console.log(import.meta.env.VITE_SUPABASE_URL)
