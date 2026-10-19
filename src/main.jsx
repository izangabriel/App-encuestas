import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { PollProvider } from './contexts/PollContext.jsx'
import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PollProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PollProvider>
  </StrictMode>,
)
