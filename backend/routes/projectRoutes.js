const express = require("express");
const router = express.Router();

const Project = require("../models/Project");
const authMiddleware = require("../middleware/authMiddleware");


// GET ALL PROJECTS
router.get("/", authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);

  } catch (error) {
    console.log("PROJECT GET ERROR:", error);
    res.status(500).json({ message: error.message });
  }
});


// CREATE PROJECT
router.post("/", authMiddleware, async (req, res) => {
  try {
    const project = new Project({
      title: req.body.title,
      description: req.body.description,
      createdBy: req.user.id,
      members: []
    });

    await project.save();
    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ADD MEMBER TO PROJECT
router.post("/:id/members", authMiddleware, async (req, res) => {
  try {
    const { memberId } = req.body;

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        message: "Project not found"
      });
    }

    if (!project.members.includes(memberId)) {
      project.members.push(memberId);
      await project.save();
    }

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// UPDATE PROJECT
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title: req.body.title,
        description: req.body.description
      },
      { new: true }
    );

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// DELETE PROJECT
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Deleted"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;