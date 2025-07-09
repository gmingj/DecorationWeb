const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Requirement = require('../models/Requirement');

// Create a new project with requirements
router.post('/', async (req, res) => {
  try {
    // For demo purposes, we'll create mock data instead of saving to MongoDB
    const project = {
      _id: 'project_' + Date.now(),
      name: req.body.projectName || 'New Project',
      description: req.body.projectDescription || '',
      createdAt: new Date()
    };
    
    // Then create requirements linked to the project
    const requirement = {
      _id: 'req_' + Date.now(),
      projectId: project._id,
      basicInfo: req.body.basicInfo,
      stylePreferences: req.body.stylePreferences,
      materialChoices: req.body.materialChoices,
      functionalRequirements: req.body.functionalRequirements,
      specialRequirements: req.body.specialRequirements,
      createdAt: new Date()
    };
    
    // Store in memory for demo purposes
    global.demoProjects = global.demoProjects || [];
    global.demoRequirements = global.demoRequirements || [];
    
    global.demoProjects.push(project);
    global.demoRequirements.push(requirement);
    
    res.status(201).json({
      project: project,
      requirement: requirement
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get all projects with their requirements
router.get('/', async (req, res) => {
  try {
    // For demo purposes, we'll return the in-memory data
    global.demoProjects = global.demoProjects || [];
    global.demoRequirements = global.demoRequirements || [];
    
    const projectsWithRequirements = global.demoProjects.map(project => {
      const requirements = global.demoRequirements.filter(req => req.projectId === project._id);
      return {
        ...project,
        requirements
      };
    });
    
    res.json(projectsWithRequirements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific project with its requirements
router.get('/:id', async (req, res) => {
  try {
    // For demo purposes, we'll return the in-memory data
    global.demoProjects = global.demoProjects || [];
    global.demoRequirements = global.demoRequirements || [];
    
    const project = global.demoProjects.find(p => p._id === req.params.id);
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const requirements = global.demoRequirements.filter(req => req.projectId === project._id);
    
    res.json({
      ...project,
      requirements
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a requirement
router.put('/:id', async (req, res) => {
  try {
    // For demo purposes, we'll update the in-memory data
    global.demoRequirements = global.demoRequirements || [];
    
    const requirementIndex = global.demoRequirements.findIndex(req => req._id === req.params.id);
    if (requirementIndex === -1) {
      return res.status(404).json({ message: 'Requirement not found' });
    }
    
    const requirement = global.demoRequirements[requirementIndex];
    
    if (req.body.basicInfo) requirement.basicInfo = req.body.basicInfo;
    if (req.body.stylePreferences) requirement.stylePreferences = req.body.stylePreferences;
    if (req.body.materialChoices) requirement.materialChoices = req.body.materialChoices;
    if (req.body.functionalRequirements) requirement.functionalRequirements = req.body.functionalRequirements;
    if (req.body.specialRequirements) requirement.specialRequirements = req.body.specialRequirements;
    
    global.demoRequirements[requirementIndex] = requirement;
    
    res.json(requirement);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a project and its requirements
router.delete('/:id', async (req, res) => {
  try {
    // For demo purposes, we'll delete from the in-memory data
    global.demoProjects = global.demoProjects || [];
    global.demoRequirements = global.demoRequirements || [];
    
    const projectIndex = global.demoProjects.findIndex(p => p._id === req.params.id);
    if (projectIndex === -1) {
      return res.status(404).json({ message: 'Project not found' });
    }
    
    const projectId = global.demoProjects[projectIndex]._id;
    
    // Remove project
    global.demoProjects.splice(projectIndex, 1);
    
    // Remove associated requirements
    global.demoRequirements = global.demoRequirements.filter(req => req.projectId !== projectId);
    
    res.json({ message: 'Project and requirements deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 