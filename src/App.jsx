import { Route, Routes } from 'react-router-dom'
import './App.css'
import PollList from './pages/PollList'
import PollPage from './pages/PollPage'

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<PollList />} />
        <Route path="/polls/:id" element={<PollPage />} />
      </Routes>
    </>
  )
}

export default App
