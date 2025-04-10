import { useSelector, useDispatch } from "react-redux";
import { sumVoteToAnecdote } from "../reducers/anecdoteReducer";
import { setNotificationAndClear } from "../reducers/notificationReducer";

const AnecdoteList = () => {
  const anecdotes = useSelector((state) => state.anecdotes);
  const filter = useSelector((state) => state.filter);

  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(sumVoteToAnecdote(id));
    dispatch(
      setNotificationAndClear(
        `you voted '${anecdotes.find((a) => a.id === id).content}'`
      , 5)
    );
  };

  return (
    <div>
      {[...anecdotes]
        .filter((anecdote) =>
          anecdote.content.toLowerCase().includes(filter.toLowerCase())
        )
        .sort((a, b) => b.votes - a.votes)
        .map((anecdote) => (
          <div key={anecdote.id}>
            <div>{anecdote.content}</div>
            <div>
              has {anecdote.votes}
              <button onClick={() => vote(anecdote.id)}>vote</button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default AnecdoteList;
