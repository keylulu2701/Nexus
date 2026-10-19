import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from './layout/AppShell'
import { Einstellungen } from './pages/Einstellungen'
import { Ideen } from './pages/Ideen'
import { KiArbeitsbereich } from './pages/KiArbeitsbereich'
import { Projekte } from './pages/Projekte'
import { Uebersicht } from './pages/Uebersicht'

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Uebersicht />} />
        <Route path="projekte" element={<Projekte />} />
        <Route path="ki" element={<KiArbeitsbereich />} />
        <Route path="ideen" element={<Ideen />} />
        <Route path="einstellungen" element={<Einstellungen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App