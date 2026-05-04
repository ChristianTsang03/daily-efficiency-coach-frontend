import { Routes, Route, Navigate } from "react-router-dom"
import { LoginPage, SignupPage, DashboardPage, AnalyticsPage, HomePage, InsightsPage} from './pages'

function ProtectedRoute({ children }) {
    const token = localStorage.getItem('token');
    return token ? children : <Navigate to="/" replace />;
}

function App() {
    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="signup" element={<SignupPage />} />
            <Route path="dashboard" element={
                <ProtectedRoute>
                    <DashboardPage />
                </ProtectedRoute>
            } />
            <Route path="analytics" element={
                <ProtectedRoute>
                    <AnalyticsPage />
                </ProtectedRoute>
            } />
            <Route path="insights" element={
                <ProtectedRoute>
                    <InsightsPage />
                </ProtectedRoute>
            } />

        </Routes>
    );
}

export default App