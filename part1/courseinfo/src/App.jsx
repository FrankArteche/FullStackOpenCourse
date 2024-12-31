const Header = (props) => {

  return (
    <div>
      <h1>{props.course}</h1>
    </div>
  )
}

const Part = (props) => {

  return (
    <div>
      <p>
        {props.partName} {props.exercisesNumber}
      </p>
    </div>
  )
}

const Content = (props) => {

  return (
    <div>
      <Part partName={props.part1} exercisesNumber={props.exercises1}/>
      <Part partName={props.part2} exercisesNumber={props.exercises2}/>
      <Part partName={props.part3} exercisesNumber={props.exercises3}/>
    </div>
  )
}

const Total = (props) => {

  return (
    <div>
      <p>Number of exercises {props.exercises1 + props.exercises2 + props.exercises3}</p>
    </div>
  )
}

const App = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <Header course={course} />
      <Content  part1={part1} exercises1={exercises1} part2={part2} exercises2={exercises2} part3={part3} exercises3={exercises3}/>
      <Total exercises1={exercises1} exercises2={exercises2} exercises3={exercises3} />
    </div>
  )
}

export default App