import axios from "axios";

const baseUrl = "http://localhost:3001/anecdotes";

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const createNew = async (content) => {
  const object = { content };
  const response = await axios.post(baseUrl, object);
  return response.data;
};

const update = async (anecdoteToChange) => {
  const response = await axios.put(`${baseUrl}/${anecdoteToChange.id}`, anecdoteToChange);
  return response.data;
};

export default {
  getAll,
  createNew,
  update,
};
