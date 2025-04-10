import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const SingleUser = () => {
  const { id } = useParams();
  const [user, setUser] = useState({ name: "", blogs: [] });

  const getUser = () => {
    axios.get(`/api/users/${id}`).then((response) => {
      setUser(response.data);
    });
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => {
          return <li key={blog.id}>{blog.title}</li>;
        })}
      </ul>
    </>
  );
};

export default SingleUser;
