import { Navigate, Route, Routes } from 'react-router-dom'
import SplashOverlay from './components/SplashOverlay'
import LoginPage from './pages/LoginPage'
import OAuthCallbackPage from './pages/OAuthCallbackPage'
import SignUpPage from './pages/SignUpPage'
import ProcedureChoicePage from './procedurepages/choice'
import CosmeticPage from './procedurepages/cosmetic'
import AnalyzingPage from './procedurepages/loading'
import SkinTypePage from './procedurepages/skintype'
import SkinTypeTestPage from './procedurepages/skintypetest'
import ProcedureStartPage from './procedurepages/start'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/auth/:provider/callback" element={<OAuthCallbackPage />} />
        <Route path="/procedurepages/start" element={<ProcedureStartPage />} />
        <Route path="/procedurepages/skintype" element={<SkinTypePage />} />
        <Route
          path="/procedurepages/skintype/test"
          element={<SkinTypeTestPage />}
        />
        <Route path="/procedurepages/choice" element={<ProcedureChoicePage />} />
        <Route
          path="/procedurepages/cosmetic"
          element={<CosmeticPage />}
        />
        <Route path="/procedurepages/loading" element={<AnalyzingPage />} />
        {/* 없는 주소는 빈 화면 대신 로그인으로 보낸다 */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <SplashOverlay />
    </>
  )
}

export default App
