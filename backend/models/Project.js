const addMember = async (projectId) => {
  try {
    const res = await axios.post(
      `http://localhost:5000/api/projects/${projectId}/members`,
      {
        memberId: memberId.trim()
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    alert("Member Added Successfully");

    setMemberId("");
    fetchProjects();

  } catch (error) {
    console.log(error.response);
    alert("Add Member Failed");
  }
};