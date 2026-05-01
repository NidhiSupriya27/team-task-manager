import React, { useState, useEffect } from "react";
import axios from "axios";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState(null);
  const [memberId, setMemberId] = useState("");

  const token = localStorage.getItem("token");

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setProjects(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
  fetchProjects();
}, [fetchProjects]);

  // Create / Update Project
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editId) {
        await axios.put(
          `http://localhost:5000/api/projects/${editId}`,
          { title, description },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Project Updated Successfully");

      } else {
        await axios.post(
          "http://localhost:5000/api/projects",
          { title, description },
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        alert("Project Created Successfully");
      }

      setTitle("");
      setDescription("");
      setEditId(null);

      fetchProjects();

    } catch (error) {
      console.log(error);
      alert("Action Failed");
    }
  };

  // Delete Project
  const deleteProject = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Project Deleted");
      fetchProjects();

    } catch (error) {
      console.log(error);
      alert("Delete Failed");
    }
  };

  // Edit Project
  const editProject = (project) => {
    setTitle(project.title);
    setDescription(project.description);
    setEditId(project._id);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // Add Member
  const addMember = async (projectId) => {
    try {
      await axios.post(
        `http://localhost:5000/api/projects/${projectId}/members`,
        { memberId },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Member Added Successfully");
      fetchProjects();
      setMemberId("");

    } catch (error) {
      console.log(error);
      alert("Add Member Failed");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Projects</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-4">

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Project Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="form-control mb-3"
          placeholder="Project Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <button className="btn btn-dark">
          {editId ? "Update Project" : "Create Project"}
        </button>

      </form>

      {/* Project Cards */}
      <div className="row">

        {projects.map((project) => (
          <div className="col-md-4 mb-3" key={project._id}>
            <div className="card shadow h-100">
              <div className="card-body">

                <h5>{project.title}</h5>
                <p>{project.description}</p>

                <p className="mt-2">
                  Members: {project.members ? project.members.length : 0}
                </p>

                <button
                  className="btn btn-primary btn-sm me-2"
                  onClick={() => editProject(project)}
                >
                  Edit
                </button>

                <button
                  className="btn btn-danger btn-sm me-2"
                  onClick={() => deleteProject(project._id)}
                >
                  Delete
                </button>

                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Enter User ID"
                  value={memberId}
                  onChange={(e) => setMemberId(e.target.value)}
                />

                <button
                  className="btn btn-success btn-sm mt-2"
                  onClick={() => addMember(project._id)}
                >
                  Add Member
                </button>

              </div>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Projects;