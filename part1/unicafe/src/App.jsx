import { useState } from 'react'

const Button = ({onClick, text}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <p>{text}: {value}</p>
  )
}

const Statistics = ({good,neutral,bad}) => {
  if(good+neutral+bad > 0){
    return (
      <div>
          <h1>statistics</h1>
          <StatisticLine text={"good: "} value={good}/>
          <StatisticLine text={"neutral: "} value={neutral}/>
          <StatisticLine text={"bad: "} value={bad}/>
          <StatisticLine text={"all: "} value={good+neutral+bad}/>
          <StatisticLine text={"average: "} value={(good-bad)/(good+neutral+bad)}/>
          <StatisticLine text={"positive: "} value={good/(good+neutral+bad)*100 + " %"}/>
        </div>
    )
  } else return (
    <div>
      <h1>statistics</h1>
      <p>No feedback given</p>
    </div>
  )
}

const App = () => {
  // guarda los clics de cada botón en su propio estado
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <>
      <div>
        <h1>give feedback</h1>
        <Button onClick={() => setGood(good + 1)} text={"good"}/>
        <Button onClick={() => setNeutral(neutral + 1)} text={"neutral"}/>
        <Button onClick={() => setBad(bad + 1)} text={"bad"}/>
      </div>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </>
  )
}

export default App