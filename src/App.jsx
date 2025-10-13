import { useState } from 'react'
import './App.css'
import AlphaWellPlatform from './components/alphawell-platform'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <AlphaWellPlatform/>
    </>
  )
}

export default App
