import React, { useState, useEffect } from "react";
import axios from "axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [projectId, setProjectId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("Pending");
  const [priority, setPriority] = useState("Medium");
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setTasks(res.data);

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/tasks/${editId}`,
          {
            title,
            description,
            status,
            priority
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Task Updated");

      } else {
        await axios.post(
          "http://localhost:5000/api/tasks",
          {
            title,
            description,
            assignedTo,
            projectId,
            dueDate,
            status,
            priority
          },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Task Created");
      }

      setEditId(null);
      setTitle("");
      setDescription("");
      setAssignedTo("");
      setProjectId("");
      setDueDate("");
      setStatus("Pending");
      setPriority("Medium");

      fetchTasks();

    } catch (error) {
      console.log(error.response?.data || error);
      alert("Action Failed");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Task Deleted");
      fetchTasks();

    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  const editTask = (task) => {
    setEditId(task._id);

    setTitle(task.title);
    setDescription(task.description);
    setAssignedTo(task.assignedTo);
    setProjectId(task.projectId);

    setDueDate(
      task.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : ""
    );

    setStatus(task.status);
    setPriority(task.priority);
  };

  return (
    <div className="container mt-4">
      <h2>Tasks</h2>

      <form onSubmit={handleSubmit} className="mb-4">

        <input
          className="form-control mb-2"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Assign User ID"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        />

        <input
          className="form-control mb-2"
          placeholder="Project ID"
          value={projectId}
          onChange={(e) => setProjectId(e.target.value)}
        />

        <input
          type="date"
          className="form-control mb-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <select
          className="form-control mb-2"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option>Pending</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select
          className="form-control mb-2"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button className="btn btn-dark">
          {editId ? "Update Task" : "Create Task"}
        </button>

      </form>

      <table className="table table-bordered mt-4">

        <thead className="table-dark">
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>User</th>
            <th>Project</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {tasks.map((task) => (
            <tr key={task._id}>
              <td>{task.title}</td>
              <td>{task.description}</td>
              <td>{task.assignedTo}</td>
              <td>{task.projectId}</td>
              <td>{task.status}</td>
              <td>{task.dueDate?.substring(0, 10)}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => editTask(task)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteTask(task._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>

      </table>

    </div>
  );
}

export default Tasks;