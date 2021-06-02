import React from 'react'
import './App.css';

const BOARD_SIZE = 10;
const DEFAULT_CELLS_VALUE = Array(BOARD_SIZE).fill(Array(BOARD_SIZE).fill(0))
const AVAILABLE_MOVES = ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft']
const SPEED = 580

const checkAvailableSlot = position => {
  switch (true) {
    case position >= BOARD_SIZE:
      return 0
    case position < 0:
      return BOARD_SIZE - 1
    default:
      return position
  }
}

const App = () => {
  const [snake, setSnake] = React.useState([[1, 1]])
  const [food, setFood] = React.useState([0, 0])
  const [direction, setDirection] = React.useState(AVAILABLE_MOVES[0])

  const handleKeyDown = (event) => {
    const index = AVAILABLE_MOVES.indexOf(event.key)
    if (index > -1) {
      setDirection(AVAILABLE_MOVES[index])
    }
  }

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
  })

  React.useEffect(() => {
    const interval = gameLoop()
    return () => clearInterval(interval)

  }, [snake])

  const generatedFood = () =>{
    let newFood
    do {
      newFood = [
        Math.floor(Math.random() * BOARD_SIZE), 
        Math.floor(Math.random() * BOARD_SIZE) 
      ]
    } while (snake.some(elem => elem[0] === newFood[0] && elem[1] === newFood[1]))
    setFood(newFood)
  }

  const gameLoop = () => {
    const timerId = setTimeout(() => {
      const newSnake = snake
      let move = []

      switch (direction) {
        case AVAILABLE_MOVES[0]:
          move = [1, 0]
          break;
        case AVAILABLE_MOVES[1]:
          move = [-1, 0]
          break;
        case AVAILABLE_MOVES[2]:
          move = [0, 1]
          break;
        case AVAILABLE_MOVES[3]:
          move = [0, -1]
          break;
      }


      const head = [
        checkAvailableSlot(newSnake[newSnake.length - 1][0] + move[0]),
        checkAvailableSlot(newSnake[newSnake.length - 1][1] + move[1])
      ]

      newSnake.push(head)
      let spliceIndex = 1
      if (head[0] === food[0] && head[1] === food[1]) {
          spliceIndex = 0
          generatedFood()
      }
      setSnake(newSnake.slice(spliceIndex))
      
    }, SPEED)

    return timerId
  }

  return (
    <div>
      <h1>Результат: {snake.length} </h1>
      {DEFAULT_CELLS_VALUE.map((row, indexR) => (
        <div key={indexR} className='row'>
          {row.map((cell, indexC) => {
            let type = snake.some(elem => elem[0] === indexR && elem[1] === indexC) && 'snake'
            if (type !== 'snake') {
              type = (food[0] === indexR && food[1] === indexC) && 'food'
            }
            return (
              <Cell key={indexC} type={type} />
            )
          })}
        </div>
      ))}
    </div>
  );
}

const Cell = ({ type }) => {
  return <div className={'cell ${type}'} />
}
export default App;
