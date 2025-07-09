import React from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  CircularProgress,
  Alert,
  Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const ProjectSelector = ({ projects, isLoading, selectedProjectId, onSelect }) => {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
        <CircularProgress size={24} />
      </Box>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <Box>
        <Alert severity="info" sx={{ mb: 2 }}>
          您还没有创建任何项目
        </Alert>
        <Button
          variant="contained"
          component={RouterLink}
          to="/requirements"
          fullWidth
        >
          创建新项目
        </Button>
      </Box>
    );
  }

  const handleChange = (event) => {
    const projectId = event.target.value;
    const project = projects.find((p) => p._id === projectId);
    
    if (project && project.requirements && project.requirements.length > 0) {
      onSelect(projectId, project.requirements[0]._id);
    }
  };

  return (
    <Box>
      <FormControl fullWidth>
        <InputLabel id="project-select-label">选择项目</InputLabel>
        <Select
          labelId="project-select-label"
          id="project-select"
          value={selectedProjectId}
          label="选择项目"
          onChange={handleChange}
        >
          {projects.map((project) => (
            <MenuItem key={project._id} value={project._id}>
              {project.name} - {project.description}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      {selectedProjectId && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary">
            已选择项目：{projects.find((p) => p._id === selectedProjectId)?.name}
          </Typography>
        </Box>
      )}
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Button
          variant="outlined"
          component={RouterLink}
          to="/requirements"
          size="small"
          fullWidth
        >
          创建新项目
        </Button>
      </Box>
    </Box>
  );
};

export default ProjectSelector; 