import { createSlice, current } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'

const anecdotesAtStart = [
  "If it hurts, do it more often",
  "Adding manpower to a late software project makes it later!",
  "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
  "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
  "Premature optimization is the root of all evil.",
  "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
];

const getId = () => (100000 * Math.random()).toFixed(0);

const asObject = (anecdote) => {
  return {
    content: anecdote,
    id: getId(),
    votes: 0,
  };
};

const initialState = anecdotesAtStart.map(asObject);

const anecdoteSlice = createSlice({
  name: "anecdotes",
  initialState: [],
  reducers: {
    voteAnecdote(state, action) {
      const id = action.payload.id;
      const anecdoteToChange = state.find((n) => n.id === id);
      console.log(anecdoteToChange)

      anecdoteToChange.votes++;
    },
    appendAnecdote(state, action) {
      state.push(action.payload);
    },
    setAnecdotes(state,action){
      return action.payload
    }
  }
})

export const { voteAnecdote, setAnecdotes, appendAnecdote } = anecdoteSlice.actions 

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdoteService.getAll()
    dispatch(setAnecdotes(anecdotes))
  }
}

export const createAnecdote = (content) => {
  return async (dispatch) => {
    const newAnecdote = await anecdoteService.createNew(content)
    dispatch(appendAnecdote(newAnecdote))
  }
}

export const sumVoteToAnecdote = (id) => {
  return async (dispatch,getState) => {
    const anecdotes = getState().anecdotes
    const anecdoteToChange = anecdotes.find((n) => n.id === id);    
    if (Number.isNaN(anecdoteToChange.votes)) {
      anecdoteToChange.votes = 0
    }
    const changedAnecdote = { ...anecdoteToChange, votes: anecdoteToChange.votes + 1 };
    const response = await anecdoteService.update(changedAnecdote);
    dispatch(voteAnecdote(response));
  }
}

export default anecdoteSlice.reducer;
