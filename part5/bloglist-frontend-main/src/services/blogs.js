import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null;

const setToken = (newToken) => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const create = async (newObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.post(baseUrl, newObject, config);
  return response.data;
};

const update = async (existingObject) => {
  const config = {
    headers: { Authorization: token },
  };

  const response = await axios.put(`${baseUrl}/${existingObject.id}`, existingObject, config)

  const blogUser = await axios.get(`/api/users/${response.data.user}`)

  const blogWithUser = {...response.data, user: blogUser.data}

  return blogWithUser
}

export default { getAll, create, setToken, update }