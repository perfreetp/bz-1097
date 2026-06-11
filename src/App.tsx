import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Layout from '@/components/Layout'
import Inventory from '@/pages/Inventory'
import Rental from '@/pages/Rental'
import Members from '@/pages/Members'
import Settlement from '@/pages/Settlement'
import Maintenance from '@/pages/Maintenance'
import Exceptions from '@/pages/Exceptions'
import Reports from '@/pages/Reports'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/inventory" replace />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="rental" element={<Rental />} />
          <Route path="members" element={<Members />} />
          <Route path="settlement" element={<Settlement />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="exceptions" element={<Exceptions />} />
          <Route path="reports" element={<Reports />} />
          <Route path="*" element={<Navigate to="/inventory" replace />} />
        </Route>
      </Routes>
    </Router>
  )
}
