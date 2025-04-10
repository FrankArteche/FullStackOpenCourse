import { useState, useEffect, useRef } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useParams,
  useNavigate,
} from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);

  const getUsers = () => {
    axios.get("/api/users").then((response) => {
      setUsers(response.data);
    });
  };
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <>
      <h2>Users</h2>
      <div>
        Blogs created
        {users.map((user) => {
          console.log(user);

          return (
            <div key={user.id}>
              <Link to={`/users/${user.id}`}>{user.name}</Link>
              <p>{user.blogs.length}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Users;
