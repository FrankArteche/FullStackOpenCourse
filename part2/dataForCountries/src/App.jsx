import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios"

function App() {
  const [countries, setCountries] = useState(0)  
  const [search, setSearch] = useState('')

  const handleSearch = (event) => {
    setSearch(event.target.value)

    axios.get(`https://studies.cs.helsinki.fi/restcountries/api/name/${event.target.value}`)
  }
  
  return (
    <>
      <div>
        find countries <input onChange={handleSearch} value={search}/>

      </div>
      
    </>
  )
}

export default App
