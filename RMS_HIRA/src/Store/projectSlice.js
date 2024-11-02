import { createSlice } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "projects",
  initialState: {
    projects: JSON.parse(localStorage.getItem("projects")) || [],
  },
  reducers: {
    addProject: (state, action) => {
      state.projects.push(action.payload);
      localStorage.setItem("projects", JSON.stringify(state.projects));
    },
    deleteProject: (state, action) => {
      state.projects = state.projects.filter((project) => project.id !== action.payload);
      localStorage.setItem("projects", JSON.stringify(state.projects));
    },
    updateProject: (state, action) => {
      const index = state.projects.findIndex((project) => project.id === action.payload.id);
      if (index !== -1) {
        state.projects[index] = action.payload;
        localStorage.setItem("projects", JSON.stringify(state.projects));
      }
    },
  },
});

export const { addProject, deleteProject, updateProject } = projectSlice.actions;
export default projectSlice.reducer;
