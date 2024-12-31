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
  const part1 = {
    name: 'Fundamentals of React',
    exercises: 10
  }
  const part2 = {
    name: 'Using props to pass data',
    exercises: 7
  }
  const part3 = {
    name: 'State of a component',
    exercises: 14
  }

  return (
    <div>
      <Header course={course} />
      <Content  part1={part1.name} exercises1={part1.exercises} part2={part2.name} exercises2={part2.exercises} part3={part3.name} exercises3={part3.exercises}/>
      <Total exercises1={part1.exercises} exercises2={part2.exercises} exercises3={part3.exercises} />
    </div>
  )
}

export default App