import React, { useEffect, useState } from "react";
import axios from "axios";

function Dashboard() {
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      const userRes = await axios.get("http://localhost:5000/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const projectRes = await axios.get("http://localhost:5000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const taskRes = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      console.log("USER RES:", userRes.data);
      console.log("PROJECT RES:", projectRes.data);
      console.log("TASK RES:", taskRes.data);
      console.log("TOKEN:", token);

      setUsers(userRes.data);
      setProjects(projectRes.data);
      setTasks(taskRes.data);

    } catch (error) {
      console.log(
        "DASHBOARD ERROR:",
        error.response?.data || error.message
      );
    }
  };

  useEffect(() => {
  fetchData();
}, [fetchData]);

  const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Dashboard</h2>

      <div className="row">

        <div className="col-md-3 mb-3">
          <div className="card text-center shadow">
            <div className="card-body">
              <h5>Total Users</h5>
              <h3>{users.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center shadow bg-primary text-white">
            <div className="card-body">
              <h5>Total Projects</h5>
              <h3>{projects.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center shadow bg-warning">
            <div className="card-body">
              <h5>Total Tasks</h5>
              <h3>{tasks.length}</h3>
            </div>
          </div>
        </div>

        <div className="col-md-3 mb-3">
          <div className="card text-center shadow bg-success text-white">
            <div className="card-body">
              <h5>Completed Tasks</h5>
              <h3>{completedTasks}</h3>
            </div>
          </div>
        </div>

      </div>

      <h4 className="mt-5">Recent Tasks</h4>

      <table className="table table-bordered mt-3">
        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Due Date</th>
          </tr>
        </thead>

        <tbody>
          {tasks.slice(0, 5).map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.status}</td>
              <td>{task.priority}</td>
              <td>{task.dueDate?.substring(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default Dashboard;