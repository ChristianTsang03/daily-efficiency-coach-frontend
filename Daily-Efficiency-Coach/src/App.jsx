import { Routes, Route } from "react-router-dom"
import { LoginPage, SignupPage, DashboardPage, AnalyticsPage } from './pages'

function App() {
  return (
    <Routes>
      <Route index element={<LoginPage />} />
      <Route path="signup" element={<SignupPage />} />
      <Route path="dashboard" element={<DashboardPage/>} />
      <Route path="analytics" element={<AnalyticsPage/>} />
    </Routes>
  )
}
export default App