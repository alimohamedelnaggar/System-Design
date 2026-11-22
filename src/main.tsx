import { MotionConfig } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { ProgressProvider } from './features/progress'
import './styles/index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <ProgressProvider>
          <App />
        </ProgressProvider>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
