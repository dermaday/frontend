import { Navigate, Route, Routes } from 'react-router-dom'
import SplashOverlay from './components/SplashOverlay'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
      </Routes>
      <SplashOverlay />
    </>
  )
}

export default App
